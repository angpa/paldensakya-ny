"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  Language,
  PotalaHotspot,
  POTALA_HOTSPOTS,
  POTALA_REFERENCE_ASSETS,
} from "@/data/potalaPalaceData";

type AtmosphereMode = "sunlight" | "night";
type BaseStyle = "island" | "maquette";
type CameraViewPreset = "diorama" | "hero" | "elevation" | "summit";

/* ══════════════════════════════════════════════════════════════════════════
   Procedural High-DPI Tibetan PBR Facade Texture Generator (Canvas 2D -> WebGL)
   Generates:
   1. Diffuse Map: Kaolinite clay / milk-honey plaster with rain streaks,
      stepped trapezoidal windows (larger on upper floors, smaller on lower
      defensive floors), tricolor shing-tsak eaves & pleated sham-bu curtains.
   2. Emissive Map: Warm butter-lamp interior glow for Night Mode + Bloom.
   3. Packed ORM + Bump Map: Occlusion (R), Roughness 0.85-0.95 (G), Metalness (B)
      and recessed window relief.
   ══════════════════════════════════════════════════════════════════════════ */
// Facade texture cache: identical facade specs share one set of GPU textures (zero duplicate uploads)
const facadeTextureCache = new Map<
  string,
  { diffuseTex: THREE.CanvasTexture; emissiveTex: THREE.CanvasTexture; ormTex: THREE.CanvasTexture }
>();

function createPotalaFacadeTextures(options: {
  wallColor: string;
  friezeColor?: string;
  cols: number;
  rows: number;
  windowStartRow?: number;
  hasGoldBand?: boolean;
}) {
  const cacheKey = [
    options.wallColor,
    options.friezeColor ?? "",
    options.cols,
    options.rows,
    options.windowStartRow ?? 0,
    options.hasGoldBand !== false ? 1 : 0,
  ].join("|");
  const cached = facadeTextureCache.get(cacheKey);
  if (cached) return cached;

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

  const ormCanvas = document.createElement("canvas");
  ormCanvas.width = width;
  ormCanvas.height = height;
  const oCtx = ormCanvas.getContext("2d")!;

  // 1. Base Kaolinite clay / stone plaster background (R=240 AO, G=230 Roughness ~0.90, B=10 Metalness ~0.04)
  ctx.fillStyle = options.wallColor;
  ctx.fillRect(0, 0, width, height);

  eCtx.fillStyle = "#000000";
  eCtx.fillRect(0, 0, width, height);

  oCtx.fillStyle = "rgb(240, 232, 10)";
  oCtx.fillRect(0, 0, width, height);

  // Organic vertical rain-weathering streaks & kaolinite plaster variation
  for (let x = 0; x < width; x += 6) {
    const streakAlpha = ((x * 37) % 10) * 0.0035;
    ctx.fillStyle = `rgba(20, 15, 10, ${streakAlpha})`;
    ctx.fillRect(x, 0, 3, height);
    // Slight roughness variation along vertical rain streaks (0.85 - 0.95)
    const rVal = 218 + ((x * 19) % 24);
    oCtx.fillStyle = `rgb(235, ${rVal}, 8)`;
    oCtx.fillRect(x, 0, 3, height);
  }

  // Subtle horizontal granite masonry courses
  ctx.strokeStyle = "rgba(0,0,0,0.055)";
  ctx.lineWidth = 1.5;
  for (let y = 0; y < height; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Top Penba Frieze (spen-ma: compacted Bordó Lama tamarix branches under parapet)
  const friezeH = Math.floor(height * 0.115);
  ctx.fillStyle = options.friezeColor || "#380714";
  ctx.fillRect(0, 0, width, friezeH);
  // Rough fibrous tamarix bundle texture on ORM/Bump
  oCtx.fillStyle = "rgb(195, 242, 12)";
  oCtx.fillRect(0, 0, width, friezeH);

  // Historical soot & moisture occlusion band directly beneath the overhanging spen-ma frieze
  const friezeShadowGrad = ctx.createLinearGradient(0, friezeH, 0, friezeH + 18);
  friezeShadowGrad.addColorStop(0, "rgba(15, 10, 8, 0.24)");
  friezeShadowGrad.addColorStop(1, "rgba(15, 10, 8, 0)");
  ctx.fillStyle = friezeShadowGrad;
  ctx.fillRect(0, friezeH, width, 18);

  // Fresh annual lime-milk-honey whitewash sheen on the lower wall third
  const baseWashGrad = ctx.createLinearGradient(0, height * 0.65, 0, height);
  baseWashGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  baseWashGrad.addColorStop(1, "rgba(255, 252, 245, 0.12)");
  ctx.fillStyle = baseWashGrad;
  ctx.fillRect(0, height * 0.65, width, height * 0.35);

  // Golden Spen-bad / Me-long (sacred gilded brass discs) along the frieze
  if (options.hasGoldBand !== false) {
    const discCount = Math.max(4, Math.max(2, options.cols) * 2);
    for (let i = 0; i < discCount; i++) {
      const cx = ((i + 0.5) / discCount) * width;
      const cy = friezeH * 0.52;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx, cy, 4.8, 0, Math.PI * 2);
      ctx.fill();

      // Metallic low-roughness spot in ORM (R=255, G=45 roughness, B=230 metalness)
      oCtx.fillStyle = "rgb(255, 45, 230)";
      oCtx.beginPath();
      oCtx.arc(cx, cy, 4.8, 0, Math.PI * 2);
      oCtx.fill();
    }
    // White & Gold lower trim line under frieze
    ctx.fillStyle = "#fde68a";
    ctx.fillRect(0, friezeH - 4, width, 3);
  }

  // 3. Stepped Trapezoidal Tibetan Windows (larger on upper floors, smaller on lower defensive floors)
  const startRow = options.windowStartRow ?? 0;
  const usableTop = friezeH + 18;
  const usableHeight = height - usableTop - 22;
  const rowStep = usableHeight / Math.max(1, options.rows);
  const colStep = (width - 40) / Math.max(1, options.cols);

  for (let r = startRow; r < options.rows; r++) {
    // Upper rows (r=0) have larger ceremonial windows; lower rows have smaller fortress windows
    const floorScale = 1.12 - (r / Math.max(1, options.rows)) * 0.34;
    const wy = usableTop + r * rowStep + rowStep * 0.14;
    const baseWinH = Math.min(50, rowStep * 0.62 * floorScale);
    const baseWinW = Math.min(36, colStep * 0.52 * floorScale);

    // Dynamic window density (canvas row 0 = top floor, highest row index = ground floor):
    //  · Defensive stone base (bottom ~30% of rows on tall blocks): only ~30% of the windows survive.
    //  · Ceremonial top floor (r = 0): windows are 30% wider / 25% taller.
    const isDefensiveRow = options.rows >= 4 && r >= Math.ceil(options.rows * 0.7);
    const isCeremonialRow = r === 0 && options.rows >= 2;
    const winW = isCeremonialRow ? Math.min(colStep * 0.78, baseWinW * 1.3) : baseWinW;
    const winH = isCeremonialRow ? baseWinH * 1.25 : baseWinH;

    for (let c = 0; c < options.cols; c++) {
      if (isDefensiveRow) {
        // Deterministic hash (never Math.random) so every load / every block renders identically
        const hash =
          (Math.imul(r + 1, 73856093) ^
            Math.imul(c + 1, 19349663) ^
            Math.imul(options.cols, 83492791)) >>>
          0;
        if (hash % 100 >= 30) continue;
      }
      const wx = 20 + c * colStep + (colStep - winW) * 0.5;

      // Subtle rain & butter-lamp soot drip beneath each window sill
      ctx.fillStyle = "rgba(20, 14, 10, 0.085)";
      ctx.fillRect(wx, wy + winH, winW, 7);

      // Black heat-absorbing trapezoidal frame (sill wider at bottom, lintel narrower at top)
      const topInset = 2.6;
      const bottomOutset = 3.2;
      ctx.fillStyle = "#141215";
      ctx.beginPath();
      ctx.moveTo(wx + topInset, wy);
      ctx.lineTo(wx + winW - topInset, wy);
      ctx.lineTo(wx + winW + bottomOutset, wy + winH);
      ctx.lineTo(wx - bottomOutset, wy + winH);
      ctx.closePath();
      ctx.fill();

      // Tricolor Tibetan wooden lintel eaves (shing-tsak: Bordó Lama, blue, gold)
      ctx.fillStyle = "#560d1e"; // Bordó Lama upper eave
      ctx.fillRect(wx - 2, wy - 6.5, winW + 4, 2.5);
      ctx.fillStyle = "#1d4ed8"; // Blue middle bracket stripe
      ctx.fillRect(wx - 1, wy - 4, winW + 2, 2);
      ctx.fillStyle = "#eab308"; // Yellow lower lintel band
      ctx.fillRect(wx, wy - 2, winW, 2);

      // Raised lintel in ORM/Bump
      oCtx.fillStyle = "rgb(250, 180, 30)";
      oCtx.fillRect(wx - 2, wy - 6.5, winW + 4, 6.5);

      // Inner recessed window cavity
      const pad = 4.2;
      const innerX = wx + pad;
      const innerY = wy + pad;
      const innerW = Math.max(6, winW - pad * 2);
      const innerH = Math.max(8, winH - pad * 1.75);

      ctx.fillStyle = "#231e21";
      ctx.fillRect(innerX, innerY, innerW, innerH);

      // Deep recessed cavity & smooth glass in ORM/Bump (R=80 AO, G=65 low roughness, B=40)
      oCtx.fillStyle = "rgb(80, 65, 40)";
      oCtx.fillRect(innerX, innerY, innerW, innerH);

      // Pleated black cloth curtain with white border (sham-bu / ba-gam) at top of window
      const curtainH = Math.max(3, innerH * 0.26);
      ctx.fillStyle = "#18181b";
      ctx.fillRect(innerX, innerY, innerW, curtainH);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(innerX, innerY + curtainH - 1.2, innerW, 1.2);

      // Window wooden lattice crossbars
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(innerX, innerY, innerW, innerH);
      ctx.beginPath();
      ctx.moveTo(wx + winW / 2, innerY + curtainH);
      ctx.lineTo(wx + winW / 2, innerY + innerH);
      ctx.stroke();

      // Emissive warm butter-lamp glow for Night Mode + Selective UnrealBloomPass
      const isLit = (r * 7 + c * 13) % 4 !== 0;
      if (isLit) {
        eCtx.fillStyle = (r + c) % 3 === 0 ? "#fef08a" : "#fbbf24";
        eCtx.fillRect(
          innerX + 1,
          innerY + curtainH + 0.5,
          Math.max(2, innerW - 2),
          Math.max(2, innerH - curtainH - 1.5)
        );
      }
    }
  }

  const diffuseTex = new THREE.CanvasTexture(diffuseCanvas);
  diffuseTex.colorSpace = THREE.SRGBColorSpace;
  diffuseTex.anisotropy = 4;

  const emissiveTex = new THREE.CanvasTexture(emissiveCanvas);
  emissiveTex.colorSpace = THREE.SRGBColorSpace;

  const ormTex = new THREE.CanvasTexture(ormCanvas);
  ormTex.anisotropy = 4;

  const result = { diffuseTex, emissiveTex, ormTex };
  facadeTextureCache.set(cacheKey, result);
  return result;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Hammered Gilded Bronze PBR Roughness/Bump Map for the 7 Golden Roofs
   Varies roughness between 0.15 and 0.35 so sunlight glints organically.
   ══════════════════════════════════════════════════════════════════════════ */
let cachedGoldRoofRoughnessTex: THREE.CanvasTexture | null = null;
function getGoldRoofRoughnessTexture() {
  if (cachedGoldRoofRoughnessTex) return cachedGoldRoofRoughnessTex;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // Base roughness ~0.24 (grayscale ~61)
  ctx.fillStyle = "rgb(61, 61, 61)";
  ctx.fillRect(0, 0, 256, 256);

  // Subtle hammered bronze ribs & shingle variation (roughness 0.15 -> 38 to 0.35 -> 90)
  for (let x = 0; x < 256; x += 8) {
    const g = 42 + ((x * 29) % 46);
    ctx.fillStyle = `rgb(${g}, ${g}, ${g})`;
    ctx.fillRect(x, 0, 4, 256);
  }
  for (let y = 0; y < 256; y += 16) {
    ctx.fillStyle = "rgb(85, 85, 85)";
    ctx.fillRect(0, y, 256, 2);
  }

  cachedGoldRoofRoughnessTex = new THREE.CanvasTexture(canvas);
  return cachedGoldRoofRoughnessTex;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Battered (Inward-Sloping) Tibetan Fortress Wing Mesh
   Includes 3D protruding Crimson Penba Frieze & gilded Spen-bad discs.
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
  const taper = params.taper ?? 0.87;

  // Battered fortress geometry: the roofline keeps its nominal footprint (w × d) while the
  // base is flared by 1/taper (e.g. 1 / 0.85 ≈ +17%), giving the monumental sloped-wall silhouette.
  const geo = new THREE.BoxGeometry(params.w, params.h, params.d, 1, 1, 1);
  const pos = geo.attributes.position;
  const invTaper = 1 / taper;
  for (let i = 0; i < pos.count; i++) {
    const vy = pos.getY(i);
    if (vy < 0) {
      pos.setX(i, pos.getX(i) * invTaper);
      pos.setZ(i, pos.getZ(i) * invTaper);
    }
  }
  geo.computeVertexNormals();

  const { diffuseTex, emissiveTex, ormTex } = createPotalaFacadeTextures({
    wallColor: params.wallColor,
    friezeColor: params.friezeColor,
    cols: params.cols,
    rows: params.rows,
    windowStartRow: params.windowStartRow,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    map: diffuseTex,
    emissiveMap: emissiveTex,
    emissive: new THREE.Color("#fde68a"),
    emissiveIntensity: 0,
    roughnessMap: ormTex,
    metalnessMap: ormTex,
    bumpMap: ormTex,
    bumpScale: 0.035,
    roughness: 0.9,
    metalness: 0.04,
  });
  wallMat.userData = { isPalaceWall: true };

  const roofTopMat = new THREE.MeshStandardMaterial({
    color: params.roofTrimColor || "#2a050e",
    roughness: 0.78,
    metalness: 0.06,
  });

  // Apply PBR facade texture to front/back/left/right, solid terrace roof on top/bottom
  const materials = [wallMat, wallMat, roofTopMat, roofTopMat, wallMat, wallMat];
  const mesh = new THREE.Mesh(geo, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // 3D Protruding Bordó Lama Penba Frieze Molding (compacted tamarix band at top of wall)
  // The roofline is now the un-tapered footprint, so frieze / cornice follow w × d directly.
  const topW = params.w;
  const topD = params.d;
  const penbaH = Math.min(0.28, params.h * 0.12);
  const penbaGeo = new THREE.BoxGeometry(topW + 0.08, penbaH, topD + 0.08);
  const penbaMat = new THREE.MeshStandardMaterial({
    color: params.friezeColor || "#380714",
    roughness: 0.92,
    metalness: 0.04,
  });
  const penbaMesh = new THREE.Mesh(penbaGeo, penbaMat);
  penbaMesh.position.y = params.h / 2 - penbaH * 0.55;
  penbaMesh.castShadow = true;
  group.add(penbaMesh);

  // 3D Gilded Spen-bad Brass Mirror Discs along the front Penba Frieze
  const spenBadMat = new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#422006",
    emissiveIntensity: 0.1,
    roughness: 0.22,
    metalness: 0.88,
  });
  const discCount = Math.min(9, Math.max(3, params.cols));
  const discGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.03, 10);
  discGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < discCount; i++) {
    const dx = ((i + 0.5) / discCount - 0.5) * (topW * 0.88);
    const disc = new THREE.Mesh(discGeo, spenBadMat);
    disc.position.set(dx, params.h / 2 - penbaH * 0.55, (topD + 0.09) / 2);
    group.add(disc);
  }

  // Overhanging flat Tibetan roof parapet cornice (crisp white stone & dark crimson trim, not orange)
  const corniceW = topW + 0.14;
  const corniceD = topD + 0.14;
  const corniceGeo = new THREE.BoxGeometry(corniceW, 0.09, corniceD);
  const corniceMat = new THREE.MeshStandardMaterial({
    color: "#f8fafc",
    roughness: 0.65,
    metalness: 0.1,
  });
  const cornice = new THREE.Mesh(corniceGeo, corniceMat);
  cornice.position.y = params.h / 2 + 0.04;
  cornice.castShadow = true;
  group.add(cornice);

  // Cylindrical Tibetan Victory Banners (Gyaltsen) on major block front corners
  if (params.w >= 2.8) {
    const bannerBlackMat = new THREE.MeshStandardMaterial({
      color: "#1c1917",
      roughness: 0.8,
    });
    [-topW * 0.46, topW * 0.46].forEach((bx) => {
      const gyaltsen = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.34, 10),
        bannerBlackMat
      );
      body.position.y = 0.17;
      const goldBand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.062, 0.062, 0.07, 10),
        spenBadMat
      );
      goldBand.position.y = 0.28;
      const topFinial = new THREE.Mesh(
        new THREE.ConeGeometry(0.065, 0.12, 10),
        spenBadMat
      );
      topFinial.position.y = 0.38;
      gyaltsen.add(body, goldBand, topFinial);
      gyaltsen.position.set(bx, params.h / 2 + 0.08, topD * 0.46);
      group.add(gyaltsen);
    });
  }

  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Gilded Sino-Tibetan Roof (Gyaphib / Serdong)
   Features hammered gilded bronze PBR roughnessMap (0.15-0.35), metalness 0.9,
   dougong timber brackets, upturned curved corner eaves, Makara ridge ends,
   treasure vases (Bumpa), and central Dharma Wheel + Nyi-Da finial.
   ══════════════════════════════════════════════════════════════════════════ */
