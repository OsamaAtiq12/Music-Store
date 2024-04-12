import warnings
import pandas as pd
import numpy as np
from fastapi import HTTPException
import spotipy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble._forest import RandomForestRegressor, RandomForestClassifier
from sklearn import decomposition
from sklearn.manifold import TSNE
from scipy.sparse import csr_matrix, hstack
from sklearn.model_selection import StratifiedKFold, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier


def authenticate_spotify(token):
    try:
        sp = spotipy.Spotify(auth=token)
        return sp
    except Exception as exc:
        print("Can't get token for", exc)
        raise HTTPException(status_code=400, detail="Invalid User token")


def _chunker(seq, size):
    return (seq[pos : pos + size] for pos in range(0, len(seq), size))


def get_track_features_and_track_names(sp, playlist_id, username="azhar"):
    sourcePlaylist = sp.user_playlist(username, playlist_id)
    tracks = sourcePlaylist["tracks"]
    songs = tracks["items"]

    features = []
    track_ids = []
    track_names = []
    limited_song = songs[:35]

    for song in limited_song:
        track_id = song["track"]["id"]
        track_name = song["track"]["name"]
        if track_id:  # Checking if track_id is not None
            track_ids.append(track_id)
            track_names.append(track_name)

    for chunk in _chunker(track_ids, 1):
        audio_features_list = sp.audio_features(chunk)
        for audio_features in audio_features_list:
            if audio_features is None:
                features.append(
                    {
                        "danceability": 0,
                        "energy": 0,
                        "key": 0,
                        "loudness": 0,
                        "mode": 0,
                        "speechiness": 0,
                        "acousticness": 0,
                        "instrumentalness": 0,
                        "liveness": 0,
                        "valence": 0,
                        "tempo": 0,
                        "type": "audio_features",
                        "id": "00000",
                        "uri": "spotify:track:0",
                        "track_href": "https://api.spotify.com/",
                        "analysis_url": "https://api.spotify.com/",
                        "duration_ms": 0,
                        "time_signature": 0,
                    }
                )
            else:
                features.append(audio_features)
    return features, track_names, sourcePlaylist


def initialize_pd_with_vector(features, track_names):
    play_listDF = pd.DataFrame(features, index=track_names)
    play_listDF = play_listDF[
        [
            "id",
            "acousticness",
            "danceability",
            "duration_ms",
            "energy",
            "instrumentalness",
            "key",
            "liveness",
            "loudness",
            "mode",
            "speechiness",
            "tempo",
            "valence",
        ]
    ]

    # Convert 'id' to string

    v = TfidfVectorizer(sublinear_tf=True, ngram_range=(1, 6), max_features=10000)
    row_unique = v.fit_transform(track_names)
    play_listDF.insert(0, "track_name", track_names)
    play_listDF["ratings"] = np.nan

    play_listDF["track_name"] = play_listDF["track_name"].astype("string")
    play_listDF["id"] = play_listDF["id"].astype("string")

    return play_listDF, row_unique, v


def map_rating_with_df(play_listDF, ratings_dict):
    for rating_info in ratings_dict:
        song_id = rating_info.get("song_id")
        rating = rating_info.get("rating")
        if song_id and rating:
            # Check if the song ID exists in play_listDF
            if song_id in play_listDF["id"].values:
                # Update the 'ratings' column with the provided rating
                play_listDF.loc[play_listDF["id"] == song_id, "ratings"] = rating
            else:
                print(f"Song with ID {song_id} not found in play_listDF.")
        else:
            print(f"Invalid rating information for song: {rating_info}")

    return play_listDF


