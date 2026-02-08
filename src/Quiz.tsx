import React, { useState } from "react";

// --- CONFIGURATION ---
const QUESTIONS = [
  { q: "Our first trip together?", a: "varkala" },
  { q: "Unofficial wedding date (dd/mm/yy)", a: "15/02/20" },
  { q: "Our favourite spot in the classroom", a: "window" },
  { q: "My favourite tea snack?", a: "mixture" },
  { q: "Colour of the first cloth i bought you?", a: "green" },
];

interface QuizProps {
  onUnlock: () => void;
}

export function Quiz({ onUnlock }: QuizProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answer.toLowerCase().trim() === QUESTIONS[current].a) {
      if (current === QUESTIONS.length - 1) {
        onUnlock();
      } else {
        setCurrent((c) => c + 1);
        setAnswer("");
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div style={styles.quizContainer}>
      <div style={styles.quizCard}>
        <h2 style={styles.quizTitle}>A Small Quiz For You ❤️</h2>
        <p style={styles.quizQuestion}>{QUESTIONS[current].q}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            style={{
              ...styles.quizInput,
              border: error ? "2px solid #ef4444" : "1px solid #ddd",
              animation: error ? "shake 0.4s" : "none",
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
      
      {/* Simple CSS for the shake effect */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

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
    width: "90%",
    textAlign: "center",
    color: "white",
  },
  quizTitle: { marginBottom: "1.2rem", fontWeight: 600, letterSpacing: "1px" },
  quizQuestion: { fontSize: "1.1rem", marginBottom: "1rem" },
  quizInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    marginBottom: "12px",
    background: "rgba(255,255,255,0.7)",
    boxSizing: "border-box",
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
  quizProgress: { marginTop: "12px", opacity: 0.8, fontSize: "0.85rem" },
};