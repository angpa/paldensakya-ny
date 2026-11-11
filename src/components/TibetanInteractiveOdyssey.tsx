"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Language,
  CulturalLandmark,
  VILLAGE_LANDMARKS,
} from "@/data/tibetanVillageData";
import TibetanGameboyVillage from "@/components/TibetanGameboyVillage";

type ViewMode = "gameboy" | "village" | "bento" | "chronicle";

export function TibetanInteractiveOdyssey({ lang }: { lang: Language }) {
  const [viewMode, setViewMode] = useState<ViewMode>("gameboy");
  const [timeOfDay, setTimeOfDay] = useState<"golden" | "night">("golden");
  const [cameraPreset, setCameraPreset] = useState<"isometric" | "aerial" | "promenade">("isometric");
  const [activeLandmark, setActiveLandmark] = useState<CulturalLandmark | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<CulturalLandmark | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotate, setTargetRotate] = useState({ rx: 22, ry: -14 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

  const applyCameraPreset = (preset: "isometric" | "aerial" | "promenade") => {
    setCameraPreset(preset);
    if (preset === "isometric") {
      setTargetRotate({ rx: 22, ry: -14 });
    } else if (preset === "aerial") {
      setTargetRotate({ rx: 52, ry: 0 });
    } else if (preset === "promenade") {
      setTargetRotate({ rx: 8, ry: -6 });
    }
  };

  /* ══════════════════════════════════════════════════════════════════
     Authentic Himalayan Acoustic Synthesizer (Web Audio API)
     ══════════════════════════════════════════════════════════════════ */
  const playSound = useCallback(
    (landmark: CulturalLandmark) => {
      if (!soundEnabled) return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

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

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(2800, now);
          filter.frequency.exponentialRampToValueAtTime(450, now + 1.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(filter);
          filter.connect(ctx.destination);

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
          gain.gain.linearRampToValueAtTime(0.09, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 3.3);
        } else {
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0, now);
          masterGain.gain.linearRampToValueAtTime(0.14, now + 0.03);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(2200, now);
          filter.frequency.exponentialRampToValueAtTime(600, now + 3.0);

          const oscFund = ctx.createOscillator();
          oscFund.type = "sine";
          oscFund.frequency.setValueAtTime(freq, now);

          const oscOvertone = ctx.createOscillator();
          oscOvertone.type = "sine";
          oscOvertone.frequency.setValueAtTime(freq * 2.76, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(4.2, now);
          lfoGain.gain.setValueAtTime(0.02, now);
          lfo.connect(lfoGain.gain);

          oscFund.connect(masterGain);
          oscOvertone.connect(masterGain);
          masterGain.connect(filter);
          filter.connect(ctx.destination);

          oscFund.start(now);
          oscOvertone.start(now);
          lfo.start(now);

          oscFund.stop(now + 3.9);
          oscOvertone.stop(now + 3.9);
          lfo.stop(now + 3.9);
        }

        setIsAudioActive(true);
        if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
        audioTimerRef.current = setTimeout(() => {
          setIsAudioActive(false);
        }, 2800);
      } catch {
        // AudioContext disabled
      }
    },
    [soundEnabled]
  );

  /* Mouse & Touch 3D Parallax Tracking */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
    setTargetRotate({ rx: 22 - y * 16, ry: -12 + x * 24 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setTargetRotate({ rx: 18, ry: -12 });
    setHoveredLandmark(null);
  }, []);

  /* Himalayan Morning Mist & Golden Stardust Particle Engine */
  useEffect(() => {
    if (viewMode !== "village") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    const particles: {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }[] = [];

    const colors =
      timeOfDay === "night"
        ? [
            "rgba(255, 255, 255, ",
            "rgba(251, 191, 36, ",
            "rgba(251, 146, 60, ",
            "rgba(147, 197, 253, ",
          ]
        : [
            "rgba(217, 163, 39, ",
            "rgba(244, 212, 122, ",
            "rgba(255, 255, 255, ",
            "rgba(56, 189, 248, ",
          ];

    for (let i = 0; i < 52; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * (timeOfDay === "night" ? 0.15 : 0.3),
        vy: timeOfDay === "night" ? -Math.random() * 0.25 : -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.6 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = "rgba(217, 163, 39, 0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [timeOfDay, viewMode]);

  const currentInspector = hoveredLandmark || activeLandmark || VILLAGE_LANDMARKS[0];

  return (
    <section
      aria-labelledby="odyssey-heading"
      className="space-y-6 pt-4 border-t border-sakya-gold/30"
    >
      {/* ══════════════════════════════════════════════════════════════════
          Header & Controls Bar (Swiss Architectural / Web3 Style)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tibet-gold animate-ping" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-mono font-semibold px-2.5 py-0.5 rounded-full bg-tibet-gold-light border border-tibet-gold/30 text-tibet-gold-rich">
              {lang === "bo"
                ? "བོད་ཀྱི་ཡུལ་ལྗོངས་གྲོང་གསེབ་༣D"
                : "Interactive 3D Tibetan Village"}
            </span>
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider hidden sm:inline">
              LIVING CULTURE · FOLK HERITAGE · NOMADIC TRADITIONS
            </span>
          </div>

          <h2
            id="odyssey-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground tracking-tight"
          >
            {lang === "bo"
              ? "༄༅། །བོད་ཀྱི་སྲོལ་རྒྱུན་གྲོང་གསེབ་དང་འཚོ་བའི་རིག་གཞུང་།"
              : "The Living Tibetan Village: 2,000 Years of Culture"}
          </h2>

          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            {lang === "bo"
              ? "གྲོང་གསེབ་ཀྱི་ཁང་པ་དང་སྦྲ་ནག ནས་ཞིང་། གཞས་ར། ལག་ཤེས་བཟོ་གྲྭ་སོགས་ལ་མནན་ཏེ་བོད་ཀྱི་འཚོ་བའི་གོམས་གཤིས་དང་རིག་གཞུང་ལ་གཟིགས།"
              : "Explore the miniature Himalayan settlement: stone homesteads, nomad yak-hair tents, barley terraces, folk dance squares, weaving studios, and herbal tea sanctuaries. Walk the village in Game Boy mode or tilt the 3D diorama."}
          </p>
        </div>

        {/* View Mode & Audio Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          {/* Folk Sound Resonance Switch (active in 3D village mode) */}
          {viewMode === "village" && (
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSound(VILLAGE_LANDMARKS[3]);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 border ${
                soundEnabled
                  ? "bg-tibet-gold text-white border-tibet-gold shadow-xs"
                  : "bg-card-bg/90 border-border-subtle text-muted hover:text-foreground"
              }`}
              title="Toggle village acoustic instruments (Dramyin lute, flute, singing bowls)"
            >
              <span>{soundEnabled ? "🎵" : "🔇"}</span>
              <span className="font-mono text-[11px]">
                {soundEnabled
                  ? lang === "bo"
                    ? "སྒྲ་དབྱངས་འབྱེད"
                    : "Acoustics: Active"
                  : lang === "bo"
                  ? "སྒྲ་མེད"
                  : "Acoustics: Off"}
              </span>
              {soundEnabled && isAudioActive && (
                <span className="flex items-center gap-0.5 text-xs animate-pulse">
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
              )}
            </button>
          )}

          {/* Time of Day Atmosphere Switch (Diorama Lighting in 3D village mode) */}
          {viewMode === "village" && (
            <button
              type="button"
              onClick={() => setTimeOfDay(timeOfDay === "golden" ? "night" : "golden")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                timeOfDay === "night"
                  ? "bg-indigo-950/80 border-indigo-400 text-indigo-200 shadow-xs"
                  : "bg-amber-950/40 border-amber-500/70 text-amber-300 shadow-xs"
              }`}
              title="Toggle Day / Night Himalayan Starlight atmosphere"
            >
              <span>{timeOfDay === "night" ? "🌙" : "☀️"}</span>
              <span className="font-mono text-[11px]">
                {timeOfDay === "night"
                  ? lang === "bo"
                    ? "དགོང་མོ"
                    : "Starlight"
                  : lang === "bo"
                  ? "ཉི་འོད"
                  : "Golden"}
              </span>
            </button>
          )}

          {/* Camera Perspective Presets (Diorama Angle in 3D village mode) */}
          {viewMode === "village" && (
            <div
              role="radiogroup"
              aria-label="Camera angle preset"
              className="flex items-center rounded-full border border-border-subtle bg-card-bg/90 p-0.5 text-xs shadow-2xs"
            >
              <button
                type="button"
                role="radio"
                aria-checked={cameraPreset === "isometric"}
                onClick={() => applyCameraPreset("isometric")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  cameraPreset === "isometric"
                    ? "bg-tibet-gold text-black font-semibold shadow-2xs"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {lang === "bo" ? "ཟུར་མཐོང" : "Isometric"}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={cameraPreset === "aerial"}
                onClick={() => applyCameraPreset("aerial")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  cameraPreset === "aerial"
                    ? "bg-tibet-gold text-black font-semibold shadow-2xs"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {lang === "bo" ? "དགུང་མཐོང" : "Aerial"}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={cameraPreset === "promenade"}
                onClick={() => applyCameraPreset("promenade")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  cameraPreset === "promenade"
                    ? "bg-tibet-gold text-black font-semibold shadow-2xs"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {lang === "bo" ? "གཤམ་མཐོང" : "Ground"}
              </button>
            </div>
          )}

          {/* Perspective Switcher */}
          <div
            role="radiogroup"
            aria-label="View mode toggle"
            className="flex items-center rounded-full border border-border-subtle bg-card-bg/90 p-0.5 text-xs shadow-2xs"
          >
            {/* 1. Walkable Game Boy / Pokémon Style Mode */}
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "gameboy"}
              onClick={() => setViewMode("gameboy")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                viewMode === "gameboy"
                  ? "bg-amber-500 text-black font-bold shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>🎮</span>
              <span>{lang === "bo" ? "གཡུ་འབྲུག་རོལ་རྩེད" : "Game Boy RPG"}</span>
            </button>

            {/* 2. 3D Tilt Spatial Stage */}
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "village"}
              onClick={() => setViewMode("village")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1 ${
                viewMode === "village"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>🏔️</span>
              <span>{lang === "bo" ? "གྲོང་གསེབ་༣D" : "3D Spatial"}</span>
            </button>

            {/* 3. Panorama Bento */}
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "bento"}
              onClick={() => setViewMode("bento")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1 ${
                viewMode === "bento"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>🏛️</span>
              <span>{lang === "bo" ? "སྤྱི་མཐོང་" : "Panorama"}</span>
            </button>

            {/* 4. Chronicle Archive */}
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "chronicle"}
              onClick={() => setViewMode("chronicle")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1 ${
                viewMode === "chronicle"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>📜</span>
              <span>{lang === "bo" ? "དཀར་ཆག" : "Chronicle"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MODE 1: WALKABLE GAME BOY ISOMETRIC TIBETAN VILLAGE (Flagship RPG)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "gameboy" && (
        <TibetanGameboyVillage
          lang={lang}
          onOpenFullStory={(landmark) => setActiveLandmark(landmark)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODE 2: 3D VOLUMETRIC DIORAMA STAGE (Jasmin Karatas Inspiration)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "village" && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative w-full min-h-[620px] sm:min-h-[700px] rounded-sm border ${
            timeOfDay === "night" ? "border-indigo-400/40" : "border-sakya-gold/40"
          } ${
            timeOfDay === "night"
              ? "bg-gradient-to-b from-[#05040a] via-[#090716] to-[#040308]"
              : "bg-gradient-to-b from-[#0a0807] via-[#140f0c] to-[#080706]"
          } overflow-hidden shadow-2xl p-4 sm:p-8 flex flex-col justify-between select-none transition-colors duration-700`}
          style={{ perspective: "1300px" }}
        >
          {/* Background Canvas: Floating Golden Stardust & Mountain Mist/Stars */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          />

          {/* Distant Snowy Himalayan Mountain Ridge Silhouette */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-44 sm:h-56 pointer-events-none opacity-40 transition-transform duration-700 ease-out"
            style={{
              transform: `translateY(${mousePos.y * 12}px) scale(1.02)`,
            }}
          >
            <svg viewBox="0 0 1000 240" preserveAspectRatio="none" className="w-full h-full text-stone-700/60 fill-current">
              <polygon points="0,240 80,120 180,180 320,80 440,160 580,60 720,150 860,70 1000,160 1000,240" opacity="0.3" />
              <polygon points="0,240 140,100 260,170 390,70 510,140 660,50 800,130 920,85 1000,140 1000,240" opacity="0.5" />
              <polygon points="370,70 390,70 410,100 375,100" fill={timeOfDay === "night" ? "#bae6fd" : "#fef08a"} opacity="0.8" />
              <polygon points="640,50 660,50 680,85 645,85" fill={timeOfDay === "night" ? "#bae6fd" : "#fef08a"} opacity="0.9" />
            </svg>
            <div
              className={`absolute inset-0 bg-gradient-to-b from-transparent ${
                timeOfDay === "night" ? "via-[#090716]/60 to-[#090716]" : "via-[#140f0c]/60 to-[#140f0c]"
              }`}
            />
          </div>

          {/* Central Radial Golden Sun/Moon Spotlight following cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
            style={{
              background: `radial-gradient(circle 420px at ${50 + mousePos.x * 40}% ${
                50 + mousePos.y * 40
              }%, ${
                timeOfDay === "night" ? "rgba(147, 197, 253, 0.16)" : "rgba(217, 163, 39, 0.20)"
              }, transparent 75%)`,
            }}
          />

          {/* Top Telemetry Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] text-white/50 font-mono tracking-wider border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-tibet-gold font-bold">✦ VILLAGE SPATIAL STAGE</span>
              <span className="text-white/30">|</span>
              <span className="text-white/70">
                PITCH: {targetRotate.rx.toFixed(1)}° · YAW: {targetRotate.ry.toFixed(1)}°
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-white/40">
                LIGHT: {timeOfDay.toUpperCase()} · CAM: {cameraPreset.toUpperCase()} · ELEV 3,650M
              </span>
              <span className="text-tibet-gold-light px-2 py-0.5 rounded-xs bg-white/5 border border-white/10">
                {currentInspector.soundType.toUpperCase()} ({currentInspector.freq} HZ)
              </span>
            </div>
          </div>

          {/* 3D Village Isometric Landscape Plateau */}
          <div
            className="relative z-10 my-auto py-8 transition-transform duration-300 ease-out will-change-transform flex items-center justify-center min-h-[440px] sm:min-h-[500px]"
            style={{
              transform: `rotateX(${targetRotate.rx}deg) rotateY(${targetRotate.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* The Stylized Ground Base of the Tibetan Settlement */}
            <div
              className={`absolute -inset-3 sm:-inset-6 rounded-2xl border-2 ${
                timeOfDay === "night"
                  ? "border-amber-500/30 bg-gradient-to-br from-[#0c0a14]/90 via-[#141022]/80 to-[#08060e]/95 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                  : "border-sakya-gold/40 bg-gradient-to-br from-[#1a1411]/90 via-[#221b16]/80 to-[#120e0c]/95 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
              } pointer-events-none transition-colors duration-700`}
              style={{
                transform: "translateZ(-30px)",
              }}
            >
              <div className="absolute inset-2 sm:inset-4 rounded-xl border border-amber-600/20 pointer-events-none" />
              <div className="absolute inset-6 sm:inset-10 rounded-lg border border-dashed border-amber-500/15 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-1/4 w-8 sm:w-12 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-[2px] transform -rotate-6 pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-6 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent pointer-events-none" />
            </div>

            {/* 8 Interactive Cultural Landmarks Positioned on the Village Stage */}
            <div className="relative w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-2">
              {VILLAGE_LANDMARKS.map((landmark, idx) => {
                const floatDelay = `${idx * 0.35}s`;

                return (
                  <div
                    key={landmark.id}
                    onClick={() => {
                      setActiveLandmark(landmark);
                      playSound(landmark);
                    }}
                    onMouseEnter={() => {
                      setHoveredLandmark(landmark);
                      playSound(landmark);
                    }}
                    onMouseLeave={() => setHoveredLandmark(null)}
                    className="group relative rounded-sm p-3.5 sm:p-4 bg-black/75 hover:bg-black/95 backdrop-blur-xl border border-white/15 hover:border-tibet-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-tibet-gold/30 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-2 hover:scale-103"
                    style={{
                      transformStyle: "preserve-3d",
                      animation: "floating-gentle 5s ease-in-out infinite",
                      animationDelay: floatDelay,
                    }}
                  >
                    <div
                      className={`absolute inset-0 rounded-sm bg-gradient-to-br ${landmark.bgGlowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                    />

                    {timeOfDay === "night" && (
                      <div
                        aria-hidden="true"
                        className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400 blur-[2px] animate-pulse pointer-events-none"
                        style={{
                          boxShadow: "0 0 10px 2px rgba(251, 191, 36, 0.8)",
                        }}
                      />
                    )}

                    <div
                      className={`w-14 h-14 sm:w-18 sm:h-18 rounded-md border ${landmark.borderClass} bg-stone-950/70 p-2 flex items-center justify-center ${landmark.colorClass} shadow-md group-hover:scale-110 transition-transform duration-300 mb-2`}
                    >
                      {landmark.svgModel}
                    </div>

                    <span
                      lang="bo"
                      className="font-serif text-xs sm:text-sm font-semibold text-tibet-gold-light group-hover:text-tibet-gold transition-colors tracking-wide"
                    >
                      {landmark.nameBo}
                    </span>

                    <span className="text-[10px] sm:text-xs text-white/90 font-medium mt-0.5 leading-snug">
                      {landmark.nameEn}
                    </span>

                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider mt-1 leading-tight">
                      {lang === "bo" ? landmark.categoryBo : landmark.categoryEn}
                    </span>

                    <span className="mt-2 text-[9px] uppercase tracking-widest text-tibet-gold border border-tibet-gold/30 px-2 py-0.5 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-tibet-gold/20 transition-all">
                      {lang === "bo" ? "ཉམས་མྱོང ↗" : "Explore ↗"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Live Telemetry & Inspector Drawer */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70 pt-3 border-t border-white/10 bg-black/60 backdrop-blur-md px-4 py-3 rounded-sm">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-md border ${currentInspector.borderClass} bg-black/80 p-1 flex items-center justify-center ${currentInspector.colorClass} shrink-0`}>
                {currentInspector.svgModel}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span lang="bo" className="font-serif font-bold text-tibet-gold">
                    {currentInspector.nameBo}
                  </span>
                  <span className="text-[11px] text-white font-medium">
                    · {currentInspector.nameEn}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    ({lang === "bo" ? currentInspector.locationBo : currentInspector.locationEn})
                  </span>
                </div>
                <p className="text-[11px] text-white/60 line-clamp-1 max-w-xl font-serif">
                  {lang === "bo" ? currentInspector.descriptionBo : currentInspector.descriptionEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveLandmark(currentInspector);
                playSound(currentInspector);
              }}
              className="px-3.5 py-1.5 rounded-sm bg-tibet-gold/20 hover:bg-tibet-gold hover:text-black border border-tibet-gold/50 text-tibet-gold text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
            >
              <span>{lang === "bo" ? "གནས་ལུགས་རྒྱས་པ ↗" : "Read Full Story ↗"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODE 3: CULTURAL PANORAMA BENTO VIEW
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "bento" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VILLAGE_LANDMARKS.map((landmark) => (
            <div
              key={landmark.id}
              onClick={() => {
                setActiveLandmark(landmark);
                playSound(landmark);
              }}
              className="group relative rounded-sm border border-border-subtle bg-card-bg/85 hover:bg-card-bg backdrop-blur-md p-5 transition-all duration-300 shadow-2xs hover:shadow-md hover:border-sakya-gold cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-md border ${landmark.borderClass} bg-stone-900 p-2 ${landmark.colorClass}`}>
                    {landmark.svgModel}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-border-subtle/50 text-muted">
                    {lang === "bo" ? landmark.categoryBo : landmark.categoryEn}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 lang="bo" className="font-serif text-base font-bold text-foreground">
                    {landmark.nameBo}
                  </h3>
                  <h4 className="text-xs font-medium text-foreground">
                    {landmark.nameEn}
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-3 leading-relaxed font-serif pt-1">
                    {lang === "bo" ? landmark.descriptionBo : landmark.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/60 text-xs">
                <span className="text-[10px] font-mono text-muted">
                  {lang === "bo" ? landmark.locationBo : landmark.locationEn}
                </span>
                <span className="text-sakya-crimson font-medium flex items-center gap-1">
                  <span>{lang === "bo" ? "གཟིགས" : "Discover"}</span>
                  <span>↗</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODE 4: CHRONICLE ARCHIVE CATALOGUE MODE
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "chronicle" && (
        <div className="rounded-sm border border-border-subtle bg-card-bg/80 backdrop-blur-md overflow-hidden shadow-xs divide-y divide-border-subtle">
          <div className="p-4 sm:p-5 bg-card-bg flex items-center justify-between border-b border-border-subtle">
            <div>
              <h3 className="font-serif text-lg font-medium text-foreground">
                {lang === "bo" ? "བོད་ཀྱི་འཚོ་བའི་རིག་གཞུང་དཀར་ཆག" : "Chronicle of Tibetan Living Heritage"}
              </h3>
              <p className="text-xs text-muted">
                {lang === "bo"
                  ? "ལོ་ངོ་ཉིས་སྟོང་རིང་གི་དམངས་ཁྲོད་འཚོ་བ། ལག་ཤེས། ཞིང་འབྲོག སྨན་རྩིས་བཅས་ཀྱི་ལོ་རྒྱུས།"
                  : "Everyday life, nomadic pastoralism, agricultural rites, medicine, and applied crafts over 2,000 years."}
              </p>
            </div>
            <span className="text-xs font-mono text-sakya-gold">
              8 CULTURAL SPHERES
            </span>
          </div>

          <div className="divide-y divide-border-subtle/70">
            {VILLAGE_LANDMARKS.map((landmark) => (
              <div
                key={landmark.id}
                onClick={() => {
                  setActiveLandmark(landmark);
                  playSound(landmark);
                }}
                className="p-4 sm:p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`w-12 h-12 rounded-md border ${landmark.borderClass} bg-stone-900 p-2 ${landmark.colorClass} shrink-0 shadow-xs`}>
                    {landmark.svgModel}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span lang="bo" className="font-serif text-base font-bold text-foreground">
                        {landmark.nameBo}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {landmark.nameEn}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-border-subtle/50 text-muted">
                        {lang === "bo" ? landmark.categoryBo : landmark.categoryEn}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-serif max-w-3xl">
                      {lang === "bo" ? landmark.descriptionBo : landmark.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound(landmark);
                    }}
                    className="p-2 rounded-full border border-border-subtle hover:border-tibet-gold text-muted hover:text-foreground text-xs cursor-pointer"
                    title="Play acoustic sound"
                  >
                    🎵 {landmark.freq} Hz
                  </button>
                  <span className="text-xs text-sakya-crimson font-medium">
                    {lang === "bo" ? "གཟིགས ↗" : "View ↗"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          CULTURAL SANCTUARY MODAL DRAWER (Deep Immersion across all modes)
          ══════════════════════════════════════════════════════════════════ */}
      {activeLandmark && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="active-landmark-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveLandmark(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-sm border border-sakya-gold/60 bg-[#161210] p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute inset-0 rounded-sm bg-gradient-to-b ${activeLandmark.bgGlowClass} opacity-60 pointer-events-none`}
            />

            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/15 pb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md border ${activeLandmark.borderClass} bg-stone-950 p-2.5 ${activeLandmark.colorClass} shadow-lg shrink-0`}
                >
                  {activeLandmark.svgModel}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-tibet-gold font-semibold">
                      {lang === "bo" ? activeLandmark.categoryBo : activeLandmark.categoryEn}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-white/70 uppercase">
                      {lang === "bo" ? activeLandmark.locationBo : activeLandmark.locationEn}
                    </span>
                    <span className="text-[10px] font-mono text-tibet-gold-light">
                      {activeLandmark.freq} Hz
                    </span>
                  </div>
                  <h3
                    id="active-landmark-heading"
                    lang="bo"
                    className="font-serif text-xl sm:text-2xl font-bold text-tibet-gold-light tracking-wide mt-0.5"
                  >
                    {activeLandmark.nameBo}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    {activeLandmark.nameEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveLandmark(null)}
                className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="relative z-10 space-y-4 text-sm leading-relaxed text-white/90">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold font-semibold block font-mono">
                  {lang === "bo" ? "ལོ་རྒྱུས་དང་འཚོ་བའི་རིན་ཐང་།" : "Living Cultural Heritage & Meaning"}
                </span>
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-serif">
                  {lang === "bo" ? activeLandmark.descriptionBo : activeLandmark.descriptionEn}
                </p>
              </div>

              <div className="p-4 rounded-sm border border-sakya-gold/40 bg-sakya-gold/10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold-light font-semibold block font-mono">
                  {lang === "bo" ? "ཉིན་རེའི་གོམས་གཤིས་དང་ལག་ལེན།" : "Traditional Living Customs & Practices"}
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-tibet-gold-light/90 font-serif">
                  {(lang === "bo" ? activeLandmark.practicesBo : activeLandmark.practicesEn).map(
                    (practice, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-tibet-gold text-xs mt-0.5">✦</span>
                        <span>{practice}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/15 text-xs">
              <span className="text-[11px] text-white/50 font-mono">
                {lang === "bo" ? "བོད་ཀྱི་རིག་གཞུང་ལོ་ཉིས་སྟོང་།" : "2,000 Years Tibetan Living Civilization"}
              </span>
              <button
                type="button"
                onClick={() => playSound(activeLandmark)}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-tibet-gold hover:text-black border border-white/20 text-white transition-all text-xs font-medium cursor-pointer flex items-center gap-2"
              >
                <span>🎵</span>
                <span className="font-mono">{lang === "bo" ? "སྒྲ་དབྱངས་བསྐྱར་གཏོང་" : "Play Instrument Timbre"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TibetanInteractiveOdyssey;
