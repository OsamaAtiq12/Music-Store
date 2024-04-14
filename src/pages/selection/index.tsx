import React, { useMemo, useState } from "react";
import Layout from "@/components/Layout/Layout";
import DataTable from "@/components/DataTable/DataTable";
import { playlistAtom } from "../../State/playlist";
import {
  currentTrackAtom,
  likedTracksAtom,
  dislikedTracksAtom,
} from "../../State/playlist";
import { useAtom } from "jotai";
import Player from "@/components/AudioPlayer/AudioPlayer";
import Link from "next/link";

function Selection() {
  const [playlist] = useAtom<any>(playlistAtom);
  const [currentTrack, setCurrentTrack] = useAtom<any>(currentTrackAtom);
  const [likedTracks, setLikedTracks] = useAtom(likedTracksAtom);
  const [dislikedTracks, setDislikedTracks] = useAtom(dislikedTracksAtom);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const shuffledTracks = useMemo(() => {
    if (playlist.tracks && playlist.tracks.items) {
      return [...playlist.tracks.items]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
    } else {
      return [];
    }
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
      <div className="flex flex-col items-center justify-center gap-5 bg-gradient-to-tr from-black to-blue-950">
        <h1 className="text-white text-4xl font-bold mt-5">
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
            <button className="bg-[#1FDF64] flex gap-1 items-center px-5 rounded-[24px] py-2 text-black font-semibold">
              <Link href="/recommendation">Get Recommendations</Link>
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
