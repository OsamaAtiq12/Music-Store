from pydantic import BaseModel
from typing import List


class SongData(BaseModel):
    song_id: str
    rating: float


class PlaylistData(BaseModel):
    playlist_id: str
    token: str
    playlist_name: str
    selected_songs: List[SongData]
