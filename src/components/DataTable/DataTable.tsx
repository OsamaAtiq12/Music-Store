import React, { useState } from "react";
import Image from "next/image";
import like from "../../Assets/like.png";
import dislike from "../../Assets/dislike.png";
import { useAtom } from "jotai";
import {
  likedTracksAtom,
  dislikedTracksAtom,
  skippedTracksAtom,
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
  const [skippedTracks, setSkippedTracks] = useAtom(skippedTracksAtom);
  const [skippedRows, setSkippedRows] = useState<number[]>([]);

  
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handleLike = (index: number) => {
    const track = data[index];
    const newData = [...data];
    newData[index] = { ...track, liked: true }; // Mark the track as liked
    setLikedTracks([...likedTracks, track]);
    setDislikedTracks(
      dislikedTracks.filter(
        (dTrack: { trackId: any }) => dTrack.trackId !== track.trackId
      )
    );
    setFilteredData(newData); // Update the data with the liked track still present
    onTrackAction(index);
  };

  const handleDislike = (index: number) => {
    const track = data[index];
    const newData = [...data];
    newData[index] = { ...track, disliked: true }; // Mark the track as disliked
    setDislikedTracks([...dislikedTracks, track]);
    setLikedTracks(
      likedTracks.filter(
        (lTrack: { trackId: any }) => lTrack.trackId !== track.trackId
      )
    );
    setFilteredData(newData); // Update the data with the disliked track still present
    onTrackAction(index);
  };

  const handleSkip = (index: number) => {
    const track = data[index];
    const newData = [...data];
    newData.splice(index, 1);
    setFilteredData(newData);
    setSkippedTracks([...skippedTracks, track]); // Add the skipped track to skippedTracksAtom
    setSkippedRows([...skippedRows, index]);
    onTrackAction(index);
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
      <div className="bg-black bg-opacity-20 text-white p-4 overflow-x-hidden">
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
        <div className="overflow-x-hidden">
          <table>
            <tbody>
              {data.slice(0, 20).map((item, index) => (
                <tr
                  key={item.trackId}
                  onClick={() => setSelectedTrack(item.previewUrl)}
                  className={`border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors duration-200 ease-in-out ${
                    skippedRows.includes(index)
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
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
                  <td>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-2 py-6"
                    >
                      <div className="shrink-0">
                        <button
                          className={`bg-[#fdfdfd] bg-opacity-20 hover:bg-slate-400 text-black font-semibold ${
                            isLiked(item) ? "bg-green-500 bg-opacity-80" : ""
                          } `}
                          onClick={() => handleLike(index)}
                          disabled={skippedRows.includes(index)}
                        >
                          <Image src={like} alt="like" width={20} height={20} />
                        </button>
                      </div>
                      <div className="shrink-0">
                        <button
                          className={`bg-[#fdfdfd] bg-opacity-20 hover:bg-slate-400 text-black font-semibold ${
                            isDisliked(item) ? "bg-red-500 bg-opacity-80" : ""
                          }`}
                          onClick={() => handleDislike(index)}
                          disabled={skippedRows.includes(index)}
                        >
                          <Image
                            src={dislike}
                            alt="dislike"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                      <div className="shrink-0">
                        <button
                          className="text-slate-400 hover:text-white text-[14px] font-extralight italic pr-10"
                          onClick={(e) => {
                            const button = e.target as HTMLButtonElement;
                            button.textContent = "skipped";
                            handleSkip(index);
                          }}
                        >
                          <span>Skip</span>
                        </button>
                      </div>
                    </div>
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
