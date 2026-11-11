"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import {
  Language,
  PotalaHotspot,
  POTALA_HOTSPOTS,
  POTALA_REFERENCE_ASSETS,
} from "@/data/potalaPalaceData";

type AtmosphereMode = "sunlight" | "night";
type BaseStyle = "island" | "maquette";
type CameraViewPreset = "diorama" | "hero" | "elevation" | "summit";

interface ScreenHotspotPos {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

/* ══════════════════════════════════════════════════════════════════════════
   Procedural High-DPI Tibetan Facade Texture Generator (Canvas 2D -> WebGL)
   Generates authentic battered walls with black-framed trapezoidal windows,
   multi-colored shing-tsak lintels, crimson penba friezes & emissive lamps.
   ══════════════════════════════════════════════════════════════════════════ */
function createPotalaFacadeTextures(options: {
  wallColor: string;
  friezeColor?: string;
  cols: number;
  rows: number;
  windowStartRow?: number;
  hasGoldBand?: boolean;
}) {
  const width = 512;
  const height = 512;

  const diffuseCanvas = document.createElement("canvas");
  diffuseCanvas.width = width;
  diffuseCanvas.height = height;
  const ctx = diffuseCanvas.getContext("2d")!;

  const emissiveCanvas = document.createElement("canvas");
  emissiveCanvas.width = width;
  emissiveCanvas.height = height;
  const eCtx = emissiveCanvas.getContext("2d")!;

  // 1. Base stone/lime plaster background
  ctx.fillStyle = options.wallColor;
  ctx.fillRect(0, 0, width, height);

  eCtx.fillStyle = "#000000";
  eCtx.fillRect(0, 0, width, height);

  // Subtle horizontal stone masonry courses
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 2;
  for (let y = 0; y < height; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Top Penba Frieze (dark crimson tamarisk band under parapet)
  const friezeH = Math.floor(height * 0.11);
  ctx.fillStyle = options.friezeColor || "#5c1319";
  ctx.fillRect(0, 0, width, friezeH);

  // Golden Melong (sacred brass mirror discs) along the frieze
  if (options.hasGoldBand !== false) {
    ctx.fillStyle = "#f59e0b";
    const discCount = Math.max(4, options.cols * 2);
    for (let i = 0; i < discCount; i++) {
      const cx = ((i + 0.5) / discCount) * width;
      const cy = friezeH * 0.52;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // White/Gold lower trim line under frieze
    ctx.fillStyle = "#fde68a";
    ctx.fillRect(0, friezeH - 4, width, 3);
  }

  // 3. Trapezoidal Tibetan Windows
  const startRow = options.windowStartRow ?? 0;
  const usableTop = friezeH + 18;
  const usableHeight = height - usableTop - 24;
  const rowStep = usableHeight / Math.max(1, options.rows);
  const colStep = (width - 40) / Math.max(1, options.cols);

  for (let r = startRow; r < options.rows; r++) {
    const wy = usableTop + r * rowStep + rowStep * 0.15;
    const winH = Math.min(48, rowStep * 0.62);
    const winW = Math.min(34, colStep * 0.52);

    for (let c = 0; c < options.cols; c++) {
      const wx = 20 + c * colStep + (colStep - winW) * 0.5;

      // Black trapezoidal frame (wider at bottom, narrower at top)
      ctx.fillStyle = "#171416";
      ctx.beginPath();
      ctx.moveTo(wx + 2, wy);
      ctx.lineTo(wx + winW - 2, wy);
      ctx.lineTo(wx + winW + 2, wy + winH);
      ctx.lineTo(wx - 2, wy + winH);
      ctx.closePath();
      ctx.fill();

      // Multi-tiered colorful wooden lintel header (shing-tsak)
      ctx.fillStyle = "#991b1b";
      ctx.fillRect(wx - 1, wy - 5, winW + 2, 4);
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(wx, wy - 2, winW, 2.5);

      // Inner recessed window glass/shutter
      const pad = 4.5;
      ctx.fillStyle = "#262124";
      ctx.fillRect(wx + pad, wy + pad, winW - pad * 2, winH - pad * 1.8);

      // Window wooden crossbars
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(wx + pad, wy + pad, winW - pad * 2, winH - pad * 1.8);
      ctx.beginPath();
      ctx.moveTo(wx + winW / 2, wy + pad);
      ctx.lineTo(wx + winW / 2, wy + winH - pad);
      ctx.stroke();

      // Emissive warm butter-lamp glow for Night Mode (75% of windows lit)
      const isLit = (r * 7 + c * 13) % 4 !== 0;
      if (isLit) {
        eCtx.fillStyle = (r + c) % 3 === 0 ? "#fde047" : "#f59e0b";
        eCtx.fillRect(wx + pad + 1, wy + pad + 1, winW - pad * 2 - 2, winH - pad * 1.8 - 2);
      }
    }
  }

  const diffuseTex = new THREE.CanvasTexture(diffuseCanvas);
  diffuseTex.colorSpace = THREE.SRGBColorSpace;
  diffuseTex.anisotropy = 4;

  const emissiveTex = new THREE.CanvasTexture(emissiveCanvas);
  emissiveTex.colorSpace = THREE.SRGBColorSpace;

  return { diffuseTex, emissiveTex };
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Battered (Inward-Sloping) Tibetan Fortress Wing Mesh
   ══════════════════════════════════════════════════════════════════════════ */
function createBatteredPalaceBlock(params: {
  w: number;
  h: number;
  d: number;
  taper?: number;
  wallColor: string;
  friezeColor?: string;
  cols: number;
  rows: number;
  windowStartRow?: number;
  roofTrimColor?: string;
}) {
  const group = new THREE.Group();
  const taper = params.taper ?? 0.88;

  // Tapered box geometry so walls slope inward as they rise
  const geo = new THREE.BoxGeometry(params.w, params.h, params.d, 1, 1, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vy = pos.getY(i);
    if (vy > 0) {
      pos.setX(i, pos.getX(i) * taper);
      pos.setZ(i, pos.getZ(i) * taper);
    }
  }
  geo.computeVertexNormals();

  const { diffuseTex, emissiveTex } = createPotalaFacadeTextures({
    wallColor: params.wallColor,
    friezeColor: params.friezeColor,
    cols: params.cols,
    rows: params.rows,
    windowStartRow: params.windowStartRow,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    map: diffuseTex,
    emissiveMap: emissiveTex,
    emissive: new THREE.Color("#ff9900"),
    emissiveIntensity: 0.08,
    roughness: 0.72,
    metalness: 0.06,
  });
  wallMat.userData = { isPalaceWall: true };

  const roofTopMat = new THREE.MeshStandardMaterial({
    color: params.roofTrimColor || "#451a1c",
    roughness: 0.6,
    metalness: 0.15,
  });

  // Apply facade texture to front/back/left/right, solid roof material on top/bottom
  const materials = [wallMat, wallMat, roofTopMat, roofTopMat, wallMat, wallMat];
  const mesh = new THREE.Mesh(geo, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // Overhanging flat Tibetan roof parapet cornice
  const corniceW = params.w * taper + 0.14;
  const corniceD = params.d * taper + 0.14;
  const corniceGeo = new THREE.BoxGeometry(corniceW, 0.12, corniceD);
  const corniceMat = new THREE.MeshStandardMaterial({
    color: "#d97706",
    roughness: 0.35,
    metalness: 0.65,
  });
  const cornice = new THREE.Mesh(corniceGeo, corniceMat);
  cornice.position.y = params.h / 2 + 0.04;
  cornice.castShadow = true;
  group.add(cornice);

  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Gilded Tibetan Roof (Gyaphib / Serdong) with Finials
   ══════════════════════════════════════════════════════════════════════════ */
function createGildedTibetanRoof(w: number, d: number, h: number) {
  const roofGroup = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({
    color: "#fbbf24",
    emissive: "#78350f",
    emissiveIntensity: 0.18,
    roughness: 0.22,
    metalness: 0.88,
  });

  // Lower flared eave tier
  const baseGeo = new THREE.BoxGeometry(w * 1.15, h * 0.25, d * 1.15);
  const baseMesh = new THREE.Mesh(baseGeo, goldMat);
  baseMesh.castShadow = true;
  roofGroup.add(baseMesh);

  // Sloped hip roof body (4-sided pyramid frustum)
  const hipGeo = new THREE.CylinderGeometry(w * 0.35, w * 0.78, h * 0.75, 4);
  hipGeo.rotateY(Math.PI / 4);
  hipGeo.scale(1, 1, d / w);
  const hipMesh = new THREE.Mesh(hipGeo, goldMat);
  hipMesh.position.y = h * 0.45;
  hipMesh.castShadow = true;
  roofGroup.add(hipMesh);

  // Golden Ridge Beam
  const ridgeGeo = new THREE.BoxGeometry(w * 0.55, h * 0.22, d * 0.18);
  const ridgeMesh = new THREE.Mesh(ridgeGeo, goldMat);
  ridgeMesh.position.y = h * 0.82;
  roofGroup.add(ridgeMesh);

  // Twin Golden Stupa Finials (Ganjira) on ridge ends
  [-w * 0.22, w * 0.22].forEach((fx) => {
    const finialGeo = new THREE.ConeGeometry(0.09, 0.32, 8);
    const finial = new THREE.Mesh(finialGeo, goldMat);
    finial.position.set(fx, h * 1.02, 0);
    roofGroup.add(finial);
  });

  // Central Dharma Wheel (Chokhor) & Sacred Nyi-Da (Crescent Moon + Sun + Flaming Jewel) Finial
  const wheelGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
  const wheel = new THREE.Mesh(wheelGeo, goldMat);
  wheel.position.set(0, h * 1.06, 0);
  roofGroup.add(wheel);

  // Crescent Moon Cradle (Zla-ba)
  const crescentGeo = new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI);
  crescentGeo.rotateZ(Math.PI);
  const crescent = new THREE.Mesh(crescentGeo, goldMat);
  crescent.position.set(0, h * 1.24, 0);
  roofGroup.add(crescent);

  // Sun Disc (Nyi-ma) & Top Jyoti Jewel
  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), goldMat);
  sunDisc.position.set(0, h * 1.28, 0);
  roofGroup.add(sunDisc);

  return roofGroup;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Lhasa High-Altitude Blue Sky Gradient Texture (3,700m Azure Sky)
   ══════════════════════════════════════════════════════════════════════════ */
function createLhasaDaySkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Vertical gradient from deep Tibetan cobalt zenith to crisp azure horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, "#1d4ed8");    // High-altitude Lhasa cobalt zenith
  skyGrad.addColorStop(0.45, "#3b82f6"); // Brilliant Himalayan azure mid-sky
  skyGrad.addColorStop(0.82, "#7dd3fc"); // Soft sky blue
  skyGrad.addColorStop(1, "#bae6fd");    // Luminous horizon mist
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle high-altitude wispy Himalayan clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
  for (let i = 0; i < 12; i++) {
    const cx = (i * 97) % 512;
    const cy = 90 + ((i * 53) % 220);
    const rx = 55 + (i % 4) * 28;
    const ry = 8 + (i % 3) * 5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Radial Glow Texture for 3D Sun & Moon Halos
   ══════════════════════════════════════════════════════════════════════════ */
function createCelestialGlowTexture(
  coreColor: string,
  midColor: string,
  outerColor: string
) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 126);
  grad.addColorStop(0, coreColor);
  grad.addColorStop(0.35, midColor);
  grad.addColorStop(0.7, outerColor);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create 3D Radiant Golden Sun (ཉི་མ།) & Luminous Moon (ཟླ་བ།)
   ══════════════════════════════════════════════════════════════════════════ */
function createSunCelestialBody() {
  const sunGroup = new THREE.Group();

  // 1. Core Radiant Solar Sphere
  const sunCoreMat = new THREE.MeshBasicMaterial({
    color: "#fef08a",
  });
  const sunSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 32, 32),
    sunCoreMat
  );
  sunGroup.add(sunSphere);

  // 2. Inner Golden Corona Shell
  const shellMat = new THREE.MeshStandardMaterial({
    color: "#f59e0b",
    emissive: "#f59e0b",
    emissiveIntensity: 1.4,
    roughness: 0.2,
    metalness: 0.6,
    transparent: true,
    opacity: 0.85,
  });
  const sunRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.22, 0.045, 12, 48),
    shellMat
  );
  sunGroup.add(sunRing);

  // 3. 12 Rotating Tibetan Solar Rays
  const raysGroup = new THREE.Group();
  raysGroup.name = "solarRays";
  const rayMat = new THREE.MeshBasicMaterial({ color: "#fbbf24" });
  const rayCount = 12;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2;
    const ray = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 6), rayMat);
    ray.position.set(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0);
    ray.rotation.z = angle - Math.PI / 2;
    raysGroup.add(ray);
  }
  sunGroup.add(raysGroup);

  // 4. Volumetric Solar Halo Sprite (vivid against daytime blue sky)
  const glowTex = createCelestialGlowTexture(
    "rgba(254, 249, 195, 0.95)",
    "rgba(251, 191, 36, 0.65)",
    "rgba(245, 158, 11, 0.18)"
  );
  const spriteMat = new THREE.SpriteMaterial({
    map: glowTex,
    transparent: true,
    depthWrite: false,
  });
  const glowSprite = new THREE.Sprite(spriteMat);
  glowSprite.scale.set(6.5, 6.5, 1);
  sunGroup.add(glowSprite);

  return sunGroup;
}

