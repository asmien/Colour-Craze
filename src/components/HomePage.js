// src/components/HomePage.js
import React, { useRef, useEffect } from "react";
import "../styles/App.css";
import bgMusicFile from "../assets/bg-music.mp3";
import clickSoundFile from "../assets/click-sound.mp3";

function HomePage({ onStart }) {
  const bgMusic = useRef(null);
  const clickSound = useRef(null);
  const userInteracted = useRef(false);

  useEffect(() => {
    // Initialize audio
    bgMusic.current = new Audio(bgMusicFile);
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.3;

    clickSound.current = new Audio(clickSoundFile);
    clickSound.current.volume = 0.7;

    return () => {
      bgMusic.current.pause();
      bgMusic.current = null;
      clickSound.current = null;
    };
  }, []);

  const handleStart = () => {
    // Play click sound
    clickSound.current.play().catch(() => {});

    // Start background music if not already playing
    if (!userInteracted.current) {
      userInteracted.current = true;
      bgMusic.current.play().catch(() => {});
    }

    // Trigger parent start
    onStart();
  };

  return (
    <div className="home-page">
      <div className="game-card">
        <div className="emoji-row">🧚 ✨ 🎨 🦄 ⭐ 🌸</div>

        <h1 className="title">
          🌈 Colour <span className="craze">Craze</span> 🎨
        </h1>

        <p className="subtitle">Mix colours • Learn • Have fun!</p>

        <button className="start-button" onClick={handleStart}>
          🚀 Start Game!
        </button>
      </div>
    </div>
  );
}

export default HomePage;
