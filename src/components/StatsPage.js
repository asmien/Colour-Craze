
import React from "react";
import "../styles/StatsPage.css";
import statsBg from "../assets/stats-background.jpeg";


function StatsPage({ stats, onBack }) {


  const handleResetStats = () => {
    const currentPlayer = localStorage.getItem("currentPlayer");


    if (!currentPlayer) {
      alert("No player is currently logged in!");
      return;
    }


    // parse existing players
    let players = {};
    try {
      const rawPlayers = localStorage.getItem("players");
      if (rawPlayers) {
        players = JSON.parse(rawPlayers);
        if (typeof players !== "object" || Array.isArray(players)) players = {};
      }
    } catch {
      players = {};
    }


    // Reset current player's stats and level
    if (players[currentPlayer]) {
      players[currentPlayer].stats = { played: 0, won: 0, lost: 0 };
      players[currentPlayer].currentLevel = 0;


      localStorage.setItem("players", JSON.stringify(players));
    }


    // clear the current player so app can redirect to home/auth
    localStorage.removeItem("currentPlayer");


    // Reload the page to reflect the changes 
    window.location.href = "/"; // redirect to homepage
  };


  const handleLogout = () => {
    //  log out, 
    localStorage.removeItem("currentPlayer");
    window.location.href = "/"; // redirect to homepage
  };


  return (
    <div
      className="stats-page"
      style={{
        backgroundImage: `url(${statsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div className="stats-box">
        <h1>📊 Game Stats 📊</h1>
        <p>Games Played: {stats.played || 0}</p>
        <p>Games Won: {stats.won || 0}</p>
        <p>Games Lost: {stats.lost || 0}</p>
      </div>


      <div className="stats-buttons">
        <button className="back-btn" onClick={onBack}>
          🔙 Back to Game
        </button>


        <button className="logout-btn" onClick={handleLogout}>
          🔒 Log Out
        </button>


        <button className="reset-btn" onClick={handleResetStats}>
          ♻️ Reset Stats
        </button>
      </div>
    </div>
  );
}


export default StatsPage;
