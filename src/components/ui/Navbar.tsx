import React from 'react';
import { useRouter } from 'next/router';
import { playlistAtom } from '../../State/playlist';
import { useAtom } from 'jotai';
import Link from 'next/link';

interface Playlist {
  tracks: any;
}

const Navbar: React.FC = () => {
  const router = useRouter();

  const [playlist, setPlaylist] = useAtom<Playlist | null>(playlistAtom);
  
  // Function to handle logout
  const handleLogout = () => {
    // Clear token from local storage
    window.localStorage.removeItem("token");
    setPlaylist(null);
    router.push("/");

  };

  return (
    <nav className="bg-black p-2 mt-0 w-full fixed  shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center">
        <div className="flex w-full md:w-1/2 justify-center md:justify-start gap-36 text-white ">

          <Link href="/">
            <div className="text-white no-underline hover:text-white hover:no-underline items-center font-extrabold whitespace-nowrap">
              <span className="text-2xl pl-2"><i className="em em-grinning"></i> Music House</span>
            </div>
          </Link>

          <Link href="/">
            <div className="text-white no-underline hover:text-white hover:no-underline whitespace-nowrap">
              <span className="text-2xl pl-2"><i className="em em-grinning"></i> Insta Tune</span>
            </div>
          </Link>
        </div>
        <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
          <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
            <button className="bg-[#1FDF64] px-3 rounded-[24px] py-2 text-black font-semibold " onClick={handleLogout} type="submit">Logout</button>
          </ul>
        </div>
      </div>
    
    </nav>
  );
}

export default Navbar;
