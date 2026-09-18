import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Html, OrbitControls, Sparkles } from '@react-three/drei';
import { Sparkles as SparklesIcon } from 'lucide-react';
import * as THREE from 'three';
import { PriceTag } from '../ui/PriceTag';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { MENU_ITEMS } from '../../data/mockData';

// Procedural Stylized 3D Gourmet Burger Model
const StylizedBurger3D = ({ position = [0, 0, 0], scale = 1 }) => {
  const burgerRef = useRef();
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const burgerItem = MENU_ITEMS.find((m) => m.id === 'm1') || MENU_ITEMS[0];

  useFrame((state, delta) => {
    if (burgerRef.current) {
      burgerRef.current.rotation.y += delta * (hovered ? 0.8 : 0.25);
    }
  });

  return (
    <group
      ref={burgerRef}
      position={position}
      scale={hovered ? scale * 1.06 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Top Brioche Bun */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#D48B38"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Sesame Seeds on top bun */}
      {[-0.5, 0, 0.5].map((x, i) =>
        [-0.4, 0, 0.4].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x * 1.4, 1.25 - Math.abs(x) * 0.2, z * 1.4]} rotation={[0.2, 0.3, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#FFF5EA" roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Melted Cheddar / Gouda Cheese (Golden drooping corners) */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.8, 1.8, 0.08]} />
        <meshStandardMaterial
          color="#F5A623"
          roughness={0.3}
          metalness={0.2}
          emissive="#D48200"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Sizzling Truffle Patty */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.35, 32]} />
        <meshStandardMaterial
          color="#4A2511"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Crispy Lettuce / Frills */}
      <mesh position={[0, -0.05, 0]} rotation={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.45, 1.4, 0.12, 32]} />
        <meshStandardMaterial
          color="#4E8D29"
          roughness={0.6}
        />
      </mesh>

      {/* Bottom Toasted Brioche Bun */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[1.25, 1.15, 0.45, 32]} />
        <meshStandardMaterial
          color="#C27A29"
          roughness={0.45}
        />
      </mesh>

      {/* Dynamic 3D HTML Price Tag */}
      <Html position={[1.5, 0.8, 0]} center distanceFactor={8}>
        <div className="glass-card p-3 rounded-2xl border border-brand-gold/40 shadow-2xl backdrop-blur-xl min-w-[180px] pointer-events-auto transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-brand-amber bg-brand-amber/15 px-2 py-0.5 rounded-full flex items-center gap-1">
              <SparklesIcon className="w-2.5 h-2.5" />
              <span>Signature</span>
            </span>
            <PriceTag price={burgerItem.price} size="sm" />
          </div>
          <p className="text-xs font-bold text-brand-cream line-clamp-1">
            {burgerItem.name}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(burgerItem, 1);
            }}
            className="w-full mt-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-brand-amber to-brand-gold text-brand-950 text-[11px] font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
          >
            + Quick Add
          </button>
        </div>
      </Html>
    </group>
  );
};

// Steaming Earthen Chai Kulhad in 3D
const SteamingChaiKulhad3D = ({ position = [2.8, -0.5, -1], scale = 0.8 }) => {
  const chaiRef = useRef();

  useFrame((state, delta) => {
    if (chaiRef.current) {
      chaiRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={chaiRef} position={position} scale={scale}>
      {/* Terracotta Clay Kulhad Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.5, 1.1, 32]} />
        <meshStandardMaterial
          color="#C85A32"
          roughness={0.9}
        />
      </mesh>

      {/* Saffron Chai Liquid Surface */}
      <mesh position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshStandardMaterial
          color="#D49B55"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Ambient Rising Steam / Sparkles */}
      <Sparkles
        count={25}
        scale={[1, 2, 1]}
        position={[0, 1.5, 0]}
        size={3}
        speed={0.6}
        color="#F4B245"
      />
    </group>
  );
};

// Floating Culinary Atmosphere Particles
const AmbientCulinaryParticles = () => {
  return (
    <>
      <Sparkles
        count={60}
        scale={[12, 10, 8]}
        size={2}
        speed={0.4}
        color="#F4B245"
        opacity={0.6}
      />
      <Sparkles
        count={30}
        scale={[8, 8, 6]}
        size={4}
        speed={0.8}
        color="#E58B20"
        opacity={0.4}
      />
    </>
  );
};

export const Hero3DCanvas = () => {
  return (
    <div className="w-full h-full min-h-[450px] sm:min-h-[550px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2} color="#FFF2DB" castShadow />
        <pointLight position={[-4, 2, 2]} intensity={1.5} color="#E58B20" />
        <pointLight position={[4, -2, 2]} intensity={1} color="#C85A32" />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <StylizedBurger3D position={[0, 0.1, 0]} scale={1.15} />
          </Float>

          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <SteamingChaiKulhad3D position={[2.4, -0.6, -0.8]} scale={0.75} />
          </Float>

          <AmbientCulinaryParticles />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
