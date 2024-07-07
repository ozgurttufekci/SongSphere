// Root URL for API
const origin_url = "http://localhost:8000"

class SongData {
    constructor(song_name, artist_name) {
        this.name = song_name;
        this.artist_name = artist_name;
    }
};


/**
 * 
 * @param {string} song_name 
 * @param {string} artist_name 
 * @returns {SongData[]}
 */
async function get_similar_songs(song_name, artist_name) {
    let url = `${origin_url}?` + new URLSearchParams({ song_name: song_name, artist_name: artist_name });

    const songs = [];

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json();

    json["songs"].forEach(element => {
        songs.push(new SongData(element.song_name, element.artist_name));
    });

    return songs;
}

console.log(get_similar_songs("hello", "there"));