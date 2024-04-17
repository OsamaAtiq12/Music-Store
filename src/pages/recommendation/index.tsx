import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { useAtom } from "jotai";
import axios from "axios";
import { selectedSongsAtom, playlistAtom } from "../../State/playlist";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "../../Assets/Loading.gif";
import Image from "next/image";
import Carousel from "@/components/ui/carousel";

function GenAI() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSongs] = useAtom(selectedSongsAtom);
  const [playlist] = useAtom<any>(playlistAtom);
  const [newPlaylistname, setnewPlaylistname] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loadingTexts, setLoadingTexts] = useState<string[]>([
    "Sending request...",
    "Calculating Scores...",
    "Generating playlist Through AI...",
    "Processing data...",
  ]);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [newPlaylistData, setNewPlaylistData] = useState<any>(); // State to hold new playlist data

  const ENDPOINT = process.env.GENERATION_API_ENDPOINT;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(window.localStorage.getItem("token"));
    }
  }, []);

  const handleSubmit = async () => {
    if (newPlaylistname.trim() === "") {
      setError("Playlist name cannot be empty");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error

    const data = {
      playlist_id: `https://open.spotify.com/playlist/${playlist.id}`,
      selected_songs: [...selectedSongs],
      token: token,
      playlist_name: newPlaylistname,
    };
    console.log("Payload:", data);

    try {
      const response = await axios.post(`${ENDPOINT}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        window.localStorage.removeItem("token");
        router.push("/");
      } else {
        // If the playlist generation was successful, make a call to Spotify API to get the playlist details
        const spotifyResponse = await axios.get(
          `https://api.spotify.com/v1/playlists/${response.data.playlist_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set new playlist data
        setNewPlaylistData(spotifyResponse.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [loadingTexts]);

  return (
    <Layout>
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <div className="h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-tr from-black to-blue-950 ">
          {newPlaylistData ? (
            <>
              <div className="mt-5 overflow-hidden max-w-[1400px]">
                <Carousel data={newPlaylistData} />
              </div>
              <a
                href={newPlaylistData.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white mt-4 underline"
              >
                View Playlist on Spotify
              </a>
            </>
          ) : (
            <>
              <Label htmlFor="terms">Enter new playlist name:</Label>
              <div>
                <Input
                  className="min-w-[50rem]"
                  type="text"
                  id="playlistUrl"
                  value={newPlaylistname}
                  onChange={(e) => setnewPlaylistname(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                onClick={handleSubmit}
                className="bg-[#1FDF64] px-3 rounded-[24px] py-2 text-black font-semibold "
                type="submit"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Playlist"}
              </button>
            </>
          )}
          {loading && (
            <div className="flex flex-col items-center">
              <Image src={Loader} alt="loading" width={50} height={50} />
              <p className="text-white">{loadingTexts[currentTextIndex]}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default GenAI;
