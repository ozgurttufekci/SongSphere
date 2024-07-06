from fastapi import FastAPI, Query, Path, Body
import uvicorn
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from schemas import ExampleSong

tags_metadata: list[dict] = [
    {
        "name": "/",
        "description": "Docs Redirect",
    },
    {
        "name": "similar-songs",
        "description": "Generating similar songs given the information of a song.",
    },
    {
        "name": "smart-playlist",
        "description": "Generating similar songs with Gemini AI.",
    },
]


app: FastAPI = FastAPI(
    title="SoundSphere API",
    summary="Summary here...",
    description="Description here...",
    openapi_tags=tags_metadata,
)


@app.get("/", tags=["/"])
def docs_redirect():
    return RedirectResponse("/docs")


@app.get("/similar-songs/", tags=["similar-songs"])
def get_similar_songs(
    song_name: str = Query(description="Song name"),
    artist_name: str = Query(default=None, description="Artist Name"),
):
    print(song_name)
    print(artist_name)

    return ExampleSong(
        song_name="Espresso",
        artist_name="Christina Carpenter",
        album_name="Short n' Sweet",
        track_id="6rqhFgbbKwnb9MLmUQDhG6",
    )


@app.get("/smart-playlist/", tags=["smart-playlist"])
def get_smart_playlist(
    song_name: str = Query(description="Song name"),
    artist_name: str = Query(default=None, description="Artist Name"),
):
    print(song_name)
    print(artist_name)

    return {"she": "onika", "ate": "burgers"}


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