function createGildedTibetanRoof(
  w: number,
  d: number,
  h: number,
  options?: {
    lanternH?: number;
    doubleEave?: boolean;
    finials?: 1 | 3;
    tallSpire?: boolean;
  }
) {
  const roofGroup = new THREE.Group();
  const goldRoughTex = getGoldRoofRoughnessTexture();
  const lanternH = options?.lanternH ?? 0.34;
  const doubleEave = options?.doubleEave ?? false;
  const finials = options?.finials ?? 3;
  const tallSpire = options?.tallSpire ?? false;

  const goldMat = new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#422006",
    emissiveIntensity: 0.12,
    roughnessMap: goldRoughTex,
    bumpMap: goldRoughTex,
    bumpScale: 0.015,
    roughness: 0.24,
    metalness: 0.9,
  });

  const dougongMat = new THREE.MeshStandardMaterial({
    color: "#420816",
    roughness: 0.72,
    metalness: 0.15,
  });

  const grilleMat = new THREE.MeshStandardMaterial({
    color: "#2a050e",
    roughness: 0.65,
    metalness: 0.2,
  });

  // 0. Clerestory Timber Lantern Pavilion (གསེར་ཐོག་ལྷ་ཁང་།) beneath the golden roof
  //    Matches `A cross-section of the Potala in Lhasa.webp`: pillared skylight drum over the Serdong stupas
  if (lanternH > 0) {
    const coreGeo = new THREE.BoxGeometry(w * 0.82, lanternH, d * 0.8);
    const coreMesh = new THREE.Mesh(coreGeo, grilleMat);
    coreMesh.position.y = lanternH * 0.5;
    roofGroup.add(coreMesh);

    // Golden lattice clerestory band around lantern
    const latticeBand = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.85, lanternH * 0.45, d * 0.83),
      goldMat
    );
    latticeBand.position.y = lanternH * 0.56;
    roofGroup.add(latticeBand);

    // Corner & bay Bordó Lama colonnade pillars + Tibetan bracket capitals (gzhu-ma)
    const pillarCols = [-0.42, -0.14, 0.14, 0.42];
    pillarCols.forEach((px) => {
      [-0.42, 0.42].forEach((pz) => {
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.028, 0.032, lanternH, 8),
          dougongMat
        );
        col.position.set(px * w, lanternH * 0.5, pz * d);
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.045, 0.06),
          goldMat
        );
        cap.position.set(px * w, lanternH * 0.9, pz * d);
        roofGroup.add(col, cap);
      });
    });
  }

  const y0 = lanternH;

  // 1. Dougong wooden bracket cornice tier beneath the golden eaves
  const dougongGeo = new THREE.BoxGeometry(w * 1.04, h * 0.18, d * 1.04);
  const dougongMesh = new THREE.Mesh(dougongGeo, dougongMat);
  dougongMesh.position.y = y0 - h * 0.04;
  roofGroup.add(dougongMesh);

  // 2. Lower flared gilded eave tier
  const baseGeo = new THREE.BoxGeometry(w * 1.18, h * 0.2, d * 1.18);
  const baseMesh = new THREE.Mesh(baseGeo, goldMat);
  baseMesh.position.y = y0 + h * 0.1;
  baseMesh.castShadow = true;
  roofGroup.add(baseMesh);

  // Optional 2nd superimposed eave tier (Great Fifth Dalai Lama central canopy in cross-section)
  const upperOffset = doubleEave ? h * 0.24 : 0;
  if (doubleEave) {
    const midNeck = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.84, h * 0.18, d * 0.84),
      dougongMat
    );
    midNeck.position.y = y0 + h * 0.22;
    const upperEave = new THREE.Mesh(
      new THREE.BoxGeometry(w * 1.02, h * 0.16, d * 1.02),
      goldMat
    );
    upperEave.position.y = y0 + h * 0.32;
    upperEave.castShadow = true;
    roofGroup.add(midNeck, upperEave);
  }

  // 3. Upturned Curved Eave Corners & Chu-srin (Makara) Bronze Gargoyle Rain Spouts
  [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ].forEach(([sx, sz]) => {
    const spurGeo = new THREE.ConeGeometry(0.075, 0.28, 6);
    const spur = new THREE.Mesh(spurGeo, goldMat);
    spur.position.set(sx * w * 0.6, y0 + h * 0.24, sz * d * 0.6);
    spur.rotation.z = -sx * 0.55;
    spur.rotation.x = sz * 0.55;
    roofGroup.add(spur);

    // Chu-srin (Makara sea-dragon) horizontal corner rain spout protruding below eave
    const spoutGeo = new THREE.CylinderGeometry(0.018, 0.032, 0.22, 6);
    const spout = new THREE.Mesh(spoutGeo, goldMat);
    spout.position.set(sx * w * 0.64, y0 + h * 0.06, sz * d * 0.64);
    spout.rotation.z = sx * (Math.PI * 0.42);
    spout.rotation.y = sz * 0.35;
    roofGroup.add(spout);
  });

  // 4. Sloped hip-and-gable roof body (4-sided pyramid frustum)
  const hipGeo = new THREE.CylinderGeometry(w * 0.32, w * 0.8, h * 0.68, 4);
  hipGeo.rotateY(Math.PI / 4);
  hipGeo.scale(1, 1, d / w);
  const hipMesh = new THREE.Mesh(hipGeo, goldMat);
  hipMesh.position.y = y0 + upperOffset + h * 0.44;
  hipMesh.castShadow = true;
  roofGroup.add(hipMesh);

  // 5. Golden Ridge Beam + Makara Dragon-Fish Upturned Ends
  const ridgeGeo = new THREE.BoxGeometry(w * 0.58, h * 0.18, d * 0.16);
  const ridgeMesh = new THREE.Mesh(ridgeGeo, goldMat);
  ridgeMesh.position.y = y0 + upperOffset + h * 0.8;
  roofGroup.add(ridgeMesh);

  [-w * 0.31, w * 0.31].forEach((mx, idx) => {
    const makara = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.22, 8),
      goldMat
    );
    makara.position.set(mx, y0 + upperOffset + h * 0.9, 0);
    makara.rotation.z = idx === 0 ? 0.4 : -0.4;
    roofGroup.add(makara);
  });

  // 6. Gser-tog / Ganjira Ridge Finials (1 central tall spire or 3 triple finials per cross-section)
  if (finials === 3) {
    [-w * 0.19, 0, w * 0.19].forEach((fx, idx) => {
      const isCenter = idx === 1;
      const finialH = isCenter ? (tallSpire ? 0.48 : 0.36) : 0.28;
      const finialGeo = new THREE.ConeGeometry(isCenter ? 0.09 : 0.075, finialH, 10);
      const finial = new THREE.Mesh(finialGeo, goldMat);
      finial.position.set(fx, y0 + upperOffset + h * 0.98 + finialH * 0.35, 0);
      roofGroup.add(finial);
    });
  } else {
    const spireH = tallSpire ? 0.56 : 0.38;
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.095, spireH, 12), goldMat);
    spire.position.set(0, y0 + upperOffset + h * 1.0 + spireH * 0.4, 0);
    roofGroup.add(spire);
  }

  // 7. Central Dharma Wheel (Chokhor) & Sacred Nyi-Da (Crescent Moon + Sun + Jyoti) Finial
  const topY = y0 + upperOffset + (tallSpire ? h * 1.22 : h * 1.05);
  const wheelGeo = new THREE.TorusGeometry(0.11, 0.028, 8, 16);
  const wheel = new THREE.Mesh(wheelGeo, goldMat);
  wheel.position.set(0, topY, 0);
  roofGroup.add(wheel);

  const crescentGeo = new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI);
  crescentGeo.rotateZ(Math.PI);
  const crescent = new THREE.Mesh(crescentGeo, goldMat);
  crescent.position.set(0, topY + 0.17, 0);
  roofGroup.add(crescent);

  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), goldMat);
  sunDisc.position.set(0, topY + 0.21, 0);
  roofGroup.add(sunDisc);

  return roofGroup;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Lhasa High-Altitude Day & Starry Night Sky Textures (3,700m)
   Cached in memory for 0ms instantaneous atmosphere switching.
   ══════════════════════════════════════════════════════════════════════════ */
let cachedDaySkyTex: THREE.CanvasTexture | null = null;
function createLhasaDaySkyTexture() {
  if (cachedDaySkyTex) return cachedDaySkyTex;
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
  cachedDaySkyTex = tex;
  return tex;
}

