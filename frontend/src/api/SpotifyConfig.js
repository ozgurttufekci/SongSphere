const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scope = 'user-read-private user-read-email playlist-modify-public';
console.log(clientId, clientSecret, redirectUri);
export const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;