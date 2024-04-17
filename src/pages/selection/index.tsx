import React, { useMemo, useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import DataTable from "@/components/DataTable/DataTable";
import { playlistAtom } from "../../State/playlist";
import {
  currentTrackAtom,
  likedTracksAtom,
  dislikedTracksAtom,
  skippedTracksAtom,
  selectedSongsAtom,
} from "../../State/playlist";
import { useAtom } from "jotai";
import Player from "@/components/AudioPlayer/AudioPlayer";
import { useRouter } from "next/router";

interface Track {
  trackId: string;
}

function Selection() {
  const router = useRouter();
  const [playlist] = useAtom<any>(playlistAtom);
  const [currentTrack] = useAtom<any>(currentTrackAtom);
  const [, setselectedSongs] = useAtom(selectedSongsAtom);
  const [likedTracks] = useAtom(likedTracksAtom);
  const [dislikedTracks] = useAtom(dislikedTracksAtom);
  const [skippedTracks] = useAtom(skippedTracksAtom);

  // State variable to keep track of the sum of liked, disliked, and skipped tracks
  const [totalActions, setTotalActions] = useState<number>(0);

  useEffect(() => {
    // Update the totalActions whenever likedTracks, dislikedTracks, or skippedTracks change
    setTotalActions(
      likedTracks.length + dislikedTracks.length + skippedTracks.length
    );
  }, [likedTracks, dislikedTracks, skippedTracks]);

  const mergedTracks = () => {
    const mergedArray: { song_id: string; rating: number }[] = [];

    // Add liked tracks with score 10
    likedTracks.forEach((track: Track) => {
      mergedArray.push({ song_id: track.trackId, rating: 10 });
    });

    // Add disliked tracks with score 0
    dislikedTracks.forEach((track: Track) => {
      mergedArray.push({ song_id: track.trackId, rating: 0 });
    });

    // Add skipped tracks with score 5
    skippedTracks.forEach((track: Track) => {
      mergedArray.push({ song_id: track.trackId, rating: 5 });
    });

    setselectedSongs(mergedArray);
  };

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const shuffledTracks: any[] = useMemo(() => {
    if (playlist) {
      if (playlist.tracks && playlist.tracks.items) {
        return [...playlist.tracks.items]
          .filter((item) => item.track && item.track.preview_url)
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);
      } else {
        return [];
      }
    }
    return [];
  }, [playlist]);

  const transformedData = useMemo(() => {
    return shuffledTracks.map((track, index) => ({
      title: track.track.name,
      artist: track.track.artists
        .map((artist: { name: any }) => artist.name)
        .join(", "),
      album: track.track.album.name,
      albumImage: track.track.album.images[0].url,
      dateAdded: new Date(track.added_at).toLocaleDateString("en-US"),
      duration: track.track.duration_ms,
      previewUrl: track.track.preview_url,
      trackId: track.track.id,
    }));
  }, [shuffledTracks]);

  const handleTrackAction = (index: number) => {
    // Remove the track at the specified index from the filteredData
    const newData = filteredData.filter((_, i) => i !== index);
    setFilteredData(newData);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-5 bg-gradient-to-tr from-black to-blue-950 h-full">
        <h1 className="text-white text-4xl font-bold mt-[100px]">
          Rate Tracks For Recommendations
        </h1>
        <p className="text-white text-lg">
          Please like/dislike tracks from your playlist to get recommendations
          according to your music taste.
        </p>
        <div className="mb-28 justify-center">
          <DataTable
            data={filteredData.length > 0 ? filteredData : transformedData}
            onTrackAction={handleTrackAction}
            setFilteredData={setFilteredData} // Ensure this is correct
          />
          <div className="flex justify-center">
            <button
              onClick={() => {
                mergedTracks(); // Call mergedTracks function
                router.push("/recommendation"); // Navigate to "/recommendation"
              }}
              className={`bg-[#1FDF64] flex gap-1 items-center px-5 rounded-[24px] py-2 text-black font-semibold ${
                totalActions > 0 ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={totalActions === 0} // Disable button if totalActions is 0
            >
              Get Recommendations
            </button>
          </div>
        </div>
        <div className="fixed bottom-0 w-screen">
          <Player src={currentTrack} />
        </div>
      </div>
    </Layout>
  );
}

export default Selection;
