import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.getenv('SPOTIPY_REDIRECT_URI')

# Initialize Spotify API client
scope = "playlist-modify-public"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                                               client_secret=SPOTIPY_CLIENT_SECRET,
                                               redirect_uri=SPOTIPY_REDIRECT_URI,
                                               scope=scope))

# Load the dataset and define the get_similar_songs function
file_path = 'tiktokCOPY.xlsx'
data = pd.read_excel(file_path)

# Relevant features for similarity calculation
features = [
    'danceability', 'energy', 'key', 'loudness', 'mode', 
    'speechiness', 'acousticness', 'instrumentalness', 
    'liveness', 'valence', 'tempo', 'duration_mins'
]

# Ensure features are numeric and drop rows with NaN values
data[features] = data[features].apply(pd.to_numeric, errors='coerce')
data = data.dropna(subset=features)

# Normalize the features
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data[features])

# Compute cosine similarity
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
    # Find the index of the given track
    idx = data.index[data['track_name'] == track_name].tolist()
    if not idx:
        return f"Track '{track_name}' not found in the dataset."
    idx = idx[0]
    
    # Get the similarity scores for the given track
    similarity_scores = list(enumerate(similarity_matrix[idx]))
    
    # Sort by similarity scores in descending order and get top n
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_n_indices = [i[0] for i in similarity_scores[1:n+1]]  # Skip the first one as it is the same song
    
    # Return the top n similar songs
    similar_songs = data.iloc[top_n_indices][['track_name', 'artist_name']]
    return similar_songs

def create_spotify_playlist(track_name, n=5):
    # Get similar songs
    similar_songs = get_similar_songs(track_name, n)
    if isinstance(similar_songs, str):
        return similar_songs

    # Search for the tracks on Spotify
    track_ids = []
    for index, row in similar_songs.iterrows():
        query = f"track:{row['track_name']} artist:{row['artist_name']}"
        results = sp.search(q=query, type='track', limit=1)
        tracks = results['tracks']['items']
        if tracks:
            track_ids.append(tracks[0]['id'])

    # Create a new playlist
    user_id = sp.current_user()['id']
    playlist_name = f"Similar to {track_name}"
    playlist = sp.user_playlist_create(user=user_id, name=playlist_name, public=True)
    playlist_id = playlist['id']

    # Add tracks to the playlist
    sp.user_playlist_add_tracks(user=user_id, playlist_id=playlist_id, tracks=track_ids)

    return f"Playlist '{playlist_name}' created successfully!"

# Example usage
track_name = "Lay It Down Gmix - Main"
n = 5
result = create_spotify_playlist(track_name, n)
print(result)
