"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

type Language = "en" | "bo";
type ViewMode = "mandala" | "matrix" | "archive";

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
  elementBo: string;
  elementEn: string;
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
    elementBo: "ནམ་མཁའ།",
    elementEn: "Space",
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/50",
    bgGlowClass: "from-amber-500/25 to-amber-700/5",
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
    elementBo: "ཆུ།",
    elementEn: "Water",
    colorClass: "text-rose-400",
    borderClass: "border-rose-400/50",
    bgGlowClass: "from-rose-500/25 to-rose-700/5",
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
    elementBo: "ས།",
    elementEn: "Earth",
    colorClass: "text-amber-300",
    borderClass: "border-amber-300/50",
    bgGlowClass: "from-amber-400/25 to-amber-600/5",
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
    elementBo: "རླུང་།",
    elementEn: "Air",
    colorClass: "text-cyan-300",
    borderClass: "border-cyan-300/50",
    bgGlowClass: "from-cyan-400/25 to-cyan-600/5",
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
    elementBo: "ས།",
    elementEn: "Earth",
    colorClass: "text-yellow-400",
    borderClass: "border-yellow-400/50",
    bgGlowClass: "from-yellow-500/25 to-yellow-700/5",
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
    elementBo: "ནམ་མཁའ།",
    elementEn: "Space",
    colorClass: "text-indigo-300",
    borderClass: "border-indigo-300/50",
    bgGlowClass: "from-indigo-400/25 to-indigo-600/5",
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
    elementBo: "ཆུ།",
    elementEn: "Water",
    colorClass: "text-emerald-300",
    borderClass: "border-emerald-300/50",
    bgGlowClass: "from-emerald-400/25 to-emerald-600/5",
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
    elementBo: "མེ།",
    elementEn: "Fire",
    colorClass: "text-red-400",
    borderClass: "border-red-400/50",
    bgGlowClass: "from-red-500/25 to-red-700/5",
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
  const [viewMode, setViewMode] = useState<ViewMode>("mandala");
  const [activeSign, setActiveSign] = useState<AuspiciousSign | null>(null);
  const [hoveredSign, setHoveredSign] = useState<AuspiciousSign | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotate, setTargetRotate] = useState({ rx: 0, ry: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* ══════════════════════════════════════════════════════════════════
     Authentic Himalayan Singing Bowl Acoustic Synthesizer (Web Audio API)
     Multi-harmonic physical modal synthesis:
     - Fundamental tone (f0)
     - Inharmonic modal strike overtone (2.76 * f0)
     - High silvery chime partial (5.40 * f0)
     - 4.2 Hz beating tremolo LFO (Himalayan hand-hammered wobble)
     - Resonant low-pass filter decay over 4.2s
     ══════════════════════════════════════════════════════════════════ */
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

        // Master gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        // Low-pass filter for warm bronze temple resonance
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.exponentialRampToValueAtTime(650, now + 3.5);
        filter.Q.value = 2.5;

        // Fundamental partial
        const oscFundamental = ctx.createOscillator();
        oscFundamental.type = "sine";
        oscFundamental.frequency.setValueAtTime(freq, now);

        // Strike modal partial (2.76x)
        const oscStrike = ctx.createOscillator();
        const strikeGain = ctx.createGain();
        strikeGain.gain.value = 0.38;
        oscStrike.type = "sine";
        oscStrike.frequency.setValueAtTime(freq * 2.76, now);

        // Shimmer overtone (5.4x)
        const oscShimmer = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerGain.gain.value = 0.15;
        oscShimmer.type = "sine";
        oscShimmer.frequency.setValueAtTime(freq * 5.4, now);

        // Beating LFO (4.2 Hz tremolo)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(4.2, now);
        lfoGain.gain.setValueAtTime(0.025, now);
        lfo.connect(lfoGain.gain);

        // Wiring
        oscFundamental.connect(masterGain);
        oscStrike.connect(strikeGain);
        strikeGain.connect(masterGain);
        oscShimmer.connect(shimmerGain);
        shimmerGain.connect(masterGain);

        masterGain.connect(filter);
        filter.connect(ctx.destination);

        oscFundamental.start(now);
        oscStrike.start(now);
        oscShimmer.start(now);
        lfo.start(now);

        oscFundamental.stop(now + 4.3);
        oscStrike.stop(now + 4.3);
        oscShimmer.stop(now + 4.3);
        lfo.stop(now + 4.3);

        setIsAudioActive(true);
        if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
        audioTimerRef.current = setTimeout(() => {
          setIsAudioActive(false);
        }, 3200);
      } catch {
        // AudioContext disabled or unpermitted
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
    setTargetRotate({ rx: -y * 18, ry: x * 22 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setTargetRotate({ rx: 0, ry: 0 });
    setHoveredSign(null);
  }, []);

  /* Ambient Himalayan Stardust & Proximity Constellation Particle Engine */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 580);

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
      "rgba(217, 163, 39, ",  // Tibetan Gold
      "rgba(251, 191, 36, ",  // Luminous Amber
      "rgba(56, 189, 248, ",  // Turquoise / Sky Blue
      "rgba(244, 114, 182, ", // Lotus Rose
    ];

    for (let i = 0; i < 54; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.15,
        alpha: Math.random() * 0.65 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render particles
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
        ctx.shadowBlur = p.size * 2.5;
        ctx.shadowColor = "rgba(217, 163, 39, 0.7)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw delicate celestial constellation links between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 65) * 0.16;
            ctx.strokeStyle = `rgba(217, 163, 39, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const currentInspector = hoveredSign || activeSign || AUSPICIOUS_SIGNS[0];

  return (
    <section
      aria-labelledby="odyssey-heading"
      className="space-y-6 pt-6 border-t border-sakya-gold/30"
    >
      {/* ══════════════════════════════════════════════════════════════════
          Header & Controls Bar (Swiss Architectural / L2 Style)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tibet-gold animate-ping" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-mono font-semibold px-2.5 py-0.5 rounded-full bg-tibet-gold-light border border-tibet-gold/30 text-tibet-gold-rich">
              {lang === "bo"
                ? "༢༠༠༠ ལོ་འཁོར་གྱི་ཉམས་མྱོང་ཁྱད་པར་ཅན།"
                : "Interactive Spatial Realm · 2,000 Years"}
            </span>
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider hidden sm:inline">
              ETH / L2 CRAFT · BOD-YIG UCHEN
            </span>
          </div>

          <h2
            id="odyssey-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground tracking-tight"
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
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          {/* Sound Resonance Switch */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playChime(432);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 border ${
              soundEnabled
                ? "bg-tibet-gold text-white border-tibet-gold shadow-xs"
                : "bg-card-bg/90 border-border-subtle text-muted hover:text-foreground"
            }`}
            title="Toggle singing bowl meditative tones"
          >
            <span>{soundEnabled ? "🔔" : "🔕"}</span>
            <span className="font-mono text-[11px]">
              {soundEnabled
                ? lang === "bo"
                  ? "སྒྲ་དབྱངས་འབྱེད"
                  : "Chimes: Active"
                : lang === "bo"
                ? "སྒྲ་མེད"
                : "Chimes: Off"}
            </span>
            {soundEnabled && isAudioActive && (
              <span className="flex items-center gap-0.5 text-xs animate-pulse">
                <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
              </span>
            )}
          </button>

          {/* Mode Switcher: 3D Mandala vs 3D Matrix vs Archive */}
          <div
            role="radiogroup"
            aria-label="View mode toggle"
            className="flex items-center rounded-full border border-border-subtle bg-card-bg/90 p-0.5 text-xs shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "mandala"}
              onClick={() => setViewMode("mandala")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1 ${
                viewMode === "mandala"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>🪐</span>
              <span>{lang === "bo" ? "དཀྱིལ་འཁོར" : "Mandala 3D"}</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "matrix"}
              onClick={() => setViewMode("matrix")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1 ${
                viewMode === "matrix"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>🌌</span>
              <span>{lang === "bo" ? "༣D དྲྭ་མིག" : "Spatial Matrix"}</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "archive"}
              onClick={() => setViewMode("archive")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1 ${
                viewMode === "archive"
                  ? "bg-sakya-crimson text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>📜</span>
              <span>{lang === "bo" ? "དཀར་ཆག" : "Archive"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SPATIAL REALM: MANDALA 3D ORBIT MODE (Jasmin Karatas Inspiration)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "mandala" && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full min-h-[580px] sm:min-h-[640px] rounded-sm border border-sakya-gold/40 bg-gradient-to-b from-[#0e0c0b] via-[#140f0d] to-[#080706] overflow-hidden shadow-2xl p-4 sm:p-8 flex flex-col justify-between select-none"
          style={{ perspective: "1400px" }}
        >
          {/* Background Canvas: Stardust & Constellations */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          />

          {/* Central Radial Spotlight following cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
            style={{
              background: `radial-gradient(circle 380px at ${50 + mousePos.x * 35}% ${
                50 + mousePos.y * 35
              }%, rgba(217, 163, 39, 0.22), transparent 75%)`,
            }}
          />

          {/* Top Telemetry Overlay (Swiss Architectural Style) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] text-white/50 font-mono tracking-wider border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-tibet-gold font-bold">✦ MANDALA ORBIT</span>
              <span className="text-white/30">|</span>
              <span className="text-white/70">
                PITCH: {targetRotate.rx.toFixed(1)}° · YAW: {targetRotate.ry.toFixed(1)}°
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-white/40">
                POKHARA PEMA TS&apos;AL · LAT 28°13&apos;N · LON 83°59&apos;E
              </span>
              <span className="text-tibet-gold-light px-2 py-0.5 rounded-xs bg-white/5 border border-white/10">
                {currentInspector.freq} HZ RESONANCE
              </span>
            </div>
          </div>

          {/* 3D Celestial Mandala Stage */}
          <div
            className="relative z-10 my-auto py-8 sm:py-12 transition-transform duration-300 ease-out will-change-transform flex items-center justify-center min-h-[360px] sm:min-h-[420px]"
            style={{
              transform: `rotateX(${targetRotate.rx}deg) rotateY(${targetRotate.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Luminous Central Axis Core (Dharmachakra & Sacred Seed OM) */}
            <div
              className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-tibet-gold/40 bg-gradient-to-br from-tibet-gold/20 via-black/80 to-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl pointer-events-none"
              style={{
                transform: "translateZ(10px)",
                animation: "spin 48s linear infinite",
              }}
            >
              <span
                lang="bo"
                className="font-serif text-3xl sm:text-4xl font-bold text-tibet-gold drop-shadow-[0_0_12px_rgba(217,163,39,0.8)]"
              >
                ཨོཾ
              </span>
              <span className="text-[9px] uppercase tracking-widest text-tibet-gold-light font-mono mt-0.5">
                BINDU · ཐིག་ལེ
              </span>
            </div>

            {/* Glowing Celestial Ring Tracks */}
            <div
              aria-hidden="true"
              className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-tibet-gold/20 pointer-events-none animate-pulse"
              style={{ transform: "translateZ(0px)" }}
            />
            <div
              aria-hidden="true"
              className="absolute w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-white/10 pointer-events-none"
              style={{ transform: "translateZ(-20px)" }}
            />

            {/* 8 Auspicious Signs Placed in Orbital 3D Trigonometric Positions */}
            <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
              {AUSPICIOUS_SIGNS.map((sign, idx) => {
                const total = AUSPICIOUS_SIGNS.length;
                const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
                // Responsive radius based on screen size
                const radiusMobile = 135;
                const radiusDesktop = 195;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                return (
                  <div
                    key={sign.id}
                    onClick={() => {
                      setActiveSign(sign);
                      playChime(sign.freq);
                    }}
                    onMouseEnter={() => {
                      setHoveredSign(sign);
                      playChime(sign.freq);
                    }}
                    onMouseLeave={() => setHoveredSign(null)}
                    className="group absolute cursor-pointer select-none"
                    style={{
                      transform: `translate(${cos * radiusDesktop}px, ${sin * radiusDesktop}px) translateZ(${
                        25 + Math.sin(idx * 1.5) * 15
                      }px)`,
                      transformStyle: "preserve-3d",
                      animation: "floating-gentle 5s ease-in-out infinite",
                      animationDelay: `${idx * 0.45}s`,
                    }}
                  >
                    {/* Floating Orb Card */}
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border ${sign.borderClass} bg-black/80 hover:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-2 transition-all duration-300 shadow-xl group-hover:scale-125 group-hover:shadow-[0_0_30px_rgba(217,163,39,0.5)]`}
                    >
                      {/* Aura Halo */}
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${sign.bgGlowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                      />

                      {/* Icon */}
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 ${sign.colorClass} transition-transform group-hover:scale-110 mb-0.5`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                          {sign.svgPath}
                        </svg>
                      </div>

                      {/* Short Tibetan Inscription */}
                      <span
                        lang="bo"
                        className="font-serif text-[10px] sm:text-xs font-semibold text-tibet-gold-light group-hover:text-tibet-gold truncate max-w-[70px] transition-colors leading-tight"
                      >
                        {sign.nameBo}
                      </span>

                      {/* Element Dot */}
                      <span className="text-[8px] font-mono text-white/50 group-hover:text-white uppercase tracking-widest">
                        {sign.element}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Telemetry & Live Inspector Drawer */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70 pt-3 border-t border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 rounded-sm">
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full border ${currentInspector.borderClass} bg-black/80 flex items-center justify-center ${currentInspector.colorClass} shrink-0`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  {currentInspector.svgPath}
                </svg>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span lang="bo" className="font-serif font-bold text-tibet-gold">
                    {currentInspector.nameBo}
                  </span>
                  <span className="text-[11px] text-white font-medium">
                    · {currentInspector.nameEn}
                  </span>
                  <span className="text-[10px] font-mono text-white/40 italic">
                    ({currentInspector.sanskrit})
                  </span>
                </div>
                <p className="text-[11px] text-white/60 line-clamp-1 max-w-xl font-serif">
                  {lang === "bo" ? currentInspector.blessingBo : currentInspector.blessingEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveSign(currentInspector);
                playChime(currentInspector.freq);
              }}
              className="px-3.5 py-1.5 rounded-sm bg-tibet-gold/20 hover:bg-tibet-gold hover:text-black border border-tibet-gold/50 text-tibet-gold text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
            >
              <span>{lang === "bo" ? "གནས་ལུགས་རྒྱས་པ ↗" : "Inspect Wisdom ↗"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SPATIAL REALM: 3D MATRIX GRID MODE
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "matrix" && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full min-h-[520px] rounded-sm border border-sakya-gold/40 bg-gradient-to-b from-neutral-950 via-[#140f0c] to-[#0c0908] overflow-hidden shadow-xl p-4 sm:p-8 flex flex-col justify-between select-none"
          style={{ perspective: "1200px" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          />

          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
            style={{
              background: `radial-gradient(circle 350px at ${50 + mousePos.x * 30}% ${
                50 + mousePos.y * 30
              }%, rgba(217, 163, 39, 0.18), transparent 75%)`,
            }}
          />

          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/50 font-mono tracking-wider border-b border-white/10 pb-3">
            <span className="flex items-center gap-1.5 text-tibet-gold">
              <span>✦</span>
              <span>ASHTAMANGALA · བཀྲ་ཤིས་རྟགས་བརྒྱད</span>
            </span>
            <span className="text-white/40">
              PITCH: {targetRotate.rx.toFixed(1)}° · YAW: {targetRotate.ry.toFixed(1)}°
            </span>
          </div>

          <div
            className="relative z-10 my-auto py-6 sm:py-8 transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `rotateX(${targetRotate.rx}deg) rotateY(${targetRotate.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {AUSPICIOUS_SIGNS.map((sign, idx) => {
                const floatDelay = `${idx * 0.4}s`;

                return (
                  <div
                    key={sign.id}
                    onClick={() => {
                      setActiveSign(sign);
                      playChime(sign.freq);
                    }}
                    onMouseEnter={() => {
                      setHoveredSign(sign);
                      playChime(sign.freq);
                    }}
                    className="group relative rounded-sm p-4 sm:p-5 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 hover:border-tibet-gold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-tibet-gold/25 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-2 hover:scale-105"
                    style={{
                      transformStyle: "preserve-3d",
                      animation: "floating-gentle 4.5s ease-in-out infinite",
                      animationDelay: floatDelay,
                    }}
                  >
                    <div
                      className={`absolute inset-0 rounded-sm bg-gradient-to-br ${sign.bgGlowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                    />

                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border ${sign.borderClass} bg-black/50 flex items-center justify-center ${sign.colorClass} shadow-md group-hover:scale-110 transition-transform duration-300 mb-3`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
                        {sign.svgPath}
                      </svg>
                    </div>

                    <span
                      lang="bo"
                      className="font-serif text-sm sm:text-base font-semibold text-tibet-gold-light group-hover:text-tibet-gold transition-colors tracking-wide"
                    >
                      {sign.nameBo}
                    </span>

                    <span className="text-[11px] sm:text-xs text-white/90 font-medium mt-1">
                      {sign.nameEn}
                    </span>

                    <span className="text-[10px] text-white/40 italic font-mono mt-0.5">
                      {sign.sanskrit} · {sign.freq} Hz
                    </span>

                    <span className="mt-3 text-[9px] uppercase tracking-widest text-tibet-gold border border-tibet-gold/30 px-2 py-0.5 rounded-full opacity-70 group-hover:opacity-100 group-hover:bg-tibet-gold/20 transition-all">
                      {lang === "bo" ? "ཞིབ་ཕྲ་གཟིགས ↗" : "Explore Wisdom ↗"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-white/40 pt-2 border-t border-white/10">
            <span>
              {lang === "bo"
                ? "💡 ཙིག་རྟགས་གཡོ་འགུལ་ལྟར་ ༣D ཞིང་ཁམས་འཁོར་བ། རྟགས་རེ་རེར་མནན་ཏེ་གཟིགས།"
                : "Hover to tilt the 3D realm with gyroscopic perspective. Click any emblem for deep philosophical meaning."}
            </span>
            <span className="font-mono text-tibet-gold/70">
              CHIME: {soundEnabled ? "ONLINE" : "MUTED"}
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SPATIAL REALM: ARCHIVE CATALOGUE TABLE MODE
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "archive" && (
        <div className="rounded-sm border border-border-subtle bg-card-bg/80 backdrop-blur-md overflow-hidden shadow-xs divide-y divide-border-subtle">
          <div className="p-4 sm:p-5 bg-card-bg flex items-center justify-between border-b border-border-subtle">
            <div>
              <h3 className="font-serif text-lg font-medium text-foreground">
                {lang === "bo" ? "བཀྲ་ཤིས་རྟགས་བརྒྱད་ཀྱི་དཀར་ཆག" : "Ashtamangala Sacred Catalogue"}
              </h3>
              <p className="text-xs text-muted">
                {lang === "bo"
                  ? "རྟགས་བརྒྱད་ཀྱི་བྱིན་རླབས་དང་གནས་ལུགས་ཆ་ཚང་།"
                  : "Complete spiritual inscriptions, elemental affiliations, and liturgical blessings."}
              </p>
            </div>
            <span className="text-xs font-mono text-sakya-gold">
              8 SYMBOLS · 5 ELEMENTS
            </span>
          </div>

          <div className="divide-y divide-border-subtle/70">
            {AUSPICIOUS_SIGNS.map((sign) => (
              <div
                key={sign.id}
                onClick={() => {
                  setActiveSign(sign);
                  playChime(sign.freq);
                }}
                className="p-4 sm:p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border ${sign.borderClass} bg-black/80 flex items-center justify-center ${sign.colorClass} shrink-0 shadow-xs`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                      {sign.svgPath}
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span lang="bo" className="font-serif text-base font-bold text-foreground">
                        {sign.nameBo}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {sign.nameEn}
                      </span>
                      <span className="text-[11px] font-mono text-muted">
                        ({sign.sanskrit})
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-border-subtle/50 text-muted">
                        {lang === "bo" ? sign.elementBo : sign.elementEn}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-serif max-w-3xl">
                      {lang === "bo" ? sign.meaningBo : sign.meaningEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playChime(sign.freq);
                    }}
                    className="p-2 rounded-full border border-border-subtle hover:border-tibet-gold text-muted hover:text-foreground text-xs cursor-pointer"
                    title="Play chime"
                  >
                    🔔 {sign.freq} Hz
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
          WISDOM SANCTUARY MODAL DRAWER (Deep Philosophical Immersion)
          ══════════════════════════════════════════════════════════════════ */}
      {activeSign && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="active-sign-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveSign(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-sm border border-sakya-gold/60 bg-[#161210] p-6 sm:p-8 text-white shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Modal Glow */}
            <div
              className={`absolute inset-0 rounded-sm bg-gradient-to-b ${activeSign.bgGlowClass} opacity-60 pointer-events-none`}
            />

            {/* Modal Header */}
            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/15 pb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border ${activeSign.borderClass} bg-black/80 flex items-center justify-center ${activeSign.colorClass} shadow-lg shrink-0`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-8 h-8 sm:w-9 sm:h-9"
                  >
                    {activeSign.svgPath}
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-tibet-gold font-semibold">
                      {activeSign.sanskrit}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-white/70 uppercase">
                      {lang === "bo" ? activeSign.elementBo : activeSign.elementEn}
                    </span>
                    <span className="text-[10px] font-mono text-tibet-gold-light">
                      {activeSign.freq} Hz
                    </span>
                  </div>
                  <h3
                    id="active-sign-heading"
                    lang="bo"
                    className="font-serif text-xl sm:text-2xl font-bold text-tibet-gold-light tracking-wide mt-0.5"
                  >
                    {activeSign.nameBo}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    {activeSign.nameEn}
                  </p>
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

            {/* Deep Philosophical Commentary */}
            <div className="relative z-10 space-y-4 text-sm leading-relaxed text-white/90">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold font-semibold block font-mono">
                  {lang === "bo" ? "གནས་ལུགས་དང་མཚོན་དོན།" : "Sacred Symbolism & Meaning"}
                </span>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-serif">
                  {lang === "bo" ? activeSign.meaningBo : activeSign.meaningEn}
                </p>
              </div>

              {/* Blessing Inscription */}
              <div className="p-4 rounded-sm border border-sakya-gold/40 bg-sakya-gold/10 space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold-light font-semibold block font-mono">
                  {lang === "bo" ? "བཀྲ་ཤིས་རྟེན་འབྲེལ་གྱི་བྱིན་རླབས།" : "Traditional Blessing"}
                </span>
                <p className="font-serif text-sm text-tibet-gold-light leading-relaxed">
                  {lang === "bo" ? activeSign.blessingBo : activeSign.blessingEn}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/15 text-xs">
              <span className="text-[11px] text-white/50 font-mono">
                {lang === "bo" ? "ལོ་ཉིས་སྟོང་དུས་སྟོན།" : "2,000 Years Tibetan Living Heritage"}
              </span>
              <button
                type="button"
                onClick={() => playChime(activeSign.freq)}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-tibet-gold hover:text-black border border-white/20 text-white transition-all text-xs font-medium cursor-pointer flex items-center gap-2"
              >
                <span>🔔</span>
                <span className="font-mono">{lang === "bo" ? "སྒྲ་དབྱངས་བསྐྱར་གཏོང་" : "Resonate Bell (Singing Bowl)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TibetanInteractiveOdyssey;
