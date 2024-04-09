import Image from "next/image";
import { Inter } from "next/font/google";

import SpotifyLogin from "@/components/ui/spotifyLogin";
import Carousel from "@/components/ui/carousel";



const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <SpotifyLogin />
    </div>
  );
}
