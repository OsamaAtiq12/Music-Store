from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from model import PlaylistData

from spotify import (
    get_track_features_and_track_names,
    train_predict_and_create_playlist,
    authenticate_spotify,
    initialize_pd_with_vector,
    map_rating_with_df,
)

app = FastAPI(
    title="Music House",
    description="APIs for Music House",
    version="0.0.1",
    docs_url="/docs",
)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-playlist")
def generate_playlist(playlist_input: PlaylistData):
    playlist_id = playlist_input.playlist_id
    selected_songs = playlist_input.selected_songs
    token = playlist_input.token
    sp = authenticate_spotify(token=token)

    for song in selected_songs:
        if not song.song_id or not song.rating:
            raise HTTPException(status_code=400, detail="Invalid song data format")
    # convert pydantic models to python dict for further processing
    song_data_dict_list = [item.dict() for item in selected_songs]
    print("get_track_features_and_track_names called")
    features, track_names, sourcePlaylist = get_track_features_and_track_names(
        sp, playlist_id
    )
    print("initialize_pd_with_vector called")
    play_listDF, row_unique, v = initialize_pd_with_vector(features, track_names)

    print("map_rating_with_df called")
    rating_mapped_df = map_rating_with_df(play_listDF, song_data_dict_list)
    print("train_predict_and_create_playlist called")
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


@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"message": str(exc)})
