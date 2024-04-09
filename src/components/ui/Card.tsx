import React, { useRef, useState, useEffect } from 'react';
import styles from './styles/cards.module.css';
import play from "../../Assets/play.png";
import pause from "../../Assets/pause.png";
import Image from 'next/image';

interface CardProps {
    imageUrl: string;
    audioUrl: string;
    isActive: boolean;
    name: string;
    albumName: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, audioUrl, isActive, name, albumName }) => {


    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false); // Track whether audio is paused

    useEffect(() => {
        const audioElement = audioRef.current;

        const handlePlay = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        const handlePause = () => {
            setIsPlaying(false);
            setIsPaused(true);
        };

        if (audioElement) {
            audioElement.addEventListener('play', handlePlay);
            audioElement.addEventListener('pause', handlePause);

            return () => {
                audioElement.removeEventListener('play', handlePlay);
                audioElement.removeEventListener('pause', handlePause);
            };
        }
    }, []);

    const handlePlayButtonClick = () => {
        const audioElement = audioRef.current;

        if (audioElement) {
            if (audioElement.paused) {
                pauseAllAudios();
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }
    };

    const pauseAllAudios = () => {
        // Pause all audio elements except the current one
        document.querySelectorAll('audio').forEach(audio => {
            if (audio !== audioRef.current) {
                (audio as HTMLAudioElement).pause();
            }
        });
    };

    return (
        <div style={{ position: "relative" }} className={isActive ? '' : 'pointer-events-none'}>
            <img src={imageUrl} alt="Album Art" className={`${styles.reflect} w-full h-full`} />
            <audio ref={audioRef} controls className='hidden'>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            {isActive && (
                <div className={`absolute bottom-0 left-0 right-0 p-4  text-white overflow-hidden ${styles.textreflect}`}>
                    <p className={`text-sm font-bold ${isActive ? 'animate-fade-in' : 'animate-fade-out'}`}>{name}</p>
                    <p className={`text-xs ${isActive ? 'animate-slide-up' : ''}`}>{albumName}</p>
                </div>
            )}
            <button
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-2 bg-[#1FDF64] text-black border border-gray-300 rounded-full shadow-lg`}
                onClick={handlePlayButtonClick}
            >
                {isPlaying && !isPaused ? (
                    <Image className='w-7 h-7' src={pause} alt="Pause" />
                ) : (
                    <Image className='w-7 h-7' src={play} alt="Play" />
                )}
            </button>
        </div>
    );
};

export default Card;