let cachedNightSkyTex: THREE.CanvasTexture | null = null;
function createLhasaNightSkyTexture() {
  if (cachedNightSkyTex) return cachedNightSkyTex;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Deep 3,700m Himalayan cosmic night gradient
  const nightGrad = ctx.createLinearGradient(0, 0, 0, 512);
  nightGrad.addColorStop(0, "#03050d");    // Deep cosmic zenith
  nightGrad.addColorStop(0.52, "#060b19"); // High-altitude midnight indigo
  nightGrad.addColorStop(0.85, "#0a1326"); // Lhasa valley nocturnal horizon
  nightGrad.addColorStop(1, "#0f1c36");    // Subtle distant mountain glow
  ctx.fillStyle = nightGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle diagonal Himalayan Milky Way stardust band
  ctx.save();
  ctx.translate(256, 210);
  ctx.rotate(-0.42);
  const milkyGrad = ctx.createLinearGradient(0, -90, 0, 90);
  milkyGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
  milkyGrad.addColorStop(0.5, "rgba(125, 211, 252, 0.055)");
  milkyGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = milkyGrad;
  ctx.fillRect(-320, -90, 640, 180);
  ctx.restore();

  // 350 crystalline Himalayan stars across 3 color temperatures
  const starColors = ["#ffffff", "#bae6fd", "#fef08a", "#e0f2fe"];
  for (let i = 0; i < 350; i++) {
    // Deterministic pseudo-random distribution so sky never flickers
    const sx = ((i * 173 + (i * i) * 31) % 508) + 2;
    const sy = ((i * 137 + i * 29) % 440) + 2;
    const radius = i % 19 === 0 ? 1.55 : i % 7 === 0 ? 1.1 : 0.65;
    const alpha = 0.35 + ((i * 43) % 65) / 100;

    ctx.fillStyle = starColors[i % starColors.length];
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Soft halo around brightest zenith stars
    if (i % 19 === 0) {
      ctx.globalAlpha = alpha * 0.25;
      ctx.beginPath();
      ctx.arc(sx, sy, radius * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1.0;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedNightSkyTex = tex;
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

  // 4. Subtle Golden Solar Halo Sprite
  const glowTex = createCelestialGlowTexture(
    "rgba(254, 249, 195, 0.85)",
    "rgba(251, 191, 36, 0.45)",
    "rgba(245, 158, 11, 0.08)"
  );
  const spriteMat = new THREE.SpriteMaterial({
    map: glowTex,
    transparent: true,
    depthWrite: false,
  });
  const glowSprite = new THREE.Sprite(spriteMat);
  glowSprite.scale.set(3.8, 3.8, 1);
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

  // 4. Balanced Silvery-Blue Lunar Halo Sprite (AgX starlight glow, zero whiteout)
  const moonGlowTex = createCelestialGlowTexture(
    "rgba(224, 242, 254, 0.82)",
    "rgba(147, 197, 253, 0.38)",
    "rgba(56, 189, 248, 0.06)"
  );
  const moonSpriteMat = new THREE.SpriteMaterial({
    map: moonGlowTex,
    transparent: true,
    depthWrite: false,
  });
  const moonGlowSprite = new THREE.Sprite(moonSpriteMat);
  moonGlowSprite.scale.set(4.2, 4.2, 1);
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
  const horizLen = Math.hypot(diff.x, diff.z);
  const yaw = -Math.atan2(diff.z, diff.x);

  const whiteMat = new THREE.MeshStandardMaterial({
    color: "#f5f3ef",
    roughness: 0.75,
  });
  const redCapMat = new THREE.MeshStandardMaterial({
    color: "#4a0a18",
    roughness: 0.65,
  });

  // Flat perimeter wall vs sloped sawtooth stepped parapet (matching peggy_marco-potala-1027014.jpg)
  if (Math.abs(diff.y) < 0.08 || horizLen < 0.2) {
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(horizLen, wallHeight, width),
      whiteMat
    );
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    const capMesh = new THREE.Mesh(
      new THREE.BoxGeometry(horizLen + 0.04, 0.11, width + 0.06),
      redCapMat
    );
    capMesh.position.y = wallHeight / 2 + 0.05;
    group.add(bodyMesh, capMesh);
    group.position.copy(mid);
    group.rotation.y = yaw;
    return group;
  }

  // Stepped sawtooth masonry parapet (horizontal white stone tiers with Bordó Lama coping)
  const stepCount = Math.max(5, Math.min(11, Math.round(horizLen * 2.2)));
  const stepLen = (horizLen / stepCount) * 1.08;

  for (let s = 0; s < stepCount; s++) {
    const t = (s + 0.5) / stepCount;
    const sx = vStart.x + diff.x * t;
    const sy = vStart.y + diff.y * t;
    const sz = vStart.z + diff.z * t;

    const stepGroup = new THREE.Group();
    const blockH = wallHeight + 0.12;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(stepLen, blockH, width),
      whiteMat
    );
    block.position.y = -0.06;
    block.castShadow = true;
    block.receiveShadow = true;

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(stepLen + 0.03, 0.095, width + 0.05),
      redCapMat
    );
    cap.position.y = wallHeight / 2 + 0.045;

    stepGroup.add(block, cap);
    stepGroup.position.set(sx, sy, sz);
    stepGroup.rotation.y = yaw;
    group.add(stepGroup);
  }

  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Main Zigzag Stairway (གཟིམ་ཆུང་ལམ། · gzim-chung lam)
   Pure builder: local origin = bottom-left corner of the first flight. Each flight crosses the
   full width `w`, climbs `totalH / segments` and advances `d / segments` toward -Z (up the hill),
   with a square landing at every switchback. Reuses createStaircaseSegment (plain boxes, no CSG).
   ══════════════════════════════════════════════════════════════════════════ */
function createZigzagStairs(w: number, totalH: number, d: number, segments = 3) {
  const group = new THREE.Group();
  const landingMat = new THREE.MeshStandardMaterial({ color: "#f5f3ef", roughness: 0.8 });
  const landingCapMat = new THREE.MeshStandardMaterial({ color: "#4a0a18", roughness: 0.65 });

  const segH = totalH / segments;
  const segD = d / segments;
  let from: [number, number, number] = [0, 0, 0];

  for (let i = 0; i < segments; i++) {
    const goingRight = i % 2 === 0;
    const to: [number, number, number] = [
      goingRight ? w : 0,
      segH * (i + 1),
      -segD * (i + 1),
    ];
    group.add(createStaircaseSegment(from, to, 0.46, 0.55));

    // Switchback landing (white body + Bordó Lama coping)
    const landing = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.55, 0.62), landingMat);
    landing.position.set(to[0], to[1], to[2]);
    landing.castShadow = true;
    landing.receiveShadow = true;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.1, 0.66), landingCapMat);
    cap.position.set(to[0], to[1] + 0.32, to[2]);
    group.add(landing, cap);

    from = to;
  }
  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Lightweight Shol Townhouse Block (ཞོལ་གྲོང་གི་ཁང་པ། · zhol-grong khang-pa)
   Low draw-call variant of createBatteredPalaceBlock for the many Shol buildings:
   exactly 3 meshes (battered wall body + spen-ma frieze + white cornice), with
   materials cached and shared across every block that uses the same facade spec.
   Local origin = center of the wall body (same convention as createBatteredPalaceBlock).
   ══════════════════════════════════════════════════════════════════════════ */
const sholMaterialCache = new Map<string, THREE.Material>();
function getSholMaterial(key: string, make: () => THREE.Material) {
  let m = sholMaterialCache.get(key);
  if (!m) {
    m = make();
    sholMaterialCache.set(key, m);
  }
  return m;
}

function createSholBlock(params: {
  w: number;
  h: number;
  d: number;
  wallColor?: string;
  friezeColor?: string;
  cols?: number;
  rows?: number;
  taper?: number;
}) {
  const group = new THREE.Group();
  const wallColor = params.wallColor ?? "#f5f1e8";
  const friezeColor = params.friezeColor ?? "#4a0a18";
  const cols = params.cols ?? Math.max(2, Math.round(params.w * 2.2));
  const rows = params.rows ?? Math.max(1, Math.round(params.h * 1.6));
  const taper = params.taper ?? 0.95;

  const geo = new THREE.BoxGeometry(params.w, params.h, params.d);
  const pos = geo.attributes.position;
  const inv = 1 / taper;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) < 0) {
      pos.setX(i, pos.getX(i) * inv);
      pos.setZ(i, pos.getZ(i) * inv);
    }
  }
  geo.computeVertexNormals();

  const wallKey = `wall|${wallColor}|${friezeColor}|${cols}|${rows}`;
  const wallMat = getSholMaterial(wallKey, () => {
    const { diffuseTex, emissiveTex, ormTex } = createPotalaFacadeTextures({
      wallColor,
      friezeColor,
      cols,
      rows,
      hasGoldBand: false,
    });
    const m = new THREE.MeshStandardMaterial({
      map: diffuseTex,
      emissiveMap: emissiveTex,
      emissive: new THREE.Color("#fde68a"),
      emissiveIntensity: 0,
      roughnessMap: ormTex,
      roughness: 0.92,
      metalness: 0.03,
    });
    m.userData = { isPalaceWall: true };
    return m;
  });
  const roofMat = getSholMaterial("roof|#2a050e", () =>
    new THREE.MeshStandardMaterial({ color: "#2a050e", roughness: 0.8 })
  );
  const friezeMat = getSholMaterial(`frieze|${friezeColor}`, () =>
    new THREE.MeshStandardMaterial({ color: friezeColor, roughness: 0.92 })
  );
  const corniceMat = getSholMaterial("cornice|#f8fafc", () =>
    new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.65 })
  );

  const body = new THREE.Mesh(geo, [wallMat, wallMat, roofMat, roofMat, wallMat, wallMat]);
  body.castShadow = true;
  body.receiveShadow = true;

  const friezeH = Math.min(0.16, params.h * 0.13);
  const frieze = new THREE.Mesh(
    new THREE.BoxGeometry(params.w + 0.06, friezeH, params.d + 0.06),
    friezeMat
  );
  frieze.position.y = params.h / 2 - friezeH * 0.55;

  const cornice = new THREE.Mesh(
    new THREE.BoxGeometry(params.w + 0.1, 0.06, params.d + 0.1),
    corniceMat
  );
  cornice.position.y = params.h / 2 + 0.03;

  group.add(body, frieze, cornice);
  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Shol Cloister Courtyard Compound (ཞོལ་གྱི་རྭ་བ། · zhol-gyi ra-ba)
   Matches the enclosed "□" and "U" courtyard compounds of Shol seen in the
   Sketchfab photogrammetry model: four (or three) whitewashed townhouse wings
   around an open lawn courtyard. Local origin = ground level, courtyard center.
   ══════════════════════════════════════════════════════════════════════════ */
function createSholCloister(params: {
  w: number;
  d: number;
  wingD: number;
  h: number;
  openSide?: "none" | "north";
  wallColor?: string;
}) {
  const group = new THREE.Group();
  const { w, d, wingD, h } = params;
  const inner = d - wingD * 2;

  // South wing (street facade) + optional north wing
  const south = createSholBlock({ w, h, d: wingD, wallColor: params.wallColor });
  south.position.set(0, h / 2, (d - wingD) / 2);
  group.add(south);
  if (params.openSide !== "north") {
    const north = createSholBlock({ w, h: h * 1.12, d: wingD, wallColor: params.wallColor });
    north.position.set(0, (h * 1.12) / 2, -(d - wingD) / 2);
    group.add(north);
  }

  // East & west side wings
  const sideLen = params.openSide === "north" ? inner + wingD : inner;
  const sideZ = params.openSide === "north" ? -wingD / 2 : 0;
  [-1, 1].forEach((sx) => {
    const side = createSholBlock({ w: wingD, h, d: sideLen, wallColor: params.wallColor, cols: 3 });
    side.position.set(sx * (w - wingD) / 2, h / 2, sideZ);
    group.add(side);
  });

  // Inner lawn courtyard (rtswa-thang) with polished ar-ga stone border
  const lawnMat = getSholMaterial("lawn", () =>
    new THREE.MeshStandardMaterial({ color: "#5f7f45", roughness: 0.95 })
  );
  const lawn = new THREE.Mesh(
    new THREE.BoxGeometry(w - wingD * 2 - 0.04, 0.04, (params.openSide === "north" ? d - wingD : inner) - 0.04),
    lawnMat
  );
  lawn.position.set(0, 0.02, params.openSide === "north" ? -wingD / 2 : 0);
  lawn.receiveShadow = true;
  group.add(lawn);

  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Traditional Tibetan White Chörten Stupa (མཆོད་རྟེན། · mchod-rten)
   Features square throne base, stepped tiers, Bumpa dome, 13-wheel spire & Nyi-Zla
   ══════════════════════════════════════════════════════════════════════════ */
function createChortenStupa(scale = 1) {
  const stupa = new THREE.Group();
  const whiteMat = new THREE.MeshStandardMaterial({
    color: "#faf8f5",
    roughness: 0.72,
    metalness: 0.05,
  });
  const crimsonMat = new THREE.MeshStandardMaterial({
    color: "#4a0a18",
    roughness: 0.68,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#422006",
    emissiveIntensity: 0.12,
    roughness: 0.24,
    metalness: 0.9,
  });

  // 1. Lion Throne Base (sen-khri)
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.56), whiteMat);
  base.position.y = 0.17;
  base.castShadow = true;
  stupa.add(base);

  // Crimson collar band
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.58), crimsonMat);
  collar.position.y = 0.36;
  stupa.add(collar);

  // 2. Four Stepped Enlightenment Tiers
  const steps = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.46), whiteMat);
  steps.position.y = 0.47;
  stupa.add(steps);

  // 3. Vase Dome (bum-pa)
  const bumpa = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.18, 0.32, 16),
    whiteMat
  );
  bumpa.position.y = 0.71;
  bumpa.castShadow = true;
  stupa.add(bumpa);

  // 4. Harmika & 13 Dharma Wheels Spire (chos-'khor bcu-gsum)
  const harmika = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.18), goldMat);
  harmika.position.y = 0.91;
  stupa.add(harmika);

  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.36, 12), goldMat);
  spire.position.y = 1.12;
  stupa.add(spire);

  // 5. Sacred Parasol & Nyi-Zla Crown
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), goldMat);
  crown.position.y = 1.33;
  stupa.add(crown);

  stupa.scale.setScalar(scale);
  return stupa;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Catenary String of 5-Color Lung-ta Prayer Flags (རླུང་རྟ། · rlung-rta)
   Traditional Tibetan elemental order: Blue, White, Red, Green, Yellow
   ══════════════════════════════════════════════════════════════════════════ */
