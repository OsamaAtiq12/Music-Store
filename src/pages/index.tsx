import React, { useState, useLayoutEffect } from "react";
import SpotifyLogin from "@/components/ui/spotifyLogin";

export default function Home() {
  const [deviceHeight, setDeviceHeight] = useState(0);

  useLayoutEffect(() => {
    function updateDeviceHeight() {
      setDeviceHeight(window.innerHeight);
    }

    // Update the height initially and add event listener for window resize
    updateDeviceHeight();
    window.addEventListener("resize", updateDeviceHeight);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", updateDeviceHeight);
    };
  }, []);
  console.log("deviceHeight:", deviceHeight);

  return (
    <div style={{ height: deviceHeight }}>
      <SpotifyLogin />
    </div>
  );
}
