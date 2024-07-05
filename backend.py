import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

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
    top_n_indices = [i[0] for i in similarity_scores[1:n+1]]
    similar_songs = data.iloc[top_n_indices][['track_name', 'artist_name']]
    return similar_songs

# Example usage
track_name = "Lay It Down Gmix - Main"
n = 5
similar_songs = get_similar_songs(track_name, n)
print(similar_songs)
