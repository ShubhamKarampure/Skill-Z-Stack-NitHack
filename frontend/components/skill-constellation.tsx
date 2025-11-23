"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Stars,
  Float,
  QuadraticBezierLine,
  useCursor,
  Environment,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { Pause, Play } from "lucide-react";
import { CredentialType, ConstellationNode, NodeStatus } from "@/lib/types";

// --- COLORS CONFIG ---
const TYPE_COLORS = {
  [CredentialType.DEGREE]: "#ec4899", // Pink
  [CredentialType.CERTIFICATE]: "#22d3ee", // Cyan/Blue
  [CredentialType.BADGE]: "#f59e0b", // Amber/Orange
  DEFAULT: "#3b82f6",
};

const COLORS = {
  ghost: "#a855f7", // Purple for future/recommended
  verifying: "#fbbf24",
};

function UserCore({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current)
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        count={150}
        scale={3}
        size={3}
        speed={0.4}
        opacity={1}
        color="#22d3ee"
      />
      <mesh>
        <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#be185d"
          emissiveIntensity={1.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      {visible && (
        <Html
          position={[0, -2, 0]}
          center
          zIndexRange={[0, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-center opacity-90 select-none">
            <h1 className="text-2xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
              IDENTITY
            </h1>
            <span className="text-[9px] font-mono text-cyan-300 tracking-[0.3em] uppercase opacity-70">
              Neural Core
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

interface Node3DProps {
  node: ConstellationNode;
  position: THREE.Vector3;
  isHovered: boolean;
  isSelected: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}

function Node3D({
  node,
  position,
  isHovered,
  isSelected,
  onHover,
  onUnhover,
  onClick,
}: Node3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useCursor(isHovered);

  const { mainColor, isWireframe } = useMemo(() => {
    if (node.status === NodeStatus.GHOST)
      return { mainColor: COLORS.ghost, isWireframe: true };
    const typeColor =
      TYPE_COLORS[node.credentialType as CredentialType] || TYPE_COLORS.DEFAULT;
    return { mainColor: typeColor, isWireframe: false };
  }, [node.status, node.credentialType]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;
    const targetScale = isSelected ? 1.5 : isHovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
        visible={false}
      >
        <sphereGeometry args={[2, 16, 16]} />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        {node.credentialType === CredentialType.DEGREE ? (
          <dodecahedronGeometry args={[0.7, 0]} />
        ) : (
          <icosahedronGeometry args={[0.5, 0]} />
        )}
        <meshStandardMaterial
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={node.status === NodeStatus.GHOST ? 2 : 1.2}
          wireframe={isWireframe}
          transparent
          opacity={node.status === NodeStatus.GHOST ? 0.6 : 1}
        />
      </mesh>

      <Html
        position={[0, 1.4, 0]}
        center
        distanceFactor={12}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`transition-all duration-300 ${
            isHovered || isSelected ? "scale-110 z-50" : "scale-100 z-10"
          }`}
        >
          <div
            className={`px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg flex items-center justify-center
             ${
               isSelected
                 ? "bg-white/10 border-white/40"
                 : "bg-black/40 border-white/5"
             }`}
          >
            <span
              className={`text-xs font-bold whitespace-nowrap ${
                node.status === NodeStatus.GHOST
                  ? "text-purple-300"
                  : "text-zinc-200"
              }`}
            >
              {node.name}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Connections({
  nodes,
  positions,
}: {
  nodes: ConstellationNode[];
  positions: Map<string, THREE.Vector3>;
}) {
  const lines = useMemo(() => {
    const els: React.ReactNode[] = [];
    nodes.forEach((node) => {
      const start = positions.get(node.id);
      if (!start) return;
      if (node.credentialType === CredentialType.DEGREE) {
        els.push(
          <QuadraticBezierLine
            key={`core-${node.id}`}
            start={[0, 0, 0]}
            end={start}
            color={TYPE_COLORS[CredentialType.DEGREE]}
            lineWidth={1}
            dashed
            opacity={0.3}
          />
        );
      }
      node.relatedIds?.forEach((relId) => {
        const end = positions.get(relId);
        if (end) {
          els.push(
            <QuadraticBezierLine
              key={`${node.id}-${relId}`}
              start={start}
              end={end}
              mid={[
                (start.x + end.x) / 2,
                (start.y + end.y) / 2 + 2,
                (start.z + end.z) / 2,
              ]}
              color="#ffffff"
              lineWidth={0.5}
              transparent
              opacity={0.15}
            />
          );
        }
      });
    });
    return els;
  }, [nodes, positions]);
  return <group>{lines}</group>;
}

function SceneContent({
  nodes,
  onSelect,
  isGenerating,
}: {
  nodes: ConstellationNode[];
  onSelect: (id: string) => void;
  isGenerating: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const nodePositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodes.forEach((n, i) => {
      const theta = (i / nodes.length) * Math.PI * 2;
      const r = 8 + (i % 3) * 3;
      map.set(
        n.id,
        new THREE.Vector3(
          Math.cos(theta) * r,
          Math.sin(theta) * r,
          Math.sin(i) * 5
        )
      );
    });
    return map;
  }, [nodes]);

  return (
    <group
      onPointerMissed={() => {
        setSelected(null);
      }}
    >
      <UserCore visible={!isGenerating} />
      <Connections nodes={nodes} positions={nodePositions} />
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        {nodes.map((node) => (
          <Node3D
            key={node.id}
            node={node}
            position={nodePositions.get(node.id) || new THREE.Vector3(0, 0, 0)}
            isHovered={hovered === node.id}
            isSelected={selected === node.id}
            onHover={() => setHovered(node.id)}
            onUnhover={() => setHovered(null)}
            onClick={() => {
              setSelected(node.id);
              onSelect(node.id);
            }}
          />
        ))}
      </Float>
    </group>
  );
}

export default function SkillConstellation({
  nodes,
  onNodeClick,
  isGenerating = false,
}: {
  nodes: ConstellationNode[];
  onNodeClick?: (id: string) => void;
  isGenerating?: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div className="relative w-full h-full bg-[#050507] rounded-xl overflow-hidden border border-zinc-800">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none opacity-80">
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span> Degree
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Certificate
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Badge
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 bg-zinc-900/50 rounded-full text-zinc-400 hover:text-white border border-white/10"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
      <Canvas camera={{ position: [0, 6, 35], fov: 35 }}>
        <Environment preset="city" blur={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <Stars radius={80} count={2000} factor={4} fade />
        <OrbitControls
          autoRotate={!isPaused}
          autoRotateSpeed={0.5}
          minDistance={10}
          maxDistance={60}
          enablePan={false}
        />
        <SceneContent
          nodes={nodes}
          onSelect={(id) => onNodeClick && onNodeClick(id)}
          isGenerating={isGenerating}
        />
      </Canvas>
    </div>
  );
}
