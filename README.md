# SongSphere
Song Sphere Repository for TikTok TechJam 2024

# Music Recommendation and Playlist Creation

This Python script provides functionalities for music recommendation based on song similarity and AI-generated suggestions, and creates a Spotify playlist with the recommended tracks.

## Requirements

- Python 3.x
- pandas
- scikit-learn
- spotipy
- python-dotenv
- google.generativeai

## Setup

1. Install the required libraries:
    ```bash
    pip install pandas scikit-learn spotipy python-dotenv google-generativeai
    ```

2. Create a `.env` file in the root directory and add your Spotify and Google API credentials:
    ```
    SPOTIPY_CLIENT_ID=your_spotify_client_id
    SPOTIPY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIPY_REDIRECT_URI=your_spotify_redirect_uri
    GOOGLE_API_KEY=your_google_api_key
    ```

3. Prepare an Excel file `tiktokCOPY.xlsx` containing song data with the following features:
    - `track_name`
    - `artist_name`
    - `danceability`
    - `energy`
    - `key`
    - `loudness`
    - `mode`
    - `speechiness`
    - `acousticness`
    - `instrumentalness`
    - `liveness`
    - `valence`
    - `tempo`
    - `duration_mins`

## Usage
```
python3 backend.py
```
This script provides a comprehensive solution for generating music recommendations and creating playlists on Spotify. Adjust the track_name and other parameters as needed for your specific use case.
