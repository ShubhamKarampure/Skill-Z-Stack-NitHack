"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
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
import {
  Pause,
  Play,
  Cpu,
  Palette,
  Globe,
  Database,
  User,
  LucideIcon,
} from "lucide-react";

// --- Types Definition ---
export enum NodeStatus {
  OWNED = "OWNED",
  VERIFYING = "VERIFYING",
  GHOST = "GHOST",
}

export enum CredentialType {
  DEGREE = "DEGREE",
  CERTIFICATE = "CERTIFICATE",
  SKILL = "SKILL",
}

export type NodeCategory =
  | "Frontend"
  | "Backend"
  | "Design"
  | "DevOps"
  | "Core";

export interface ConstellationNode {
  id: string;
  name: string;
  category: NodeCategory;
  type: CredentialType;
  status: NodeStatus;
  x: number;
  y: number;
  relatedIds?: string[];
  logoSlug?: string;
}

// --- Config ---
type CategoryConfigItem = {
  offset: [number, number, number];
  color: string;
  icon: LucideIcon | React.ElementType;
};

const CATEGORY_CONFIG: Record<NodeCategory, CategoryConfigItem> = {
  // Increased offsets to spread categories further apart
  Frontend: { offset: [12, 0, 0], color: "#22d3ee", icon: Globe }, // Cyan
  Backend: { offset: [-12, 0, 0], color: "#10b981", icon: Database }, // Emerald
  Design: { offset: [0, 12, -6], color: "#ec4899", icon: Palette }, // Pink
  DevOps: { offset: [0, -12, 6], color: "#f59e0b", icon: Cpu }, // Amber
  Core: { offset: [0, 0, 0], color: "#06b6d4", icon: User }, // Cyan
};

const COLORS = {
  owned: "#3b82f6", // Blue
  verifying: "#f59e0b", // Amber
  ghost: "#a855f7", // Purple
};

// --- Helper: Position Calculation ---
const calculateNodePosition = (
  node: ConstellationNode,
  index: number,
  total: number
) => {
  const config = CATEGORY_CONFIG[node.category] || CATEGORY_CONFIG.Core;
  const center = config.offset;

  const theta = (index / total) * Math.PI * 2;
  // Increased base radius from 4 to 8 to un-cramp the nodes
  const radius = 8 + (index % 3) * 2.5;

  const x = center[0] + Math.cos(theta) * radius;
  const y = center[1] + Math.sin(theta) * radius;
  // Increased z-spread from 3 to 5
  const z = center[2] + Math.sin(index * 2) * 5;

  return new THREE.Vector3(x, y, z);
};

