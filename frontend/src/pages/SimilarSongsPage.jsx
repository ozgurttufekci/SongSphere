import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { IconButton, InputBase, Paper, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import SoundSphereIcon from "../components/SoundSphereIcon";
import axios from 'axios';

function SimilarSongsPage() {
    const [searchTerm, setSearchTerm] = useState(""); // State to store search term
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const [selectedTrack, setSelectedTrack] = useState(null); // State to store selected track
    const [loading, setLoading] = useState(false); // State to manage loading state
    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false); // State to manage playlist dialog open/close
    const [playlist, setPlaylist] = useState(null); // State to store created playlist data

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=10`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log('Search Results:', response.data);
            setSearchResults(response.data.tracks.items);
        } catch (error) {
            console.error('Error searching tracks:', error);
            alert(error);
        }
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSearch();
    };

    const handleSelectTrack = (track) => {
        setSelectedTrack(track);
        setLoading(true);
        setPlaylistDialogOpen(true);
        handleCreatePlaylist();
    };

    const handleClosePlaylistDialog = () => {
        setPlaylistDialogOpen(false);
    };

    const fetchUserId = async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data.id;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            alert(error);
            return null;
        }
    };

    const handleCreatePlaylist = async () => {
        setLoading(true);
        try {
            // Fetch user ID
            const userId = await fetchUserId();
            if (!userId) {
                console.error('User ID not found.');
                setLoading(false);
                return;
            }

            // Extract track details for creating a playlist based on selected track
            const { id, name, artists } = selectedTrack;

            // Prepare track seed for creating playlist
            const trackSeed = `seed_tracks=${id}`;

            // Fetch similar tracks based on the selected track
            const response = await axios.get(`https://api.spotify.com/v1/recommendations?${trackSeed}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log('Similar Tracks:', response.data);

            // Create a playlist
            const createPlaylistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                name: `${name} - Similar Tracks`,
                description: `Playlist created based on ${name} by ${artists.map(artist => artist.name).join(', ')}`,
                public: true
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Created Playlist:', createPlaylistResponse.data);

            // Add tracks to the created playlist
            const playlistId = createPlaylistResponse.data.id;
            const uris = response.data.tracks.map(track => track.uri);
            const addTracksResponse = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                uris: uris
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Added Tracks to Playlist:', addTracksResponse.data);

            // Set the created playlist to display
            setPlaylist({
                id: playlistId,
                name: createPlaylistResponse.data.name,
                description: createPlaylistResponse.data.description,
                tracks: response.data.tracks
            });

            setLoading(false);
        } catch (error) {
            console.error('Error creating playlist:', error);
            alert(error);
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar selectedTab={0} />
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h4" component="h1">
                        Similar Songs Page
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Paper component="form" elevation={3} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 600, mx: 'auto' }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Spotify track"
                            inputProps={{ 'aria-label': 'search spotify track' }}
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        <IconButton type="submit" sx={{ p: '10px' }} onClick={handleSubmit}>
                            <SoundSphereIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                {searchResults.length > 0 && (
                    <Grid item xs={12}>
                        <Grid container spacing={2} justifyContent="center">
                            {searchResults.map((track) => (
                                <Grid item key={track.id} xs={12} sm={6} md={4} lg={3}>
                                    <Paper elevation={3} sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: "15px" }}>
                                        <Typography variant="h6" component="h3" sx={{ mb: 1, flexGrow: 1 }}>
                                            {track.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {track.artists.map(artist => artist.name).join(', ')}
                                        </Typography>
                                        <>
                                            <iframe
                                                title={track.name}
                                                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`}
                                                width="100%"
                                                height="352"
                                                style={{ borderRadius: "15px", border: "none" }}
                                                allowfullscreen=""
                                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                loading="lazy"
                                            >
                                            </iframe>
                                        </>
                                        <Button variant="contained" color="inherit" sx={{backgroundColor: '#FE2C55', ":hover": {backgroundColor: "#25F4EE"}}} onClick={() => handleSelectTrack(track)}>
                                            Create Playlist
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                )}
            </Grid>

            {/* Dialog to display created playlist */}
            <Dialog open={playlistDialogOpen} onClose={handleClosePlaylistDialog} sx={{ width: "100%", height: "352", borderRadius: "15px" }}>
                <DialogTitle>{loading ? 'Creating Playlist...' : 'Created Playlist'}</DialogTitle>
                <DialogContent dividers sx={{ flexGrow: 1 }}>
                    {loading ? (
                        <Grid container justifyContent="center">
                            <CircularProgress />
                        </Grid>
                    ) : (
                        <>
                            {playlist && <iframe style={{ borderRadius: "15px", border: "none" }} src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`} width="100%" height="352" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"></iframe>}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePlaylistDialog} color="secondary" disabled={loading}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SimilarSongsPage;
