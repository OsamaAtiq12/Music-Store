import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./AudioPlayer.module.css";

function Player({ src }: { src: string }) {
    return (
        <div>
            <AudioPlayer
                className={styles.body}
                src={src}
                volume={0.1}


            />
        </div>
    );
}

export default Player;
