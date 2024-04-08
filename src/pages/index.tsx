import Image from "next/image";
import { Inter } from "next/font/google";
import Carousel from "@/components/ui/Carousel";
import PlaylistUrlSubmissionForm from "@/components/ui/playlistUrlSubmissionForm";



 
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
        <Carousel/>

        <PlaylistUrlSubmissionForm/>
    </div>
  );
}
