
import React, { useState, useEffect, useRef } from "react";
import "../styles/GamePage.css";
import { EXTRA_COLORS, checkMix, MIXING_RULES } from "./TargetColor";
import ResultPage from "./ResultPage";
import StatsPage from "./StatsPage";
import gameBg from "../assets/game-background.jpeg";
import bgMusicFile from "../assets/bg-music.mp3";
import winMusicFile from "../assets/win-music.mp3";
import clickSoundFile from "../assets/click-sound.mp3";


const TARGETS = Object.keys(MIXING_RULES);


const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};


function GamePage({ player, setPlayer }) {
  const [currentLevel, setCurrentLevel] = useState(player.currentLevel || 0);
  const [droppedColors, setDroppedColors] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showStats, setShowStats] = useState(false);


  const bgMusic = useRef(null);
  const winMusic = useRef(null);
  const clickSound = useRef(null);
  const userInteracted = useRef(false);


  const playerName = player.name;
  const playerAvatar = player.avatar;


  useEffect(() => {
    bgMusic.current = new Audio(bgMusicFile);
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.3;


    winMusic.current = new Audio(winMusicFile);
    winMusic.current.volume = 0.7;


    clickSound.current = new Audio(clickSoundFile);
    clickSound.current.volume = 0.7;


    return () => {
      bgMusic.current.pause();
      bgMusic.current = null;
      winMusic.current = null;
      clickSound.current = null;
    };
  }, []);


  const startBgMusic = () => {
    if (!userInteracted.current) {
      userInteracted.current = true;
      bgMusic.current.play().catch(() => {});
    }
  };


  const targetColor = TARGETS[currentLevel];
  const paletteColors = shuffleArray(EXTRA_COLORS[targetColor]);


  const handleDragStart = (e, color) => {
    startBgMusic();
    clickSound.current.play().catch(() => {});
    e.dataTransfer.setData("color", color);
  };


  const handleDragOver = (e) => e.preventDefault();


  const handleDrop = (e) => {
    e.preventDefault();
    const color = e.dataTransfer.getData("color");
    if (!droppedColors.includes(color)) setDroppedColors([...droppedColors, color]);
  };


  const handleCheck = () => {
    startBgMusic();
    clickSound.current.play().catch(() => {});


    const result = checkMix(targetColor, droppedColors);
    setSuccess(result);
    setShowResult(true);


    const players = JSON.parse(localStorage.getItem("players") || "{}");
    if (!players[playerName]) {
      players[playerName] = { stats: { played: 0, won: 0, lost: 0 }, currentLevel: 0, avatar: playerAvatar };
    }


    players[playerName].stats.played += 1;
    if (result) players[playerName].stats.won += 1;
    else players[playerName].stats.lost += 1;


    // Save current level
    players[playerName].currentLevel = currentLevel;


    localStorage.setItem("players", JSON.stringify(players));


    // Update App.js player state
    setPlayer((prev) => ({
      ...prev,
      stats: players[playerName].stats,
      currentLevel: currentLevel,
    }));


    if (result) {
      bgMusic.current.pause();
      winMusic.current.play().catch(() => {});
      winMusic.current.onended = () => bgMusic.current.play().catch(() => {});
    }
  };


  const handleRetry = () => {
    startBgMusic();
    clickSound.current.play().catch(() => {});
    setDroppedColors([]);
    setShowResult(false);
    bgMusic.current.play().catch(() => {});
  };


  const handleNextLevel = () => {
    startBgMusic();
    clickSound.current.play().catch(() => {});


    if (currentLevel < TARGETS.length - 1) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setDroppedColors([]);
      setShowResult(false);


      const players = JSON.parse(localStorage.getItem("players") || "{}");
      if (players[playerName]) {
        players[playerName].currentLevel = nextLevel;
        localStorage.setItem("players", JSON.stringify(players));


        setPlayer((prev) => ({
          ...prev,
          currentLevel: nextLevel,
        }));
      }
    } else {
      alert("🎉 You completed all levels! 🎉");
      setShowResult(false);
    }
  };


  const handleShowStats = () => setShowStats(true);
  const handleBackFromStats = () => setShowStats(false);


  if (showStats) {
    const stats = player.stats || { played: 0, won: 0, lost: 0 };
    return <StatsPage stats={stats} onBack={handleBackFromStats} />;
  }


  if (showResult) {
    return (
      <ResultPage
        success={success}
        onRetry={handleRetry}
        onNext={handleNextLevel}
        onShowStats={handleShowStats}
      />
    );
  }


  return (
    <div className="game-page" style={{ backgroundImage: `url(${gameBg})` }} onClick={startBgMusic}>
      <div className="player-info">
        {playerAvatar && <img src={playerAvatar} alt="avatar" className="player-avatar" />}
        {playerName && <span className="player-name">{playerName}</span>}
      </div>


      <div className="game-header">
        🎨✨ Color Craze Mix Lab ✨🎨 (Level {currentLevel + 1})
      </div>


      <div className="instructions-box">
        🧠📜 Drag the colors into the bucket to create <strong>{targetColor.toUpperCase()}</strong>!
      </div>


      <div className="colors-section">
        {paletteColors.map((color) => (
          <div key={color} className={`color-slot ${color}`} draggable onDragStart={(e) => handleDragStart(e, color)}></div>
        ))}
      </div>


      <div className="bucket-section">
        <div className="bucket" onDragOver={handleDragOver} onDrop={handleDrop}>
          <span className="bucket-emoji">🪣</span>
          <span className="bucket-text">Mix Here!</span>
          <div className="dropped-colors">
            {droppedColors.map((color, index) => (
              <div key={index} className={`dropped-color ${color}`}></div>
            ))}
          </div>
        </div>
      </div>


      <button className="check-btn" onClick={handleCheck}>
        Check Mix
      </button>


      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("currentPlayer");
          window.location.reload();
        }}
      >
        🔒 Log Out
      </button>
    </div>
  );
}


export default GamePage;
