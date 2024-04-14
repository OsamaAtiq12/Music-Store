import React from "react";
import Image from "next/image";
import like from "../../Assets/like.png";
import dislike from "../../Assets/dislike.png";
import { useAtom } from "jotai";
import {
  likedTracksAtom,
  dislikedTracksAtom,
  currentTrackAtom,
} from "../../State/playlist";

interface DataTableProps {
  data: any[];
  onTrackAction: (index: number) => void;
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function DataTable({
  data,
  onTrackAction,
  setFilteredData,
}: DataTableProps) {
  const [selectedTrack, setSelectedTrack] = useAtom(currentTrackAtom);
  const [likedTracks, setLikedTracks] = useAtom(likedTracksAtom);
  const [dislikedTracks, setDislikedTracks] = useAtom(dislikedTracksAtom);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handleLike = (index: number) => {
    const track = data[index];
    if (likedTracks.length >= 20) {
      // Trim likedTracks array if it exceeds the limit
      setLikedTracks([...likedTracks.slice(1), track]);
    } else {
      setLikedTracks([...likedTracks, track]);
    }
    // Remove the track from dislikedTracks if it exists
    setDislikedTracks(
      dislikedTracks.filter(
        (dTrack: { trackId: any }) => dTrack.trackId !== track.trackId
      )
    );
    onTrackAction(index); // Trigger the onTrackAction callback with the index
  };

  const handleDislike = (index: number) => {
    const track = data[index];
    if (dislikedTracks.length >= 20) {
      // Trim dislikedTracks array if it exceeds the limit
      setDislikedTracks([...dislikedTracks.slice(1), track]);
    } else {
      setDislikedTracks([...dislikedTracks, track]);
    }
    // Remove the track from likedTracks if it exists
    setLikedTracks(
      likedTracks.filter(
        (lTrack: { trackId: any }) => lTrack.trackId !== track.trackId
      )
    );
    onTrackAction(index);
  };

  const handleSkip = (index: number) => {
    const newData = [...data]; // Create a copy of the data array
    newData.splice(index, 1); // Remove the track at the specified index
    setFilteredData(newData); // Update the filtered data state
    onTrackAction(index); // Trigger the onTrackAction callback with the index
  };

  const isLiked = (track: any) => {
    return likedTracks.some(
      (likedTrack: { trackId: any }) => likedTrack.trackId === track.trackId
    );
  };

  const isDisliked = (track: any) => {
    return dislikedTracks.some(
      (dislikedTrack: { trackId: any }) =>
        dislikedTrack.trackId === track.trackId
    );
  };

  return (
    <>
      <div className="bg-black bg-opacity-20 text-white p-4">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="px-4 py-2 text-left w-1/12">#</th>
              <th className="px-4 py-2 text-left w-1/12">Cover</th>
              <th className="px-4 py-2 text-left w-2/12">Title</th>
              <th className="px-4 py-2 text-left w-2/12">Artist</th>
              <th className="px-4 py-2 text-left w-2/12">Album</th>
              <th className="px-4 py-2 text-left w-2/12">Date added</th>
              <th className="px-4 py-2 text-left w-1/12">Duration</th>
              <th className="px-4 py-2 text-left w-2/12"></th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto">
          <table>
            <tbody>
              {data.slice(0, 20).map((item, index) => (
                <tr
                  key={item.trackId}
                  onClick={() => setSelectedTrack(item.previewUrl)}
                  className="border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors duration-200 ease-in-out"
                >
                  <td className="px-4 py-3 w-1/12">{index + 1}</td>
                  <td className="px-4 py-3 w-1/12">
                    <Image
                      src={item.albumImage}
                      alt={`${item.album} cover`}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="px-4 py-3 w-2/12">{item.title}</td>
                  <td className="px-4 py-3 w-2/12">{item.artist}</td>
                  <td className="px-4 py-3 w-2/12">{item.album}</td>
                  <td className="px-4 py-3 w-2/12 text-gray-400">
                    {item.dateAdded}
                  </td>
                  <td className="px-4 py-3 w-1/12">
                    {formatDuration(item.duration)}
                  </td>
                  <td className="flex gap-2 px-4 py-3 w-11/12">
                    <button
                      className={`bg-[#fdfdfd] bg-opacity-20 hover:bg-slate-400 text-black font-semibold ${
                        isLiked(item) ? "bg-green-500 bg-opacity-80" : ""
                      } `}
                      onClick={() => handleLike(index)}
                    >
                      <Image src={like} alt="like" width={100} height={100} />
                    </button>
                    <button
                      className={`bg-[#fdfdfd] bg-opacity-20 hover:bg-slate-400 text-black font-semibold ${
                        isDisliked(item) ? "bg-red-500 bg-opacity-80" : ""
                      }`}
                      onClick={() => handleDislike(index)}
                    >
                      <Image
                        src={dislike}
                        alt="dislike"
                        width={100}
                        height={100}
                      />
                    </button>
                    <button
                      className="text-slate-400 hover:text-white font-extralight"
                      onClick={() => handleSkip(index)}
                    >
                      Skip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
