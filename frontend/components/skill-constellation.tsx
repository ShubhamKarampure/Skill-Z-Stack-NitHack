"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Stars,
  Float,
  QuadraticBezierLine,
  useCursor,
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
  Sparkles,
} from "lucide-react";

// --- Types ---
export enum CredentialType {
  DEGREE = "DEGREE",
  CERTIFICATE = "CERTIFICATE",
  BADGE = "BADGE",
}

export enum NodeStatus {
  OWNED = "OWNED",
  VERIFYING = "VERIFYING",
  GHOST = "GHOST",
}

export interface ConstellationNode {
  id: string;
  name: string;
  type: CredentialType;
  status: NodeStatus;
  category: "Frontend" | "Backend" | "Design" | "DevOps" | "Core";
  relatedIds: string[];
  description?: string;
  logoSlug?: string;
}

const CATEGORY_CONFIG = {
  Frontend: { offset: [8, 0, 0], color: "#3b82f6", icon: Globe }, // Increased spread
  Backend: { offset: [-8, 0, 0], color: "#10b981", icon: Database },
  Design: { offset: [0, 8, -4], color: "#ec4899", icon: Palette },
  DevOps: { offset: [0, -8, 4], color: "#f59e0b", icon: Cpu },
  Core: { offset: [0, 0, 0], color: "#06b6d4", icon: User },
};

const COLORS = {
  owned: "#3b82f6", // Blue
  verifying: "#f59e0b", // Amber
  ghost: "#a855f7", // Neon Purple (Visible on dark bg)
};

// --- Helper: Position Calculation (WIDER SPREAD) ---
const calculateNodePosition = (
  node: ConstellationNode,
  index: number,
  total: number
) => {
  const config = CATEGORY_CONFIG[node.category] || CATEGORY_CONFIG.Core;
  const center = config.offset;

  // Distribute nodes in a wider spiral
  const theta = (index / total) * Math.PI * 2;
  const radius = 4 + (index % 3) * 1.5; // Dynamic radius to prevent bunching

  const x = center[0] + Math.cos(theta) * radius;
  const y = center[1] + Math.sin(theta) * radius;
  // More depth variation to reduce visual overlap
  const z = center[2] + Math.sin(index * 2) * 3;

  return new THREE.Vector3(x, y, z);
};

// --- Sub-Component: Identity Core (Sun) ---
function UserCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current)
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#06b6d4"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight intensity={3} color="#06b6d4" distance={25} decay={2} />
      <Html position={[0, -2.2, 0]} center zIndexRange={[50, 0]}>
        <div className="px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur border border-cyan-500/50 text-[10px] font-bold tracking-[0.2em] text-cyan-200 uppercase select-none pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          Identity Core
        </div>
      </Html>
    </group>
  );
}

// --- Sub-Component: Individual Node ---
function Node3D({
  node,
  position,
  isHovered,
  isSelected,
  onHover,
  onUnhover,
  onClick,
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  useCursor(isHovered);

  const { mainColor, isWireframe } = useMemo(() => {
    if (node.status === NodeStatus.GHOST)
      return { mainColor: COLORS.ghost, isWireframe: true };
    if (node.status === NodeStatus.VERIFYING)
      return { mainColor: COLORS.verifying, isWireframe: false };
    return { mainColor: COLORS.owned, isWireframe: false };
  }, [node.status]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;

    // Scale Logic
    let targetScale = isSelected ? 1.5 : isHovered ? 1.3 : 1;

    // Pulse effect for Ghost Nodes to make them visible
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
        <sphereGeometry args={[1.8, 16, 16]} />
      </mesh>

      {/* Geometry */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
      >
        <dodecahedronGeometry args={[node.type === "DEGREE" ? 0.7 : 0.5, 0]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={mainColor}
          // Higher emissive for Ghost nodes so they glow in the dark
          emissiveIntensity={node.status === NodeStatus.GHOST ? 2 : 0.6}
          wireframe={isWireframe}
          transparent
          // Ghost nodes are visible but ghostly
          opacity={node.status === NodeStatus.GHOST ? 0.8 : 1}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, 1.4, 0]}
        center
        distanceFactor={12}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`flex flex-col items-center transition-all duration-300 ${
            isHovered || isSelected
              ? "scale-110 opacity-100 z-50"
              : "scale-100 opacity-80"
          }`}
        >
          <div
            className={`
            px-3 py-1.5 rounded-lg border backdrop-blur-md flex items-center gap-2 transition-all duration-300 shadow-lg
            ${
              isSelected
                ? "bg-blue-600/40 border-blue-400 shadow-blue-500/20"
                : node.status === NodeStatus.GHOST
                ? "bg-purple-900/40 border-purple-500/50"
                : "bg-zinc-900/70 border-zinc-700"
            }
          `}
          >
            {logoUrl && <img src={logoUrl} alt="icon" className="w-3 h-3" />}
            <span
              className={`text-[10px] font-bold whitespace-nowrap ${
                isSelected
                  ? "text-white"
                  : node.status === NodeStatus.GHOST
                  ? "text-purple-200"
                  : "text-zinc-300"
              }`}
            >
              {node.name}
            </span>
          </div>
          {node.status === NodeStatus.GHOST && isHovered && (
            <span className="mt-1 text-[8px] uppercase tracking-wider text-purple-400 font-bold bg-black/50 px-1 rounded">
              Recommended
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

// --- Sub-Component: Connections (Thinner Lines) ---
function Connections({
  nodes,
  positions,
}: {
  nodes: ConstellationNode[];
  positions: Map<string, THREE.Vector3>;
}) {
  const lines = useMemo(() => {
    const els: JSX.Element[] = [];
    const processed = new Set<string>();

    nodes.forEach((node) => {
      const start = positions.get(node.id);
      if (!start) return;

      // Connect Degree to Core
      if (node.type === CredentialType.DEGREE) {
        els.push(
          <QuadraticBezierLine
            key={`core-${node.id}`}
            start={[0, 0, 0]}
            end={start}
            color="#06b6d4"
            lineWidth={0.3}
            transparent
            opacity={0.1}
            dashed
            gapSize={0.5}
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
          els.push(
            <QuadraticBezierLine
              key={pair}
              start={start}
              end={end}
              mid={[
                (start.x + end.x) / 2,
                (start.y + end.y) / 2 + Math.random() * 2,
                (start.z + end.z) / 2,
              ]}
              color={isGhost ? "#a855f7" : "#3b82f6"}
              lineWidth={isGhost ? 0.3 : 0.6} // Thinner lines
              transparent
              opacity={isGhost ? 0.2 : 0.15} // More transparent to reduce clutter
              dashed={isGhost}
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
            position={nodePositions.get(node.id)}
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
          className="p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 rounded-full border border-white/5 backdrop-blur-md"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>

      <Canvas camera={{ position: [0, 4, 28], fov: 30 }} dpr={[1, 2]}>
        <color attach="background" args={["#050507"]} />
        <fog attach="fog" args={["#050507", 15, 60]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[15, 15, 15]} intensity={1} color="#3b82f6" />
        <pointLight position={[-15, -10, -15]} intensity={1} color="#d946ef" />
        <Stars radius={80} count={3000} factor={4} fade speed={0.2} />
        <OrbitControls
          autoRotate={!isPaused}
          autoRotateSpeed={0.3}
          minDistance={10}
          maxDistance={50}
          enablePan={false}
        />
        <SceneContent
          nodes={nodes}
          onSelect={(n) => n && onNodeClick && onNodeClick(n.id)}
        />
      </Canvas>
    </div>
  );
}
