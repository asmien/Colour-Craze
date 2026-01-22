
import React, { useRef, useEffect } from "react";
import "../styles/ResultPage.css";
import resultBg from "../assets/result-background.jpeg";
import clickSoundFile from "../assets/click-sound.mp3";

function ResultPage({ success, onRetry, onNext, onShowStats }) {
  const clickSound = useRef(null);

  useEffect(() => {
    clickSound.current = new Audio(clickSoundFile);
    clickSound.current.volume = 0.7;
  }, []);

  const handleClick = (callback) => {
    clickSound.current.play().catch(() => {});
    callback();
  };

  return (
    <div
      className="result-page"
      style={{
        backgroundImage: `url(${resultBg})`,
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
      <div className="result-box">
        <h1>{success ? "🎉 You Succeeded!" : "❌ Try Again!"}</h1>
      </div>

      <div className="result-buttons">
        {!success && (
          <button className="retry-btn" onClick={() => handleClick(onRetry)}>
            Retry
          </button>
        )}
        {success && (
          <button className="next-btn" onClick={() => handleClick(onNext)}>
            Next Level
          </button>
        )}
        <button className="stats-btn" onClick={() => handleClick(onShowStats)}>
          📊 Show Stats
        </button>
      </div>
    </div>
  );
}

export default ResultPage;





