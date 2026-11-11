"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Language,
  CulturalLandmark,
  VILLAGE_LANDMARKS,
  VILLAGE_ITEMS,
  InventoryItem,
} from "@/data/tibetanVillageData";

interface TibetanGameboyVillageProps {
  lang: Language;
  onOpenFullStory?: (landmark: CulturalLandmark) => void;
}

export function TibetanGameboyVillage({
  lang,
  onOpenFullStory,
}: TibetanGameboyVillageProps) {
  // Player state on isometric village map (0 to 100 percentage coordinates)
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 64 });
  const [playerFacing, setPlayerFacing] = useState<"down" | "up" | "left" | "right">("down");
  const [isWalking, setIsWalking] = useState(false);
  const [walkStep, setWalkStep] = useState(0);

  // Proximity & Dialogue state
  const [nearbyLandmark, setNearbyLandmark] = useState<CulturalLandmark | null>(null);
  const [nearbyYak, setNearbyYak] = useState(false);
  const [nearbyManiWheel, setNearbyManiWheel] = useState(false);
  const [isManiSpinning, setIsManiSpinning] = useState(false);

  // Active Dialogue Box
  const [activeDialogue, setActiveDialogue] = useState<{
    titleBo: string;
    titleEn: string;
    categoryBo: string;
    categoryEn: string;
    dialogueBo: string;
    dialogueEn: string;
    landmark?: CulturalLandmark;
    isYak?: boolean;
    isMani?: boolean;
  } | null>(null);

  // Bag / Inventory
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem>(VILLAGE_ITEMS[0]);

  // Environment & Settings
  const [timeOfDay, setTimeOfDay] = useState<"golden" | "night">("golden");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBezelMode, setIsBezelMode] = useState(false); // Classic Handheld Console Bezel vs Wide View
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Key tracking & Game Loop
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  const targetWalkPos = useRef<{ x: number; y: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const dpadTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* ══════════════════════════════════════════════════════════════════
     Web Audio Synthesizer: 8-Bit Game Boy FX + Folk Instruments
     ══════════════════════════════════════════════════════════════════ */
  const initAudio = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  const play8BitChirp = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = initAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled, initAudio]);

  const play8BitSelect = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = initAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.06);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled, initAudio]);

  const playYakSound = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = initAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(105, now + 0.6);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled, initAudio]);

  const playManiBell = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = initAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1200, now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2410, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.9);
      osc2.stop(now + 1.9);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled, initAudio]);

  const playLandmarkAcoustic = useCallback(
    (landmark: CulturalLandmark) => {
      if (!soundEnabled) return;
      const ctx = initAudio();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const freq = landmark.freq;

        if (landmark.soundType === "lute") {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sawtooth";
          osc1.frequency.setValueAtTime(freq, now);
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(freq * 2, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 1.7);
          osc2.stop(now + 1.7);
        } else if (landmark.soundType === "wind") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.linearRampToValueAtTime(freq * 1.08, now + 0.8);
          osc.frequency.linearRampToValueAtTime(freq, now + 2.2);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 3.3);
        } else {
          // Singing bowl
          const oscFund = ctx.createOscillator();
          const oscOvertone = ctx.createOscillator();
          const gain = ctx.createGain();

          oscFund.type = "sine";
          oscFund.frequency.setValueAtTime(freq, now);
          oscOvertone.type = "sine";
          oscOvertone.frequency.setValueAtTime(freq * 2.76, now);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          oscFund.connect(gain);
          oscOvertone.connect(gain);
          gain.connect(ctx.destination);

          oscFund.start(now);
          oscOvertone.start(now);
          oscFund.stop(now + 3.3);
          oscOvertone.stop(now + 3.3);
        }
      } catch {
        // Audio fallback
      }
    },
    [soundEnabled, initAudio]
  );

  /* ══════════════════════════════════════════════════════════════════
     Proximity Detection Loop
     ══════════════════════════════════════════════════════════════════ */
  const checkProximity = useCallback((px: number, py: number) => {
    // Check landmarks
    let foundLandmark: CulturalLandmark | null = null;
    let closestDist = 12; // Proximity radius in % units

    for (const lm of VILLAGE_LANDMARKS) {
      const d = Math.hypot(px - lm.mapCoords.x, py - lm.mapCoords.y);
      if (d < closestDist) {
        closestDist = d;
        foundLandmark = lm;
      }
    }
    setNearbyLandmark(foundLandmark);

    // Check Yak at (84, 38)
    const dYak = Math.hypot(px - 84, py - 38);
    setNearbyYak(dYak < 9);

    // Check Mani Wheel at (58, 82)
    const dMani = Math.hypot(px - 58, py - 82);
    setNearbyManiWheel(dMani < 9);
  }, []);

  /* ══════════════════════════════════════════════════════════════════
     Action (A) Button Interaction
     ══════════════════════════════════════════════════════════════════ */
  const triggerAButton = useCallback(() => {
    // If dialogue is currently open and has a landmark, play sound or advance
    if (activeDialogue) {
      if (activeDialogue.landmark) {
        playLandmarkAcoustic(activeDialogue.landmark);
        setLastActionMsg("🎵 Played Timbre");
        setTimeout(() => setLastActionMsg(null), 1500);
      } else if (activeDialogue.isYak) {
        playYakSound();
      } else if (activeDialogue.isMani) {
        playManiBell();
        setIsManiSpinning(true);
        setTimeout(() => setIsManiSpinning(false), 2000);
      }
      return;
    }

    // Inspect nearby object
    if (nearbyLandmark) {
      play8BitSelect();
      playLandmarkAcoustic(nearbyLandmark);
      setActiveDialogue({
        titleBo: nearbyLandmark.nameBo,
        titleEn: nearbyLandmark.nameEn,
        categoryBo: nearbyLandmark.categoryBo,
        categoryEn: nearbyLandmark.categoryEn,
        dialogueBo: nearbyLandmark.dialogueBo,
        dialogueEn: nearbyLandmark.dialogueEn,
        landmark: nearbyLandmark,
      });
      return;
    }

    if (nearbyYak) {
      play8BitSelect();
      playYakSound();
      setActiveDialogue({
        titleBo: "གཡག · ས་མཐོའི་གཡག",
        titleEn: "Friendly Himalayan Yak",
        categoryBo: "འབྲོག་པའི་གྲོགས་པོ།",
        categoryEn: "Pastoral Mountain Companion",
        dialogueBo:
          "གཡག་དཀར་ནག་འཇམ་པོ་འདིས་རྩྭ་ཁར་རྩྭ་ཟ་བཞིན་འདུག མགོ་བོ་གཡུག་ཅིང་འཇམ་པོས་ངུར་སྒྲ་འབྱིན། *ངུར་སྒྲ* ལྷོད་པོར་འཚོ་བཞིན་འདུག",
        dialogueEn:
          "A friendly highland yak with a woven wool bell collar. It gazes at you with gentle brown eyes and grunts affectionately: *Hrrr-moooo*.",
        isYak: true,
      });
      return;
    }

    if (nearbyManiWheel) {
      play8BitSelect();
      playManiBell();
      setIsManiSpinning(true);
      setTimeout(() => setIsManiSpinning(false), 2000);
      setActiveDialogue({
        titleBo: "མ་ཎི་ལག་འཁོར། · ཆོས་ཀྱི་འཁོར་ལོ།",
        titleEn: "Sacred Mani Prayer Wheel",
        categoryBo: "བྱིན་རླབས་འཁོར་ལོ།",
        categoryEn: "Clockwise Auspicious Rotation",
        dialogueBo:
          "ཟངས་ཀྱི་མ་ཎི་འཁོར་ལོ་འདིའི་ནང་དུ་མ་ཎི་ཡིག་དྲུག་ཁྲི་ཕྲག་མང་པོ་བཞུགས། ཁྱེད་ཀྱིས་གཡས་སྐོར་དུ་བསྐོར་བས་སེམས་ཅན་ཐམས་ཅད་ལ་ཞི་བདེ་དང་བདེ་སྐྱིད་འབྱུང་བའི་སྨོན་ལམ་བཏབ། ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།",
        dialogueEn:
          "You gently spin the copper Mani wheel clockwise. Tens of thousands of printed mantras whirl within: Om Mani Padme Hum! May peace embrace every living being.",
        isMani: true,
      });
      return;
    }

    // If nothing nearby, prompt player
    play8BitChirp();
    setLastActionMsg(
      lang === "bo" ? "གནས་མཆོག་གི་འགྲམ་དུ་བསྐྱོད་རོགས" : "Walk closer to a landmark!"
    );
    setTimeout(() => setLastActionMsg(null), 1400);
  }, [
    activeDialogue,
    nearbyLandmark,
    nearbyYak,
    nearbyManiWheel,
    play8BitSelect,
    play8BitChirp,
    playLandmarkAcoustic,
    playYakSound,
    playManiBell,
    lang,
  ]);

  /* ══════════════════════════════════════════════════════════════════
     Action (B) Button: Close / Cancel
     ══════════════════════════════════════════════════════════════════ */
  const triggerBButton = useCallback(() => {
    play8BitChirp();
    if (activeDialogue) {
      setActiveDialogue(null);
      return;
    }
    if (inventoryOpen) {
      setInventoryOpen(false);
      return;
    }
  }, [activeDialogue, inventoryOpen, play8BitChirp]);

  /* ══════════════════════════════════════════════════════════════════
     START Button: Open / Close Cultural Bag
     ══════════════════════════════════════════════════════════════════ */
  const triggerStartButton = useCallback(() => {
    play8BitSelect();
    setInventoryOpen((prev) => !prev);
    if (activeDialogue) setActiveDialogue(null);
  }, [play8BitSelect, activeDialogue]);

  /* ══════════════════════════════════════════════════════════════════
     SELECT Button: Toggle Golden Hour / Night Atmosphere
     ══════════════════════════════════════════════════════════════════ */
  const triggerSelectButton = useCallback(() => {
    play8BitChirp();
    setTimeOfDay((prev) => (prev === "golden" ? "night" : "golden"));
  }, [play8BitChirp]);

  /* ══════════════════════════════════════════════════════════════════
     Movement Engine: Keyboard & Game Loop
     ══════════════════════════════════════════════════════════════════ */
  const movePlayerBy = useCallback(
    (dx: number, dy: number, facing: "down" | "up" | "left" | "right") => {
      setPlayerFacing(facing);
      setIsWalking(true);
      setWalkStep((s) => (s + 1) % 4);

      setPlayerPos((prev) => {
        // Map bounds: 12% to 88% on X, 16% to 88% on Y
        const nextX = Math.max(12, Math.min(88, prev.x + dx));
        const nextY = Math.max(16, Math.min(88, prev.y + dy));
        checkProximity(nextX, nextY);
        return { x: nextX, y: nextY };
      });
    },
    [checkProximity]
  );

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Avoid capturing input if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
          " ",
          "enter",
          "z",
          "x",
          "escape",
        ].includes(key)
      ) {
        // Prevent window scroll
        e.preventDefault();
      }

      keysPressed.current.add(key);

      // (A) Action
      if (key === " " || key === "enter" || key === "z") {
        triggerAButton();
      }
      // (B) Cancel
      if (key === "escape" || key === "x" || key === "backspace") {
        triggerBButton();
      }
      // START / Inventory
      if (key === "i" || key === "tab") {
        triggerStartButton();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      if (
        !keysPressed.current.has("arrowup") &&
        !keysPressed.current.has("arrowdown") &&
        !keysPressed.current.has("arrowleft") &&
        !keysPressed.current.has("arrowright") &&
        !keysPressed.current.has("w") &&
        !keysPressed.current.has("a") &&
        !keysPressed.current.has("s") &&
        !keysPressed.current.has("d")
      ) {
        setIsWalking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [triggerAButton, triggerBButton, triggerStartButton]);

  // Game Loop Animation Frame for continuous keyboard or click-to-walk movement
  useEffect(() => {
    const SPEED = 0.55;

    const loop = () => {
      const keys = keysPressed.current;
      let dx = 0;
      let dy = 0;
      let facing: "down" | "up" | "left" | "right" | null = null;

      if (keys.has("arrowup") || keys.has("w")) {
        dy -= SPEED;
        facing = "up";
      }
      if (keys.has("arrowdown") || keys.has("s")) {
        dy += SPEED;
        facing = "down";
      }
      if (keys.has("arrowleft") || keys.has("a")) {
        dx -= SPEED;
        facing = "left";
      }
      if (keys.has("arrowright") || keys.has("d")) {
        dx += SPEED;
        facing = "right";
      }

      // Handle Click-to-Walk waypoint
      if (targetWalkPos.current) {
        const tx = targetWalkPos.current.x;
        const ty = targetWalkPos.current.y;
        setPlayerPos((curr) => {
          const dist = Math.hypot(tx - curr.x, ty - curr.y);
          if (dist < 1.2) {
            targetWalkPos.current = null;
            setIsWalking(false);
            checkProximity(curr.x, curr.y);
            return curr;
          }
          const angle = Math.atan2(ty - curr.y, tx - curr.x);
          const stepX = Math.cos(angle) * SPEED * 1.2;
          const stepY = Math.sin(angle) * SPEED * 1.2;

          let newFacing: "down" | "up" | "left" | "right" = "down";
          if (Math.abs(stepX) > Math.abs(stepY)) {
            newFacing = stepX > 0 ? "right" : "left";
          } else {
            newFacing = stepY > 0 ? "down" : "up";
          }
          setPlayerFacing(newFacing);
          setIsWalking(true);
          setWalkStep((s) => (s + 1) % 4);

          const nx = Math.max(12, Math.min(88, curr.x + stepX));
          const ny = Math.max(16, Math.min(88, curr.y + stepY));
          checkProximity(nx, ny);
          return { x: nx, y: ny };
        });
      } else if (dx !== 0 || dy !== 0) {
        if (facing) {
          movePlayerBy(dx, dy, facing);
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [movePlayerBy, checkProximity]);

  // Click on map to walk
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    targetWalkPos.current = {
      x: Math.max(12, Math.min(88, xPct)),
      y: Math.max(16, Math.min(88, yPct)),
    };
  };

  // Virtual D-Pad Touch/Mouse Handlers
  const startDpadMove = (direction: "up" | "down" | "left" | "right") => {
    targetWalkPos.current = null; // Cancel waypoint
    const keyMap = {
      up: "arrowup",
      down: "arrowdown",
      left: "arrowleft",
      right: "arrowright",
    };
    keysPressed.current.add(keyMap[direction]);

    if (dpadTimerRef.current) clearInterval(dpadTimerRef.current);
  };

  const stopDpadMove = (direction: "up" | "down" | "left" | "right") => {
    const keyMap = {
      up: "arrowup",
      down: "arrowdown",
      left: "arrowleft",
      right: "arrowright",
    };
    keysPressed.current.delete(keyMap[direction]);
    setIsWalking(false);
  };

  /* ══════════════════════════════════════════════════════════════════
     Player Sprite Rendering (Traditional Tibetan Pilgrim / Traveler)
     ══════════════════════════════════════════════════════════════════ */
  const renderPlayerSprite = () => {
    const isStep = walkStep % 2 === 1 && isWalking;
    const bobY = isStep ? -3 : 0;

    return (
      <div
        className="relative w-12 h-14 sm:w-14 sm:h-16 flex flex-col items-center justify-center transition-transform duration-75"
        style={{ transform: `translateY(${bobY}px)` }}
      >
        {/* Shadow */}
        <div className="absolute -bottom-1 w-8 sm:w-10 h-3 rounded-full bg-black/50 blur-[2px] pointer-events-none" />

        {/* Proximity [!] Alert Icon bobbing overhead */}
        {(nearbyLandmark || nearbyYak || nearbyManiWheel) && (
          <div className="absolute -top-7 animate-bounce flex items-center gap-1 bg-amber-400 text-black px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-lg border border-amber-300">
            <span>!</span>
            <span className="text-[9px]">PRESS (A)</span>
          </div>
        )}

        {/* Traditional Tibetan Robe (Chuba) SVG Avatar */}
        <svg viewBox="0 0 48 56" fill="none" className="w-full h-full drop-shadow-md">
          {/* Hat / Head */}
          {playerFacing === "up" ? (
            /* Back of head with Tibetan braided queue / traveler hood */
            <g>
              <ellipse cx="24" cy="14" rx="8" ry="7" className="fill-stone-900" />
              {/* Maroon hood rim */}
              <path d="M16,14 Q24,8 32,14" strokeWidth="2.5" className="stroke-red-950" />
              {/* Braided queue / hair strand */}
              <line x1="24" y1="18" x2="24" y2="25" strokeWidth="2" className="stroke-stone-900" />
            </g>
          ) : playerFacing === "left" ? (
            /* Left profile */
            <g>
              <ellipse cx="22" cy="14" rx="7" ry="7" className="fill-amber-200" />
              {/* Fox fur trim / traditional hat */}
              <ellipse cx="22" cy="10" rx="8" ry="4" className="fill-amber-900" />
              {/* Eye dot */}
              <circle cx="18" cy="14" r="1" className="fill-stone-900" />
              {/* Travel staff in hand */}
              <line x1="12" y1="14" x2="12" y2="48" strokeWidth="2" className="stroke-amber-700" />
              <circle cx="12" cy="13" r="2" className="fill-amber-400" />
            </g>
          ) : playerFacing === "right" ? (
            /* Right profile */
            <g>
              <ellipse cx="26" cy="14" rx="7" ry="7" className="fill-amber-200" />
              <ellipse cx="26" cy="10" rx="8" ry="4" className="fill-amber-900" />
              <circle cx="30" cy="14" r="1" className="fill-stone-900" />
              <line x1="36" y1="14" x2="36" y2="48" strokeWidth="2" className="stroke-amber-700" />
              <circle cx="36" cy="13" r="2" className="fill-amber-400" />
            </g>
          ) : (
            /* Front Facing */
            <g>
              {/* Face */}
              <ellipse cx="24" cy="14" rx="7.5" ry="7" className="fill-amber-200" />
              {/* Traditional cap with earflaps (Tsering Kinkhab) */}
              <path d="M15,12 C16,6 32,6 33,12" strokeWidth="3" className="stroke-amber-900 fill-amber-800" />
              <ellipse cx="24" cy="8" rx="4" ry="2" className="fill-yellow-500" />
              {/* Eyes & Peaceful Smile */}
              <circle cx="21" cy="14" r="1" className="fill-stone-900" />
              <circle cx="27" cy="14" r="1" className="fill-stone-900" />
              <path d="M22,17 Q24,19 26,17" strokeWidth="1" strokeLinecap="round" className="stroke-amber-900" />
              {/* Turquoise Amulet / Gau Box on neck */}
              <rect x="22.5" y="19" width="3" height="3" className="fill-teal-400 stroke-yellow-500" strokeWidth="0.8" />
            </g>
          )}

          {/* Body: Maroon Wool Chuba (Tibetan Robe) with Golden Sash (Kera) */}
          <g>
            {/* Chuba gown */}
            <path
              d={
                playerFacing === "left"
                  ? "M18,22 L15,44 L28,44 L26,22 Z"
                  : playerFacing === "right"
                  ? "M22,22 L20,44 L33,44 L30,22 Z"
                  : "M16,22 L13,44 L35,44 L32,22 Z"
              }
              className="fill-red-900 stroke-red-950"
              strokeWidth="1.5"
            />
            {/* Asymmetrical golden silk collar trim */}
            <path d="M19,22 L27,30 L25,32" strokeWidth="1.5" className="stroke-yellow-400 fill-none" />
            {/* Tied Golden Sash (Kera) at waist */}
            <rect x="15" y="31" width="18" height="3.5" rx="1" className="fill-yellow-500 stroke-amber-600" strokeWidth="0.8" />
            {/* Prayer beads (Mala) looped around sash */}
            <circle cx="22" cy="35" r="1.2" className="fill-amber-600" />
            <circle cx="24" cy="36" r="1.2" className="fill-amber-600" />
            <circle cx="26" cy="35" r="1.2" className="fill-amber-600" />
          </g>

          {/* Boots: Felt Tibetan Sompa Boots */}
          <g>
            {isStep ? (
              /* Walking step */
              playerFacing === "left" || playerFacing === "right" ? (
                <>
                  <rect x="19" y="44" width="5" height="7" rx="1.5" className="fill-stone-900 stroke-red-800" strokeWidth="1" />
                  <rect x="24" y="42" width="5" height="7" rx="1.5" className="fill-stone-900 stroke-red-800" strokeWidth="1" />
                </>
              ) : (
                <>
                  <rect x="16" y="43" width="5" height="8" rx="1.5" className="fill-stone-900 stroke-red-800" strokeWidth="1" />
                  <rect x="27" y="45" width="5" height="6" rx="1.5" className="fill-stone-900 stroke-red-800" strokeWidth="1" />
                </>
              )
            ) : (
              /* Standing */
              <>
                <rect x="17" y="44" width="5" height="7" rx="1.5" className="fill-stone-900 stroke-red-800" strokeWidth="1" />
                <rect x="26" y="44" width="5" height="7" rx="1.5" className="fill-stone-900 stroke-red-800" strokeWidth="1" />
              </>
            )}
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* ══════════════════════════════════════════════════════════════════
          Console Top Navigation & Telemetry
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white/70 py-2 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-tibet-gold font-bold uppercase tracking-wider">
            {lang === "bo" ? "གཡུ་འབྲུག་རོལ་རྩེད · GAME BOY TIBET" : "GAME BOY RETRO RPG · POKÉMON ISOMETRIC ENGINE"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Bezel Skin Toggle */}
          <button
            type="button"
            onClick={() => setIsBezelMode((prev) => !prev)}
            className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px]"
            title="Toggle Retro Handheld Console Bezel"
          >
            {isBezelMode ? "🖥️ Widescreen" : "🎮 Game Boy Bezel"}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              setSoundEnabled((s) => !s);
              initAudio();
            }}
            className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px]"
          >
            {soundEnabled ? "🔊 Sound On" : "🔇 Mute"}
          </button>

          {/* Day / Night */}
          <button
            type="button"
            onClick={triggerSelectButton}
            className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px]"
          >
            {timeOfDay === "golden" ? "☀️ Golden Hour" : "🌙 Starlight"}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          Main Game Boy Shell (Bezel vs Widescreen)
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className={`w-full transition-all duration-300 ${
          isBezelMode
            ? "max-w-2xl bg-[#2b2b2b] p-6 sm:p-8 rounded-3xl border-4 border-[#1a1a1a] shadow-2xl relative"
            : "w-full"
        }`}
      >
        {/* Game Boy Classic Screen Glass Frame */}
        <div
          className={`relative rounded-xl overflow-hidden border-2 ${
            timeOfDay === "night" ? "border-indigo-400/40" : "border-amber-500/50"
          } bg-[#0a0807] shadow-inner`}
        >
          {/* Glass Glare Highlight */}
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-30" />

          {/* ══════════════════════════════════════════════════════════════
              ISOMETRIC TIBETAN VILLAGE MAP (THE WORLD STAGE)
              ══════════════════════════════════════════════════════════════ */}
          <div
            ref={mapContainerRef}
            onClick={handleMapClick}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/10] min-h-[460px] sm:min-h-[540px] overflow-hidden cursor-crosshair transition-colors duration-700 ${
              timeOfDay === "night"
                ? "bg-gradient-to-b from-[#05040d] via-[#0e0c1f] to-[#05040a]"
                : "bg-gradient-to-b from-[#140e0a] via-[#241a12] to-[#120d0a]"
            }`}
          >
            {/* Distant Himalayan Snow Peaks Backdrop */}
            <div className="absolute top-0 inset-x-0 h-28 pointer-events-none opacity-45">
              <svg viewBox="0 0 800 160" preserveAspectRatio="none" className="w-full h-full text-stone-700 fill-current">
                <polygon points="0,160 80,70 180,120 300,40 420,110 540,30 660,100 800,50 800,160" opacity="0.4" />
                <polygon points="0,160 120,50 240,110 380,30 490,90 620,20 740,80 800,40 800,160" opacity="0.6" />
                {/* Snow Cap Highlights */}
                <polygon points="360,30 380,30 400,60 365,60" fill={timeOfDay === "night" ? "#bae6fd" : "#fef08a"} opacity="0.8" />
                <polygon points="600,20 620,20 640,55 605,55" fill={timeOfDay === "night" ? "#bae6fd" : "#fef08a"} opacity="0.9" />
              </svg>
            </div>

            {/* Flowing Glacial Mountain Stream (Left edge through barley mill) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
              <path
                d="M 18,10 Q 15,30 22,40 T 16,70 T 20,95"
                fill="none"
                stroke={timeOfDay === "night" ? "#38bdf8" : "#67e8f9"}
                strokeWidth="6"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>

            {/* Stepped Cobblestone Paths Connecting the Village */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              {/* Path: South Gateway Chorten (50, 84) -> Central Square (50, 50) */}
              <line x1="50%" y1="84%" x2="50%" y2="50%" stroke="#d97706" strokeWidth="8" strokeDasharray="3 3" />
              {/* Path: Central Square (50, 50) -> Wind Horse Ridge (50, 14) */}
              <line x1="50%" y1="50%" x2="50%" y2="14%" stroke="#d97706" strokeWidth="6" strokeDasharray="3 3" />
              {/* Path: Central Square (50, 50) -> Homestead (24, 56) */}
              <line x1="50%" y1="50%" x2="24%" y2="56%" stroke="#d97706" strokeWidth="6" strokeDasharray="3 3" />
              {/* Path: Central Square (50, 50) -> Sowa Rigpa (76, 56) */}
              <line x1="50%" y1="50%" x2="76%" y2="56%" stroke="#d97706" strokeWidth="6" strokeDasharray="3 3" />
              {/* Path: Central Square (50, 50) -> Barley Terraces (22, 30) */}
              <line x1="50%" y1="50%" x2="22%" y2="30%" stroke="#d97706" strokeWidth="6" strokeDasharray="3 3" />
              {/* Path: Central Square (50, 50) -> Nomad Tent (78, 28) */}
              <line x1="50%" y1="50%" x2="78%" y2="28%" stroke="#d97706" strokeWidth="6" strokeDasharray="3 3" />
              {/* Path: Central Square (50, 50) -> Loom Studio (26, 78) */}
              <line x1="50%" y1="50%" x2="26%" y2="78%" stroke="#d97706" strokeWidth="6" strokeDasharray="3 3" />
            </svg>

            {/* ══════════════════════════════════════════════════════════════
                8 VILLAGE BUILDINGS & LANDMARKS PLACED ON ISOMETRIC GRID
                ══════════════════════════════════════════════════════════════ */}
            {VILLAGE_LANDMARKS.map((landmark) => {
              const isNear = nearbyLandmark?.id === landmark.id;

              return (
                <div
                  key={landmark.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Walk toward this landmark
                    targetWalkPos.current = {
                      x: landmark.mapCoords.x,
                      y: Math.min(86, landmark.mapCoords.y + 6),
                    };
                    play8BitSelect();
                    playLandmarkAcoustic(landmark);
                    setActiveDialogue({
                      titleBo: landmark.nameBo,
                      titleEn: landmark.nameEn,
                      categoryBo: landmark.categoryBo,
                      categoryEn: landmark.categoryEn,
                      dialogueBo: landmark.dialogueBo,
                      dialogueEn: landmark.dialogueEn,
                      landmark,
                    });
                  }}
                  className="absolute cursor-pointer transition-transform duration-200 group"
                  style={{
                    left: `${landmark.mapCoords.x}%`,
                    top: `${landmark.mapCoords.y}%`,
                    transform: "translate(-50%, -60%)",
                    zIndex: Math.floor(landmark.mapCoords.y),
                  }}
                >
                  {/* Proximity Focus Ring */}
                  {isNear && (
                    <div className="absolute -inset-3 rounded-2xl border-2 border-amber-400 bg-amber-400/20 animate-pulse pointer-events-none" />
                  )}

                  {/* Building Visual Model Container */}
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg border ${
                      landmark.borderClass
                    } bg-stone-950/80 backdrop-blur-md p-2 flex items-center justify-center ${
                      landmark.colorClass
                    } shadow-lg transition-transform duration-200 group-hover:scale-110 ${
                      isNear ? "scale-108 shadow-amber-400/30" : ""
                    }`}
                  >
                    {landmark.svgModel}

                    {/* Night Lantern Window Glow */}
                    {timeOfDay === "night" && (
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 blur-[2px] animate-pulse" />
                    )}
                  </div>

                  {/* Building Label Tag */}
                  <div className="mt-1 text-center whitespace-nowrap">
                    <span
                      lang="bo"
                      className={`block font-serif text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isNear
                          ? "bg-amber-400 text-black font-bold shadow-md"
                          : "bg-black/80 text-white/90 border border-white/15"
                      }`}
                    >
                      {landmark.nameBo.split("·")[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* ══════════════════════════════════════════════════════════════
                SPECIAL INTERACTABLE 1: FRIENDLY HIMALAYAN YAK (84, 38)
                ══════════════════════════════════════════════════════════════ */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                targetWalkPos.current = { x: 80, y: 40 };
                play8BitSelect();
                playYakSound();
                setActiveDialogue({
                  titleBo: "གཡག · ས་མཐོའི་གཡག",
                  titleEn: "Friendly Himalayan Yak",
                  categoryBo: "འབྲོག་པའི་གྲོགས་པོ།",
                  categoryEn: "Pastoral Mountain Companion",
                  dialogueBo:
                    "གཡག་དཀར་ནག་འཇམ་པོ་འདིས་རྩྭ་ཁར་རྩྭ་ཟ་བཞིན་འདུག མགོ་བོ་གཡུག་ཅིང་འཇམ་པོས་ངུར་སྒྲ་འབྱིན། *ངུར་སྒྲ* ལྷོད་པོར་འཚོ་བཞིན་འདུག",
                  dialogueEn:
                    "A friendly highland yak with a woven wool bell collar. It gazes at you with gentle brown eyes and grunts affectionately: *Hrrr-moooo*.",
                  isYak: true,
                });
              }}
              className="absolute cursor-pointer group"
              style={{
                left: "84%",
                top: "38%",
                transform: "translate(-50%, -60%)",
                zIndex: 38,
              }}
              title="Click to interact with the Yak"
            >
              {nearbyYak && (
                <div className="absolute -inset-2 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-pulse pointer-events-none" />
              )}
              <div className="w-12 h-10 sm:w-14 sm:h-12 bg-stone-900 border border-stone-600 rounded-md p-1 shadow-md group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 32 24" fill="none" className="w-full h-full">
                  {/* Yak Body */}
                  <ellipse cx="16" cy="14" rx="10" ry="7" className="fill-stone-800" />
                  <ellipse cx="16" cy="17" rx="9" ry="4" className="fill-stone-950" />
                  {/* Yak Head */}
                  <circle cx="8" cy="11" r="4.5" className="fill-stone-800" />
                  {/* Curved Horns */}
                  <path d="M7,8 Q4,3 8,2" strokeWidth="1.5" className="stroke-stone-300" strokeLinecap="round" />
                  <path d="M9,8 Q12,3 8,2" strokeWidth="1.5" className="stroke-stone-300" strokeLinecap="round" />
                  {/* Bell Collar */}
                  <circle cx="10" cy="14" r="1.5" className="fill-yellow-400" />
                  {/* Legs */}
                  <rect x="10" y="18" width="2" height="4" className="fill-stone-900" />
                  <rect x="14" y="18" width="2" height="4" className="fill-stone-900" />
                  <rect x="18" y="18" width="2" height="4" className="fill-stone-900" />
                  <rect x="22" y="18" width="2" height="4" className="fill-stone-900" />
                </svg>
              </div>
              <span className="block text-[9px] font-mono font-bold text-center mt-0.5 px-1 bg-black/80 text-amber-300 rounded-xs">
                གཡག (Yak)
              </span>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SPECIAL INTERACTABLE 2: SACRED MANI PRAYER WHEEL (58, 82)
                ══════════════════════════════════════════════════════════════ */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                targetWalkPos.current = { x: 55, y: 82 };
                play8BitSelect();
                playManiBell();
                setIsManiSpinning(true);
                setTimeout(() => setIsManiSpinning(false), 2000);
                setActiveDialogue({
                  titleBo: "མ་ཎི་ལག་འཁོར། · ཆོས་ཀྱི་འཁོར་ལོ།",
                  titleEn: "Sacred Mani Prayer Wheel",
                  categoryBo: "བྱིན་རླབས་འཁོར་ལོ།",
                  categoryEn: "Clockwise Auspicious Rotation",
                  dialogueBo:
                    "ཟངས་ཀྱི་མ་ཎི་འཁོར་ལོ་འདིའི་ནང་དུ་མ་ཎི་ཡིག་དྲུག་ཁྲི་ཕྲག་མང་པོ་བཞུགས། ཁྱེད་ཀྱིས་གཡས་སྐོར་དུ་བསྐོར་བས་སེམས་ཅན་ཐམས་ཅད་ལ་ཞི་བདེ་དང་བདེ་སྐྱིད་འབྱུང་བའི་སྨོན་ལམ་བཏབ། ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།",
                  dialogueEn:
                    "You gently spin the copper Mani wheel clockwise. Tens of thousands of printed mantras whirl within: Om Mani Padme Hum! May peace embrace every living being.",
                  isMani: true,
                });
              }}
              className="absolute cursor-pointer group"
              style={{
                left: "58%",
                top: "82%",
                transform: "translate(-50%, -60%)",
                zIndex: 82,
              }}
              title="Click to spin the prayer wheel"
            >
              {nearbyManiWheel && (
                <div className="absolute -inset-2 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-pulse pointer-events-none" />
              )}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 bg-amber-950/80 border border-amber-500 rounded-md p-1 shadow-md group-hover:scale-110 transition-transform ${
                  isManiSpinning ? "animate-spin" : ""
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <circle cx="12" cy="12" r="9" className="stroke-amber-400 fill-amber-700/60" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4" className="stroke-yellow-300 fill-yellow-500" strokeWidth="1" />
                  <line x1="12" y1="3" x2="12" y2="8" strokeWidth="1.2" className="stroke-yellow-200" />
                  <line x1="12" y1="16" x2="12" y2="21" strokeWidth="1.2" className="stroke-yellow-200" />
                  <line x1="3" y1="12" x2="8" y2="12" strokeWidth="1.2" className="stroke-yellow-200" />
                  <line x1="16" y1="12" x2="21" y2="12" strokeWidth="1.2" className="stroke-yellow-200" />
                </svg>
              </div>
              <span className="block text-[9px] font-mono font-bold text-center mt-0.5 px-1 bg-black/80 text-amber-300 rounded-xs">
                མ་ཎི (Mani)
              </span>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                THE PLAYABLE AVATAR (TIBETAN TRAVELER SPRITE)
                ══════════════════════════════════════════════════════════════ */}
            <div
              className="absolute pointer-events-none will-change-transform"
              style={{
                left: `${playerPos.x}%`,
                top: `${playerPos.y}%`,
                transform: "translate(-50%, -100%)",
                zIndex: Math.floor(playerPos.y) + 5,
              }}
            >
              {renderPlayerSprite()}
            </div>

            {/* Floating Action / Prompt Toast */}
            {lastActionMsg && (
              <div className="absolute top-4 inset-x-0 mx-auto w-max z-40 bg-amber-400 text-black px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-xl border border-amber-200 animate-in fade-in slide-in-from-top-2 duration-150">
                {lastActionMsg}
              </div>
            )}

            {/* Keyboard & Control Instructions Overlay */}
            <div className="absolute bottom-2 left-2 right-2 pointer-events-none z-20 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/60 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🎮 [WASD / ARROWS]</span>
                <span>Walk Village</span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span className="text-amber-400 font-bold hidden sm:inline">[SPACE / A]</span>
                <span className="hidden sm:inline">Inspect</span>
                <span className="text-white/30 hidden md:inline">|</span>
                <span className="text-amber-400 font-bold hidden md:inline">[CLICK GROUND]</span>
                <span className="hidden md:inline">Walk to Point</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-bold">POS:</span>
                <span>{playerPos.x.toFixed(0)}%, {playerPos.y.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RETRO GAME BOY POKÉMON-STYLE DIALOGUE BOX
              ══════════════════════════════════════════════════════════════ */}
          {activeDialogue && (
            <div
              className="border-t-2 border-amber-400 bg-[#0d0d0f] text-white p-4 sm:p-5 relative z-30 animate-in slide-in-from-bottom-2 duration-150"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
              }}
            >
              {/* Retro 8-bit Corner Brackets */}
              <div className="flex items-start justify-between gap-3 pb-2 border-b border-white/10">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-amber-400 text-black font-bold">
                      {lang === "bo" ? activeDialogue.categoryBo : activeDialogue.categoryEn}
                    </span>
                    <span className="text-xs font-mono text-white/50">
                      [AREA ENCOUNTER]
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-amber-300 tracking-wide mt-1">
                    {lang === "bo" ? activeDialogue.titleBo : activeDialogue.titleEn}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={triggerBButton}
                  className="w-7 h-7 rounded-sm border border-white/20 hover:border-amber-400 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                  title="Close (B)"
                >
                  ✕
                </button>
              </div>

              {/* Dialogue Text */}
              <div className="py-3 text-xs sm:text-sm text-white/90 leading-relaxed font-serif">
                <p>
                  {lang === "bo" ? activeDialogue.dialogueBo : activeDialogue.dialogueEn}
                </p>
              </div>

              {/* Dialogue Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-2">
                  {activeDialogue.landmark && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeDialogue.landmark) {
                          playLandmarkAcoustic(activeDialogue.landmark);
                          setLastActionMsg("🎵 Instrument Timbre");
                          setTimeout(() => setLastActionMsg(null), 1500);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xs bg-amber-400/20 hover:bg-amber-400 hover:text-black border border-amber-400 text-amber-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🎵</span>
                      <span>
                        {lang === "bo"
                          ? `སྒྲ་དབྱངས (${activeDialogue.landmark.freq}Hz)`
                          : `(A) Play Sound (${activeDialogue.landmark.freq}Hz)`}
                      </span>
                    </button>
                  )}

                  {activeDialogue.landmark && onOpenFullStory && (
                    <button
                      type="button"
                      onClick={() => onOpenFullStory(activeDialogue.landmark!)}
                      className="px-3 py-1.5 rounded-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>📖</span>
                      <span>{lang === "bo" ? "ལོ་རྒྱུས་ཞིབ་ཕྲ ↗" : "Full Story ↗"}</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={triggerBButton}
                  className="px-3 py-1.5 rounded-xs bg-red-950/40 hover:bg-red-900 border border-red-500/50 text-red-200 transition-all cursor-pointer"
                >
                  {lang === "bo" ? "ཕྱིར་ཐོན (B)" : "Close (B)"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VILLAGE CULTURAL BAG / INVENTORY (START BUTTON)
              ══════════════════════════════════════════════════════════════ */}
          {inventoryOpen && (
            <div className="border-t-2 border-sakya-gold bg-[#120f0d] text-white p-4 sm:p-5 relative z-30 animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎒</span>
                  <h4 className="font-mono text-sm font-bold text-amber-300">
                    {lang === "bo" ? "བོད་ཀྱི་རིག་གཞུང་ཡོ་བྱད · VILLAGE BAG" : "SACRED VILLAGE BAG (6 ITEMS)"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setInventoryOpen(false)}
                  className="text-xs px-2 py-1 rounded-xs bg-white/10 hover:bg-white/20 cursor-pointer font-mono"
                >
                  ✕ Close (B)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3">
                {VILLAGE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedItem(item);
                      play8BitSelect();
                    }}
                    className={`p-2.5 rounded-sm border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                      selectedItem.id === item.id
                        ? "border-amber-400 bg-amber-400/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <span lang="bo" className="block text-xs font-serif font-bold text-amber-200 truncate">
                        {item.nameBo}
                      </span>
                      <span className="block text-[10px] text-white/70 truncate">
                        {item.nameEn}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Item Lore */}
              <div className="p-3 rounded-xs border border-white/10 bg-black/50 text-xs space-y-1">
                <span className="font-mono text-amber-400 font-bold block">
                  {lang === "bo" ? selectedItem.nameBo : selectedItem.nameEn}
                </span>
                <p className="text-white/80 font-serif">
                  {lang === "bo" ? selectedItem.descBo : selectedItem.descEn}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TACTILE GAME BOY PHYSICAL CONTROLLER (BOTTOM CONSOLE PAD)
            ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full mt-4 sm:mt-6 p-4 rounded-2xl bg-[#1c1917]/90 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl select-none">
          {/* LEFT: Authentic Cross D-Pad */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5 font-bold">
              DIRECTION PAD
            </span>
            <div className="relative w-28 h-28">
              {/* D-Pad Center Base */}
              <div className="absolute inset-8 bg-[#1e1c1b] rounded-sm shadow-inner" />

              {/* UP */}
              <button
                type="button"
                onMouseDown={() => startDpadMove("up")}
                onMouseUp={() => stopDpadMove("up")}
                onMouseLeave={() => stopDpadMove("up")}
                onTouchStart={(e) => {
                  e.preventDefault();
                  startDpadMove("up");
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopDpadMove("up");
                }}
                className="absolute top-0 left-9 w-10 h-10 bg-[#3a3532] hover:bg-[#4d4743] active:bg-amber-500 rounded-t-md shadow-md border-t-2 border-x-2 border-stone-600 active:border-amber-400 cursor-pointer flex items-center justify-center text-white active:text-black font-bold text-xs"
                aria-label="Walk Up"
              >
                ▲
              </button>

              {/* DOWN */}
              <button
                type="button"
                onMouseDown={() => startDpadMove("down")}
                onMouseUp={() => stopDpadMove("down")}
                onMouseLeave={() => stopDpadMove("down")}
                onTouchStart={(e) => {
                  e.preventDefault();
                  startDpadMove("down");
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopDpadMove("down");
                }}
                className="absolute bottom-0 left-9 w-10 h-10 bg-[#3a3532] hover:bg-[#4d4743] active:bg-amber-500 rounded-b-md shadow-md border-b-2 border-x-2 border-stone-600 active:border-amber-400 cursor-pointer flex items-center justify-center text-white active:text-black font-bold text-xs"
                aria-label="Walk Down"
              >
                ▼
              </button>

              {/* LEFT */}
              <button
                type="button"
                onMouseDown={() => startDpadMove("left")}
                onMouseUp={() => stopDpadMove("left")}
                onMouseLeave={() => stopDpadMove("left")}
                onTouchStart={(e) => {
                  e.preventDefault();
                  startDpadMove("left");
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopDpadMove("left");
                }}
                className="absolute top-9 left-0 w-10 h-10 bg-[#3a3532] hover:bg-[#4d4743] active:bg-amber-500 rounded-l-md shadow-md border-l-2 border-y-2 border-stone-600 active:border-amber-400 cursor-pointer flex items-center justify-center text-white active:text-black font-bold text-xs"
                aria-label="Walk Left"
              >
                ◀
              </button>

              {/* RIGHT */}
              <button
                type="button"
                onMouseDown={() => startDpadMove("right")}
                onMouseUp={() => stopDpadMove("right")}
                onMouseLeave={() => stopDpadMove("right")}
                onTouchStart={(e) => {
                  e.preventDefault();
                  startDpadMove("right");
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopDpadMove("right");
                }}
                className="absolute top-9 right-0 w-10 h-10 bg-[#3a3532] hover:bg-[#4d4743] active:bg-amber-500 rounded-r-md shadow-md border-r-2 border-y-2 border-stone-600 active:border-amber-400 cursor-pointer flex items-center justify-center text-white active:text-black font-bold text-xs"
                aria-label="Walk Right"
              >
                ▶
              </button>

              {/* Center Pivot */}
              <div className="absolute top-9 left-9 w-10 h-10 bg-[#2d2825] flex items-center justify-center pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-[#1c1917]" />
              </div>
            </div>
          </div>

          {/* MIDDLE: SELECT & START (Angled Pill Buttons) */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
              PALDEN SAKYA SYSTEM
            </span>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={triggerSelectButton}
                  className="w-14 h-4 bg-[#383330] hover:bg-[#4a4440] active:bg-white rounded-full -rotate-25 shadow-md border border-stone-600 cursor-pointer transition-colors"
                  title="SELECT: Toggle Day / Night"
                />
                <span className="text-[9px] font-mono tracking-widest text-white/50 mt-1 uppercase font-bold">
                  SELECT
                </span>
                <span className="text-[8px] font-mono text-white/30">☀️ / 🌙</span>
              </div>

              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={triggerStartButton}
                  className="w-14 h-4 bg-[#383330] hover:bg-[#4a4440] active:bg-white rounded-full -rotate-25 shadow-md border border-stone-600 cursor-pointer transition-colors"
                  title="START: Open Bag"
                />
                <span className="text-[9px] font-mono tracking-widest text-white/50 mt-1 uppercase font-bold">
                  START
                </span>
                <span className="text-[8px] font-mono text-white/30">🎒 Bag</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Round (B) and (A) Action Buttons (Angled) */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5 font-bold">
              ACTIONS
            </span>
            <div className="flex items-center gap-4 rotate-[-12deg]">
              {/* (B) Button: Cancel / Close */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={triggerBButton}
                  className="w-12 h-12 rounded-full bg-[#831843] hover:bg-[#9d174d] active:bg-red-400 text-white font-mono font-bold text-sm shadow-lg border-2 border-pink-900 active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
                  aria-label="Button B: Cancel / Close"
                >
                  B
                </button>
                <span className="text-[9px] font-mono tracking-wider text-white/60 mt-1 font-bold">
                  CLOSE
                </span>
              </div>

              {/* (A) Button: Inspect / Talk / Play Sound */}
              <div className="flex flex-col items-center -mt-4">
                <button
                  type="button"
                  onClick={triggerAButton}
                  className="w-12 h-12 rounded-full bg-[#d97706] hover:bg-[#f59e0b] active:bg-yellow-300 text-black font-mono font-bold text-sm shadow-lg border-2 border-yellow-700 active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
                  aria-label="Button A: Inspect / Talk"
                >
                  A
                </button>
                <span className="text-[9px] font-mono tracking-wider text-amber-300 mt-1 font-bold">
                  INSPECT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TibetanGameboyVillage;
