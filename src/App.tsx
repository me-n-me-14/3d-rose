import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Quiz } from "./Quiz";
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
// LOADER COMPONENT
// -----------------------------
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: "white", textAlign: "center", fontFamily: "sans-serif" }}>
        <p style={{ margin: 0, fontSize: "0.9rem" }}>Loading for you...</p>
        <div style={{ width: "200px", height: "6px", background: "#333", borderRadius: "3px", marginTop: "10px", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#d6336c", transition: "width 0.2s" }} />
        </div>
        <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

// -----------------------------
// MAIN APP COMPONENT
// -----------------------------
export default function App() {
  // RESTORED: Missing state and function start
  const [unlocked, setUnlocked] = useState(false);

  // -------------------------------------
  // MULTI-STEP QUIZ UI
  // -------------------------------------
  if (!unlocked) {
    return <Quiz onUnlock={() => setUnlocked(true)} />;
  }

  // -------------------------------------
  // ROSE SCENE
  // -------------------------------------
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <GhibliBackground />

        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <pointLight position={[-10, -10, -10]} color="#ff0055" intensity={0.5} />
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

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} />
      </Canvas>

      {/* Overlay Text */}
      <div style={styles.overlayText}>
        <h2 style={{ margin: 0, fontWeight: 300, letterSpacing: "2px" }}>FOR YOU</h2>
        <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Drag to look around</p>
      </div>
    </div>
  );
}

// -----------------------------
// STYLES (Cleaned up)
// -----------------------------
const styles: { [key: string]: React.CSSProperties } = {
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