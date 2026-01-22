// src/components/AvatarPage.js
import React, { useState, useEffect } from "react";
import "../styles/AvatarPage.css";
import avatarBg from "../assets/avatar-background.jpeg";

import avatar1 from "../assets/avatars/avatar1.jpg";
import avatar2 from "../assets/avatars/avatar2.jpg";
import avatar3 from "../assets/avatars/avatar3.jpg";
import avatar4 from "../assets/avatars/avatar4.jpg";
import avatar5 from "../assets/avatars/avatar5.jpg";
import avatar6 from "../assets/avatars/avatar6.jpg";

import clickSoundFile from "../assets/click-sound.mp3";
import bgMusicFile from "../assets/bg-music.mp3";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

function AvatarPage({ onComplete }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [existingPlayers, setExistingPlayers] = useState([]);

  const clickSound = new Audio(clickSoundFile);

  // Background music
  useEffect(() => {
    const bgMusic = new Audio(bgMusicFile);
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
    return () => bgMusic.pause();
  }, []);

  // Load existing players
  useEffect(() => {
    const players = JSON.parse(localStorage.getItem("players") || "{}");
    setExistingPlayers(Object.keys(players));
  }, []);

  // Auto-load avatar if existing player
  useEffect(() => {
    const players = JSON.parse(localStorage.getItem("players") || "{}");
    if (playerName.trim() && players[playerName.trim()]) {
      setSelectedAvatar(players[playerName.trim()].avatar);
    }
  }, [playerName]);

  const handleStartGame = () => {
    clickSound.play();

    if (!playerName.trim()) {
      setError("Please enter your name!");
      return;
    }
    if (!selectedAvatar) {
      setError("Please select an avatar!");
      return;
    }

    const players = JSON.parse(localStorage.getItem("players") || "{}");
    const trimmedName = playerName.trim();

    // If player exists, keep stats & level; else create new
    if (!players[trimmedName]) {
      players[trimmedName] = {
        avatar: selectedAvatar,
        stats: { played: 0, won: 0, lost: 0 },
        currentLevel: 0,
      };
    } else {
      // Keep existing stats & level, update avatar
      players[trimmedName].avatar = selectedAvatar;
    }

    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("currentPlayer", trimmedName);

    // Pass full player object to App.js
    onComplete({
      name: trimmedName,
      avatar: selectedAvatar,
      stats: players[trimmedName].stats,
      currentLevel: players[trimmedName].currentLevel,
    });
  };

  const handleAvatarClick = (av) => {
    clickSound.play();
    setSelectedAvatar(av);
    setError("");
  };

  const handleExistingPlayerClick = (name) => {
    clickSound.play();
    setPlayerName(name);
    const players = JSON.parse(localStorage.getItem("players") || "{}");
    setSelectedAvatar(players[name].avatar);
    setError("");
  };

  const handleDeletePlayer = (name) => {
    clickSound.play();
    const players = JSON.parse(localStorage.getItem("players") || "{}");
    delete players[name];
    localStorage.setItem("players", JSON.stringify(players));
    setExistingPlayers(Object.keys(players));

    if (localStorage.getItem("currentPlayer") === name) {
      localStorage.removeItem("currentPlayer");
    }

    if (playerName === name) {
      setPlayerName("");
      setSelectedAvatar(null);
    }
  };

  return (
    <div
      className="avatar-page"
      style={{
        backgroundImage: `url(${avatarBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="avatar-container">
        <h2>Pick Your Avatar!</h2>

        {/* Existing users list with delete */}
        {existingPlayers.length > 0 && (
          <div className="existing-players">
            <p>Click your name to continue as an existing player:</p>
            {existingPlayers.map((name) => (
              <div key={name} className="existing-player-row">
                <button
                  className="existing-player-btn"
                  onClick={() => handleExistingPlayerClick(name)}
                >
                  {name}
                </button>
                <button
                  className="delete-player-btn"
                  onClick={() => handleDeletePlayer(name)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="avatars-grid">
          {avatars.map((av, index) => (
            <img
              key={index}
              src={av}
              alt={`Avatar ${index + 1}`}
              className={`avatar-img ${selectedAvatar === av ? "selected" : ""}`}
              onClick={() => handleAvatarClick(av)}
            />
          ))}
        </div>

        <div className="name-input-container">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => {
              clickSound.play();
              setPlayerName(e.target.value);
              setError("");
            }}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="start-game-btn" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default AvatarPage;
