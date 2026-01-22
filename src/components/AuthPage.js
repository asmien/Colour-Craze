
import React, { useState, useEffect } from "react";
import "../styles/AuthPage.css";
import authBg from "../assets/auth-background.jpeg"; 
import clickSoundFile from "../assets/click-sound.mp3"; 
import bgMusicFile from "../assets/bg-music.mp3"; 

// Fun human verification question 
const question = {
  text: "Which animal is black and white?",
  options: ["Panda 🐼", "Elephant 🐘", "Lion 🦁", "Tiger 🐯"],
  answer: "Panda 🐼",
};

function AuthPage({ onSuccess }) {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  // Load click sound
  const clickSound = new Audio(clickSoundFile);

  // Load and autoplay background music
  useEffect(() => {
    const bgMusic = new Audio(bgMusicFile);
    bgMusic.loop = true;
    bgMusic.volume = 0.3; 
    bgMusic.play().catch(() => {
      
    });

    return () => {
      bgMusic.pause();
    };
  }, []);

  const handleNext = () => {
    clickSound.play(); // play click sound
    if (selected === question.answer) {
      onSuccess(); // move to avatar page
    } else {
      setError("Oops! That's not correct. Try again!");
    }
  };

  const handleOptionClick = (opt) => {
    clickSound.play(); 
    setSelected(opt);
    setError("");
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="auth-container">
        <h2>{question.text}</h2>

        <div className="options-container">
          {question.options.map((opt) => (
            <button
              key={opt}
              className={`option-btn ${selected === opt ? "selected" : ""}`}
              onClick={() => handleOptionClick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!selected}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
