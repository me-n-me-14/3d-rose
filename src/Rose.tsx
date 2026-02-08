import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Model(props: any) {
  const { scene } = useGLTF("/rose.glb");
  const groupRef = useRef<THREE.Group>(null!);
  const [sparkles, setSparkles] = useState<THREE.Group | null>(null);

  // --------------------------------------------------
  // REMOVE ARTIFACTS + CENTER MODEL
  // --------------------------------------------------
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.name === "Object_6" || obj.name === "Object_8") {
          obj.parent?.remove(obj);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  // --------------------------------------------------
  // CREATE SPARKLING 4-POINT STARS ON PETALS
  // --------------------------------------------------
  useEffect(() => {
    const petalMesh = scene.getObjectByName("Object_10") as THREE.Mesh;
    if (!petalMesh) return;

    const geom = petalMesh.geometry;
    const posAttr = geom.attributes.position;
    const vertexCount = posAttr.count;

    const sparkleGroup = new THREE.Group();

    // Create the sparkle texture (4-point star)
    function createStarTexture() {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(size * 0.5, size * 0.05);
      ctx.lineTo(size * 0.5, size * 0.95);
      ctx.moveTo(size * 0.05, size * 0.5);
      ctx.lineTo(size * 0.95, size * 0.5);
      ctx.stroke();

      return new THREE.CanvasTexture(canvas);
    }

    const starTexture = createStarTexture();

    const sparkleCount = 25;
    for (let i = 0; i < sparkleCount; i++) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: starTexture,
          color: new THREE.Color("#ffffff"),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );

      // Random petal surface position
      const idx = Math.floor(Math.random() * vertexCount);
      sprite.position.set(
        posAttr.getX(idx),
        posAttr.getY(idx),
        posAttr.getZ(idx),
      );

      // Random base size
      const size = 0.03 + Math.random() * 0.035;
      sprite.scale.set(size, size, 1);

      // Animation data
      sprite.userData = {
        baseSize: size,
        life: Math.random() * 2, // start offset
        speed: 2 + Math.random() * 1.5,
      };

      sparkleGroup.add(sprite);
    }

    petalMesh.add(sparkleGroup);
    setSparkles(sparkleGroup);
  }, [scene]);

  // --------------------------------------------------
  // ANIMATION LOOP
  // --------------------------------------------------
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.17;
    }

    if (sparkles) {
      sparkles.children.forEach((star: any) => {
        // update sparkle life
        star.userData.life += delta * star.userData.speed;

        // loop life
        if (star.userData.life > Math.PI * 2) {
          star.userData.life -= Math.PI * 2;
        }

        const t = star.userData.life;
        // ease in/out
        const burst = Math.sin(t) * Math.sin(t * 0.5);

        // opacity animation
        const opacity = Math.max(0, burst * 1.2);
        star.material.opacity = opacity;

        // size animation
        const scale = star.userData.baseSize * (1 + burst * 0.8);
        star.scale.set(scale, scale, 1);
      });
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group
        ref={groupRef}
        {...props}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <primitive object={scene} />
      </group>
    </Float>
  );
}