def train_predict_and_create_playlist(
    play_listDF, row_unique, sp, v, nameofplaylist, sourcePlaylist
):
    """
    This function trains a machine learning model to predict ratings for unrated songs in a playlist,
    analyzes feature importance, applies different classifiers, makes API calls to get song
    recommendations, and creates a new playlist with recommended tracks based on predicted ratings.

    :param play_listDF: The `play_listDF` parameter is a DataFrame containing information about songs in
    a playlist. It includes columns such as 'id', 'ratings', and 'track_name' along with other features
    used for training the recommendation model. The DataFrame is used to train the model, predict
    ratings for unrated songs
    :param row_unique: `row_unique` seems to be a variable that is being used in the function
    `train_predict_and_create_playlist`. It is being passed as an argument to the function along with
    other parameters like `play_listDF`, `sp`, `v`, `nameofplaylist`, and `sourcePlaylist`
    :param sp: The parameter `sp` is likely an object or instance related to the Spotify API. It is used
    to interact with the Spotify API in order to retrieve song recommendations, audio features, and
    create playlists. This object would contain methods for accessing Spotify's resources such as
    tracks, playlists, and user information
    :param v: The `v` parameter in the function `train_predict_and_create_playlist` appears to be a
    vectorizer object that is used to transform text data into numerical features. It is likely being
    used to transform track names into a format that can be used by machine learning models
    :param nameofplaylist: The `nameofplaylist` parameter is a string that represents the name of the
    new playlist that will be created. It will be used to name the playlist that will be created based
    on the recommendations generated by the model
    :param sourcePlaylist: The `sourcePlaylist` parameter is a dictionary containing information about
    the source playlist from which recommendations will be generated. It likely includes details such as
    the name of the playlist, its ID, and other relevant information needed for creating the new
    playlist based on the recommendations
    :return: The function `train_predict_and_create_playlist` returns the `new_playlist_id` of the newly
    created playlist.
    """
    # Split the DataFrame into rated and unrated songs
    initial_ratings = play_listDF.dropna(subset=["ratings"])
    unrated_songs = play_listDF[play_listDF["ratings"].isnull()]

    # Prepare the data for the model
    X_train = initial_ratings.drop(["id", "ratings", "track_name"], axis=1)
    y_train = initial_ratings["ratings"].astype(float)  # Ensure ratings are float

    # Normalize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    # Initialize and train the model
    model = RandomForestRegressor(random_state=42)
    model.fit(X_train_scaled, y_train)

    # Prepare the prediction set
    X_predict = unrated_songs.drop(["id", "ratings", "track_name"], axis=1)
    X_predict_scaled = scaler.transform(X_predict)  # Use the same scaler as before

    # Predict ratings
    predicted_ratings = model.predict(X_predict_scaled)

    # Correctly round the predicted ratings
    predicted_ratings_rounded = np.round(predicted_ratings)

    # Directly update the 'ratings' column in 'play_listDF' for the indices corresponding to 'unrated_songs'
    play_listDF.loc[play_listDF["ratings"].isnull(), "ratings"] = (
        predicted_ratings_rounded
    )

    # random forest classifier to analyse feature importance and print them
    X_train = play_listDF.drop(["id", "ratings", "track_name"], axis=1)
    y_train = play_listDF["ratings"]
    forest = RandomForestClassifier(
        random_state=42, max_depth=5, max_features=12
    )  # Set by GridSearchCV below
    forest.fit(X_train, y_train)
    impt = forest.feature_importances_
    ind = np.argsort(impt)[::-1]

    X_scaled = StandardScaler().fit_transform(X_train)

    pca1 = decomposition.PCA(n_components=8)
    X_pca = pca1.fit_transform(X_scaled)

    # Assuming X_scaled is your standardized dataset
    n_samples = X_scaled.shape[0]  # Number of samples in your dataset

    # Make sure perplexity is less than the number of samples
    tsne = TSNE(random_state=17, perplexity=min(30, n_samples - 1))

    X_tsne = tsne.fit_transform(X_scaled)

    # SETTING UP =====================================

    X_train_last = csr_matrix(
        hstack([X_pca, row_unique])
    )  # Check with X_tsne + X_names_sparse also

    warnings.filterwarnings("ignore")

    # Initialize a stratified split for the validation process
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # CREATING Decision Trees First ==============================

    tree = DecisionTreeClassifier()

    tree_params = {"max_depth": range(1, 11), "max_features": range(4, 19)}

    tree_grid = GridSearchCV(tree, tree_params, cv=skf, n_jobs=-1, verbose=True)

    tree_grid.fit(X_train_last, y_train)
    # print(tree_grid.best_estimator_, tree_grid.best_score_)

    # APPYING RANDOM FOREST ============================

    parameters = {
        "max_features": [4, 7, 8, 10],
        "min_samples_leaf": [1, 3, 5, 8],
        "max_depth": [3, 5, 8],
    }
    rfc = RandomForestClassifier(
        n_estimators=100, random_state=42, n_jobs=-1, oob_score=True
    )
    gcv1 = GridSearchCV(rfc, parameters, n_jobs=-1, cv=skf, verbose=1)
    gcv1.fit(X_train_last, y_train)
    print(gcv1.best_estimator_, gcv1.best_score_)

    # APPYING KNN ====================================

    knn_params = {"n_neighbors": range(1, 10)}
    knn = KNeighborsClassifier(n_jobs=-1)

    knn_grid = GridSearchCV(knn, knn_params, cv=skf, n_jobs=-1, verbose=True)
    knn_grid.fit(X_train_last, y_train)
    # knn_grid.best_params_, knn_grid.best_score_

    # HIGH API CALLS ===================================================

    rec_tracks = []
    for i in play_listDF["id"].values.tolist():
        recommendations = sp.recommendations(
            seed_tracks=[i], limit=int(len(play_listDF) / 2)
        )["tracks"]
        rec_tracks.extend(recommendations)

    rec_track_ids = [track["id"] for track in rec_tracks]
    rec_track_names = [track["name"] for track in rec_tracks]

    rec_features = []
    for track_id in rec_track_ids:
        rec_audio_features = sp.audio_features(track_id)
        if rec_audio_features:  # Check if rec_audio_features is not None and not empty
            rec_features.extend(rec_audio_features)
        else:
            pass

    # Before creating the DataFrame, ensure that all entries in rec_features are not None
    rec_features = [feature for feature in rec_features if feature is not None]

    rec_playlist_df = pd.DataFrame(rec_features, index=rec_track_ids)

    # SETTING UP PREDICTIONS ==============================

    X_test_names = v.transform(rec_track_names)

    rec_playlist_df = rec_playlist_df[
        [
            "acousticness",
            "danceability",
            "duration_ms",
            "energy",
            "instrumentalness",
            "key",
            "liveness",
            "loudness",
            "mode",
            "speechiness",
            "tempo",
            "valence",
        ]
    ]

    # MAKE PREDICTIONS =====================================

    tree_grid.best_estimator_.fit(X_train_last, y_train)
    rec_playlist_df_scaled = StandardScaler().fit_transform(rec_playlist_df)
    rec_playlist_df_pca = pca1.transform(rec_playlist_df_scaled)
    X_test_last = csr_matrix(hstack([rec_playlist_df_pca, X_test_names]))
    y_pred_class = tree_grid.best_estimator_.predict(X_test_last)

    # FILTER OUT SONGS BASED ON THE RATINGS GIVEN TO IT BY THE AI =======================
    rec_playlist_df["ratings"] = y_pred_class
    rec_playlist_df = rec_playlist_df.sort_values("ratings", ascending=False)
    rec_playlist_df = rec_playlist_df.reset_index()

    # Pick the top ranking tracks to add your new playlist 9, 10 will work
    recs_to_add = rec_playlist_df[rec_playlist_df["ratings"] >= 8][
        "index"
    ].values.tolist()[:30]
    rating_of_songs = (len(rec_tracks), rec_playlist_df.shape, len(recs_to_add))

    rec_array = reshape_to_closest_shape(recs_to_add)

    playlist_recs = sp.user_playlist_create(
        sp.me()["id"], name="{} - {}".format(nameofplaylist, sourcePlaylist["name"])
    )
    new_playlist_id = playlist_recs["id"]
    #  Add tracks to the new playlist
    for i in rec_array:
        sp.user_playlist_add_tracks(sp.me()["id"], new_playlist_id, i)

    return new_playlist_id


def find_closest_factors(n):
    """Find the pair of factors of n that are closest to each other."""
    for i in range(int(n**0.5), 0, -1):
        if n % i == 0:
            return i, n // i


def reshape_to_closest_shape(arr):
    """Reshape the array to a shape whose dimensions are close to each other."""
    length = len(arr)
    factors = find_closest_factors(length)
    reshaped_array = np.reshape(arr, factors)  # type: ignore
    return reshaped_array
