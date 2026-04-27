import { useEffect, useLayoutEffect, useRef, useState } from "react";
import bgMusic from "./assets/bg.mp3";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // 🎧 Handle enter click
  const handleEnter = () => {
    const audio = audioRef.current;
    audio.volume = 0.5;
    audio.play();

    setEntered(true);
    setShowMessage(true);
  };

  // ⏱️ Hide "ENJOY AND CHILL" after 3 seconds
  useEffect(() => {
    let timer;

    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showMessage]);

  // 🎬 MATRIX EFFECT
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const letters = "1010101010101010101010101010101";
    const matrix = letters.split("");

    const fontSize = 16;
    let columns;
    let drops = [];

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      columns = Math.floor(canvas.width / fontSize);

      drops = new Array(columns)
        .fill(0)
        .map(() => Math.random() * canvas.height / fontSize);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    setup();

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 255, 255, 1)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    const resize = () => setup();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="intro-container">
      {/* 🎥 Canvas */}
      <canvas ref={canvasRef} />

      {/* 🎧 Audio */}
      <audio ref={audioRef} src={bgMusic} loop />

      {/* 🧠 Enter Screen */}
      {!entered && (
        <div className="parent" onClick={handleEnter}>
          <h1>PRESS ME TO GET STARTED 👈</h1>
          <p className="pro-tips">
            Pro tips: Turn on volume for best experience and exit by closing tab 🎧
          </p>
        </div>
      )}

      {/* 🧩 Message (auto disappears after 3s) */}
      {showMessage && (
        <div className="parent">
          <h1>ENJOY AND CHILL 🔥</h1>
        </div>
      )}
    </div>
  );
}

export default App;