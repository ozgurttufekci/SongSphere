from pydantic import BaseModel, Field

class ExampleSong(BaseModel):
    song_name:str = Field(description="Name of song")
    artist_name:str = Field(description="Name of artist")
    album_name:str = Field(description="Name of Album")
    track_id:str = Field(description="Track ID")