function createLungtaPrayerFlagString(
  start: [number, number, number],
  end: [number, number, number],
  flagCount = 10,
  sag = 0.22
) {
  const group = new THREE.Group();
  const vStart = new THREE.Vector3(...start);
  const vEnd = new THREE.Vector3(...end);

  const fiveColors = ["#2563eb", "#f8fafc", "#dc2626", "#16a34a", "#eab308"];
  const flagGeo = new THREE.PlaneGeometry(0.11, 0.14);

  for (let i = 1; i <= flagCount; i++) {
    const t = i / (flagCount + 1);
    const pt = new THREE.Vector3().lerpVectors(vStart, vEnd, t);
    // Parabolic catenary sag
    pt.y -= Math.sin(t * Math.PI) * sag;

    const flagMat = new THREE.MeshStandardMaterial({
      color: fiveColors[i % 5],
      roughness: 0.75,
      side: THREE.DoubleSide,
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.copy(pt);
    flag.userData = { basePosY: pt.y, phase: i * 0.65 };
    group.add(flag);
  }

  return group;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helper: Create Golden Funerary Serdong Reliquary Stupa (གསེར་གདུང་། · gser-gdung)
   Matches the multi-story indoor stupas in `A cross-section of the Potala in Lhasa.webp`:
   stepped Lion Throne (Seng-khri), turquoise/coral inlaid bands, bulbous Bumpa dome,
   Bre-ba harmika, 13 Dharma Wheels (Chos-'khor bcu-gsum), parasol & Nyi-Zla crown.
   ══════════════════════════════════════════════════════════════════════════ */
function createGoldenSerdongStupa(totalH = 2.45, widthScale = 1.0) {
  const group = new THREE.Group();
  const goldRoughTex = getGoldRoofRoughnessTexture();
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#facc15",
    emissive: "#78350f",
    emissiveIntensity: 0.28,
    roughnessMap: goldRoughTex,
    roughness: 0.2,
    metalness: 0.92,
  });
  const turquoiseMat = new THREE.MeshStandardMaterial({
    color: "#0d9488",
    emissive: "#115e59",
    emissiveIntensity: 0.25,
    roughness: 0.35,
    metalness: 0.4,
  });
  const coralMat = new THREE.MeshStandardMaterial({
    color: "#9f1239",
    roughness: 0.4,
    metalness: 0.3,
  });

  const w = 0.88 * widthScale;

  // 1. Stepped Lion Throne Base (Seng-khri) + 4 Enlightenment Steps (Bang-rim)
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(w * 1.12, totalH * 0.14, w * 1.12),
    goldMat
  );
  plinth.position.y = totalH * 0.07;
  group.add(plinth);

  const throneWaist = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.94, totalH * 0.14, w * 0.94),
    turquoiseMat
  );
  throneWaist.position.y = totalH * 0.21;
  group.add(throneWaist);

  for (let s = 0; s < 4; s++) {
    const stepW = w * (1.0 - s * 0.08);
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(stepW, totalH * 0.042, stepW),
      s % 2 === 0 ? goldMat : coralMat
    );
    step.position.y = totalH * (0.3 + s * 0.042);
    group.add(step);
  }

  // 2. Bulbous Lotus Vase Dome (Bum-pa) with sacred Kumbha niche
  const bumpa = new THREE.Mesh(
    new THREE.SphereGeometry(w * 0.38, 18, 16),
    goldMat
  );
  bumpa.scale.set(1, 1.12, 1);
  bumpa.position.y = totalH * 0.56;
  group.add(bumpa);

  const niche = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.22, totalH * 0.12, w * 0.08),
    turquoiseMat
  );
  niche.position.set(0, totalH * 0.56, w * 0.36);
  group.add(niche);

  // 3. Harmika Cube (Bre-ba)
  const harmika = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.32, totalH * 0.07, w * 0.32),
    coralMat
  );
  harmika.position.y = totalH * 0.72;
  group.add(harmika);

  // 4. Conical 13-Wheel Spire (Chos-'khor bcu-gsum) reaching into the skylight lantern
  const spire = new THREE.Mesh(
    new THREE.CylinderGeometry(w * 0.045, w * 0.15, totalH * 0.22, 14),
    goldMat
  );
  spire.position.y = totalH * 0.86;
  group.add(spire);

  // 5. Royal Parasol (Gdugs) & Nyi-Zla Finial
  const parasol = new THREE.Mesh(
    new THREE.CylinderGeometry(w * 0.16, w * 0.19, totalH * 0.025, 16),
    turquoiseMat
  );
  parasol.position.y = totalH * 0.97;
  const jewel = new THREE.Mesh(
    new THREE.SphereGeometry(w * 0.055, 10, 10),
    goldMat
  );
  jewel.position.y = totalH * 1.01;
  group.add(parasol, jewel);

  return group;
}

