import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os
import json
import google.generativeai as genai

load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.getenv('SPOTIPY_REDIRECT_URI')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

scope = "playlist-modify-public"
auth_manager = SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                            client_secret=SPOTIPY_CLIENT_SECRET,
                            redirect_uri=SPOTIPY_REDIRECT_URI,
                            scope=scope)

sp = spotipy.Spotify(auth_manager=auth_manager)
file_path = 'tiktokCOPY.xlsx'
data = pd.read_excel(file_path)
features = [
    'danceability', 'energy', 'key', 'loudness', 'mode', 
    'speechiness', 'acousticness', 'instrumentalness', 
    'liveness', 'valence', 'tempo', 'duration_mins'
]
data[features] = data[features].apply(pd.to_numeric, errors='coerce')
data = data.dropna(subset=features)
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data[features])
similarity_matrix = cosine_similarity(data_scaled)

def get_similar_songs(track_name, n=5):
    """
    Get the top n similar songs for a given track name.
    
    Parameters:
    - track_name (str): The name of the track to find similar songs for.
    - n (int): The number of similar songs to return. Default is 5.
    
    Returns:
    - DataFrame: A DataFrame containing the names and artists of the similar songs.
    """
    idx = data.index[data['track_name'] == track_name].tolist()
    if not idx:
        return f"Track '{track_name}' not found in the dataset."
    idx = idx[0]
    similarity_scores = list(enumerate(similarity_matrix[idx]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_n_indices = [i[0] for i in similarity_scores[1:n+1]]  # Skip the first one as it is the same song
    similar_songs = data.iloc[top_n_indices][['track_name', 'artist_name']]
    return similar_songs

def get_ai_suggested_songs(track_name, n=5):
    """
    Get AI suggested songs using Google Generative AI (GeminiAI).
    
    Parameters:
    - track_name (str): The name of the track to find AI suggested songs for.
    - n (int): The number of AI suggested songs to return. Default is 5.
    
    Returns:
    - DataFrame: A DataFrame containing the names and artists of the AI suggested songs.
    """
    prompt = f"""I have a song that I really like and
            I would love to discover similar tracks.
            The song is called '{track_name}'.
            Could you please provide me with
            a list of '{n}' songs that have similar
            characteristics in terms of genre, mood,
            and musical style? I only want the song
            names, artist name and no extra text in
            the response, no explanation, and no Markdown. 
            Return the list of tracks in as a JSON array 
            with objects in JSON format with the fields 
            {{"song_name": "string", "artist_name": "string"}}. 
            Dont specify the type of mix it is. """
    
    response = model.generate_content(prompt)
    
    if "I'm sorry" in response.text or "I don't have access" in response.text:
        return pd.DataFrame(columns=['track_name', 'artist_name'])  # Return empty DataFrame
    
    try:
        songs_json = json.loads(response.text)
        songs = [(song['song_name'], song['artist_name']) for song in songs_json]
    except (json.JSONDecodeError, KeyError):
        return pd.DataFrame(columns=['track_name', 'artist_name'])  # Return empty DataFrame if parsing fails
    
    #print("AI suggested songs:" , songs)
    ai_suggestions = pd.DataFrame(songs, columns=['track_name', 'artist_name'])
    
    return ai_suggestions.head(n)

def create_spotify_playlist(track_name, n=5, ai_toggle=False):
    similar_songs = get_similar_songs(track_name, n)
    if isinstance(similar_songs, str):
        return similar_songs

    # Combine AI suggested songs if ai_toggle is True
    if ai_toggle:
        ai_songs = get_ai_suggested_songs(track_name, n)
        if ai_songs.empty:
            print("AI suggestions were not retrieved successfully. Proceeding with only similar songs from the dataset.")
        combined_songs = pd.concat([similar_songs, ai_songs]).drop_duplicates().reset_index(drop=True)
    else:
        combined_songs = similar_songs

    # Search for the tracks on Spotify
    track_ids = []
    for index, row in combined_songs.iterrows():
        query = f"track:{row['track_name']} artist:{row['artist_name']}"
        results = sp.search(q=query, type='track', limit=1)
        tracks = results['tracks']['items']
        if tracks:
            track_ids.append(tracks[0]['id'])
        else:
            print(f"Track '{row['track_name']}' by '{row['artist_name']}' not found on Spotify.")

    user_id = sp.current_user()['id']
    playlist_name = f"Similar to {track_name}"
    playlist = sp.user_playlist_create(user=user_id, name=playlist_name, public=True)
    playlist_id = playlist['id']
    playlist_url = playlist['external_urls']['spotify']
    sp.user_playlist_add_tracks(user=user_id, playlist_id=playlist_id, tracks=track_ids)
    return f"Playlist '{playlist_name}' created successfully! Playlist URL: {playlist_url}"

try:
    # Example usage
    track_name = "Lay It Down Gmix - Main"
    n = 5
    ai_toggle = True  # Set to True to include AI suggested songs
    result = create_spotify_playlist(track_name, n, ai_toggle)
    print(result)
finally:
    # Ensure the cleanup of the Spotify client
    del sp
    del auth_manager
