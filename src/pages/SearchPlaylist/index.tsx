import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { playlistAtom } from '../../State/playlist';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import logo from "../../Assets/logo.png"
import Carousel from '@/components/ui/carousel';
import Loader from '@/components/ui/loader';
import Navbar from '@/components/ui/Navbar';

function PlaylistUrlSubmissionForm() {
  interface Playlist {
    tracks: any;
  }

  const [playlist, setPlaylist] = useAtom<Playlist | null>(playlistAtom);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirect to "/" if no token
      setPlaylist(null); // Clear playlist if no token
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!url.trim()) {
      setError('URL cannot be empty');
      return;
    }

    setLoading(true); // Start loading
    setError(''); // Clear any previous error

    const token = window.localStorage.getItem("token");
    const playlistUrl = url;
    const parts = playlistUrl.split('/');
    const playlistId = parts[parts.length - 1];

    try {
      const response = await axios.get(`
      https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const playlists = response.data;
      setPlaylist(playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError('Invalid URL'); // Set error message for invalid URL
      setPlaylist(null); // Clear playlist if fetching fails
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div className='flex flex-col items-center justify-center gap-5 h-full bg-black'>
        <div className="self-center">
          <Image width={100} height={100} src={logo} alt="SpotifyLogo" />
        </div>
        <Label htmlFor="terms">Enter Your Playlist Url Here</Label>
        <div>
          <Input
            className='min-w-[50rem]'
            type="text"
            id="playlistUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <button className="bg-[#1FDF64] px-3 rounded-[24px] py-2 text-black font-semibold " onClick={handleSubmit} type="submit">Submit</button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className='mt-5 overflow-hidden max-w-[1200px]'>
          {loading && <Loader />} {/* Render Loader if loading is true */}
          {!loading && playlist && <Carousel data={playlist} />} {/* Render Carousel if not loading and playlist is available */}
        </div>
      </div>
    </div>
  );
}

export default PlaylistUrlSubmissionForm;