export function PotalaPalace3DViewer({ lang }: { lang: Language }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive State
  const [selectedHotspot, setSelectedHotspot] = useState<PotalaHotspot>(POTALA_HOTSPOTS[0]);
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>("sunlight");
  const [baseStyle, setBaseStyle] = useState<BaseStyle>("island");
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>("diorama");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [crossSection, setCrossSection] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTripoStudio, setShowTripoStudio] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Three.js Object Refs for live updates without rebuilding scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const potalaRootRef = useRef<THREE.Group | null>(null);
  const proceduralGroupRef = useRef<THREE.Group | null>(null);
  const customGlbGroupRef = useRef<THREE.Group | null>(null);
  const islandFoliageGroupRef = useRef<THREE.Group | null>(null);
  const mountainMeshRef = useRef<THREE.Mesh | null>(null);
  const redPalaceInteriorGroupRef = useRef<THREE.Group | null>(null);
  const redPalaceCutawayMeshesRef = useRef<THREE.Object3D[]>([]);
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

  // Lights & Environment Refs
  const envTextureRef = useRef<THREE.Texture | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const palaceSpotLightRef = useRef<THREE.SpotLight | null>(null);
  const incenseLightRef = useRef<THREE.PointLight | null>(null);
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

    // 3. Ultra-Fast 60 FPS WebGL Renderer + Khronos Neutral Tone Mapping (0% red-to-orange hue skew)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Image-Based Lighting (IBL) for metallic reflections on the 7 Golden Roofs & Spen-bad discs
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    envTextureRef.current = envTexture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

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

    // 5. Lighting Setup (Crisp high-altitude 3,700m Lhasa daylight white, zero orange cast)
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.0);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight("#ffffff", 1.75);
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

    const palaceSpotLight = new THREE.SpotLight("#fff7ed", 0, 36, Math.PI / 2.6, 0.45, 1.0);
    palaceSpotLight.position.set(0, 2.2, 12.5);
    palaceSpotLight.target.position.set(0, 6.2, 0);
    scene.add(palaceSpotLight);
    scene.add(palaceSpotLight.target);
    palaceSpotLightRef.current = palaceSpotLight;

    // Subtle Sang-khang (incense burner) local point light on Deyangshar terrace
    const incenseLight = new THREE.PointLight("#fde68a", 0, 4.5, 1.8);
    incenseLight.position.set(2.0, 5.8, 1.5);
    scene.add(incenseLight);
    incenseLightRef.current = incenseLight;

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

    // Upper stone platform slab (extended south for Shol & north for the Byang-ngos turnaround
    // and pentagonal perimeter circuit seen in the satellite orthophoto)
    const platformGeo = new THREE.BoxGeometry(20.4, 0.55, 17.2);
    const platformMat = new THREE.MeshStandardMaterial({
      color: "#d6d3d1",
      roughness: 0.7,
      metalness: 0.1,
    });
    const platformMesh = new THREE.Mesh(platformGeo, platformMat);
    platformMesh.position.set(0, 0.25, 1.2);
    platformMesh.receiveShadow = true;
    platformMesh.castShadow = true;
    pedestalGroup.add(platformMesh);

    // Inverted floating island bowl & spherical feet (matching potala-diorama-model.png)
    const underBowlGeo = new THREE.CylinderGeometry(8.8, 3.3, 2.4, 16);
    underBowlGeo.scale(1.12, 1, 0.92);
    const underBowlMat = new THREE.MeshStandardMaterial({
      color: "#a8a29e",
      roughness: 0.65,
      metalness: 0.15,
    });
    const underBowl = new THREE.Mesh(underBowlGeo, underBowlMat);
    underBowl.position.set(0, -1.2, 1.2);
    pedestalGroup.add(underBowl);

    // Spherical pedestal nodes underneath
    const footPositions: [number, number, number, number][] = [
      [0, -2.5, 1.2, 0.95],
      [-4.2, -1.9, 3.6, 0.75],
      [4.2, -1.9, 3.6, 0.75],
      [-6.8, -1.2, 4.6, 0.55],
      [6.8, -1.2, 4.6, 0.55],
      [-4.2, -1.9, -1.6, 0.7],
      [4.2, -1.9, -1.6, 0.7],
    ];
    footPositions.forEach(([fx, fy, fz, r]) => {
      const sphereGeo = new THREE.SphereGeometry(r, 16, 16);
      const sphere = new THREE.Mesh(sphereGeo, underBowlMat);
      sphere.position.set(fx, fy, fz);
      pedestalGroup.add(sphere);
    });

    // Marpo Ri (དམར་པོ་རི། · dmar-po ri): low-poly fractured granite massif.
    // IcosahedronGeometry (non-indexed → crisp flat facets) projected onto the same elliptical
    // envelope as before (flat summit plateau + battered flanks), then roughened with a
    // deterministic position-based ridged noise (shared vertices always move together → no cracks).
    const MARPO = { cx: -0.3, cy: 0.2, cz: -0.2, rx: 9.68, rz: 5.98, H: 4.2, plateau: 0.59 };
    const marpoFlank = (rho: number) =>
      Math.min(1, Math.max(0, (1 - rho) / (1 - MARPO.plateau)));
    // The south face drops away in front of the palace (z > 1.2) so the white bastion and the
    // gos-sku thangka wall stand clear of the rock instead of being swallowed by the summit plateau.
    const marpoSouthDrop = (z: number) => {
      const u = Math.min(1, Math.max(0, (z - 1.2) / 2.0));
      return 1 - 0.6 * (u * u * (3 - 2 * u));
    };
    // Smooth (noise-free) surface height: used to seat trees & the main stairway on the slope
    const marpoSurfaceY = (x: number, z: number) => {
      const rho = Math.hypot((x - MARPO.cx) / MARPO.rx, (z - MARPO.cz) / MARPO.rz);
      const t = marpoFlank(rho);
      const eastDescent = x > 2 ? -(x - 2) * 0.18 : 0;
      return MARPO.cy + (t * MARPO.H + eastDescent * t) * marpoSouthDrop(z);
    };

    const hillGeo = new THREE.IcosahedronGeometry(1, 7);
    const hillPos = hillGeo.attributes.position;
    const hillColors = new Float32Array(hillPos.count * 3);
    const rockDark = new THREE.Color("#5c5048"); // oxidised granite
    const rockLight = new THREE.Color("#7d6d5b"); // sun-bleached scree
    const alpineGreen = new THREE.Color("#58693a"); // juniper / scrub on the gentle foothills
    const tmpColor = new THREE.Color();

    for (let i = 0; i < hillPos.count; i++) {
      const ux = hillPos.getX(i);
      const uy = hillPos.getY(i);
      const uz = hillPos.getZ(i);

      // Upper hemisphere → disk (orthographic); lower hemisphere collapses onto the base rim
      let dx = ux;
      let dz = uz;
      let rho = Math.hypot(ux, uz);
      if (uy < 0) {
        const len = Math.max(rho, 1e-4);
        dx = ux / len;
        dz = uz / len;
        rho = 1;
      }
      const x = MARPO.cx + dx * MARPO.rx;
      const z = MARPO.cz + dz * MARPO.rz;
      const t = marpoFlank(rho);

      // Ridged, strata-like granite noise (fractures stronger on the flanks than on the summit)
      const ridge =
        0.55 * Math.sin(x * 1.3 + z * 0.7) +
        0.3 * (1 - 2 * Math.abs(Math.sin(x * 2.9 - z * 2.3))) +
        0.15 * Math.sin(z * 3.7 + x * 1.1);
      const weight = 0.25 + 0.75 * (4 * t * (1 - t));
      const eastDescent = x > 2 ? -(x - 2) * 0.18 : 0;

      const y = Math.max(
        MARPO.cy,
        MARPO.cy + (t * MARPO.H + eastDescent * t) * marpoSouthDrop(z) + ridge * 0.42 * weight
      );
      hillPos.setXYZ(i, x + ridge * 0.2 * weight * (t > 0 ? 1 : 0), y, z);

      // Vertex colours: green foothills → granite flanks → bleached summit scree
      const rockMix = Math.min(1, Math.max(0, (t - 0.12) / 0.38 + ridge * 0.18));
      tmpColor.copy(rockDark).lerp(rockLight, Math.min(1, Math.max(0, 0.5 + ridge * 0.5)));
      tmpColor.lerp(alpineGreen, 1 - rockMix);
      hillColors[i * 3] = tmpColor.r;
      hillColors[i * 3 + 1] = tmpColor.g;
      hillColors[i * 3 + 2] = tmpColor.b;
    }
    hillGeo.setAttribute("color", new THREE.BufferAttribute(hillColors, 3));
    hillGeo.computeVertexNormals();

    const hillMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      vertexColors: true,
      roughness: 1.0,
      metalness: 0.02,
      flatShading: true,
    });
    const hillMesh = new THREE.Mesh(hillGeo, hillMat);
    hillMesh.receiveShadow = true;
    hillMesh.castShadow = true;
    proceduralGroup.add(hillMesh);
    mountainMeshRef.current = hillMesh;

    // Rocky Western Crag Outcrop & Fractured Granite Bedrock Interlocking with Palace Base
    // Deterministic position-based roughening (shared vertices move together → no cracks)
    const roughenRock = (geo: THREE.BufferGeometry, amp: number) => {
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const y = p.getY(i);
        const z = p.getZ(i);
        const n =
          0.6 * Math.sin(x * 2.7 + y * 1.9) +
          0.4 * (1 - 2 * Math.abs(Math.sin(z * 3.1 - x * 2.3 + y * 1.3)));
        const k = 1 + n * amp;
        p.setXYZ(i, x * k, y * (1 + n * amp * 0.7), z * k);
      }
      geo.computeVertexNormals();
    };
    const cragGeo = new THREE.DodecahedronGeometry(2.5, 2);
    cragGeo.scale(1.1, 1.35, 0.9);
    roughenRock(cragGeo, 0.24);
    const cragMat = new THREE.MeshStandardMaterial({
      color: "#736558",
      roughness: 0.95,
      flatShading: true,
    });
    const westCrag = new THREE.Mesh(cragGeo, cragMat);
    westCrag.position.set(-7.2, 2.2, 0.8);
    westCrag.castShadow = true;
    westCrag.receiveShadow = true;
    proceduralGroup.add(westCrag);

    // Fractured granite bedrock outcrops emerging directly into the White & Red Palace foundations
    const bedrockOutcrops: [number, number, number, number, number, number][] = [
      [-3.1, 2.35, 1.85, 1.25, 0.95, 0.85],
      [2.65, 2.25, 1.95, 1.15, 0.9, 0.85],
      [-5.6, 2.55, 1.45, 1.1, 1.05, 0.8],
      [6.35, 1.95, 2.25, 1.2, 0.85, 0.85],
      [1.85, 5.15, -1.25, 1.05, 1.2, 0.9], // Summit crag around Chögyal Drupuk cave
    ];
    bedrockOutcrops.forEach(([rx, ry, rz, sx, sy, sz], idx) => {
      const rockGeo = new THREE.IcosahedronGeometry(1.0, 1);
      rockGeo.scale(sx, sy, sz);
      roughenRock(rockGeo, 0.2);
      const rockMesh = new THREE.Mesh(rockGeo, cragMat);
      rockMesh.position.set(rx, ry, rz);
      rockMesh.rotation.set(idx * 0.4, idx * 0.7, idx * 0.25);
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;
      proceduralGroup.add(rockMesh);
    });

    /* ──────────────────────────────────────────────────────────────────
       B. THE RED PALACE (ཕོ་བྲང་དམར་པོ། · pho-brang dmar-po - Center Summit)
       3-Tier Stepped Puntsok Kodpa (ཕུན་ཚོགས་བཀོད་པ།) Sanctuary Core in Bordó Lama
       ────────────────────────────────────────────────────────────────── */
    // 1. Tier 1: Main Central Bordó Lama Mass (85m × 70m scaled at 1u = 20m)
    const redPalaceMain = createBatteredPalaceBlock({
      w: 4.35,
      h: 3.15,
      d: 2.8,
      taper: 0.89,
      wallColor: "#560d1e",
      friezeColor: "#2d050e",
      cols: 7,
      rows: 4,
      roofTrimColor: "#2d050e",
    });
    redPalaceMain.position.set(-0.2, 6.1, -0.2);
    proceduralGroup.add(redPalaceMain);

    // 2. Four Prominent Dark Timber/Bordó Vertical Bay Window Columns on Red Palace Front
    const darkTimberBayMat = new THREE.MeshStandardMaterial({
      color: "#28050d",
      roughness: 0.78,
      metalness: 0.08,
    });
    [-1.15, -0.38, 0.38, 1.15].forEach((bx) => {
      const bayGeo = new THREE.BoxGeometry(0.34, 2.72, 0.22);
      const bay = new THREE.Mesh(bayGeo, darkTimberBayMat);
      // Wall face now flares outward at the base (z≈1.37 bottom → 1.2 top): sit the bays on the
      // slanted face and lean them back with the batter so they never sink into the wall.
      bay.position.set(-0.2 + bx, 6.2, 1.31);
      bay.rotation.x = -0.054;
      bay.castShadow = true;
      proceduralGroup.add(bay);
    });

    // Black Yak-Hair Portal Curtains with White Trim (སྣམ་བུ། · snam-bu) on Red Palace Portals
    const snambuBlackMat = new THREE.MeshStandardMaterial({
      color: "#141215",
      roughness: 0.88,
    });
    const snambuWhiteTrimMat = new THREE.MeshStandardMaterial({
      color: "#f8fafc",
      roughness: 0.7,
    });
    [-0.76, 0, 0.76].forEach((px) => {
      const curtain = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.46, 0.04),
        snambuBlackMat
      );
      curtain.position.set(-0.2 + px, 5.15, 1.38);
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(0.33, 0.05, 0.045),
        snambuWhiteTrimMat
      );
      trim.position.set(-0.2 + px, 5.32, 1.385);
      proceduralGroup.add(curtain, trim);
    });

    // 3. Tier 2: Recessed Middle Puntsok Kodpa Clerestory Gallery
    const redPalaceMidTier = createBatteredPalaceBlock({
      w: 3.85,
      h: 0.95,
      d: 2.35,
      taper: 0.92,
      wallColor: "#4c0a1a",
      friezeColor: "#28040c",
      cols: 6,
      rows: 1,
      roofTrimColor: "#28040c",
    });
    redPalaceMidTier.position.set(-0.2, 7.85, -0.22);
    proceduralGroup.add(redPalaceMidTier);

    // 4. Tier 3: Upper Red Palace Summit Sanctuary Tier
    const redPalaceUpper = createBatteredPalaceBlock({
      w: 3.35,
      h: 1.15,
      d: 2.0,
      taper: 0.93,
      wallColor: "#420816",
      friezeColor: "#24030a",
      cols: 5,
      rows: 2,
      roofTrimColor: "#24030a",
    });
    redPalaceUpper.position.set(-0.2, 8.55, -0.25);
    proceduralGroup.add(redPalaceUpper);

    // 5. Flanking Bordó Lama & Imperial Sacred Chapels (West & East of Red Palace)
    const westOchreWing = createBatteredPalaceBlock({
      w: 1.35,
      h: 2.2,
      d: 2.1,
      taper: 0.9,
      wallColor: "#520c1c",
      friezeColor: "#2d050e",
      cols: 3,
      rows: 3,
    });
    westOchreWing.position.set(-2.65, 6.0, -0.1);
    proceduralGroup.add(westOchreWing);

    const eastOchreWing = createBatteredPalaceBlock({
      w: 1.45,
      h: 1.85,
      d: 1.95,
      taper: 0.9,
      wallColor: "#4c0a1a",
      friezeColor: "#2d050e",
      cols: 3,
      rows: 2,
    });
    eastOchreWing.position.set(2.3, 6.2, -0.05);
    proceduralGroup.add(eastOchreWing);

    // 6. Nyi-'od (ཉི་འོད། · Sunshine Apartment — #15 in Axonometric Map) atop East Inner White Wing
    const nyiodSunshineApt = createBatteredPalaceBlock({
      w: 1.75,
      h: 0.88,
      d: 1.45,
      taper: 0.94,
      wallColor: "#c9a03a",
      friezeColor: "#380714",
      cols: 4,
      rows: 1,
    });
    nyiodSunshineApt.position.set(3.35, 7.82, -0.2);
    proceduralGroup.add(nyiodSunshineApt);

    // 7. Central Tshoms-chen Skylight Light-Well Courtyard on Red Palace Roof (visible in satellite orthophoto)
    const skylightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.16, 0.85),
      new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.65 })
    );
    skylightFrame.position.set(-0.2, 9.15, -0.45);
    const skylightVoid = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.18, 0.62),
      new THREE.MeshStandardMaterial({ color: "#1c1917", roughness: 0.9 })
    );
    skylightVoid.position.set(-0.2, 9.16, -0.45);
    proceduralGroup.add(skylightFrame, skylightVoid);

    // 8. North Rear Spur (བྱང་ངོས། · byang-ngos) & Circular Rear Turnaround Plaza (from satellite orthophoto)
    const northRearSpur = createBatteredPalaceBlock({
      w: 1.65,
      h: 2.25,
      d: 1.85,
      taper: 0.88,
      wallColor: "#520c1c",
      friezeColor: "#2d050e",
      cols: 3,
      rows: 3,
    });
    northRearSpur.position.set(-0.35, 5.5, -2.25);
    proceduralGroup.add(northRearSpur);

    const northGateHouse = createBatteredPalaceBlock({
      w: 1.25,
      h: 1.45,
      d: 1.25,
      taper: 0.9,
      wallColor: "#faf8f5",
      friezeColor: "#4a0a18",
      cols: 2,
      rows: 2,
    });
    northGateHouse.position.set(-0.4, 4.75, -3.55);
    proceduralGroup.add(northGateHouse);

    // Circular paved northern turnaround plaza at top of the rear access roads
    const northPlaza = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 1.05, 0.25, 24),
      new THREE.MeshStandardMaterial({ color: "#d6d3d1", roughness: 0.72 })
    );
    northPlaza.position.set(-0.45, 4.25, -4.45);
    northPlaza.receiveShadow = true;
    proceduralGroup.add(northPlaza);

    // Register Red Palace outer facade objects for Cross-Section X-Ray cutaway mode
    const redCutawayList: THREE.Object3D[] = [
      redPalaceMain,
      redPalaceMidTier,
      redPalaceUpper,
    ];

    /* ──────────────────────────────────────────────────────────────────
       B2. RED PALACE INTERIOR SANCTUARY (Cross-Section Mode · 实测图62 红宫纵剖面)
           Houses the 3-story Golden Serdong Stupas of the 5th & 13th Dalai Lamas,
           smaller lineage stupas, and the 44-columned Sishi Phuntsok Great Assembly Hall
       ────────────────────────────────────────────────────────────────── */
    const redInteriorGroup = new THREE.Group();
    redInteriorGroup.position.set(-0.2, 4.55, -0.2);
    redInteriorGroup.visible = false;
    proceduralGroup.add(redInteriorGroup);
    redPalaceInteriorGroupRef.current = redInteriorGroup;

    // 1. Three internal floor slabs & gallery balconies matching the cross-section drawing
    const slabMat = new THREE.MeshStandardMaterial({
      color: "#d6ccc2",
      roughness: 0.65,
    });
    const beamMat = new THREE.MeshStandardMaterial({
      color: "#380714",
      roughness: 0.55,
    });
    [0.05, 1.05, 2.05, 3.05].forEach((sy, sIdx) => {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(4.1, 0.08, 2.1),
        sIdx === 0 ? slabMat : beamMat
      );
      slab.position.set(0, sy, 0);
      redInteriorGroup.add(slab);
    });

    // 2. Great Fifth Dalai Lama Golden Serdong Stupa (འཛམ་གླིང་རྒྱན་གཅིག · 14.85m, 3 stories tall)
    const fifthDalaiSerdong = createGoldenSerdongStupa(3.45, 1.15);
    fifthDalaiSerdong.position.set(-0.35, 0.08, -0.05);
    redInteriorGroup.add(fifthDalaiSerdong);

    // 3. Thirteenth Dalai Lama Golden Serdong Stupa (ཐུབ་བསྟན་རྒྱ་མཚོ། · 14m, far-left in cross-section)
    const thirteenthDalaiSerdong = createGoldenSerdongStupa(3.25, 1.02);
    thirteenthDalaiSerdong.position.set(-1.55, 0.08, -0.05);
    redInteriorGroup.add(thirteenthDalaiSerdong);

    // 4. Lineage Serdong Stupas of the 7th, 8th & 9th Dalai Lamas (East & North chapels)
    const seventhDalaiSerdong = createGoldenSerdongStupa(1.85, 0.68);
    seventhDalaiSerdong.position.set(1.35, 1.08, -0.05);
    const eighthDalaiSerdong = createGoldenSerdongStupa(1.45, 0.55);
    eighthDalaiSerdong.position.set(0.45, 2.08, -0.45);
    redInteriorGroup.add(seventhDalaiSerdong, eighthDalaiSerdong);

    // 5. Sishi Phuntsok (སྲིད་ཞི་ཕུན་ཚོགས།) Great Western Assembly Hall Hypostyle Columns + Gzhu-ma Capitals
    const hallColMat = new THREE.MeshStandardMaterial({
      color: "#7f1d1d",
      roughness: 0.45,
    });
    const capitalGoldMat = new THREE.MeshStandardMaterial({
      color: "#facc15",
      roughness: 0.25,
      metalness: 0.88,
    });
    for (let cx = 0; cx < 4; cx++) {
      for (let cz = -1; cz <= 1; cz++) {
        const colX = 0.25 + cx * 0.42;
        const colZ = cz * 0.55;
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.042, 0.05, 1.95, 10),
          hallColMat
        );
        col.position.set(colX, 1.05, colZ);
        const gzhumaCap = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.065, 0.08),
          capitalGoldMat
        );
        gzhumaCap.position.set(colX, 1.96, colZ);
        redInteriorGroup.add(col, gzhumaCap);
      }
    }

    /* ──────────────────────────────────────────────────────────────────
       C. THE SEVEN GOLDEN ROOFS (གསེར་ཐོག་བདུན། · 7 Gilded Bronze Gyaphib Roofs)
       Crowning the funerary stupas (Serdong) with Clerestory Lanterns per cross-section
       ────────────────────────────────────────────────────────────────── */
    // 1. Central Great Fifth Dalai Lama Stupa Roof (Double-eave canopy + tall central spire)
    const centerGoldRoof = createGildedTibetanRoof(1.75, 1.15, 0.85, {
      lanternH: 0.38,
      doubleEave: true,
      finials: 1,
      tallSpire: true,
    });
    centerGoldRoof.position.set(-0.2, 8.95, -0.25);
    proceduralGroup.add(centerGoldRoof);

    // 2. West Thirteenth Dalai Lama Stupa Roof (Wide hipped gallery + 3 Gser-tog finials)
    const westGoldRoof = createGildedTibetanRoof(1.28, 0.96, 0.68, {
      lanternH: 0.34,
      finials: 3,
    });
    westGoldRoof.position.set(-1.55, 8.85, -0.25);
    proceduralGroup.add(westGoldRoof);

    // 3. East Seventh Dalai Lama Stupa Roof (3 Gser-tog finials)
    const eastGoldRoof = createGildedTibetanRoof(1.25, 0.95, 0.68, {
      lanternH: 0.32,
      finials: 3,
    });
    eastGoldRoof.position.set(1.15, 8.85, -0.25);
    proceduralGroup.add(eastGoldRoof);

    // 4. North-West Eighth Dalai Lama Stupa Roof (Pyramidal 1-finial canopy per cross-section center)
    const northWestGoldRoof = createGildedTibetanRoof(1.05, 0.82, 0.58, {
      lanternH: 0.28,
      finials: 1,
    });
    northWestGoldRoof.position.set(-0.95, 8.78, -1.05);
    proceduralGroup.add(northWestGoldRoof);

    // 5. North-East Ninth Dalai Lama Stupa Roof (3 Gser-tog finials)
    const northEastGoldRoof = createGildedTibetanRoof(1.05, 0.82, 0.58, {
      lanternH: 0.28,
      finials: 3,
    });
    northEastGoldRoof.position.set(0.55, 8.78, -1.05);
    proceduralGroup.add(northEastGoldRoof);

    // 6. Far-West Chapel Golden Roof
    const farWestGoldRoof = createGildedTibetanRoof(1.15, 0.85, 0.6, {
      lanternH: 0.26,
      finials: 3,
    });
    farWestGoldRoof.position.set(-2.65, 7.12, -0.1);
    proceduralGroup.add(farWestGoldRoof);

    // 7. Far-East Nyi-'od Sunshine Apartment Golden Roof
    const farEastGoldRoof = createGildedTibetanRoof(1.3, 0.9, 0.65, {
      lanternH: 0.26,
      finials: 3,
    });
    farEastGoldRoof.position.set(3.35, 8.26, -0.2);
    proceduralGroup.add(farEastGoldRoof);

    redPalaceCutawayMeshesRef.current = redCutawayList;

    /* ──────────────────────────────────────────────────────────────────
       D. THE WHITE PALACE (ཕོ་བྲང་དཀར་པོ། · pho-brang dkar-po)
          & CEREMONIAL GOS-SKU THANGKA WALL (གོས་སྐུ། · gos-sku, "cloth image")
       ────────────────────────────────────────────────────────────────── */
    // 1. Great Central Alabaster Bastion directly in front of the Red Palace
    const centralWhiteBastion = createBatteredPalaceBlock({
      w: 4.9,
      h: 3.1,
      d: 2.9,
      taper: 0.85,
      wallColor: "#faf8f5",
      friezeColor: "#4a0a18",
      cols: 9,
      rows: 5,
      windowStartRow: 0,
    });
    centralWhiteBastion.position.set(-0.2, 3.6, 0.55);
    proceduralGroup.add(centralWhiteBastion);

    // Monumental Smooth White Gos-sku Wall (གོས་སྐུ། · gos-sku, literally "cloth image")
    // Windowless lower battered facade in front of the Red Palace where giant silk thangkas are unfurled
    const frontApron = createBatteredPalaceBlock({
      w: 4.75,
      h: 2.15,
      d: 1.6,
      taper: 0.84,
      wallColor: "#faf8f5",
      friezeColor: "#4a0a18",
      cols: 8,
      rows: 4,
      windowStartRow: 4, // Smooth windowless Gos-sku thangka display wall
    });
    frontApron.position.set(-0.2, 2.88, 1.48);
    proceduralGroup.add(frontApron);

    // Gilded Bronze Gos-sku Thangka Suspension Mooring Hooks along the top cornice of the Gos-sku Wall
    const hookMat = new THREE.MeshStandardMaterial({
      color: "#facc15",
      roughness: 0.25,
      metalness: 0.9,
    });
    for (let hi = 0; hi < 7; hi++) {
      const hx = -0.2 + (hi - 3) * 0.56;
      const hook = new THREE.Mesh(
        new THREE.TorusGeometry(0.045, 0.014, 8, 12),
        hookMat
      );
      hook.position.set(hx, 3.86, 2.31);
      proceduralGroup.add(hook);
    }

    // 2. Western White Palace Wings & Iconic Cylindrical Drum Tower
    const westUpperWhite = createBatteredPalaceBlock({
      w: 3.6,
      h: 2.6,
      d: 2.5,
      taper: 0.87,
      wallColor: "#f8f6f0",
      friezeColor: "#4a0a18",
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
      friezeColor: "#4a0a18",
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
      color: "#4a0a18",
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
      friezeColor: "#4a0a18",
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
      friezeColor: "#4a0a18",
      cols: 8,
      rows: 3,
    });
    eastMidWhite.position.set(3.85, 4.3, 0.35);
    proceduralGroup.add(eastMidWhite);

    /* ──────────────────────────────────────────────────────────────────
       D2. DEYANGSHAR CEREMONIAL COURTYARD (བདེ་དབྱངས་ཤར། · bde-dbyangs shar)
           Polished Ar-ga Stone Floor, Bordó Lama Gzhu-gdong Galleries,
           Dar-chen Prayer Flagpole, Bsang-khang Burner & Lung-ta Flags
       ────────────────────────────────────────────────────────────────── */
    const deyangsharGroup = new THREE.Group();
    deyangsharGroup.position.set(2.55, 5.56, 1.15);
    proceduralGroup.add(deyangsharGroup);

    // 1. Hand-tamped polished Ar-ga (ཨར་ག) waterproof lime-stone terrace floor (40m × 40m open plaza in satellite view)
    const argaFloor = new THREE.Mesh(
      new THREE.BoxGeometry(2.75, 0.12, 2.15),
      new THREE.MeshStandardMaterial({
        color: "#e7e0d6",
        roughness: 0.48,
        metalness: 0.08,
      })
    );
    argaFloor.receiveShadow = true;
    deyangsharGroup.add(argaFloor);

    // 2. Bordó Lama Pillared Monastic Galleries (གཞུ་གདོང་། · gzhu-gdong) along North & East edges
    const pillarMat = new THREE.MeshStandardMaterial({
      color: "#560d1e",
      roughness: 0.55,
    });
    for (let pi = 0; pi < 5; pi++) {
      const pNorth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.04, 0.48, 8),
        pillarMat
      );
      pNorth.position.set(-0.85 + pi * 0.42, 0.28, -0.72);
      deyangsharGroup.add(pNorth);
    }

    // 3. Central Ceremonial Prayer Flagpole (དར་ཆེན། · dar-chen)
    const darchenPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.045, 1.85, 10),
      new THREE.MeshStandardMaterial({
        color: "#facc15",
        roughness: 0.35,
        metalness: 0.75,
      })
    );
    darchenPole.position.set(0, 0.95, 0.1);
    darchenPole.castShadow = true;
    deyangsharGroup.add(darchenPole);

    const darchenFinial = new THREE.Mesh(
      new THREE.ConeGeometry(0.065, 0.18, 10),
      hookMat
    );
    darchenFinial.position.set(0, 1.92, 0.1);
    deyangsharGroup.add(darchenFinial);

    // 4. Whitewashed Ritual Incense Burner (བསང་ཁང་། · bsang-khang) on Deyangshar terrace
    const bsangKhang = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.15, 0.32, 12),
      new THREE.MeshStandardMaterial({ color: "#faf8f5", roughness: 0.7 })
    );
    bsangKhang.position.set(-0.55, 0.2, 0.35);
    const bsangEmber = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 8, 8),
      new THREE.MeshBasicMaterial({ color: "#fde68a" })
    );
    bsangEmber.position.set(-0.55, 0.36, 0.35);
    deyangsharGroup.add(bsangKhang, bsangEmber);

    // 5. Three Catenary Strings of 5-Color Lung-ta Prayer Flags (རླུང་རྟ། · rlung-rta)
    const lungtaGroup = new THREE.Group();
    lungtaGroup.name = "lungtaFlags";
    lungtaGroup.add(
      createLungtaPrayerFlagString([0, 1.78, 0.1], [-1.1, 0.95, -0.65], 9, 0.18),
      createLungtaPrayerFlagString([0, 1.78, 0.1], [1.05, 0.95, -0.65], 9, 0.18),
      createLungtaPrayerFlagString([0, 1.78, 0.1], [0.95, 0.72, 0.68], 8, 0.16)
    );
    deyangsharGroup.add(lungtaGroup);

    // 6. Eastern Rounded Defensive Bastion (ཤར་རྒྱལ་མཁར། · shar-rgyal-mkhar — Point 6 in Plan & #16 in Map)
    const eastRoundBastion = new THREE.Group();
    const eastDrumBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.94, 2.25, 24),
      drumMat
    );
    eastDrumBody.castShadow = true;
    eastDrumBody.receiveShadow = true;
    const eastDrumCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.86, 0.84, 0.3, 24),
      drumCrimsonMat
    );
    eastDrumCap.position.y = 1.15;
    eastRoundBastion.add(eastDrumBody, eastDrumCap);
    eastRoundBastion.position.set(5.65, 4.35, 0.95);
    proceduralGroup.add(eastRoundBastion);

    // Eastern Protruding Watchtower Bastion (Mid-Right Slope)
    const eastBastionTower = createBatteredPalaceBlock({
      w: 1.75,
      h: 2.6,
      d: 1.85,
      taper: 0.84,
      wallColor: "#faf8f5",
      friezeColor: "#4a0a18",
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
      friezeColor: "#4a0a18",
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
      createStaircaseSegment([-2.4, 3.2, 2.22], [-0.4, 3.92, 2.28], 0.45, 0.6)
    );
    // 4. Western Ridge Staircase (Left side of Marpo Ri)
    stairsGroup.add(
      createStaircaseSegment([-7.5, 0.95, 3.9], [-4.8, 2.75, 2.25], 0.48, 0.62)
    );
    // 5. Far-Eastern Descent Wall
    stairsGroup.add(
      createStaircaseSegment([5.6, 2.2, 2.5], [7.9, 1.35, 3.5], 0.44, 0.55)
    );

    // 6. Main central zigzag stairway (gzim-chung lam) seated on the south face of Marpo Ri:
    //    4 switchbacks from the Shol foothills up to the foot of the Gos-sku wall.
    const mainStairsBaseZ = 5.25;
    const mainStairsTopZ = 2.75;
    const mainStairsBaseY = marpoSurfaceY(-0.3, mainStairsBaseZ) + 0.12;
    const mainStairsTopY = marpoSurfaceY(-0.3, mainStairsTopZ) + 0.12;
    const mainStairs = createZigzagStairs(
      1.6,
      mainStairsTopY - mainStairsBaseY,
      mainStairsBaseZ - mainStairsTopZ,
      4
    );
    mainStairs.position.set(-1.1, mainStairsBaseY, mainStairsBaseZ);
    stairsGroup.add(mainStairs);

    /* ──────────────────────────────────────────────────────────────────
       F. SHOL WALLED VILLAGE & PERIMETER GATES (ཞོལ་གྲོང་། · Base of Palace)
          Enriched from the Sketchfab photogrammetry model (Hong Nguyen):
          turreted enclosure with 3 gateways, cloister courtyards, Zhol Par-khang,
          processional avenue and the stepped stone terrace below the Gos-sku wall.
       ────────────────────────────────────────────────────────────────── */
    const sholGroup = new THREE.Group();
    proceduralGroup.add(sholGroup);

    const SHOL_GROUND = 0.525; // top of the extended stone platform
    const SHOL_FRONT_Z = 8.9; // southern enclosure wall (lcags-ri)
    const SHOL_SIDE_X = 9.2; // east & west enclosure walls
    const SHOL_BACK_Z = 4.4; // where the side walls meet the Marpo Ri foothills

    // 1. Turreted Enclosure Walls (ཞོལ་གྱི་ལྕགས་རི། · zhol-gyi lcags-ri), white with Bordó coping
    sholGroup.add(
      // South wall, split around the central main gate
      createStaircaseSegment([-SHOL_SIDE_X, 0.85, SHOL_FRONT_Z], [-1.15, 0.85, SHOL_FRONT_Z], 0.42, 0.75),
      createStaircaseSegment([0.55, 0.85, SHOL_FRONT_Z], [SHOL_SIDE_X, 0.85, SHOL_FRONT_Z], 0.42, 0.75),
      // West & east side walls running north to the foothills
      createStaircaseSegment([-SHOL_SIDE_X, 0.85, SHOL_FRONT_Z], [-SHOL_SIDE_X, 0.85, SHOL_BACK_Z], 0.42, 0.75),
      createStaircaseSegment([SHOL_SIDE_X, 0.85, SHOL_FRONT_Z], [SHOL_SIDE_X, 0.85, SHOL_BACK_Z], 0.42, 0.75),
      // Sawtooth links climbing to the western ridge & far-eastern descent walls → one continuous
      // defensive circuit from Shol up to the palace (as in the Sketchfab model)
      createStaircaseSegment([-SHOL_SIDE_X, 0.85, SHOL_BACK_Z], [-7.5, 0.95, 3.9], 0.42, 0.7),
      createStaircaseSegment([SHOL_SIDE_X, 0.85, SHOL_BACK_Z], [7.9, 1.35, 3.5], 0.42, 0.7),
      // Northern Pentagonal Outer Perimeter Wall (closing the back of Marpo Ri per satellite orthophoto)
      createStaircaseSegment([-SHOL_SIDE_X, 0.85, SHOL_BACK_Z], [-7.8, 0.85, -1.6], 0.4, 0.72),
      createStaircaseSegment([-7.8, 0.85, -1.6], [-0.4, 0.85, -6.3], 0.4, 0.72),
      createStaircaseSegment([-0.4, 0.85, -6.3], [7.6, 0.85, -1.6], 0.4, 0.72),
      createStaircaseSegment([7.6, 0.85, -1.6], [SHOL_SIDE_X, 0.85, SHOL_BACK_Z], 0.4, 0.72),
      // North-West Sweeping Rear Approach Road (from circular turnaround down NW flank)
      createStaircaseSegment([-0.45, 4.15, -4.45], [-4.6, 2.45, -2.5], 0.46, 0.45),
      createStaircaseSegment([-4.6, 2.45, -2.5], [-8.2, 0.95, 1.4], 0.46, 0.45),
      // North-East Double Zigzag Rear Ramp (from circular turnaround down NE flank)
      createStaircaseSegment([-0.2, 4.15, -4.45], [3.6, 2.65, -3.1], 0.42, 0.5),
      createStaircaseSegment([3.6, 2.65, -3.1], [6.8, 1.35, -1.6], 0.42, 0.5)
    );

    // Corner watchtowers (ཟུར་མཁར། · zur-mkhar) at the two southern corners
    [-SHOL_SIDE_X, SHOL_SIDE_X].forEach((cx) => {
      const tower = createSholBlock({ w: 0.85, h: 1.45, d: 0.85, cols: 1, rows: 2, taper: 0.88 });
      tower.position.set(cx, SHOL_GROUND + 0.725, SHOL_FRONT_Z);
      sholGroup.add(tower);
    });

    // 2. Three Shol Gateways (ཞོལ་གྱི་རྒྱལ་སྒོ་གསུམ། · zhol-gyi rgyal-sgo gsum)
    const gateOpeningMat = getSholMaterial("gate-opening", () =>
      new THREE.MeshStandardMaterial({ color: "#141215", roughness: 0.9 })
    );
    const gateTrimMat = getSholMaterial("gate-trim", () =>
      new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.7 })
    );
    const addGate = (gx: number, gw: number, gh: number, withRoof: boolean) => {
      const gate = createSholBlock({ w: gw, h: gh, d: 0.8, cols: 2, rows: 1, taper: 0.97 });
      gate.position.set(gx, SHOL_GROUND + gh / 2, SHOL_FRONT_Z);
      sholGroup.add(gate);
      // Dark portal with black yak-hair snam-bu curtain and white border
      const portalH = gh * 0.55;
      const portal = new THREE.Mesh(new THREE.BoxGeometry(gw * 0.36, portalH, 0.05), gateOpeningMat);
      portal.position.set(gx, SHOL_GROUND + portalH / 2, SHOL_FRONT_Z + 0.425);
      const trim = new THREE.Mesh(new THREE.BoxGeometry(gw * 0.4, 0.05, 0.06), gateTrimMat);
      trim.position.set(gx, SHOL_GROUND + portalH, SHOL_FRONT_Z + 0.43);
      sholGroup.add(portal, trim);
      if (withRoof) {
        const gateRoof = createGildedTibetanRoof(gw * 0.62, 0.62, 0.34, { lanternH: 0, finials: 1 });
        gateRoof.position.set(gx, SHOL_GROUND + gh + 0.06, SHOL_FRONT_Z);
        sholGroup.add(gateRoof);
      }
    };
    addGate(-0.3, 1.7, 1.45, true); // Main South Gate (ཞོལ་སྒོ་ཆེན། · zhol sgo-chen)
    addGate(-5.6, 1.1, 1.15, false); // West Gate (ནུབ་སྒོ། · nub-sgo)
    addGate(5.0, 1.1, 1.15, false); // East Gate (ཤར་སྒོ། · shar-sgo)

    // 3. Processional Stone Avenue (ལམ་ཆེན། · lam-chen) from the main gate to the zigzag stairway
    const avenueMat = getSholMaterial("avenue", () =>
      new THREE.MeshStandardMaterial({ color: "#e7e0d6", roughness: 0.6 })
    );
    const avenue = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.03, 3.25), avenueMat);
    avenue.position.set(-0.3, SHOL_GROUND + 0.015, 7.05);
    avenue.receiveShadow = true;
    sholGroup.add(avenue);

    // 4. Cloister Courtyard Compounds (ཞོལ་གྱི་རྭ་བ། · zhol-gyi ra-ba)
    //    West: closed "□" cloister · East: "U" cloister opening north towards the palace
    const westCloister = createSholCloister({ w: 3.2, d: 2.0, wingD: 0.5, h: 0.9, openSide: "none" });
    westCloister.position.set(-5.4, SHOL_GROUND, 7.3);
    sholGroup.add(westCloister);

    const eastCloister = createSholCloister({ w: 3.4, d: 2.0, wingD: 0.5, h: 0.95, openSide: "north" });
    eastCloister.position.set(4.6, SHOL_GROUND, 7.3);
    sholGroup.add(eastCloister);

    // Additional Inner Cloister Compound (East-Center of Shol, matching satellite grid)
    const eastInnerCloister = createSholCloister({ w: 2.3, d: 1.5, wingD: 0.42, h: 0.85, openSide: "none" });
    eastInnerCloister.position.set(2.8, SHOL_GROUND, 5.85);
    sholGroup.add(eastInnerCloister);

    // Interior SW & SE Green Park Lawns inside the Shol Enclosure (per satellite orthophoto)
    const parkLawnMat = getSholMaterial("park-lawn", () =>
      new THREE.MeshStandardMaterial({ color: "#4d7c3a", roughness: 0.95 })
    );
    [
      [-7.65, 7.2, 2.1, 2.5], // SW Shol Park
      [7.45, 7.2, 2.3, 2.5],  // SE Shol Park
    ].forEach(([px, pz, pw, pd]) => {
      const park = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.04, pd), parkLawnMat);
      park.position.set(px, SHOL_GROUND + 0.02, pz);
      park.receiveShadow = true;
      sholGroup.add(park);
    });

    // Twin Symmetrical Ornamental Cloud-Spiral Gardens outside the Southern Shol Wall
    const spiralGoldMat = getSholMaterial("spiral-gold", () =>
      new THREE.MeshStandardMaterial({ color: "#eab308", roughness: 0.7 })
    );
    [-4.8, 4.4].forEach((gx) => {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.03, 0.72), parkLawnMat);
      bed.position.set(gx, SHOL_GROUND + 0.015, 9.42);
      bed.receiveShadow = true;
      const spiral = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.045, 6, 18),
        spiralGoldMat
      );
      spiral.rotation.x = Math.PI / 2;
      spiral.position.set(gx, SHOL_GROUND + 0.04, 9.42);
      sholGroup.add(bed, spiral);
    });

    // 5. Zhol Par-khang (ཞོལ་པར་ཁང་། · zhol par-khang): 3-tier stepped woodblock printing house
    const parkhangTiers: [number, number, number][] = [
      // [w, h, d]
      [2.0, 0.78, 1.4],
      [1.6, 0.62, 1.1],
      [1.1, 0.5, 0.8],
    ];
    let parkhangY = SHOL_GROUND;
    parkhangTiers.forEach(([tw, th, td], ti) => {
      const tier = createSholBlock({ w: tw, h: th, d: td, rows: ti === 0 ? 2 : 1, taper: 0.94 });
      tier.position.set(-2.3, parkhangY + th / 2, 6.95 - ti * 0.1);
      sholGroup.add(tier);
      parkhangY += th + 0.06;
    });
    const parkhangRoof = createGildedTibetanRoof(0.7, 0.5, 0.3, { lanternH: 0.12, finials: 1 });
    parkhangRoof.position.set(-2.3, parkhangY, 6.75);
    sholGroup.add(parkhangRoof);

    // 6. Gos-sku Thangka Storehouse (གོས་སྐུ་མཛོད་ཁང་། · gos-sku mdzod-khang) in Tibetan ochre (ser-po)
    const thangkaStore = createSholBlock({
      w: 1.6,
      h: 1.05,
      d: 1.1,
      wallColor: "#c9a03a",
      friezeColor: "#380714",
      cols: 3,
      rows: 2,
    });
    thangkaStore.position.set(1.65, SHOL_GROUND + 0.525, 6.85);
    sholGroup.add(thangkaStore);

    // 7. Stepped Stone Terrace (རྡོ་སྐས། · rdo-skas) at the foot of the Gos-sku wall, where the
    //    main zigzag stairway lands (grey ashlar steps visible in the Sketchfab model)
    const terraceMats = [
      getSholMaterial("terrace-a", () => new THREE.MeshStandardMaterial({ color: "#a8a29e", roughness: 0.85 })),
      getSholMaterial("terrace-b", () => new THREE.MeshStandardMaterial({ color: "#d6d3d1", roughness: 0.8 })),
    ];
    for (let si = 0; si < 3; si++) {
      const sz = 2.55 + si * 0.24;
      const stepTop = marpoSurfaceY(-0.2, sz) + 0.22 - si * 0.04;
      const step = new THREE.Mesh(new THREE.BoxGeometry(4.5 - si * 0.35, 0.9, 0.26), terraceMats[si % 2]);
      step.position.set(-0.2, stepTop - 0.45, sz);
      step.castShadow = true;
      step.receiveShadow = true;
      sholGroup.add(step);
    }

    // Western Shol Two-Story Courtyard Building (Lower Left)
    const sholWestBuilding = createBatteredPalaceBlock({
      w: 2.7,
      h: 1.55,
      d: 1.6,
      taper: 0.92,
      wallColor: "#faf8f5",
      friezeColor: "#4a0a18",
      cols: 5,
      rows: 2,
    });
    sholWestBuilding.position.set(-5.2, 1.25, 4.9);
    sholGroup.add(sholWestBuilding);

    // Central Shol Parkhang Printing House (Bordó Lama) & White Lower Courtyard Building
    const sholYellowMain = createBatteredPalaceBlock({
      w: 1.95,
      h: 1.2,
      d: 1.3,
      taper: 0.93,
      wallColor: "#560d1e",
      friezeColor: "#2d050e",
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
      wallColor: "#faf8f5",
      friezeColor: "#4a0a18",
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
      friezeColor: "#4a0a18",
      cols: 6,
      rows: 2,
    });
    sholEastBuilding.position.set(4.5, 1.18, 5.1);
    sholGroup.add(sholEastBuilding);

    // Shol Doring (ཞོལ་རྡོ་རིང་། · zhol rdo-ring - Ancient 763 CE Inscribed Stone Pillar)
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

    // Sacred White Chörten Stupas (མཆོད་རྟེན། · mchod-rten) at Western Ridge & Shol Gateways
    const westRidgeChorten = createChortenStupa(1.05);
    westRidgeChorten.position.set(-6.85, 3.35, 1.15);
    proceduralGroup.add(westRidgeChorten);

    const sholWestChorten = createChortenStupa(0.88);
    sholWestChorten.position.set(-7.35, 0.55, 5.25);
    sholGroup.add(sholWestChorten);

    const sholEastChorten = createChortenStupa(0.88);
    sholEastChorten.position.set(7.35, 0.55, 5.25);
    sholGroup.add(sholEastChorten);

    // Instanced Golden Mani Prayer Wheels (མ་ཎི་འཁོར་ལོ། · ma-ṇi 'khor-lo) along the Lingkhor (གླིང་སྐོར།) Path
    const maniCount = 28;
    const maniGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.18, 10);
    const maniMat = new THREE.MeshStandardMaterial({
      color: "#fbbf24",
      emissive: "#78350f",
      emissiveIntensity: 0.2,
      roughness: 0.25,
      metalness: 0.9,
    });
    const instancedManiWheels = new THREE.InstancedMesh(maniGeo, maniMat, maniCount);
    const maniDummy = new THREE.Object3D();
    for (let mi = 0; mi < maniCount; mi++) {
      const mx = -8.2 + (mi / (maniCount - 1)) * 16.4;
      // Lingkhor path runs outside the new southern Shol wall; leave the 3 gateways clear
      const inGate =
        (mx > -1.3 && mx < 0.7) || (mx > -6.3 && mx < -4.9) || (mx > 4.3 && mx < 5.7);
      maniDummy.position.set(mx, inGate ? -50 : 0.62, 9.22);
      maniDummy.scale.setScalar(inGate ? 0 : 1);
      maniDummy.rotation.set(0, mi * 0.4, 0);
      maniDummy.updateMatrix();
      instancedManiWheels.setMatrixAt(mi, maniDummy.matrix);
    }
    instancedManiWheels.instanceMatrix.needsUpdate = true;
    sholGroup.add(instancedManiWheels);

    /* ──────────────────────────────────────────────────────────────────
       G. INSTANCED HIMALAYAN PINE & CYPRESS GROVES (THREE.InstancedMesh)
       Renders all 75 alpine trees in just 2 GPU draw calls (trunks + crowns)
       ────────────────────────────────────────────────────────────────── */
    const foliageGroup = new THREE.Group();
    proceduralGroup.add(foliageGroup);
    islandFoliageGroupRef.current = foliageGroup;

    const treeCount = 75;
    const trunkGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.35, 6);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: "#5c4033",
      roughness: 0.9,
    });
    const instancedTrunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    instancedTrunks.castShadow = true;
    instancedTrunks.receiveShadow = true;

    const crownGeo = new THREE.ConeGeometry(0.28, 0.72, 8);
    const crownMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.82,
      metalness: 0.02,
    });
    const instancedCrowns = new THREE.InstancedMesh(crownGeo, crownMat, treeCount);
    instancedCrowns.castShadow = true;
    instancedCrowns.receiveShadow = true;

    const treePalette = [
      new THREE.Color("#2d5a27"),
      new THREE.Color("#3a6b33"),
      new THREE.Color("#4d7c3f"),
      new THREE.Color("#1e4620"),
    ];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < treeCount; i++) {
      const tx = (Math.random() - 0.5) * 14.5;
      // Keep groves on the flanks/foothills (z ≥ 2.8): the summit plateau belongs to the palace blocks
      const tz = 2.8 + Math.random() * 2.7;
      const ty = Math.max(0.65, marpoSurfaceY(tx, tz) + 0.05);
      const scale = 0.65 + Math.random() * 0.55;

      dummy.position.set(tx, ty + 0.15 * scale, tz);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      instancedTrunks.setMatrixAt(i, dummy.matrix);

      dummy.position.set(tx, ty + 0.48 * scale, tz);
      dummy.scale.set(scale, scale * (0.95 + (i % 3) * 0.15), scale);
      dummy.updateMatrix();
      instancedCrowns.setMatrixAt(i, dummy.matrix);
      instancedCrowns.setColorAt(i, treePalette[i % treePalette.length]);
    }
    instancedTrunks.instanceMatrix.needsUpdate = true;
    instancedCrowns.instanceMatrix.needsUpdate = true;
    if (instancedCrowns.instanceColor) instancedCrowns.instanceColor.needsUpdate = true;

    foliageGroup.add(instancedTrunks, instancedCrowns);

    // Broadleaf Tibetan willows (ལྕང་མ། · lcang-ma) in the Shol courtyards & along the avenue,
    // matching the round tree canopies of the Sketchfab model — 2 extra draw calls total
    const willowSpots: [number, number, number][] = [
      // [x, z, scale]
      [-5.4, 7.3, 1.05],
      [4.6, 7.0, 1.1],
      [-1.15, 8.2, 0.85],
      [0.55, 8.2, 0.85],
      [-1.15, 6.2, 0.8],
      [0.55, 6.2, 0.8],
      [1.65, 8.15, 0.9],
      [-8.1, 7.6, 1.0],
      [7.55, 7.4, 1.0],
      [-3.7, 8.3, 0.8],
      [3.0, 5.95, 0.75],
    ];
    const willowTrunks = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.045, 0.07, 0.42, 6),
      trunkMat,
      willowSpots.length
    );
    const willowCrownGeo = new THREE.IcosahedronGeometry(0.38, 1);
    willowCrownGeo.scale(1, 0.85, 1);
    const willowCrowns = new THREE.InstancedMesh(
      willowCrownGeo,
      new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, flatShading: true }),
      willowSpots.length
    );
    willowCrowns.castShadow = true;
    const willowPalette = [new THREE.Color("#4f7a3a"), new THREE.Color("#5d8a40"), new THREE.Color("#3f6b31")];
    willowSpots.forEach(([wx, wz, ws], wi) => {
      dummy.rotation.set(0, wi * 1.3, 0);
      dummy.scale.setScalar(ws);
      dummy.position.set(wx, 0.525 + 0.21 * ws, wz);
      dummy.updateMatrix();
      willowTrunks.setMatrixAt(wi, dummy.matrix);
      dummy.position.set(wx, 0.525 + 0.62 * ws, wz);
      dummy.updateMatrix();
      willowCrowns.setMatrixAt(wi, dummy.matrix);
      willowCrowns.setColorAt(wi, willowPalette[wi % willowPalette.length]);
    });
    willowTrunks.instanceMatrix.needsUpdate = true;
    willowCrowns.instanceMatrix.needsUpdate = true;
    if (willowCrowns.instanceColor) willowCrowns.instanceColor.needsUpdate = true;
    foliageGroup.add(willowTrunks, willowCrowns);

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

      // Gentle upward drift of golden stardust, Sun/Moon rings & Lung-ta prayer flags
      const t = performance.now() * 0.0025;
      particles.rotation.y += 0.0006;
      const solarRays = sunBody.getObjectByName("solarRays");
      if (solarRays) solarRays.rotation.z += 0.004;
      const lunarStars = moonBody.getObjectByName("lunarStars");
      if (lunarStars) lunarStars.rotation.z -= 0.003;

      // Subtle Himalayan wind ripple on the 5-color Lung-ta prayer flags in Deyangshar
      lungtaGroup.children.forEach((strand) => {
        strand.children.forEach((flagObj) => {
          const phase = flagObj.userData.phase || 0;
          flagObj.rotation.y = Math.sin(t + phase) * 0.22;
          flagObj.rotation.z = Math.cos(t * 0.8 + phase) * 0.08;
        });
      });

      // Pure 60 FPS Native WebGL Render
      renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize Handler (Window + ResizeObserver for Fullscreen transitions)
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
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
      scene.environment = envTextureRef.current;
      scene.fog = new THREE.FogExp2("#bae6fd", 0.0028);
      ambient.color.set("#ffffff");
      ambient.intensity = 1.0;
      sun.color.set("#ffffff");
      sun.intensity = 1.75;
      sun.position.set(14, 22, 16);
      spot.intensity = 0;
      if (incenseLightRef.current) incenseLightRef.current.intensity = 0;
      wallEmissive = 0;
      if (sunBodyRef.current) {
        sunBodyRef.current.visible = true;
        sunBodyRef.current.scale.setScalar(1.15);
      }
      if (moonBodyRef.current) {
        moonBodyRef.current.visible = false;
      }
    } else {
      // Sacred Night Mode (AgX Colorimetry): 3,700m starry Himalayan sky, IBL disabled so gold roofs
      // reflect only moonlight & floodlights, crisp architectural spotlight keeping White Palace white
      scene.background = createLhasaNightSkyTexture();
      scene.environment = null;
      scene.fog = new THREE.FogExp2("#040711", 0.0042);
      ambient.color.set("#1e293b");
      ambient.intensity = 0.55;
      sun.color.set("#bae6fd");
      sun.intensity = 0.85;
      sun.position.set(-10, 18, -10);
      spot.color.set("#fff7ed");
      spot.intensity = 2.4;
      if (incenseLightRef.current) incenseLightRef.current.intensity = 0.35;
      wallEmissive = 1.15;
      if (sunBodyRef.current) {
        sunBodyRef.current.visible = false;
      }
      if (moonBodyRef.current) {
        moonBodyRef.current.visible = true;
        moonBodyRef.current.scale.setScalar(1.2);
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
      hillMat.vertexColors = false;
      hillMat.color.set("#f5f5f4");
      hillMat.needsUpdate = true;
      foliage.visible = false;
    } else {
      // Marpo Ri granite massif with per-vertex rock / alpine-scrub colours
      hillMat.vertexColors = true;
      hillMat.color.set("#ffffff");
      hillMat.needsUpdate = true;
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
     Toggle Red Palace Longitudinal Cross-Section Mode (实测图62 红宫纵剖面)
     Makes the Red Palace outer facade translucent to reveal the 3-story
     Golden Serdong Stupas and the 44-column Sishi Phuntsok Assembly Hall
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const interior = redPalaceInteriorGroupRef.current;
    const cutawayList = redPalaceCutawayMeshesRef.current;
    if (!interior || !cutawayList.length) return;

    interior.visible = crossSection;
    cutawayList.forEach((groupObj) => {
      groupObj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const std = m as THREE.MeshStandardMaterial;
            if (std) {
              std.transparent = crossSection;
              std.opacity = crossSection ? 0.18 : 1.0;
              std.depthWrite = !crossSection;
              std.needsUpdate = true;
            }
          });
        }
      });
    });

    if (crossSection) {
      cameraTargetGoalRef.current = {
        pos: new THREE.Vector3(0.2, 8.2, 8.8),
        look: new THREE.Vector3(-0.3, 6.4, -0.2),
        active: true,
      };
    }
  }, [crossSection]);

  /* ══════════════════════════════════════════════════════════════════════
     Fullscreen Mode (Native Browser Fullscreen API + CSS Fixed Fallback)
     ══════════════════════════════════════════════════════════════════════ */
  const toggleFullscreen = useCallback(async () => {
    const el = viewportContainerRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
          setIsFullscreen(true);
        } else {
          setIsFullscreen((prev) => !prev);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          setIsFullscreen(false);
        }
      }
    } catch {
      // Fallback to CSS fixed fullscreen if Fullscreen API is blocked
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

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
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const std = m as THREE.MeshStandardMaterial;
              if (std && "envMapIntensity" in std) {
                std.envMapIntensity = 1.35;
                std.needsUpdate = true;
              }
            });
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
            LHASA · 400M × 350M · 117M (13 STORIES) · AGX + PBR + 60 FPS
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

          {/* Red Palace Cross-Section X-Ray Toggle (Reveals 3-Story Golden Serdong Stupas) */}
          <button
            type="button"
            onClick={() => {
              setCrossSection((prev) => !prev);
              playResonance(963);
            }}
            className={`px-2.5 py-1.5 rounded-sm border font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              crossSection
                ? "bg-amber-400 text-black border-amber-300 shadow-sm"
                : "bg-white/10 hover:bg-white/20 border-tibet-gold/40 text-tibet-gold-light"
            }`}
            title="Toggle architectural cross-section of the Red Palace to inspect the 3-story Golden Serdong Stupas inside"
          >
            <span>🏛️</span>
            <span>
              {crossSection
                ? lang === "bo"
                  ? "ནང་ངོས་གསེར་གདུང་། (On)"
                  : "Serdong Cutaway: ON"
                : lang === "bo"
                ? "གསེར་གདུང་ནང་མཐོང་།"
                : "Cross-Section"}
            </span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`px-2.5 py-1.5 rounded-sm border font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isFullscreen
                ? "bg-tibet-gold text-black border-tibet-gold shadow-sm"
                : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            }`}
            title="Toggle Fullscreen 3D View (Esc to exit)"
          >
            <span>{isFullscreen ? "🗗" : "⛶"}</span>
            <span>
              {isFullscreen
                ? lang === "bo"
                  ? "ཆུང་ངུར་བསྒྱུར།"
                  : "Exit Fullscreen"
                : lang === "bo"
                ? "ཡོལ་ངོས་ཆ་ཚང་།"
                : "Fullscreen"}
            </span>
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
        {/* LEFT 8 COLS: Interactive WebGL 3D Potala Canvas (Clean Unobstructed 3D View) */}
        <div
          ref={viewportContainerRef}
          className={
            isFullscreen
              ? "fixed inset-0 z-50 w-screen h-screen bg-[#0c0a09] overflow-hidden"
              : "lg:col-span-8 relative w-full min-h-[500px] sm:min-h-[600px] rounded-sm border border-sakya-gold/40 bg-[#0c0a09] overflow-hidden shadow-2xl"
          }
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
          <div
            ref={mountRef}
            className={`w-full h-full cursor-grab active:cursor-grabbing ${
              isFullscreen ? "min-h-screen" : "min-h-[500px] sm:min-h-[600px]"
            }`}
          />

          {/* Top-Right Fullscreen Quick Controls Overlay */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-xs border border-white/15">
            {isFullscreen && (
              <>
                <button
                  type="button"
                  onClick={() => setAtmosphere((a) => (a === "sunlight" ? "night" : "sunlight"))}
                  className="px-2 py-1 rounded-xs bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] cursor-pointer"
                  title="Switch Day / Night Atmosphere"
                >
                  {atmosphere === "sunlight" ? "☀️ Sun" : "🌙 Night"}
                </button>
                <button
                  type="button"
                  onClick={() => setCrossSection((c) => !c)}
                  className={`px-2 py-1 rounded-xs font-mono text-[11px] cursor-pointer ${
                    crossSection
                      ? "bg-amber-400 text-black font-bold"
                      : "bg-white/10 hover:bg-white/20 text-tibet-gold-light"
                  }`}
                  title="Toggle Red Palace Cross-Section"
                >
                  🏛️ {lang === "bo" ? "གསེར་གདུང་།" : "Cutaway"}
                </button>
                <button
                  type="button"
                  onClick={() => setAutoRotate((r) => !r)}
                  className="px-2 py-1 rounded-xs bg-white/10 hover:bg-white/20 text-white/80 font-mono text-[11px] cursor-pointer"
                >
                  {autoRotate ? "↻ 360°" : "⏸ 360°"}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`px-2.5 py-1 rounded-xs font-mono text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                isFullscreen
                  ? "bg-tibet-gold text-black hover:bg-amber-400"
                  : "bg-white/10 hover:bg-tibet-gold hover:text-black text-white"
              }`}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
            >
              <span>{isFullscreen ? "🗗" : "⛶"}</span>
              <span>
                {isFullscreen
                  ? lang === "bo"
                    ? "ཕྱིར་འཐོན། (Esc)"
                    : "Exit (Esc)"
                  : lang === "bo"
                  ? "ཡོལ་ངོས་ཆ་ཚང་།"
                  : "Fullscreen"}
              </span>
            </button>
          </div>

          {/* Top-Left Minimal HUD Overlay */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xs border border-white/10">
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
                ? "ཙིག་རྟགས་ཀྱིས་༣༦༠° བསྐོར་བ་དང་ཆེ་ཆུང་སྒྱུར་ཐུབ། འོག་གི་ ༠༡–༠༧ མནན་ན་དེར་འཁྲིད་ཐུབ།"
                : "Drag to orbit 360° · Scroll to zoom · Click 01–07 below to inspect"}
            </span>
          </div>

          {/* Bottom Hotspot Quick-Select Ribbon inside Canvas (Navigates directly to each palace wing) */}
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
                    {lang === "bo" ? hs.nameBo.split("(")[0].trim() : hs.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
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

