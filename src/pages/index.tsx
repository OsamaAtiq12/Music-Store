import Image from "next/image";
import { Inter } from "next/font/google";

import PlaylistUrlSubmissionForm from "@/components/ui/playlistUrlSubmissionForm";
import Carousel from "@/components/ui/carousel";




const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Carousel />

      <PlaylistUrlSubmissionForm />
    </div>
  );
}
