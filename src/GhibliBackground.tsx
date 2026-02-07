import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Cloud, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Interactive Particles that drift and react to mouse/touch
 */
function FloatingParticles({ count = 1000 }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const { viewport } = useThree(); // We need viewport to map mouse coordinates to world space

  // Initialize positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array as Float32Array;

    // 1. Get Mouse/Touch Position in World Space
    // state.pointer is normalized (-1 to +1). We multiply by viewport to get real 3D coords.
    const mouseX = (state.pointer.x * viewport.width) / 2;
    const mouseY = (state.pointer.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Current particle position
      let x = array[i3];
      let y = array[i3 + 1];
      let z = array[i3 + 2];

      // --- 2. INTERACTION PHYSICS (Repulsion) ---
      // Calculate distance between mouse and particle
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // If mouse is close (within radius of 3 units)
      const repulsionRadius = 3;
      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) / repulsionRadius; // Stronger when closer
        const angle = Math.atan2(dy, dx);
        
        // Push particle away
        // We subtract because we want to move AWAY from the mouse
        x -= Math.cos(angle) * force * 0.5; 
        y -= Math.sin(angle) * force * 0.5; 
      }

      // --- 3. FLOW FIELD (The "Wind") ---
      // We add the wind movement on top of the interaction
      x += Math.sin(y * 0.3 + time * 0.5) * 0.01;
      y += Math.cos(x * 0.3 + time * 0.2) * 0.01;
      // Z-drift for 3D depth feeling
      z += Math.sin(x * 0.1 + time * 0.2) * 0.01;

      // --- 4. BOUNDARY CHECK (Infinite Loop) ---
      if (Math.abs(x) > 15) x = (Math.random() - 0.5) * 25;
      if (Math.abs(y) > 10) y = (Math.random() - 0.5) * 15;
      if (Math.abs(z) > 15) z = (Math.random() - 0.5) * 20;

      // Apply new positions
      array[i3] = x;
      array[i3 + 1] = y;
      array[i3 + 2] = z;
    }

    positionsAttr.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffd6ff"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function GhibliBackground() {
  return (
    <group>
      {/* 1. Base Dark Environment */}
      <color attach="background" args={["#050511"]} />
      
      {/* 2. Volumetric Clouds */}
      <group position={[0, -2, 0]}>
        <Cloud opacity={0.4} speed={0.2} width={20} depth={2} segments={10} color="#1a0f2b" position={[0, -2, -10]} />
        <Cloud opacity={0.3} speed={0.2} width={10} depth={1.5} segments={10} color="#4c2a68" position={[0, 0, -5]} />
      </group>

      {/* 3. The Atmosphere */}
      <fogExp2 attach="fog" args={["#050511", 0.035]} />
      
      {/* 4. Distant Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* 5. INTERACTIVE PARTICLES */}
      <FloatingParticles count={1500} />
      
      {/* 6. Fireflies */}
      <Sparkles count={200} scale={12} size={4} speed={0.4} opacity={0.5} color="#ffeebb" />
    </group>
  );
}