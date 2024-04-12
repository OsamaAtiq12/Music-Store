from fastapi import APIRouter, HTTPException
from .model import PlaylistData
from services.spotify import (
    get_track_features_and_track_names,
    train_predict_and_create_playlist,
    authenticate_spotify,
    initialize_pd_with_vector,
    map_rating_with_df,
)

rest_router = APIRouter()


@rest_router.post("/generate-playlist")
async def generate_playlist(playlist_input: PlaylistData):
    playlist_id = playlist_input.playlist_id
    selected_songs = playlist_input.selected_songs
    token = playlist_input.token
    sp = authenticate_spotify(token=token)

    for song in selected_songs:
        if not song.song_id or not song.rating:
            raise HTTPException(status_code=400, detail="Invalid song data format")

    features, track_names, sourcePlaylist = get_track_features_and_track_names(
        sp, playlist_id
    )
    play_listDF, row_unique, v = initialize_pd_with_vector(features, track_names)
    rating_mapped_df = map_rating_with_df(play_listDF, selected_songs)
    created_playlist_id = train_predict_and_create_playlist(
        rating_mapped_df,
        row_unique,
        sp,
        v,
        playlist_input.playlist_name,
        sourcePlaylist,
    )

    return {
        "message": f"Successfully created playlist with ID: {created_playlist_id}",
        "playlist_id": created_playlist_id,
    }
