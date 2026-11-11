"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Language = "en" | "bo";

interface AuspiciousSign {
  id: string;
  tibetan: string;
  sanskrit: string;
  nameEn: string;
  nameBo: string;
  meaningEn: string;
  meaningBo: string;
  blessingEn: string;
  blessingBo: string;
  element: "space" | "air" | "fire" | "water" | "earth";
  colorClass: string;
  borderClass: string;
  bgGlowClass: string;
  freq: number; // Web Audio chime frequency in Hz
  svgPath: React.ReactNode;
}

const AUSPICIOUS_SIGNS: AuspiciousSign[] = [
  {
    id: "wheel",
    tibetan: "ཆོས་ཀྱི་འཁོར་ལོ།",
    sanskrit: "Dharmachakra",
    nameEn: "The Golden Dharma Wheel",
    nameBo: "ཆོས་ཀྱི་འཁོར་ལོ།",
    meaningEn: "The eternal turning of the Buddha's teachings of wisdom and boundless compassion across realms and centuries.",
    meaningBo: "སྟོན་པ་ཤཱཀྱ་ཐུབ་པའི་དམ་ཆོས་འཁོར་ལོ་རིམ་པ་གསུམ་བསྐོར་བའི་བདེན་པའི་སྙིང་པོ།",
    blessingEn: "Bestows the wisdom to overcome ignorance and guides the mind on the eightfold path.",
    blessingBo: "མ་རིག་མུན་པ་སེལ་ཞིང་ཡེ་ཤེས་ཀྱི་སྣང་བ་རྒྱས་པའི་རྟེན་འབྲེལ།",
    element: "space",
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/50",
    bgGlowClass: "from-amber-500/20 to-amber-700/5",
    freq: 432,
    svgPath: (
      <>
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
        <line x1="12" y1="3" x2="12" y2="8.5" strokeWidth="1.8" />
        <line x1="12" y1="15.5" x2="12" y2="21" strokeWidth="1.8" />
        <line x1="3" y1="12" x2="8.5" y2="12" strokeWidth="1.8" />
        <line x1="15.5" y1="12" x2="21" y2="12" strokeWidth="1.8" />
        <line x1="5.6" y1="5.6" x2="9.5" y2="9.5" strokeWidth="1.8" />
        <line x1="14.5" y1="14.5" x2="18.4" y2="18.4" strokeWidth="1.8" />
        <line x1="18.4" y1="5.6" x2="14.5" y2="9.5" strokeWidth="1.8" />
        <line x1="9.5" y1="14.5" x2="5.6" y2="18.4" strokeWidth="1.8" />
      </>
    ),
  },
  {
    id: "lotus",
    tibetan: "པདྨ།",
    sanskrit: "Padma",
    nameEn: "The Sacred Lotus",
    nameBo: "དྲི་མེད་པདྨ།",
    meaningEn: "Emerging unstained from the mud, representing primordial purity of mind, speech, and body amid worldly existence.",
    meaningBo: "འདམ་ལས་སྐྱེས་ཀྱང་འདམ་གྱིས་མ་གོས་པའི་རྣམ་དག་སྐུ་གསུང་ཐུགས་ཀྱི་མཚོན་དོན།",
    blessingEn: "Purifies negative deeds and unfolds the innate radiant compassion within.",
    blessingBo: "ལས་ངན་སྒྲིབ་པ་དག་ཅིང་རང་བྱུང་སྙིང་རྗེའི་མེ་ཏོག་རྒྱས་པའི་རྟེན་འབྲེལ།",
    element: "water",
    colorClass: "text-rose-400",
    borderClass: "border-rose-400/50",
    bgGlowClass: "from-rose-500/20 to-rose-700/5",
    freq: 528,
    svgPath: (
      <>
        <path d="M12 3c-2 4-4 8-4 12a4 4 0 008 0c0-4-2-8-4-12z" strokeWidth="1.8" />
        <path d="M12 15c-3-2-6-1-7 2 1 3 4 4 7 4" strokeWidth="1.8" />
        <path d="M12 15c3-2 6-1 7 2-1 3-4 4-7 4" strokeWidth="1.8" />
        <path d="M12 21v-3" strokeWidth="1.8" />
      </>
    ),
  },
  {
    id: "knot",
    tibetan: "དཔལ་བེའུ།",
    sanskrit: "Shrivatsa",
    nameEn: "The Endless Knot",
    nameBo: "དཔལ་བེའུ།",
    meaningEn: "The interweaving of wisdom and compassion; the endless cycle of cause and effect, harmony, and mutual interdependence.",
    meaningBo: "ཐབས་དང་ཤེས་རབ་ཟུང་འཇུག་དང་རྟེན་ཅིང་འབྲེལ་བར་འབྱུང་བའི་མཐའ་མེད་རྒྱུན་གཟུགས།",
    blessingEn: "Creates harmonious relationships, longevity, and auspicious causes for spiritual realization.",
    blessingBo: "མཐུན་ལམ་དང་ཚེ་བསོད། བྱང་ཆུབ་ཀྱི་ལམ་དུ་རྟེན་འབྲེལ་བཟང་པོ་འགྲིལ་བའི་དཔལ།",
    element: "earth",
    colorClass: "text-amber-300",
    borderClass: "border-amber-300/50",
    bgGlowClass: "from-amber-400/20 to-amber-600/5",
    freq: 396,
    svgPath: (
      <path
        d="M8 8l8 8M16 8l-8 8M12 4l8 8-4 4-8-8 4-4zM4 12l8-8 4 4-8 8-4-4z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "conch",
    tibetan: "དུང་དཀར་གཡས་འཁྱིལ།",
    sanskrit: "Shankha",
    nameEn: "The Right-Turning Conch",
    nameBo: "དུང་དཀར་གཡས་འཁྱིལ།",
    meaningEn: "The far-reaching and melodious sound of the Buddha's teachings, awakening beings from the deep sleep of ignorance.",
    meaningBo: "དམ་ཆོས་ཀྱི་སྒྲ་དབྱངས་ཕྱོགས་བཅུར་ཁྱབ་ཅིང་ཉོན་མོངས་གཉིད་ལས་སློང་བའི་མཚོན་རྟགས།",
    blessingEn: "Brings fame, clear communication, and the blessing of hearing profound teachings.",
    blessingBo: "གྲགས་པ་དང་ཚིག་བཟང་། ཆོས་ཀྱི་སྒྲ་དབྱངས་ཐོས་པའི་སྐལ་བཟང་འཕེལ་བའི་རྟེན།",
    element: "air",
    colorClass: "text-cyan-300",
    borderClass: "border-cyan-300/50",
    bgGlowClass: "from-cyan-400/20 to-cyan-600/5",
    freq: 639,
    svgPath: (
      <>
        <path d="M12 4c5 0 9 4 9 9s-3 8-7 8c-3 0-5-2-6-5l8-4c1-2 0-4-2-5l-2-3z" strokeWidth="1.8" />
        <path d="M12 4c-3 0-6 3-6 7 0 5 4 10 8 10" strokeWidth="1.8" />
        <circle cx="12" cy="13" r="2" strokeWidth="1.8" />
      </>
    ),
  },
  {
    id: "vase",
    tibetan: "གཏེར་གྱི་བུམ་པ།",
    sanskrit: "Kalasha",
    nameEn: "The Treasure Vase",
    nameBo: "གཏེར་གྱི་བུམ་པ།",
    meaningEn: "An inexhaustible celestial vessel holding jewels of longevity, spiritual wealth, and the boundless nectar of liberation.",
    meaningBo: "ཟད་མི་ཤེས་པའི་དགོས་འདོད་ཀུན་འབྱུང་གི་རིན་པོ་ཆེའི་གཏེར་དང་བདུད་རྩིའི་བུམ་པ།",
    blessingEn: "Attracts inner contentment, boundless prosperity, and spiritual vitality.",
    blessingBo: "ནང་གི་ཚིམ་པ་དང་དཔལ་འབྱོར། ཚེ་དང་བསོད་ནམས་ཡར་ངོའི་ཟླ་ལྟར་འཕེལ་བའི་རྟེན།",
    element: "earth",
    colorClass: "text-yellow-400",
    borderClass: "border-yellow-400/50",
    bgGlowClass: "from-yellow-500/20 to-yellow-700/5",
    freq: 741,
    svgPath: (
      <>
        <path d="M8 8h8M9 4h6M9 4v4M15 4v4" strokeWidth="1.8" />
        <path d="M7 8c-3 3-3 7 0 10 2 2 8 2 10 0 3-3 3-7 0-10" strokeWidth="1.8" />
        <path d="M9 19h6" strokeWidth="1.8" />
        <circle cx="12" cy="13" r="2.5" strokeWidth="1.8" />
      </>
    ),
  },
  {
    id: "parasol",
    tibetan: "རིན་ཆེན་གདུགས།",
    sanskrit: "Chhatra",
    nameEn: "The Precious Parasol",
    nameBo: "རིན་ཆེན་གདུགས།",
    meaningEn: "The protective canopy shielding sentient beings from the scorching heat of afflictions, harms, and lower rebirths.",
    meaningBo: "ཉོན་མོངས་པའི་ཚ་གདུང་དང་གནོད་པ་ཀུན་ལས་སྐྱོབ་པའི་བསིལ་ཡབ་རིན་པོ་ཆེའི་གདུགས།",
    blessingEn: "Shields against obstacles, illness, and unfavorable planetary or environmental conditions.",
    blessingBo: "བར་ཆད་དང་ནད་གདོན། མི་མཐུན་ཕྱོགས་ཀུན་ལས་རྣམ་པར་རྒྱལ་བའི་སྲུང་སྐྱོབ།",
    element: "space",
    colorClass: "text-indigo-300",
    borderClass: "border-indigo-300/50",
    bgGlowClass: "from-indigo-400/20 to-indigo-600/5",
    freq: 852,
    svgPath: (
      <>
        <path d="M4 12c0-5 3.5-8 8-8s8 3 8 8H4z" strokeWidth="1.8" />
        <path d="M12 4V2M12 12v9c0 1-1 2-2 2" strokeWidth="1.8" />
        <path d="M7 12c0 2 2 3 5 3s5-1 5-3" strokeWidth="1.8" />
      </>
    ),
  },
  {
    id: "fishes",
    tibetan: "གསེར་གྱི་ཉ་མོ།",
    sanskrit: "Matsyayugma",
    nameEn: "The Pair of Golden Fishes",
    nameBo: "གསེར་གྱི་ཉ་མོ།",
    meaningEn: "Swimmers in the ocean of cyclic existence who fearlessly glide with total joy and freedom, drowning in no sorrow.",
    meaningBo: "འཁོར་བའི་རྒྱ་མཚོར་འཇིགས་པ་མེད་པར་རྩེན་པའི་རང་དབང་དང་བདེ་སྐྱིད་ཀྱི་མཚོན་དོན།",
    blessingEn: "Grants fearlessness, fertility, and joyous adaptability in any life circumstance.",
    blessingBo: "འཇིགས་མེད་དང་བདེ་ལེགས། གནས་སྟངས་གང་ལའང་རང་དབང་དུ་འགྱུར་བའི་རྟེན་འབྲེལ།",
    element: "water",
    colorClass: "text-emerald-300",
    borderClass: "border-emerald-300/50",
    bgGlowClass: "from-emerald-400/20 to-emerald-600/5",
    freq: 584,
    svgPath: (
      <>
        <path d="M6 8c4-3 8-1 10 3-3 2-7 2-10-3z" strokeWidth="1.8" />
        <path d="M18 16c-4 3-8 1-10-3 3-2 7-2 10 3z" strokeWidth="1.8" />
        <circle cx="8" cy="7" r="1" fill="currentColor" />
        <circle cx="16" cy="17" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    id: "banner",
    tibetan: "རྒྱལ་མཚན།",
    sanskrit: "Dhvaja",
    nameEn: "The Victory Banner",
    nameBo: "རྒྱལ་མཚན།",
    meaningEn: "Erected atop Mount Meru, signifying the triumph of Buddhist wisdom over the four Maras (inner delusions and mortality).",
    meaningBo: "བདུད་བཞིའི་གཡུལ་ལས་རྣམ་པར་རྒྱལ་ཏེ་དམ་པའི་ཆོས་ཀྱི་རྒྱལ་མཚན་མཐོན་པོར་བསྒྲེངས་པ།",
    blessingEn: "Inspires moral courage, spiritual victory over obstacles, and triumphant success in virtuous deeds.",
    blessingBo: "བདུད་ལས་རྣམ་པར་རྒྱལ་ཞིང་དགེ་བའི་ལས་དོན་མཐའ་དག་ལྷུན་གྱིས་འགྲུབ་པའི་དཔལ།",
    element: "fire",
    colorClass: "text-red-400",
    borderClass: "border-red-400/50",
    bgGlowClass: "from-red-500/20 to-red-700/5",
    freq: 963,
    svgPath: (
      <>
        <path d="M6 3v19M6 5h12l-3 4 3 4H6" strokeWidth="1.8" />
        <circle cx="6" cy="3" r="1.5" strokeWidth="1.8" />
        <path d="M10 13v5M14 13v3" strokeWidth="1.8" />
      </>
    ),
  },
];

export function TibetanInteractiveOdyssey({ lang }: { lang: Language }) {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [activeSign, setActiveSign] = useState<AuspiciousSign | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotate, setTargetRotate] = useState({ rx: 0, ry: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play gentle meditative singing bowl chime via Web Audio API (no external asset needed)
  const playChime = useCallback(
    (freq: number) => {
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
        const osc = ctx.createOscillator();
        const oscOvertone = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        oscOvertone.type = "sine";
        oscOvertone.frequency.setValueAtTime(freq * 1.5, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        oscOvertone.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        oscOvertone.start(now);
        osc.stop(now + 2.3);
        oscOvertone.stop(now + 2.3);
      } catch {
        // AudioContext not allowed or disabled
      }
    },
    [soundEnabled]
  );

  // Mouse & Touch 3D Parallax Tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
    setTargetRotate({ rx: -y * 14, ry: x * 18 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setTargetRotate({ rx: 0, ry: 0 });
  }, []);

  // Ambient Golden Stardust Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

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

    const colors = [
      "rgba(217, 163, 39, ", // Tibetan Gold
      "rgba(244, 212, 122, ", // Luminous Yellow
      "rgba(248, 113, 113, ", // Crimson Spark
      "rgba(56, 189, 248, ",  // Turquoise / Sky Blue
    ];

    for (let i = 0; i < 48; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2, // Floats gently upward
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = "rgba(217, 163, 39, 0.8)";
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
  }, []);

  return (
    <section
      aria-labelledby="odyssey-heading"
      className="space-y-6 pt-4 border-t border-sakya-gold/30"
    >
      {/* Header & Controls bar (like Jasmin Karatas "Enter Voyage" / "Simple Website") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tibet-gold animate-pulse shadow-xs" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-tibet-gold-light border border-tibet-gold/30 text-tibet-gold-rich">
              {lang === "bo"
                ? "༢༠༠༠ ལོ་འཁོར་གྱི་ཉམས་མྱོང་ཁྱད་པར་ཅན།"
                : "Interactive Spatial Realm · 2,000 Years"}
            </span>
          </div>
          <h2
            id="odyssey-heading"
            className="font-serif text-2xl sm:text-3xl font-medium text-foreground tracking-tight"
          >
            {lang === "bo"
              ? "༄༅། །བཀྲ་ཤིས་རྟགས་བརྒྱད་དང་འབྱུང་ལྔའི་ཞིང་ཁམས།"
              : "The Eight Auspicious Symbols & Sacred Elements"}
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            {lang === "bo"
              ? "རྟགས་རེ་རེར་མནན་ཏེ་ལོ་ཉིས་སྟོང་ལྷག་གི་བོད་ཀྱི་རིག་གཞུང་དང་ནང་དོན་རིག་པའི་ཟབ་དོན་དང་བྱིན་རླབས་ལ་གཟིགས།"
              : "An interactive spatial voyage through 2,000+ years of living wisdom. Hover or tap each sacred talisman to illuminate its philosophical meaning and meditative tone."}
          </p>
        </div>

        {/* View Mode & Audio Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playChime(432);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
              soundEnabled
                ? "bg-tibet-gold text-white border-tibet-gold shadow-xs"
                : "bg-card-bg/80 border-border-subtle text-muted hover:text-foreground"
            }`}
            title="Toggle singing bowl meditative tones"
          >
            <span>{soundEnabled ? "🔔" : "🔕"}</span>
            <span>
              {soundEnabled
                ? lang === "bo"
                  ? "སྒྲ་དབྱངས་འབྱེད"
                  : "Chimes: On"
                : lang === "bo"
                ? "སྒྲ་མེད"
                : "Chimes: Off"}
            </span>
          </button>

          <div
            role="radiogroup"
            aria-label="View mode toggle"
            className="flex items-center rounded-full border border-border-subtle bg-card-bg/90 p-0.5 text-xs shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "3d"}
              onClick={() => setViewMode("3d")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                viewMode === "3d"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {lang === "bo" ? "🌌 ༣D ཞིང་ཁམས" : "🌌 3D Voyage"}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                viewMode === "grid"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {lang === "bo" ? "📜 དྲྭ་མིག" : "📜 Grid View"}
            </button>
          </div>
        </div>
      </div>

      {/* 3D Interactive Spatial Realm (Jasmin Karatas Odyssey style) */}
      {viewMode === "3d" ? (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full min-h-[480px] sm:min-h-[560px] rounded-sm border border-sakya-gold/40 bg-gradient-to-b from-neutral-950 via-[#140f0c] to-[#0c0908] overflow-hidden shadow-xl p-4 sm:p-8 flex flex-col justify-between select-none"
          style={{ perspective: "1200px" }}
        >
          {/* Background Canvas: Floating Golden Stardust & Ethereal Ribbons */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          />

          {/* Central Sacred Mandala Radial Light Glow */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
            style={{
              background: `radial-gradient(circle 350px at ${50 + mousePos.x * 30}% ${
                50 + mousePos.y * 30
              }%, rgba(217, 163, 39, 0.18), transparent 75%)`,
            }}
          />

          {/* Top Realm Badge */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/50 font-mono tracking-wider">
            <span className="flex items-center gap-1.5 text-tibet-gold">
              <span>✦</span>
              <span>ASHTAMANGALA · བཀྲ་ཤིས་རྟགས་བརྒྱད</span>
            </span>
            <span className="hidden sm:inline text-white/40">
              Interactive 3D Gyroscopic Stage
            </span>
          </div>

          {/* The Floating 3D Talismans Stage */}
          <div
            className="relative z-10 my-auto py-6 sm:py-8 transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `rotateX(${targetRotate.rx}deg) rotateY(${targetRotate.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {AUSPICIOUS_SIGNS.map((sign, idx) => {
                // Gentle floating sine wave offset
                const floatDelay = `${idx * 0.4}s`;

                return (
                  <div
                    key={sign.id}
                    onClick={() => {
                      setActiveSign(sign);
                      playChime(sign.freq);
                    }}
                    onMouseEnter={() => playChime(sign.freq)}
                    className="group relative rounded-sm p-4 sm:p-5 bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 hover:border-tibet-gold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-tibet-gold/20 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-2 hover:scale-102"
                    style={{
                      transformStyle: "preserve-3d",
                      animation: `floating-gentle 4.5s ease-in-out infinite`,
                      animationDelay: floatDelay,
                    }}
                  >
                    {/* Glowing Aura */}
                    <div
                      className={`absolute inset-0 rounded-sm bg-gradient-to-br ${sign.bgGlowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                    />

                    {/* Emblem Icon */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border ${sign.borderClass} bg-black/50 flex items-center justify-center ${sign.colorClass} shadow-md group-hover:scale-110 transition-transform duration-300 mb-3`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-7 h-7 sm:w-8 sm:h-8"
                      >
                        {sign.svgPath}
                      </svg>
                    </div>

                    {/* Tibetan Uchen Name */}
                    <span
                      lang="bo"
                      className="font-serif text-sm sm:text-base font-semibold text-tibet-gold-light group-hover:text-tibet-gold transition-colors tracking-wide"
                    >
                      {sign.nameBo}
                    </span>

                    {/* Sanskrit & English Name */}
                    <span className="text-[11px] sm:text-xs text-white/90 font-medium mt-1">
                      {sign.nameEn}
                    </span>

                    <span className="text-[10px] text-white/40 italic font-mono mt-0.5">
                      {sign.sanskrit}
                    </span>

                    {/* Explore Pill on hover */}
                    <span className="mt-3 text-[9px] uppercase tracking-widest text-tibet-gold border border-tibet-gold/30 px-2 py-0.5 rounded-full opacity-70 group-hover:opacity-100 group-hover:bg-tibet-gold/20 transition-all">
                      {lang === "bo" ? "ཞིབ་ཕྲ་གཟིགས ↗" : "Explore Wisdom ↗"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Stage Hint */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-white/40 pt-2 border-t border-white/10">
            <span>
              {lang === "bo"
                ? "💡 ཙིག་རྟགས་གཡོ་འགུལ་ལྟར་ ༣D ཞིང་ཁམས་འཁོར་བ། རྟགས་རེ་རེར་མནན་ཏེ་གཟིགས།"
                : "💡 Cursor movement tilts the 3D realm. Tap any sacred talisman for the 2,000-year wisdom blessing."}
            </span>
            <span className="font-mono text-tibet-gold/80">
              Tibetan Sacred Elements V.1
            </span>
          </div>
        </div>
      ) : (
        /* Alternative Classical Grid View (Like Jasmin Karatas Simple Website mode) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUSPICIOUS_SIGNS.map((sign) => (
            <div
              key={sign.id}
              onClick={() => {
                setActiveSign(sign);
                playChime(sign.freq);
              }}
              className="p-5 rounded-sm border border-border-subtle bg-card-bg/80 hover:border-sakya-gold hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-tibet-gold-light border border-tibet-gold/30 flex items-center justify-center text-tibet-gold-rich group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      {sign.svgPath}
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
                    {sign.sanskrit}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-sakya-crimson transition-colors">
                    {lang === "bo" ? sign.nameBo : sign.nameEn}
                  </h3>
                  <p className="text-xs text-tibet-gold-rich font-serif mt-0.5">
                    {sign.tibetan}
                  </p>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {lang === "bo" ? sign.meaningBo : sign.meaningEn}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle/60 text-[11px] text-sakya-crimson font-medium flex items-center justify-between">
                <span>{lang === "bo" ? "བྱིན་རླབས་གཟིགས" : "Read Blessing"}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deep Wisdom Modal Drawer */}
      {activeSign && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeSign.nameEn}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveSign(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-sm border border-sakya-gold/60 bg-neutral-950 text-white p-6 sm:p-8 shadow-2xl space-y-5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Radial Glow */}
            <div
              className={`absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br ${activeSign.bgGlowClass} blur-3xl pointer-events-none`}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full border ${activeSign.borderClass} bg-black/60 flex items-center justify-center ${activeSign.colorClass}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                    {activeSign.svgPath}
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white">
                    {lang === "bo" ? activeSign.nameBo : activeSign.nameEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-tibet-gold font-serif">
                    <span>{activeSign.tibetan}</span>
                    <span className="text-white/40">·</span>
                    <span className="font-mono text-white/60">{activeSign.sanskrit}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSign(null)}
                className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Deep Meaning */}
            <div className="space-y-3 text-sm leading-relaxed text-white/90">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold font-semibold block">
                  {lang === "bo" ? "གནས་ལུགས་དང་མཚོན་དོན།" : "Sacred Symbolism & Meaning"}
                </span>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-serif">
                  {lang === "bo" ? activeSign.meaningBo : activeSign.meaningEn}
                </p>
              </div>

              {/* Blessing Inscription */}
              <div className="p-4 rounded-sm border border-sakya-gold/40 bg-sakya-gold/10 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold-light font-semibold block">
                  {lang === "bo" ? "བཀྲ་ཤིས་རྟེན་འབྲེལ་གྱི་བྱིན་རླབས།" : "Traditional Blessing"}
                </span>
                <p className="font-serif text-sm text-tibet-gold-light leading-relaxed">
                  {lang === "bo" ? activeSign.blessingBo : activeSign.blessingEn}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-[11px] text-white/50 font-mono">
                {lang === "bo" ? "ལོ་ཉིས་སྟོང་དུས་སྟོན།" : "2,000 Years Tibetan Living Heritage"}
              </span>
              <button
                type="button"
                onClick={() => playChime(activeSign.freq)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-tibet-gold hover:text-black border border-white/20 text-white transition-all text-xs font-medium cursor-pointer flex items-center gap-1.5"
              >
                <span>🔔</span>
                <span>{lang === "bo" ? "སྒྲ་དབྱངས་བསྐྱར་གཏོང་" : "Resonate Bell"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TibetanInteractiveOdyssey;