// --- Sub-Component: Identity Core (HOLOGRAPHIC BRAIN) ---
function UserCore() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Gentle floating hover
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    if (innerRef.current && outerRef.current) {
      // Counter-rotation for complex tech feel
      innerRef.current.rotation.y = t * 0.4;
      innerRef.current.rotation.z = t * 0.1;

      outerRef.current.rotation.x = t * 0.2;
      outerRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. NEURAL ACTIVITY (Sparkles inside) - Scaled Down */}
      <Sparkles
        count={200}
        scale={3} // Reduced scale from 5 back to 3
        size={3}
        speed={0.4}
        opacity={1}
        color="#22d3ee"
      />

      {/* 2. INNER CORE (The dense brain matter) - Scaled Down */}
      <mesh ref={innerRef}>
        {/* Reduced radius from 1.6 back to 1 */}
        <torusKnotGeometry args={[1, 0.35, 128, 16]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#be185d"
          emissiveIntensity={2}
          wireframe={true}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* 3. OUTER SHELL (The Forcefield/Hologram) - Scaled Down */}
      <mesh ref={outerRef} scale={1.5}>
        {" "}
        {/* Reduced scale from 2.4 to 1.5 */}
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. GLOW LIGHT */}
      <pointLight intensity={5} color="#d946ef" distance={10} decay={2} />
      <pointLight
        intensity={5}
        color="#22d3ee"
        distance={10}
        decay={2}
        position={[0, 2, 0]}
      />

      {/* 5. UI LABEL (Moved Up) */}
      <Html
        position={[0, -2.5, 0]} // Moved up from -3.5 to -2.5
        center
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
      >
        <div className="flex flex-col items-center justify-center select-none opacity-90">
          {/* Main Title - Slightly Larger */}
          <h1 className="text-3xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            IDENTITY
          </h1>
          {/* Subtitle */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-[1px] w-6 bg-cyan-500/50"></div>
            <span className="text-[10px] font-mono text-cyan-300 tracking-[0.3em] uppercase opacity-70">
              Neural Core
            </span>
            <div className="h-[1px] w-6 bg-cyan-500/50"></div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// --- Sub-Component: Individual Node ---
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
    if (node.status === NodeStatus.VERIFYING)
      return { mainColor: COLORS.verifying, isWireframe: false };
    return { mainColor: COLORS.owned, isWireframe: false };
  }, [node.status]);

  useFrame((state: RootState, delta: number) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;

    let targetScale = isSelected ? 1.5 : isHovered ? 1.3 : 1;

    if (node.status === NodeStatus.GHOST) {
      targetScale += Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }

    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  const logoUrl = node.logoSlug
    ? `https://cdn.simpleicons.org/${node.logoSlug}/${
        isSelected || isHovered
          ? "ffffff"
          : node.status === NodeStatus.GHOST
          ? "a855f7"
          : "9ca3af"
      }`
    : null;

  return (
    <group position={position}>
      {/* Hitbox */}
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        <sphereGeometry args={[1.8, 16, 16] as [number, number, number]} />
      </mesh>

      {/* Visible Geometry */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        <dodecahedronGeometry
          args={
            [node.type === CredentialType.DEGREE ? 0.7 : 0.5, 0] as [
              number,
              number
            ]
          }
        />
        <meshStandardMaterial
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={node.status === NodeStatus.GHOST ? 3 : 1.5}
          wireframe={isWireframe}
          transparent
          opacity={node.status === NodeStatus.GHOST ? 0.8 : 1}
          toneMapped={false}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* --- LABEL UI --- */}
      <Html
        position={[0, 1.4, 0]}
        center
        distanceFactor={12}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isHovered || isSelected
              ? "scale-110 opacity-100 z-50"
              : "scale-100 opacity-80"
          }`}
        >
          <div
            className={`
            px-4 py-2 rounded-full border backdrop-blur-md flex items-center gap-3 transition-all duration-300 shadow-lg
            ${
              isSelected
                ? "bg-blue-600/40 border-blue-400 shadow-blue-500/20"
                : node.status === NodeStatus.GHOST
                ? "bg-purple-900/40 border-purple-500/50"
                : "bg-zinc-900/70 border-zinc-700"
            }
          `}
          >
            {logoUrl && (
              <img
                src={logoUrl}
                alt="icon"
                className="w-5 h-5 object-contain flex-shrink-0"
              />
            )}
            <span
              className={`
          text-sm font-bold whitespace-nowrap
          ${
            isSelected
              ? "text-white"
              : node.status === NodeStatus.GHOST
              ? "text-purple-200"
              : "text-zinc-300"
          }
              `}
            >
              {node.name}
            </span>
          </div>
          {node.status === NodeStatus.GHOST && isHovered && (
            <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold bg-black/50 px-2 py-0.5 rounded">
              Recommended
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

// --- Sub-Component: Connections ---
function Connections({
  nodes,
  positions,
}: {
  nodes: ConstellationNode[];
  positions: Map<string, THREE.Vector3>;
}) {
  const lines = useMemo(() => {
    const els: React.ReactNode[] = [];
    const processed = new Set<string>();

    nodes.forEach((node) => {
      const start = positions.get(node.id);
      if (!start) return;

      // Connect Degree nodes to the BRAIN core (0,0,0)
      if (node.type === CredentialType.DEGREE) {
        els.push(
          <QuadraticBezierLine
            key={`core-${node.id}`}
            start={[0, 0, 0]}
            end={start}
            color="#ec4899" // Pink connection for Brain
            lineWidth={1.5}
            dashed={true}
            dashScale={10}
            gapSize={3}
            transparent
            opacity={0.3}
            segments={20}
          />
        );
      }

      node.relatedIds?.forEach((relId) => {
        const pair = [node.id, relId].sort().join("-");
        if (processed.has(pair)) return;
        processed.add(pair);

        const end = positions.get(relId);

        if (end) {
          const isGhost =
            node.status === NodeStatus.GHOST ||
            nodes.find((n) => n.id === relId)?.status === NodeStatus.GHOST;

          const midPoint: [number, number, number] = [
            (start.x + end.x) / 2,
            (start.y + end.y) / 2 + 2,
            (start.z + end.z) / 2,
          ];

          els.push(
            <QuadraticBezierLine
              key={pair}
              start={start}
              end={end}
              mid={midPoint}
              color={isGhost ? "#c084fc" : "#22d3ee"} // Cyan or Ghost Purple
              lineWidth={isGhost ? 1 : 1.5}
              transparent
              opacity={isGhost ? 0.3 : 0.6}
              dashed={true}
              dashScale={isGhost ? 15 : 20}
              gapSize={isGhost ? 5 : 4}
              segments={20}
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
}: {
  nodes: ConstellationNode[];
  onSelect: (n: ConstellationNode | null) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const nodePositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodes.forEach((n, i) =>
      map.set(n.id, calculateNodePosition(n, i, nodes.length))
    );
    return map;
  }, [nodes]);

  const handleClick = (node: ConstellationNode) => {
    const newVal = selected === node.id ? null : node.id;
    setSelected(newVal);
    onSelect(newVal ? node : null);
  };

  return (
    <group
      onPointerMissed={() => {
        setSelected(null);
        onSelect(null);
      }}
    >
      <UserCore />
      <Connections nodes={nodes} positions={nodePositions} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {nodes.map((node) => (
          <Node3D
            key={node.id}
            node={node}
            position={nodePositions.get(node.id) || new THREE.Vector3(0, 0, 0)}
            isHovered={hovered === node.id}
            isSelected={selected === node.id}
            onHover={() => setHovered(node.id)}
            onUnhover={() => setHovered(null)}
            onClick={() => handleClick(node)}
          />
        ))}
      </Float>
    </group>
  );
}

// --- MAIN EXPORT ---
export default function SkillConstellation({
  nodes,
  onNodeClick,
}: {
  nodes: ConstellationNode[];
  onNodeClick?: (id: string) => void;
}) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#050507] rounded-xl overflow-hidden border border-zinc-800">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none opacity-60">
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Owned
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>{" "}
          Recommended
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 rounded-full border border-white/5 backdrop-blur-md cursor-pointer pointer-events-auto"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>

      {/* Adjusted camera position: pulled back from [0, 4, 28] to [0, 6, 45] for a wider view */}
      <Canvas camera={{ position: [0, 6, 45], fov: 30 }} dpr={[1, 2]}>
        <color attach="background" args={["#050507"]} />
        <fog attach="fog" args={["#050507", 20, 80]} />

        <Environment preset="city" blur={1} intensity={0.5} />
        <ambientLight intensity={0.8} />
        <pointLight position={[15, 15, 15]} intensity={2} color="#3b82f6" />
        <pointLight position={[-15, -10, -15]} intensity={2} color="#d946ef" />

        <Stars radius={80} count={3000} factor={4} fade speed={0.2} />
        <OrbitControls
          autoRotate={!isPaused}
          autoRotateSpeed={0.3}
          minDistance={10}
          maxDistance={80} // Increased max distance
          enablePan={false}
        />
        <SceneContent
          nodes={nodes}
          onSelect={(n) => {
            if (n && onNodeClick) {
              onNodeClick(n.id);
            }
          }}
        />
      </Canvas>
    </div>
  );
}
