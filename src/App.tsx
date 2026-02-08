import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
} from "@react-three/drei";
import { Model } from "./Rose";
import { GhibliBackground } from "./GhibliBackground";

// -----------------------------
// QUIZ QUESTIONS
// -----------------------------

const QUESTIONS = [
  "Where was our first vacation together?",
  "What is my favorite thing about you?",
  "Where did we first meet?",
  "What is our movie?",
  "What day did we start talking?",
];

const ANSWERS = ["paris", "smile", "college", "lalaland", "november"];

// -----------------------------
// LOADER COMPONENT
// -----------------------------

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: "white",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem" }}>Loading for you...</p>

        <div
          style={{
            width: "200px",
            height: "6px",
            background: "#333",
            borderRadius: "3px",
            marginTop: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#d6336c",
              transition: "width 0.2s",
            }}
          />
        </div>

        <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

// -----------------------------
// MAIN APP COMPONENT
// -----------------------------

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answer.toLowerCase().trim() === ANSWERS[current]) {
      if (current === QUESTIONS.length - 1) {
        setUnlocked(true);
      } else {
        setCurrent((c) => c + 1);
        setAnswer("");
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  // -------------------------------------
  // MULTI-STEP QUIZ UI
  // -------------------------------------
  if (!unlocked) {
    return (
      <div style={styles.quizContainer}>
        <div style={styles.quizCard}>
          <h2 style={styles.quizTitle}>A Small Quiz For You ❤️</h2>

          <p style={styles.quizQuestion}>{QUESTIONS[current]}</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              style={{
                ...styles.quizInput,
                border: error ? "2px solid #ef4444" : "1px solid #ddd",
              }}
            />

            <button type="submit" style={styles.quizButton}>
              Next →
            </button>
          </form>

          <p style={styles.quizProgress}>
            Question {current + 1} / {QUESTIONS.length}
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------
  // ROSE SCENE
  // -------------------------------------
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        position: "relative",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <GhibliBackground />

        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <pointLight
          position={[-10, -10, -10]}
          color="#ff0055"
          intensity={0.5}
        />
        <Environment preset="night" />

        <Suspense fallback={<Loader />}>
          <Model scale={4} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={true}
          autoRotate={false}
          minPolarAngle={Math.PI / 2 - 0.7}
          maxPolarAngle={Math.PI / 2 + 0.05}
        />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
        />
      </Canvas>

      {/* Overlay Text */}
      <div style={styles.overlayText}>
        <h2 style={{ margin: 0, fontWeight: 300, letterSpacing: "2px" }}>
          FOR YOU
        </h2>
        <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Drag to look around</p>
      </div>
    </div>
  );
}

// -----------------------------
// STYLES
// -----------------------------

const styles: { [key: string]: React.CSSProperties } = {
  quizContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    background: "radial-gradient(circle at top, #ff99bb, #331122)",
    fontFamily: "system-ui",
  },

  quizCard: {
    background: "rgba(255,255,255,0.15)",
    padding: "2rem 3rem",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    maxWidth: "400px",
    textAlign: "center",
    color: "white",
  },

  quizTitle: {
    marginBottom: "1.2rem",
    fontWeight: 600,
    letterSpacing: "1px",
  },

  quizQuestion: {
    fontSize: "1.1rem",
    marginBottom: "1rem",
  },

  quizInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    marginBottom: "12px",
    background: "rgba(255,255,255,0.7)",
  },

  quizButton: {
    width: "100%",
    padding: "12px",
    background: "#ff4d88",
    borderRadius: "10px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: 600,
    marginTop: "5px",
  },

  quizProgress: {
    marginTop: "12px",
    opacity: 0.8,
    fontSize: "0.85rem",
  },

  overlayText: {
    position: "absolute",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    textAlign: "center",
    fontFamily: "system-ui",
    pointerEvents: "none",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
  },
};
