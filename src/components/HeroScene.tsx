import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null!);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const FloatingOrb = ({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[0.6, 4]} />
        <MeshDistortMaterial color={color} distort={0.4} speed={2} roughness={0.1} metalness={0.9} />
      </mesh>
    </Float>
  );
};

const NeuralConnections = () => {
  const ref = useRef<THREE.Group>(null!);
  const nodeCount = 20;

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, () => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4),
    }));
  }, []);

  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 3) {
          result.push([nodes[i].pos, nodes[j].pos]);
        }
      }
    }
    return result;
  }, [nodes]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      ))}
      {lines.map((line, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line);
        return (
          <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#4d8df7", transparent: true, opacity: 0.15 }))} />
        );
      })}
    </group>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#4d8df7" />
        <pointLight position={[3, -2, -2]} intensity={0.5} color="#38bdf8" />

        <FloatingOrb position={[-2.5, 0.5, 0]} color="#4d8df7" speed={0.8} />
        <FloatingOrb position={[2.8, -0.3, -1]} color="#38bdf8" speed={1.2} />
        <FloatingOrb position={[0.5, 1.5, -2]} color="#6366f1" speed={0.6} />

        <ParticleField />
        <NeuralConnections />
      </Canvas>
    </div>
  );
};

export default HeroScene;