function createMoonCelestialBody() {
  const moonGroup = new THREE.Group();

  // Procedural subtle lunar crater canvas texture
  const mCanvas = document.createElement("canvas");
  mCanvas.width = 256;
  mCanvas.height = 256;
  const mCtx = mCanvas.getContext("2d")!;
  mCtx.fillStyle = "#e0f2fe";
  mCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 28; i++) {
    const cx = Math.random() * 256;
    const cy = Math.random() * 256;
    const r = 4 + Math.random() * 18;
    mCtx.fillStyle = i % 2 === 0 ? "rgba(186, 230, 253, 0.65)" : "rgba(148, 163, 184, 0.35)";
    mCtx.beginPath();
    mCtx.arc(cx, cy, r, 0, Math.PI * 2);
    mCtx.fill();
  }
  const moonTex = new THREE.CanvasTexture(mCanvas);
  moonTex.colorSpace = THREE.SRGBColorSpace;

  // 1. Pearlescent Lunar Orb
  const moonOrbMat = new THREE.MeshStandardMaterial({
    map: moonTex,
    color: "#f0f9ff",
    emissive: "#bae6fd",
    emissiveIntensity: 0.85,
    roughness: 0.45,
    metalness: 0.15,
  });
  const moonOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 32, 32),
    moonOrbMat
  );
  moonGroup.add(moonOrb);

  // 2. Sculpted Tibetan Crescent Cradle (Zla-tshes) embracing the Moon
  const crescentMat = new THREE.MeshStandardMaterial({
    color: "#f8fafc",
    emissive: "#7dd3fc",
    emissiveIntensity: 0.9,
    roughness: 0.25,
    metalness: 0.7,
  });
  const crescentCradle = new THREE.Mesh(
    new THREE.TorusGeometry(0.96, 0.16, 16, 48, Math.PI * 1.28),
    crescentMat
  );
  crescentCradle.rotation.z = Math.PI * 0.86;
  moonGroup.add(crescentCradle);

  // 3. Orbiting Silver Starlight Ring
  const starRingGroup = new THREE.Group();
  starRingGroup.name = "lunarStars";
  const ringMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.28, 0.025, 10, 48),
    new THREE.MeshBasicMaterial({
      color: "#bae6fd",
      transparent: true,
      opacity: 0.65,
    })
  );
  starRingGroup.add(ringMesh);

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const starDot = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.08, 0),
      new THREE.MeshBasicMaterial({ color: "#ffffff" })
    );
    starDot.position.set(Math.cos(a) * 1.28, Math.sin(a) * 1.28, 0);
    starRingGroup.add(starDot);
  }
  moonGroup.add(starRingGroup);

  // 4. Volumetric Silvery-Blue Lunar Halo Sprite
  const moonGlowTex = createCelestialGlowTexture(
    "rgba(240, 249, 255, 0.92)",
    "rgba(125, 211, 252, 0.48)",
    "rgba(56, 189, 248, 0.12)"
  );
  const moonSpriteMat = new THREE.SpriteMaterial({
    map: moonGlowTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const moonGlowSprite = new THREE.Sprite(moonSpriteMat);
  moonGlowSprite.scale.set(5.8, 5.8, 1);
  moonGroup.add(moonGlowSprite);

  return moonGroup;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Stepped Zigzagging White Staircase Segment with Red Cap
   ══════════════════════════════════════════════════════════════════════════ */
function createStaircaseSegment(
  start: [number, number, number],
  end: [number, number, number],
  width = 0.55,
  wallHeight = 0.65
) {
  const group = new THREE.Group();
  const vStart = new THREE.Vector3(...start);
  const vEnd = new THREE.Vector3(...end);
  const diff = new THREE.Vector3().subVectors(vEnd, vStart);
  const length = diff.length();
  const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);

  const whiteMat = new THREE.MeshStandardMaterial({
    color: "#f5f3ef",
    roughness: 0.75,
  });
  const redCapMat = new THREE.MeshStandardMaterial({
    color: "#7f1d1d",
    roughness: 0.6,
  });

  // Main whitewashed stone ramp/wall body
  const bodyGeo = new THREE.BoxGeometry(length, wallHeight, width);
  const bodyMesh = new THREE.Mesh(bodyGeo, whiteMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Crimson parapet coping along top edges
  const capGeo = new THREE.BoxGeometry(length + 0.04, 0.11, width + 0.06);
  const capMesh = new THREE.Mesh(capGeo, redCapMat);
  capMesh.position.y = wallHeight / 2 + 0.05;
  group.add(capMesh);

  // Orient segment from start to end
  group.position.copy(mid);
  const horizLen = Math.hypot(diff.x, diff.z);
  const yaw = -Math.atan2(diff.z, diff.x);
  const pitch = Math.atan2(diff.y, horizLen);
  group.rotation.order = "YXZ";
  group.rotation.y = yaw;
  group.rotation.z = pitch;

  return group;
}

export function PotalaPalace3DViewer({ lang }: { lang: Language }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive State
  const [selectedHotspot, setSelectedHotspot] = useState<PotalaHotspot>(POTALA_HOTSPOTS[0]);
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>("sunlight");
  const [baseStyle, setBaseStyle] = useState<BaseStyle>("island");
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>("diorama");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showTripoStudio, setShowTripoStudio] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [screenHotspots, setScreenHotspots] = useState<ScreenHotspotPos[]>([]);
  const [screenCelestials, setScreenCelestials] = useState<{
    sun: { x: number; y: number; visible: boolean };
    moon: { x: number; y: number; visible: boolean };
  }>({
    sun: { x: 0, y: 0, visible: false },
    moon: { x: 0, y: 0, visible: false },
  });

  // Three.js Object Refs for live updates without rebuilding scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const potalaRootRef = useRef<THREE.Group | null>(null);
  const proceduralGroupRef = useRef<THREE.Group | null>(null);
  const customGlbGroupRef = useRef<THREE.Group | null>(null);
  const islandFoliageGroupRef = useRef<THREE.Group | null>(null);
  const mountainMeshRef = useRef<THREE.Mesh | null>(null);
  const sunBodyRef = useRef<THREE.Group | null>(null);
  const moonBodyRef = useRef<THREE.Group | null>(null);
  const cameraTargetGoalRef = useRef<{
    pos: THREE.Vector3;
    look: THREE.Vector3;
    active: boolean;
  }>({
    pos: new THREE.Vector3(0, 9.5, 19.5),
    look: new THREE.Vector3(0, 4.2, 0),
    active: false,
  });

  // Lights Refs
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const palaceSpotLightRef = useRef<THREE.SpotLight | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  /* ══════════════════════════════════════════════════════════════════════
     Web Audio API: Tibetan Singing Bowl & Dharma Bell Resonance
     ══════════════════════════════════════════════════════════════════════ */
  const playResonance = useCallback((freq: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2.756, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 3.3);
      osc2.stop(now + 3.3);
    } catch {
      // Ignore if audio blocked
    }
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     Initialize Three.js Scene & Build Procedural 3D Potala Palace Diorama
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 620;

    // 1. Scene (Default Lhasa Blue Sky)
    const scene = new THREE.Scene();
    scene.background = createLhasaDaySkyTexture();
    scene.fog = new THREE.FogExp2("#60a5fa", 0.0055);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);
    camera.position.set(0, 9.2, 21.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 4.2, 0.5);
    controls.minDistance = 7;
    controls.maxDistance = 36;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controlsRef.current = controls;

    // Cancel camera lerp if user manually drags
    const onControlStart = () => {
      cameraTargetGoalRef.current.active = false;
    };
    controls.addEventListener("start", onControlStart);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight("#fff7ed", 1.15);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight("#fffbeb", 2.4);
    sunLight.position.set(14, 22, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 55;
    const d = 14;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const rimLight = new THREE.DirectionalLight("#93c5fd", 0.75);
    rimLight.position.set(-14, 12, -12);
    scene.add(rimLight);

    const palaceSpotLight = new THREE.SpotLight("#fbbf24", 0, 32, Math.PI / 3, 0.5, 1.2);
    palaceSpotLight.position.set(0, 2.5, 12);
    palaceSpotLight.target.position.set(0, 6.5, 0);
    scene.add(palaceSpotLight);
    scene.add(palaceSpotLight.target);
    palaceSpotLightRef.current = palaceSpotLight;

    // 6. Root Group for the entire Potala Diorama
    const potalaRoot = new THREE.Group();
    scene.add(potalaRoot);
    potalaRootRef.current = potalaRoot;

    const proceduralGroup = new THREE.Group();
    potalaRoot.add(proceduralGroup);
    proceduralGroupRef.current = proceduralGroup;

    const customGlbGroup = new THREE.Group();
    potalaRoot.add(customGlbGroup);
    customGlbGroupRef.current = customGlbGroup;

    /* ──────────────────────────────────────────────────────────────────
       A. FLOATING DIORAMA PEDESTAL & MARPO RI (RED HILL) TERRAIN
       Matches `/potala/potala-diorama-model.png` & `/potala/potala-3d-render.jpg`
       ────────────────────────────────────────────────────────────────── */
    const pedestalGroup = new THREE.Group();
    proceduralGroup.add(pedestalGroup);

    // Upper stone platform slab
    const platformGeo = new THREE.BoxGeometry(19.6, 0.55, 13.6);
    const platformMat = new THREE.MeshStandardMaterial({
      color: "#d6d3d1",
      roughness: 0.7,
      metalness: 0.1,
    });
    const platformMesh = new THREE.Mesh(platformGeo, platformMat);
    platformMesh.position.set(0, 0.25, 0.6);
    platformMesh.receiveShadow = true;
    platformMesh.castShadow = true;
    pedestalGroup.add(platformMesh);

    // Inverted floating island bowl & spherical feet (matching potala-diorama-model.png)
    const underBowlGeo = new THREE.CylinderGeometry(8.5, 3.2, 2.4, 16);
    underBowlGeo.scale(1.12, 1, 0.75);
    const underBowlMat = new THREE.MeshStandardMaterial({
      color: "#a8a29e",
      roughness: 0.65,
      metalness: 0.15,
    });
    const underBowl = new THREE.Mesh(underBowlGeo, underBowlMat);
    underBowl.position.set(0, -1.2, 0.6);
    pedestalGroup.add(underBowl);

    // Spherical pedestal nodes underneath
    const footPositions: [number, number, number, number][] = [
      [0, -2.5, 0.6, 0.95],
      [-4.2, -1.9, 2.6, 0.75],
      [4.2, -1.9, 2.6, 0.75],
      [-6.8, -1.2, 3.4, 0.55],
      [6.8, -1.2, 3.4, 0.55],
      [-4.2, -1.9, -1.4, 0.7],
      [4.2, -1.9, -1.4, 0.7],
    ];
    footPositions.forEach(([fx, fy, fz, r]) => {
      const sphereGeo = new THREE.SphereGeometry(r, 16, 16);
      const sphere = new THREE.Mesh(sphereGeo, underBowlMat);
      sphere.position.set(fx, fy, fz);
      pedestalGroup.add(sphere);
    });

    // Marpo Ri (Red Mountain) Sculpted Faceted Hill
    const hillGeo = new THREE.CylinderGeometry(5.2, 8.8, 4.2, 24, 5);
    hillGeo.scale(1.1, 1, 0.68);
    const hillPos = hillGeo.attributes.position;
    for (let i = 0; i < hillPos.count; i++) {
      const vx = hillPos.getX(i);
      const vy = hillPos.getY(i);
      const vz = hillPos.getZ(i);
      // Organic craggy rock facets
      const ridgeNoise =
        Math.sin(vx * 1.1) * 0.35 +
        Math.cos(vz * 1.4) * 0.28 +
        Math.sin((vx + vz) * 2.1) * 0.15;
      hillPos.setX(i, vx + ridgeNoise * 0.45);
      // Higher in the center-left, sloping down on the far right (matching Potala profile)
      const slopeShift = vx > 2 ? -(vx - 2) * 0.18 : 0;
      hillPos.setY(i, vy + slopeShift + Math.abs(ridgeNoise) * 0.25);
    }
    hillGeo.computeVertexNormals();

    const hillMat = new THREE.MeshStandardMaterial({
      color: "#4d6b3c",
      roughness: 0.88,
      metalness: 0.04,
      flatShading: true,
    });
    const hillMesh = new THREE.Mesh(hillGeo, hillMat);
    hillMesh.position.set(-0.3, 2.3, -0.2);
    hillMesh.receiveShadow = true;
    hillMesh.castShadow = true;
    proceduralGroup.add(hillMesh);
    mountainMeshRef.current = hillMesh;

    // Rocky Western Crag Outcrop (seen on left of potala-elevation.jpg)
    const cragGeo = new THREE.DodecahedronGeometry(2.5, 1);
    cragGeo.scale(1.1, 1.35, 0.9);
    const cragMat = new THREE.MeshStandardMaterial({
      color: "#6b7280",
      roughness: 0.85,
      flatShading: true,
    });
    const westCrag = new THREE.Mesh(cragGeo, cragMat);
    westCrag.position.set(-7.2, 2.2, 0.8);
    westCrag.castShadow = true;
    westCrag.receiveShadow = true;
    proceduralGroup.add(westCrag);

    /* ──────────────────────────────────────────────────────────────────
       B. THE RED PALACE (ཕོ་བྲང་དམར་པོ། · Potrang Marpo - Center Summit)
       ────────────────────────────────────────────────────────────────── */
    // 1. Main Central Crimson Mass
    const redPalaceMain = createBatteredPalaceBlock({
      w: 4.3,
      h: 3.3,
      d: 2.7,
      taper: 0.89,
      wallColor: "#8b1d24",
      friezeColor: "#3f0d12",
      cols: 7,
      rows: 4,
      roofTrimColor: "#fbbf24",
    });
    redPalaceMain.position.set(-0.2, 6.2, -0.2);
    proceduralGroup.add(redPalaceMain);

    // 2. Four Prominent Golden/Timber Vertical Bay Window Columns on Red Palace Front
    const goldBayMat = new THREE.MeshStandardMaterial({
      color: "#d97706",
      emissive: "#92400e",
      emissiveIntensity: 0.15,
      roughness: 0.4,
      metalness: 0.55,
    });
    [-1.15, -0.38, 0.38, 1.15].forEach((bx) => {
      const bayGeo = new THREE.BoxGeometry(0.36, 2.75, 0.25);
      const bay = new THREE.Mesh(bayGeo, goldBayMat);
      bay.position.set(-0.2 + bx, 6.25, 1.08);
      bay.castShadow = true;
      proceduralGroup.add(bay);
    });

    // 3. Upper Red Palace Sanctuary Tier
    const redPalaceUpper = createBatteredPalaceBlock({
      w: 3.5,
      h: 1.35,
      d: 2.1,
      taper: 0.92,
      wallColor: "#7f1d1d",
      friezeColor: "#3b0a0e",
      cols: 6,
      rows: 2,
      roofTrimColor: "#fbbf24",
    });
    redPalaceUpper.position.set(-0.2, 8.2, -0.25);
    proceduralGroup.add(redPalaceUpper);

    // 4. Yellow-Ochre Flanking Sacred Chapels (West & East of Red Palace)
    const westOchreWing = createBatteredPalaceBlock({
      w: 1.35,
      h: 2.2,
      d: 2.1,
      taper: 0.9,
      wallColor: "#d97706",
      friezeColor: "#6b181e",
      cols: 3,
      rows: 3,
    });
    westOchreWing.position.set(-2.65, 6.0, -0.1);
    proceduralGroup.add(westOchreWing);

    const eastOchreWing = createBatteredPalaceBlock({
      w: 1.5,
      h: 1.85,
      d: 2.0,
      taper: 0.9,
      wallColor: "#eab308",
      friezeColor: "#6b181e",
      cols: 3,
      rows: 2,
    });
    eastOchreWing.position.set(2.3, 6.2, -0.05);
    proceduralGroup.add(eastOchreWing);

    /* ──────────────────────────────────────────────────────────────────
       C. THE GILDED GOLDEN ROOFS (གསེར་ཐོག · Serdong & Gyaphib)
       ────────────────────────────────────────────────────────────────── */
    const centerGoldRoof = createGildedTibetanRoof(1.75, 1.15, 0.85);
    centerGoldRoof.position.set(-0.2, 9.0, -0.25);
    proceduralGroup.add(centerGoldRoof);

    const westGoldRoof = createGildedTibetanRoof(1.25, 0.95, 0.68);
    westGoldRoof.position.set(-1.55, 8.92, -0.25);
    proceduralGroup.add(westGoldRoof);

    const eastGoldRoof = createGildedTibetanRoof(1.25, 0.95, 0.68);
    eastGoldRoof.position.set(1.15, 8.92, -0.25);
    proceduralGroup.add(eastGoldRoof);

    const farEastGoldRoof = createGildedTibetanRoof(1.3, 0.9, 0.65);
    farEastGoldRoof.position.set(3.45, 7.75, -0.2);
    proceduralGroup.add(farEastGoldRoof);

    /* ──────────────────────────────────────────────────────────────────
       D. THE WHITE PALACE (ཕོ་བྲང་དཀར་པོ། · Potrang Karpo)
       ────────────────────────────────────────────────────────────────── */
    // 1. Great Central Alabaster Bastion (Directly below Red Palace, windows in top 2 rows)
    const centralWhiteBastion = createBatteredPalaceBlock({
      w: 4.9,
      h: 3.1,
      d: 2.9,
      taper: 0.85,
      wallColor: "#faf8f5",
      friezeColor: "#6b181e",
      cols: 9,
      rows: 5,
      windowStartRow: 0,
    });
    centralWhiteBastion.position.set(-0.2, 3.6, 0.55);
    proceduralGroup.add(centralWhiteBastion);

    // Solid sloping white apron wall in front of the central bastion
    const frontApron = createBatteredPalaceBlock({
      w: 4.75,
      h: 2.1,
      d: 1.6,
      taper: 0.84,
      wallColor: "#f5f2eb",
      friezeColor: "#7f1d1d",
      cols: 8,
      rows: 2,
    });
    frontApron.position.set(-0.2, 2.9, 1.35);
    proceduralGroup.add(frontApron);

    // 2. Western White Palace Wings & Iconic Cylindrical Drum Tower
    const westUpperWhite = createBatteredPalaceBlock({
      w: 3.6,
      h: 2.6,
      d: 2.5,
      taper: 0.87,
      wallColor: "#f8f6f0",
      friezeColor: "#6b181e",
      cols: 6,
      rows: 3,
    });
    westUpperWhite.position.set(-4.35, 5.1, 0.15);
    proceduralGroup.add(westUpperWhite);

    const westLowerWhite = createBatteredPalaceBlock({
      w: 4.1,
      h: 2.4,
      d: 2.6,
      taper: 0.85,
      wallColor: "#f3f0e8",
      friezeColor: "#6b181e",
      cols: 7,
      rows: 3,
    });
    westLowerWhite.position.set(-5.05, 3.6, 0.95);
    proceduralGroup.add(westLowerWhite);

    // Western Cylindrical Drum Bastion (upper left corner of Potala)
    const drumGroup = new THREE.Group();
    const drumGeo = new THREE.CylinderGeometry(0.88, 0.98, 1.65, 24);
    const drumMat = new THREE.MeshStandardMaterial({
      color: "#f8f6f0",
      roughness: 0.7,
    });
    const drumMesh = new THREE.Mesh(drumGeo, drumMat);
    drumMesh.castShadow = true;
    drumGroup.add(drumMesh);

    const drumCrimsonCapGeo = new THREE.CylinderGeometry(0.92, 0.9, 0.32, 24);
    const drumCrimsonMat = new THREE.MeshStandardMaterial({
      color: "#6b181e",
      roughness: 0.6,
    });
    const drumCap = new THREE.Mesh(drumCrimsonCapGeo, drumCrimsonMat);
    drumCap.position.y = 0.85;
    drumGroup.add(drumCap);

    drumGroup.position.set(-5.25, 6.75, -0.35);
    proceduralGroup.add(drumGroup);

    // 3. Eastern White Palace Wings, Deyangshar Plaza & Stepped Bastions
    const eastInnerWhite = createBatteredPalaceBlock({
      w: 2.3,
      h: 2.9,
      d: 2.4,
      taper: 0.88,
      wallColor: "#faf8f5",
      friezeColor: "#6b181e",
      cols: 4,
      rows: 4,
    });
    eastInnerWhite.position.set(3.35, 6.1, -0.2);
    proceduralGroup.add(eastInnerWhite);

    const eastMidWhite = createBatteredPalaceBlock({
      w: 3.8,
      h: 2.5,
      d: 2.6,
      taper: 0.86,
      wallColor: "#f7f4ed",
      friezeColor: "#6b181e",
      cols: 8,
      rows: 3,
    });
    eastMidWhite.position.set(3.85, 4.3, 0.55);
    proceduralGroup.add(eastMidWhite);

    // Eastern Protruding Watchtower Bastion (Mid-Right Slope)
    const eastBastionTower = createBatteredPalaceBlock({
      w: 1.75,
      h: 2.6,
      d: 1.85,
      taper: 0.84,
      wallColor: "#faf8f5",
      friezeColor: "#7f1d1d",
      cols: 3,
      rows: 3,
    });
    eastBastionTower.position.set(5.45, 3.25, 2.05);
    proceduralGroup.add(eastBastionTower);

    // Far-East Lower Gatehouse Tower (Far Right of reference images)
    const farEastTower = createBatteredPalaceBlock({
      w: 1.65,
      h: 2.0,
      d: 1.6,
      taper: 0.86,
      wallColor: "#f8f6f0",
      friezeColor: "#7f1d1d",
      cols: 3,
      rows: 3,
    });
    farEastTower.position.set(7.85, 2.25, 2.45);
    proceduralGroup.add(farEastTower);

    /* ──────────────────────────────────────────────────────────────────
       E. GRAND ZIGZAGGING STAIRCASES (གཟིམ་ཆུང་ལམ།)
       Matches the dramatic white switchbacks in all 4 reference images
       ────────────────────────────────────────────────────────────────── */
    const stairsGroup = new THREE.Group();
    proceduralGroup.add(stairsGroup);

    // 1. Lower-center to Right Switchback
    stairsGroup.add(
      createStaircaseSegment([0.8, 0.85, 4.9], [4.6, 2.15, 3.3], 0.5, 0.65)
    );
    // 2. Right Bastion to Central White Palace Entrance Switchback
    stairsGroup.add(
      createStaircaseSegment([4.6, 2.15, 3.1], [1.2, 3.45, 2.15], 0.52, 0.72)
    );
    // 3. Central Upper Stairway into White Palace
    stairsGroup.add(
      createStaircaseSegment([-2.4, 3.2, 2.1], [0.2, 4.2, 1.65], 0.45, 0.6)
    );
    // 4. Western Ridge Staircase (Left side of Marpo Ri)
    stairsGroup.add(
      createStaircaseSegment([-7.5, 0.95, 3.9], [-4.8, 2.75, 2.25], 0.48, 0.62)
    );
    // 5. Far-Eastern Descent Wall
    stairsGroup.add(
      createStaircaseSegment([5.6, 2.2, 2.5], [7.9, 1.35, 3.5], 0.44, 0.55)
    );

    /* ──────────────────────────────────────────────────────────────────
       F. SHOL WALLED VILLAGE & PERIMETER GATES (ཞོལ་གྲོང་། · Base of Palace)
       ────────────────────────────────────────────────────────────────── */
    const sholGroup = new THREE.Group();
    proceduralGroup.add(sholGroup);

    // Front Southern Perimeter Wall with Crimson Coping
    const frontWall = createStaircaseSegment(
      [-8.4, 0.85, 5.8],
      [8.4, 0.85, 5.8],
      0.42,
      0.75
    );
    sholGroup.add(frontWall);

    // Western Shol Two-Story Courtyard Building (Lower Left)
    const sholWestBuilding = createBatteredPalaceBlock({
      w: 2.7,
      h: 1.55,
      d: 1.6,
      taper: 0.92,
      wallColor: "#faf8f5",
      friezeColor: "#7f1d1d",
      cols: 5,
      rows: 2,
    });
    sholWestBuilding.position.set(-5.2, 1.25, 4.9);
    sholGroup.add(sholWestBuilding);

    // Central Yellow-Ochre Shol Printing House & Treasury Buildings
    const sholYellowMain = createBatteredPalaceBlock({
      w: 2.1,
      h: 1.25,
      d: 1.35,
      taper: 0.93,
      wallColor: "#eab308",
      friezeColor: "#7f1d1d",
      cols: 4,
      rows: 2,
    });
    sholYellowMain.position.set(-0.6, 1.25, 3.95);
    sholGroup.add(sholYellowMain);

    const sholYellowLower = createBatteredPalaceBlock({
      w: 2.4,
      h: 1.0,
      d: 1.2,
      taper: 0.94,
      wallColor: "#f59e0b",
      friezeColor: "#7f1d1d",
      cols: 5,
      rows: 1,
    });
    sholYellowLower.position.set(-1.9, 0.95, 4.85);
    sholGroup.add(sholYellowLower);

    // Eastern Shol Gatehouse Compound (Lower Right)
    const sholEastBuilding = createBatteredPalaceBlock({
      w: 3.1,
      h: 1.4,
      d: 1.5,
      taper: 0.92,
      wallColor: "#faf8f5",
      friezeColor: "#7f1d1d",
      cols: 6,
      rows: 2,
    });
    sholEastBuilding.position.set(4.5, 1.18, 5.1);
    sholGroup.add(sholEastBuilding);

    // Shol Doring (Ancient 763 CE Inscribed Stone Pillar)
    const doringGroup = new THREE.Group();
    const doringBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.25, 0.55),
      new THREE.MeshStandardMaterial({ color: "#d6d3d1", roughness: 0.7 })
    );
    const doringPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 1.15, 0.22),
      new THREE.MeshStandardMaterial({ color: "#78716c", roughness: 0.6 })
    );
    doringPillar.position.y = 0.65;
    const doringRoof = createGildedTibetanRoof(0.42, 0.42, 0.25);
    doringRoof.position.y = 1.28;
    doringGroup.add(doringBase, doringPillar, doringRoof);
    doringGroup.position.set(-3.1, 0.65, 5.15);
    sholGroup.add(doringGroup);

    /* ──────────────────────────────────────────────────────────────────
       G. LUSH HIMALAYAN PINE & CYPRESS GROVES ON MARPO RI SLOPES
       ────────────────────────────────────────────────────────────────── */
    const foliageGroup = new THREE.Group();
    proceduralGroup.add(foliageGroup);
    islandFoliageGroupRef.current = foliageGroup;

    const treeColors = ["#2d5a27", "#3a6b33", "#4d7c3f", "#1e4620"];
    const treeMaterials = treeColors.map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.82,
          metalness: 0.02,
        })
    );
    const trunkMat = new THREE.MeshStandardMaterial({
      color: "#5c4033",
      roughness: 0.9,
    });

    // Scatter 75 stylized diorama trees across the hillside and courtyards
    for (let i = 0; i < 75; i++) {
      const tx = (Math.random() - 0.5) * 14.5;
      const tz = 1.6 + Math.random() * 3.9;
      // Compute height along hillside slope
      const distCenter = Math.hypot(tx * 0.65, tz - 1.2);
      const ty = Math.max(0.65, 2.75 - distCenter * 0.34);

      const tree = new THREE.Group();
      const scale = 0.65 + Math.random() * 0.55;

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05 * scale, 0.08 * scale, 0.35 * scale, 6),
        trunkMat
      );
      trunk.position.y = 0.15 * scale;
      tree.add(trunk);

      const mat = treeMaterials[i % treeMaterials.length];
      // Conical pine or rounded diorama cypress (matching potala-diorama-model.png)
      if (i % 3 === 0) {
        const crown = new THREE.Mesh(
          new THREE.SphereGeometry(0.28 * scale, 10, 10),
          mat
        );
        crown.scale.set(1, 1.25, 1);
        crown.position.y = 0.42 * scale;
        crown.castShadow = true;
        tree.add(crown);
      } else {
        const cone1 = new THREE.Mesh(
          new THREE.ConeGeometry(0.28 * scale, 0.55 * scale, 8),
          mat
        );
        cone1.position.y = 0.4 * scale;
        cone1.castShadow = true;
        const cone2 = new THREE.Mesh(
          new THREE.ConeGeometry(0.21 * scale, 0.45 * scale, 8),
          mat
        );
        cone2.position.y = 0.65 * scale;
        cone2.castShadow = true;
        tree.add(cone1, cone2);
      }

      tree.position.set(tx, ty, tz);
      foliageGroup.add(tree);
    }

    /* ──────────────────────────────────────────────────────────────────
       H. FLOATING GOLDEN HIMALAYAN ATMOSPHERE PARTICLES
       ────────────────────────────────────────────────────────────────── */
    const particleCount = 160;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 28;
      pPositions[i * 3 + 1] = Math.random() * 14 + 0.5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: "#fbbf24",
      size: 0.11,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ──────────────────────────────────────────────────────────────────
       I. SACRED SUN (ཉི་མ།) & MOON (ཟླ་བ།) IN THE HIMALAYAN SKY (NYI-DA)
       ────────────────────────────────────────────────────────────────── */
    const sunBody = createSunCelestialBody();
    sunBody.position.set(6.8, 10.4, -2.2);
    sunBody.visible = true;
    proceduralGroup.add(sunBody);
    sunBodyRef.current = sunBody;

    const moonBody = createMoonCelestialBody();
    moonBody.position.set(-6.8, 10.4, -2.2);
    moonBody.visible = false;
    proceduralGroup.add(moonBody);
    moonBodyRef.current = moonBody;

    /* ──────────────────────────────────────────────────────────────────
       Animation & 3D Hotspot Projection Loop
       ────────────────────────────────────────────────────────────────── */
    let animFrameId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      // Smooth Camera Flight when a Hotspot or Preset is selected
      if (cameraTargetGoalRef.current.active) {
        camera.position.lerp(cameraTargetGoalRef.current.pos, 0.06);
        controls.target.lerp(cameraTargetGoalRef.current.look, 0.08);
        if (camera.position.distanceTo(cameraTargetGoalRef.current.pos) < 0.15) {
          cameraTargetGoalRef.current.active = false;
        }
      }

      controls.update();

      // Gentle upward drift of golden stardust & rotation of Sun/Moon rings
      particles.rotation.y += 0.0006;
      const solarRays = sunBody.getObjectByName("solarRays");
      if (solarRays) solarRays.rotation.z += 0.004;
      const lunarStars = moonBody.getObjectByName("lunarStars");
      if (lunarStars) lunarStars.rotation.z -= 0.003;

      renderer.render(scene, camera);

      // Project 3D Hotspot positions to 2D Screen Coordinates
      const currentW = container.clientWidth || width;
      const currentH = container.clientHeight || height;

      const projected: ScreenHotspotPos[] = POTALA_HOTSPOTS.map((hs) => {
        tempVec.set(...hs.position3D);
        tempVec.project(camera);
        const x = (tempVec.x * 0.5 + 0.5) * currentW;
        const y = (-(tempVec.y * 0.5) + 0.5) * currentH;
        const visible = tempVec.z < 1 && x >= 16 && x <= currentW - 16 && y >= 16 && y <= currentH - 16;
        return { id: hs.id, x, y, visible };
      });
      setScreenHotspots(projected);

      // Project 3D Sun & Moon positions for interactive sky badges
      tempVec.copy(sunBody.position).add(new THREE.Vector3(0, -1.5, 0));
      tempVec.project(camera);
      const sunX = (tempVec.x * 0.5 + 0.5) * currentW;
      const sunY = (-(tempVec.y * 0.5) + 0.5) * currentH;
      const sunVis =
        sunBody.visible &&
        tempVec.z < 1 &&
        sunX >= 20 &&
        sunX <= currentW - 20 &&
        sunY >= 20 &&
        sunY <= currentH - 20;

      tempVec.copy(moonBody.position).add(new THREE.Vector3(0, -1.5, 0));
      tempVec.project(camera);
      const moonX = (tempVec.x * 0.5 + 0.5) * currentW;
      const moonY = (-(tempVec.y * 0.5) + 0.5) * currentH;
      const moonVis =
        moonBody.visible &&
        tempVec.z < 1 &&
        moonX >= 20 &&
        moonX <= currentW - 20 &&
        moonY >= 20 &&
        moonY <= currentH - 20;

      setScreenCelestials({
        sun: { x: sunX, y: sunY, visible: sunVis },
        moon: { x: moonX, y: moonY, visible: moonVis },
      });
    };

    animate();

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", onControlStart);
      renderer.dispose();
    };
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     Update Atmosphere Lighting (Sunlight / Night Illumination)
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const scene = sceneRef.current;
    const ambient = ambientLightRef.current;
    const sun = sunLightRef.current;
    const spot = palaceSpotLightRef.current;
    const root = potalaRootRef.current;
    if (!scene || !ambient || !sun || !spot || !root) return;

    let wallEmissive = 0.05;

    if (atmosphere === "sunlight") {
      scene.background = createLhasaDaySkyTexture();
      scene.fog = new THREE.FogExp2("#60a5fa", 0.0055);
      ambient.color.set("#fffbeb");
      ambient.intensity = 1.35;
      sun.color.set("#ffffff");
      sun.intensity = 2.6;
      sun.position.set(14, 22, 16);
      spot.intensity = 0;
      wallEmissive = 0.02;
      if (sunBodyRef.current) {
        sunBodyRef.current.visible = true;
        sunBodyRef.current.scale.setScalar(1.15);
      }
      if (moonBodyRef.current) {
        moonBodyRef.current.visible = false;
      }
    } else {
      // Sacred Night Mode: deep midnight sky, illuminated windows & 3D Moon
      scene.background = new THREE.Color("#050814");
      scene.fog = new THREE.FogExp2("#050814", 0.014);
      ambient.color.set("#93c5fd");
      ambient.intensity = 0.35;
      sun.color.set("#60a5fa");
      sun.intensity = 0.45;
      sun.position.set(-10, 18, -10);
      spot.intensity = 3.6;
      wallEmissive = 1.35;
      if (sunBodyRef.current) {
        sunBodyRef.current.visible = false;
      }
      if (moonBodyRef.current) {
        moonBodyRef.current.visible = true;
        moonBodyRef.current.scale.setScalar(1.25);
      }
    }

    // Update emissive window glow on all palace walls
    root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const stdMat = m as THREE.MeshStandardMaterial;
          if (stdMat?.userData?.isPalaceWall) {
            stdMat.emissiveIntensity = wallEmissive;
          }
        });
      }
    });
  }, [atmosphere]);

  /* ══════════════════════════════════════════════════════════════════════
     Update Diorama Base Style (Floating Island vs White Maquette)
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const hill = mountainMeshRef.current;
    const foliage = islandFoliageGroupRef.current;
    if (!hill || !foliage) return;

    const hillMat = hill.material as THREE.MeshStandardMaterial;
    if (baseStyle === "maquette") {
      // Crisp white architectural maquette matching /potala/potala-3d-render.jpg
      hillMat.color.set("#f5f5f4");
      foliage.visible = false;
    } else {
      // Lush emerald Marpo Ri hill matching /potala/potala-diorama-model.png
      hillMat.color.set("#4d6b3c");
      foliage.visible = true;
    }
  }, [baseStyle]);

  /* ══════════════════════════════════════════════════════════════════════
     Toggle Orbit Auto-Rotation
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  /* ══════════════════════════════════════════════════════════════════════
     Camera Preset Transitions
     ══════════════════════════════════════════════════════════════════════ */
  const applyCameraView = useCallback((preset: CameraViewPreset) => {
    setCameraPreset(preset);
    if (preset === "diorama") {
      cameraTargetGoalRef.current = {
        pos: new THREE.Vector3(0, 9.2, 21.5),
        look: new THREE.Vector3(0, 4.2, 0.5),
        active: true,
      };
    } else if (preset === "hero") {
      // Low Hero Angle matching peggy_marco-potala-1027014.jpg
      cameraTargetGoalRef.current = {
        pos: new THREE.Vector3(-6.2, 3.1, 15.8),
        look: new THREE.Vector3(0, 5.4, 0),
        active: true,
      };
    } else if (preset === "elevation") {
      // Front Orthographic-style Elevation matching potala-elevation.jpg
      cameraTargetGoalRef.current = {
        pos: new THREE.Vector3(0, 5.2, 23.5),
        look: new THREE.Vector3(0, 4.4, 0),
        active: true,
      };
    } else if (preset === "summit") {
      // Close-up of the Red Palace & Golden Roofs
      cameraTargetGoalRef.current = {
        pos: new THREE.Vector3(2.2, 10.8, 10.2),
        look: new THREE.Vector3(-0.2, 7.2, -0.1),
        active: true,
      };
    }
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     Focus on a Specific Architectural Hotspot
     ══════════════════════════════════════════════════════════════════════ */
  const focusHotspot = useCallback(
    (hotspot: PotalaHotspot) => {
      setSelectedHotspot(hotspot);
      playResonance(hotspot.freq);
      cameraTargetGoalRef.current = {
        pos: new THREE.Vector3(...hotspot.cameraPos3D),
        look: new THREE.Vector3(...hotspot.cameraTarget3D),
        active: true,
      };
    },
    [playResonance]
  );

  /* ══════════════════════════════════════════════════════════════════════
     Tripo3D Custom .GLB File Loader (Load any .glb exported from Tripo3D)
     ══════════════════════════════════════════════════════════════════════ */
  const handleLoadGlbFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const customGroup = customGlbGroupRef.current;
        const procGroup = proceduralGroupRef.current;
        if (!customGroup || !procGroup) return;

        // Clear previous custom model
        while (customGroup.children.length > 0) {
          customGroup.remove(customGroup.children[0]);
        }

        const model = gltf.scene;
        // Auto-normalize scale and center on the diorama stage
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const targetScale = 14 / maxDim;

        model.scale.setScalar(targetScale);
        model.position.set(
          -center.x * targetScale,
          -box.min.y * targetScale + 0.6,
          -center.z * targetScale
        );

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        customGroup.add(model);
        procGroup.visible = false;
        setCustomModelName(file.name);
        URL.revokeObjectURL(url);
      },
      undefined,
      () => {
        URL.revokeObjectURL(url);
      }
    );
  }, []);

  const restoreProceduralPotala = useCallback(() => {
    if (customGlbGroupRef.current) {
      while (customGlbGroupRef.current.children.length > 0) {
        customGlbGroupRef.current.remove(customGlbGroupRef.current.children[0]);
      }
    }
    if (proceduralGroupRef.current) {
      proceduralGroupRef.current.visible = true;
    }
    setCustomModelName(null);
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     Export Procedural 3D Potala Palace as a Downloadable .GLB File
     ══════════════════════════════════════════════════════════════════════ */
  const handleExportGlb = useCallback(() => {
    const targetObj = customModelName
      ? customGlbGroupRef.current
      : proceduralGroupRef.current;
    if (!targetObj) return;

    setIsExporting(true);
    const exporter = new GLTFExporter();
    exporter.parse(
      targetObj,
      (result) => {
        setIsExporting(false);
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: "model/gltf-binary" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "potala-palace-3d-diorama.glb";
          link.click();
          URL.revokeObjectURL(link.href);
        }
      },
      () => {
        setIsExporting(false);
      },
      { binary: true }
    );
  }, [customModelName]);

  return (
    <div className="w-full space-y-5 select-none">
      {/* ══════════════════════════════════════════════════════════════════
          Top Architectural Control Bar
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-sm bg-black/75 border border-sakya-gold/35 backdrop-blur-xl text-xs">
        {/* Left: Title & Elevation Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-xs bg-sakya-crimson text-white font-mono text-[11px] font-bold tracking-wider uppercase">
            {lang === "bo" ? "ཕོ་བྲང་པོ་ཏ་ལ་ ༣D" : "3D POTALA PALACE DIORAMA"}
          </span>
          <span className="text-white/60 font-mono text-[11px] hidden sm:inline">
            LHASA · MARPO RI HILL (3,700M) · WEBGL PBR ENGINE
          </span>
        </div>

        {/* Right: Camera Angles, Base Style, Atmosphere & Tripo3D Bridge */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Camera Angle Presets */}
          <div className="flex items-center rounded-sm bg-white/5 border border-white/15 p-0.5 font-mono text-[11px]">
            {(
              [
                { id: "diorama", labelBo: "གླིང་ཕྲན", labelEn: "Diorama" },
                { id: "hero", labelBo: "གྱེན་མཐོང", labelEn: "Low Hero" },
                { id: "elevation", labelBo: "མདུན་ངོས", labelEn: "Facade" },
                { id: "summit", labelBo: "གསེར་ཐོག", labelEn: "Summit" },
              ] as const
            ).map((cam) => (
              <button
                key={cam.id}
                type="button"
                onClick={() => applyCameraView(cam.id)}
                className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer ${
                  cameraPreset === cam.id
                    ? "bg-tibet-gold text-black font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {lang === "bo" ? cam.labelBo : cam.labelEn}
              </button>
            ))}
          </div>

          {/* Base Style Switch: Island vs White Maquette */}
          <button
            type="button"
            onClick={() => setBaseStyle((s) => (s === "island" ? "maquette" : "island"))}
            className="px-2.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-[11px] transition-colors cursor-pointer"
            title="Switch between Floating Pine Island and Architectural White Maquette"
          >
            {baseStyle === "island"
              ? lang === "bo"
                ? "🏝️ གླིང་ཕྲན་ཚོན་ཅན"
                : "🏝️ Pine Island"
              : lang === "bo"
              ? "❄️ དཔེ་གཟུགས་དཀར་པོ"
              : "❄️ White Maquette"}
          </button>

          {/* Atmosphere Lighting Switch: Sun vs Night */}
          <div className="flex items-center rounded-sm bg-white/5 border border-white/15 p-0.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => {
                setAtmosphere("sunlight");
                playResonance(528);
              }}
              className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1 ${
                atmosphere === "sunlight"
                  ? "bg-amber-400 text-black font-bold shadow-xs"
                  : "text-amber-200/75 hover:text-amber-200"
              }`}
            >
              <span>☀️</span>
              <span>{lang === "bo" ? "ཉི་མ།" : "Sun"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAtmosphere("night");
                playResonance(432);
              }}
              className={`px-2.5 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1 ${
                atmosphere === "night"
                  ? "bg-sky-300 text-black font-bold shadow-xs"
                  : "text-sky-200/75 hover:text-sky-200"
              }`}
            >
              <span>🌙</span>
              <span>{lang === "bo" ? "མཚན་མོ།" : "Night"}</span>
            </button>
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate((r) => !r)}
            className={`px-2.5 py-1.5 rounded-sm border font-mono text-[11px] transition-colors cursor-pointer ${
              autoRotate
                ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200"
                : "bg-white/5 border-white/15 text-white/60"
            }`}
          >
            {autoRotate ? "↻ 360° On" : "↻ 360° Paused"}
          </button>

          {/* Show / Hide All Labels Toggle (Clean 3D View) */}
          <button
            type="button"
            onClick={() => setShowHotspots((h) => !h)}
            className={`px-2.5 py-1.5 rounded-sm border font-mono text-[11px] font-bold transition-colors cursor-pointer ${
              showHotspots
                ? "bg-tibet-gold/20 border-tibet-gold/60 text-tibet-gold hover:bg-tibet-gold/30"
                : "bg-white/10 border-white/25 text-white hover:bg-white/20"
            }`}
          >
            {showHotspots
              ? lang === "bo"
                ? "🙈 ཁ་བྱང་སྦེད་པ (3D གཙང་མ)"
                : "🙈 Hide Labels (Clean 3D)"
              : lang === "bo"
              ? "🏷️ ཁ་བྱང་སྟོན་པ"
              : "🏷️ Show Labels"}
          </button>

          {/* Tripo3D Studio & GLB Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowTripoStudio((prev) => !prev)}
            className={`px-3 py-1.5 rounded-sm border font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showTripoStudio
                ? "bg-tibet-gold text-black border-tibet-gold shadow-md"
                : "bg-sakya-crimson/80 hover:bg-sakya-crimson text-white border-sakya-gold/50"
            }`}
          >
            <span>✨</span>
            <span>{lang === "bo" ? "Tripo3D · GLB" : "Tripo3D Studio & .GLB"}</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          Main 3D Viewport + Architectural Inspector Split Layout
          ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT 8 COLS: Interactive WebGL 3D Potala Canvas */}
        <div
          className="lg:col-span-8 relative w-full min-h-[500px] sm:min-h-[600px] rounded-sm border border-sakya-gold/40 bg-[#0c0a09] overflow-hidden shadow-2xl"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
              handleLoadGlbFile(file);
            }
          }}
        >
          {/* Three.js WebGL Mount Container */}
          <div ref={mountRef} className="w-full h-full min-h-[500px] sm:min-h-[600px] cursor-grab active:cursor-grabbing" />

          {/* Top-Right Quick Button inside Canvas: Toggle Clean 3D View (Hide/Show all text & labels) */}
          <button
            type="button"
            onClick={() => setShowHotspots((h) => !h)}
            className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-full bg-black/75 hover:bg-tibet-gold text-white hover:text-black border border-tibet-gold/60 backdrop-blur-md font-mono text-[11px] font-bold transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <span>{showHotspots ? "🙈" : "🏷️"}</span>
            <span>
              {showHotspots
                ? lang === "bo"
                  ? "3D གཙང་མ"
                  : "Clean 3D"
                : lang === "bo"
                ? "ཁ་བྱང་སྟོན"
                : "Show Labels"}
            </span>
          </button>

          {/* 3D Projected Sun (ཉི་མ།) & Moon (ཟླ་བ།) Sky Badges */}
          {showHotspots && !customModelName && screenCelestials.sun.visible && (
            <button
              type="button"
              onClick={() => {
                setAtmosphere("sunlight");
                playResonance(528);
              }}
              style={{
                left: `${screenCelestials.sun.x}px`,
                top: `${screenCelestials.sun.y}px`,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute z-10 px-2.5 py-0.5 rounded-full font-mono text-[10px] transition-all cursor-pointer flex items-center gap-1 border ${
                atmosphere === "sunlight"
                  ? "bg-amber-400 text-black font-bold border-white shadow-[0_0_15px_rgba(251,191,36,0.9)]"
                  : "bg-black/70 hover:bg-amber-400/90 text-amber-200 hover:text-black border-amber-400/50"
              }`}
              title="Click to activate Lhasa Sunlight"
            >
              <span>☀️</span>
              <span lang="bo" className="font-serif">
                {lang === "bo" ? "ཉི་མ།" : "Sun"}
              </span>
            </button>
          )}

          {showHotspots && !customModelName && screenCelestials.moon.visible && (
            <button
              type="button"
              onClick={() => {
                setAtmosphere("night");
                playResonance(432);
              }}
              style={{
                left: `${screenCelestials.moon.x}px`,
                top: `${screenCelestials.moon.y}px`,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute z-10 px-2.5 py-0.5 rounded-full font-mono text-[10px] transition-all cursor-pointer flex items-center gap-1 border ${
                atmosphere === "night"
                  ? "bg-sky-300 text-black font-bold border-white shadow-[0_0_15px_rgba(125,211,252,0.9)]"
                  : "bg-black/70 hover:bg-sky-300/90 text-sky-200 hover:text-black border-sky-300/50"
              }`}
              title="Click to activate Sacred Night Moon"
            >
              <span>🌙</span>
              <span lang="bo" className="font-serif">
                {lang === "bo" ? "ཟླ་བ།" : "Moon"}
              </span>
            </button>
          )}

          {/* 3D Projected Interactive Hotspot Pins */}
          {showHotspots &&
            !customModelName &&
            screenHotspots.map((pos) => {
              if (!pos.visible) return null;
              const hs = POTALA_HOTSPOTS.find((h) => h.id === pos.id);
              if (!hs) return null;
              const isSelected = selectedHotspot.id === hs.id;

              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => focusHotspot(hs)}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute z-20 group flex items-center gap-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-tibet-gold text-black px-3 py-1 font-bold shadow-[0_0_20px_rgba(251,191,36,0.9)] scale-110 border-2 border-white"
                      : "bg-black/85 hover:bg-tibet-gold text-white hover:text-black px-2.5 py-1 border border-tibet-gold/70 shadow-lg"
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold">{hs.number}</span>
                  <span lang="bo" className="font-serif text-xs hidden sm:inline">
                    {lang === "bo" ? hs.nameBo : hs.nameEn.split("(")[0].trim()}
                  </span>
                </button>
              );
            })}

          {/* Top-Left HUD Overlay */}
          {showHotspots && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1 bg-black/65 backdrop-blur-md px-3 py-2 rounded-xs border border-white/10">
              <div className="flex items-center gap-2 text-[10px] font-mono text-tibet-gold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {customModelName
                    ? `CUSTOM GLB: ${customModelName}`
                    : lang === "bo"
                    ? "ཕོ་བྲང་པོ་ཏ་ལའི་༣D དཔེ་གཟུགས།"
                    : "POTALA PALACE · 3D ARCHITECTURAL MODEL"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/60">
                {lang === "bo"
                  ? "ཙིག་རྟགས་ཀྱིས་༣༦༠° བསྐོར་བ་དང་ཆེ་ཆུང་སྒྱུར་ཐུབ།"
                  : "Drag to orbit 360° · Scroll to zoom · Click pins (01–07) to inspect"}
              </span>
            </div>
          )}

          {/* Bottom Hotspot Quick-Select Ribbon inside Canvas */}
          {showHotspots && (
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center gap-1.5 overflow-x-auto py-1.5 px-2.5 rounded-sm bg-black/80 backdrop-blur-md border border-white/15">
              {POTALA_HOTSPOTS.map((hs) => {
                const active = selectedHotspot.id === hs.id;
                return (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => focusHotspot(hs)}
                    className={`px-2.5 py-1 rounded-xs text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      active
                        ? "bg-tibet-gold text-black font-bold shadow-xs"
                        : "bg-white/5 hover:bg-white/15 text-white/80"
                    }`}
                  >
                    <span className="opacity-70">{hs.number}</span>
                    <span lang="bo" className="font-serif">
                      {lang === "bo" ? hs.nameBo : hs.nameEn.split("(")[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT 4 COLS: Sacred Architectural Inspector Panel */}
        <div className="lg:col-span-4 rounded-sm border border-sakya-gold/40 bg-[#14100e] p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-4">
            {/* Hotspot Header Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-tibet-gold text-black font-mono text-xs font-bold flex items-center justify-center">
                  {selectedHotspot.number}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-tibet-gold block">
                    {selectedHotspot.elevation}
                  </span>
                  <span className="text-[10px] font-mono text-white/50 block">
                    {lang === "bo" ? selectedHotspot.eraBo : selectedHotspot.eraEn}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => playResonance(selectedHotspot.freq)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-tibet-gold hover:text-black text-white/90 text-[11px] font-mono transition-colors cursor-pointer"
                title="Play acoustic bell resonance"
              >
                🔔 {selectedHotspot.freq} Hz
              </button>
            </div>

            {/* Bilingual Title */}
            <div className="space-y-1">
              <h3
                lang="bo"
                className="font-serif text-xl sm:text-2xl font-bold text-tibet-gold-light leading-snug"
              >
                {selectedHotspot.nameBo}
              </h3>
              <h4 className="text-sm sm:text-base font-medium text-white">
                {selectedHotspot.nameEn}
              </h4>
              <p className="text-xs text-tibet-gold/80 font-serif">
                {lang === "bo" ? selectedHotspot.subtitleBo : selectedHotspot.subtitleEn}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-serif">
              {lang === "bo"
                ? selectedHotspot.descriptionBo
                : selectedHotspot.descriptionEn}
            </p>

            {/* Architectural Highlights */}
            <div className="p-3.5 rounded-sm bg-black/50 border border-sakya-gold/30 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-tibet-gold font-bold block">
                {lang === "bo"
                  ? "བཟོ་བཀོད་ཀྱི་ཁྱད་ཆོས་གཙོ་བོ།"
                  : "KEY ARCHITECTURAL FEATURES"}
              </span>
              <ul className="space-y-1.5 text-xs text-white/85 font-serif">
                {(lang === "bo"
                  ? selectedHotspot.architectureBo
                  : selectedHotspot.architectureEn
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-tibet-gold mt-0.5">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Export & Custom GLB Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportGlb}
                disabled={isExporting}
                className="flex-1 px-3 py-2 rounded-xs bg-tibet-gold hover:bg-amber-400 text-black font-mono text-xs font-bold transition-colors cursor-pointer text-center"
              >
                {isExporting
                  ? "Exporting .GLB..."
                  : lang === "bo"
                  ? "⬇️ ༣D .GLB ཕབ་ལེན"
                  : "⬇️ Export 3D (.GLB)"}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3 py-2 rounded-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs transition-colors cursor-pointer text-center"
              >
                {lang === "bo" ? "📦 Tripo .GLB འཇུག" : "📦 Load .GLB"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLoadGlbFile(file);
                }}
              />
            </div>

            {customModelName && (
              <button
                type="button"
                onClick={restoreProceduralPotala}
                className="w-full py-1.5 rounded-xs bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 font-mono text-[11px] cursor-pointer"
              >
                {lang === "bo"
                  ? "↩ ཕོ་བྲང་པོ་ཏ་ལའི་དཔེ་གཟུགས་ལ་ཕྱིར་ལོག"
                  : "↩ Restore Built-in 3D Potala Model"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TRIPO3D AI STUDIO BRIDGE & /POTALA REFERENCE GALLERY
          ══════════════════════════════════════════════════════════════════ */}
      {showTripoStudio && (
        <div className="rounded-sm border border-sakya-gold/50 bg-[#14100d] p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-xs bg-tibet-gold text-black font-bold">
                  TRIPO3D AI PIPELINE
                </span>
                <span className="text-xs font-mono text-white/60">
                  IMAGE-TO-3D & TEXT-TO-3D STUDIO
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-1">
                {lang === "bo"
                  ? "ཕོ་བྲང་པོ་ཏ་ལའི་༣D མ་དཔེ་དང་ Tripo3D མཐུད་སྦྱོར།"
                  : "Potala Palace Reference Assets & Tripo3D .GLB Workflow"}
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                {lang === "bo"
                  ? "གཤམ་གྱི་པོ་ཏ་ལའི་པར་རིས་༤ པོ་ Tripo3D ནང་བེད་སྤྱོད་བྱས་ཏེ་ .GLB ཕབ་ལེན་དང་འདིར་ཐད་ཀར་འཇུག་ཐུབ།"
                  : "Use any of the 4 curated Potala Palace reference images below on tripo3d.ai (Image-to-3D) or copy the prompts, then drop the exported .GLB directly into the 3D stage above."}
              </p>
            </div>

            <a
              href="https://www.tripo3d.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xs bg-tibet-gold hover:bg-amber-400 text-black font-mono text-xs font-bold transition-colors shrink-0 self-start sm:self-auto"
            >
              Open Tripo3D.ai ↗
            </a>
          </div>

          {/* 4 Reference Images from /potala */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POTALA_REFERENCE_ASSETS.map((asset) => (
              <div
                key={asset.id}
                className="rounded-sm border border-white/15 bg-black/60 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full bg-stone-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.src}
                      alt={asset.titleEn}
                      className="w-full h-full object-contain p-2"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-black/80 text-tibet-gold font-mono text-[10px]">
                      {lang === "bo" ? asset.typeBo : asset.typeEn}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h4 lang="bo" className="font-serif text-sm font-bold text-tibet-gold-light">
                      {asset.titleBo}
                    </h4>
                    <p className="text-xs font-medium text-white/90">{asset.titleEn}</p>
                    <p className="text-[11px] text-white/60 font-mono line-clamp-3 bg-white/5 p-2 rounded-xs border border-white/10">
                      {asset.tripoPrompt}
                    </p>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(asset.tripoPrompt);
                      setCopiedPromptId(asset.id);
                      setTimeout(() => setCopiedPromptId(null), 1800);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xs bg-white/10 hover:bg-tibet-gold hover:text-black text-white text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    {copiedPromptId === asset.id
                      ? "✓ Copied"
                      : lang === "bo"
                      ? "Prompt བཤུས"
                      : "Copy Prompt"}
                  </button>
                  <a
                    href={asset.src}
                    download
                    className="py-1.5 px-2.5 rounded-xs bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 text-[11px] font-mono"
                    title="Download reference image for Tripo3D Image-to-3D"
                  >
                    ⬇️ IMG
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PotalaPalace3DViewer;

