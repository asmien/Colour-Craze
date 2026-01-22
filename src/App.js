
import React, { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import background from "./assets/background.jpg";


import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import AvatarPage from "./components/AvatarPage";
import GamePage from "./components/GamePage";


import bgMusicFile from "./assets/bg-music.mp3";


function App() {
  const [page, setPage] = useState("home"); // home → auth → avatar → game
  const [player, setPlayer] = useState({
    name: "",
    avatar: "",
    stats: { played: 0, won: 0, lost: 0 },
    currentLevel: 0,
  });


  // Background music 
  const bgMusic = useRef(null);
  const musicStarted = useRef(false);


  useEffect(() => {
    bgMusic.current = new Audio(bgMusicFile);
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.3;


    const startMusic = () => {
      if (!musicStarted.current) {
        musicStarted.current = true;
        bgMusic.current.play().catch(() => {});
      }
    };


    window.addEventListener("user-interacted", startMusic);


    return () => {
      window.removeEventListener("user-interacted", startMusic);
      bgMusic.current.pause();
      bgMusic.current = null;
    };
  }, []);


  // Load currently logged-in player if any
  useEffect(() => {
    const savedPlayerName = localStorage.getItem("currentPlayer");
    if (!savedPlayerName) {
      setPage("home");
      return;
    }


    const players = JSON.parse(localStorage.getItem("players") || "{}");
    if (players[savedPlayerName]) {
      setPlayer({
        name: savedPlayerName,
        avatar: players[savedPlayerName].avatar || "",
        stats: players[savedPlayerName].stats || { played: 0, won: 0, lost: 0 },
        currentLevel: players[savedPlayerName].currentLevel || 0,
      });
      setPage("game");
    } else {
      localStorage.removeItem("currentPlayer");
      setPage("home");
    }
  }, []);


  // Save player profile to localStorage whenever it changes
  useEffect(() => {
    if (!player.name) return;


    const players = JSON.parse(localStorage.getItem("players") || "{}");
    if (!players[player.name]) {
      players[player.name] = {
        avatar: player.avatar || "",
        currentLevel: player.currentLevel || 0,
        stats: player.stats || { played: 0, won: 0, lost: 0 },
      };
    } else {
      // Update avatar, currentLevel, stats
      if (player.avatar) players[player.name].avatar = player.avatar;
      players[player.name].currentLevel = player.currentLevel || 0;
      players[player.name].stats = player.stats || { played: 0, won: 0, lost: 0 };
    }


    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("currentPlayer", player.name);
  }, [player]);


  return (
    <div className="app">
      <img src={background} alt="background" className="bg-image" />


      {page === "home" && <HomePage onStart={() => setPage("auth")} />}


      {page === "auth" && (
        <AuthPage
          onSuccess={(name) => {
            const players = JSON.parse(localStorage.getItem("players") || "{}");
            const existingPlayer = players[name] || {};
            setPlayer({
              name,
              avatar: existingPlayer.avatar || "",
              stats: existingPlayer.stats || { played: 0, won: 0, lost: 0 },
              currentLevel: existingPlayer.currentLevel || 0,
            });
            setPage("avatar");
          }}
        />
      )}


      {page === "avatar" && (
        <AvatarPage
          onComplete={(playerObj) => {
            const players = JSON.parse(localStorage.getItem("players") || "{}");
            const existingPlayer = players[playerObj.name] || {};


            setPlayer({
              name: playerObj.name,
              avatar: playerObj.avatar,
              stats: existingPlayer.stats || { played: 0, won: 0, lost: 0 },
              currentLevel: existingPlayer.currentLevel || 0,
            });


            setPage("game");
          }}
        />
      )}


      {page === "game" && <GamePage player={player} setPlayer={setPlayer} />}
    </div>
  );
}


export default App;
