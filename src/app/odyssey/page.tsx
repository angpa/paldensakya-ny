"use client";

import { useState } from "react";
import Link from "next/link";
import TibetanInteractiveOdyssey from "@/components/TibetanInteractiveOdyssey";

type Language = "en" | "bo";

const ODYSSEY_UI = {
  en: {
    backCulture: "← Back to Tibetan Culture",
    backHome: "Home",
    badge: "3D Potala Palace & Living Tibetan Village · 2,000 Years",
    title: "3D Potala Palace Diorama & Living Tibetan Heritage",
    subtitle:
      "Explore our interactive 360° WebGL 3D architectural model of the Potala Palace (Potrang Marpo, Potrang Karpo, Golden Roofs, and Shol Village on Marpo Ri Hill) alongside the walkable Game Boy Tibetan village.",
    sacredCenter: "Palden Sakya Center · New York",
    footerText:
      "Palden Sakya Center · Dedicated to the preservation of Tibetan living culture and Buddha Dharma.",
  },
  bo: {
    backCulture: "← བོད་ཀྱི་རིག་གཞུང་ལ་ཕྱིར་ལོག",
    backHome: "གཙོ་ངོས།",
    badge: "ཕོ་བྲང་པོ་ཏ་ལ་དང་བོད་ཀྱི་གྲོང་གསེབ་༣D",
    title: "༄༅། །ཕོ་བྲང་པོ་ཏ་ལ་དང་བོད་ཀྱི་འཚོ་བའི་རིག་གཞུང་༣D།",
    subtitle:
      "ལྷ་སའི་དམར་པོ་རིའི་སྟེང་གི་ཕོ་བྲང་པོ་ཏ་ལའི་(ཕོ་བྲང་དམར་པོ་དང་། ཕོ་བྲང་དཀར་པོ། གསེར་ཐོག ཞོལ་གྲོང་)༣D དཔེ་གཟུགས་དང་། བོད་ཀྱི་སྲོལ་རྒྱུན་གྲོང་གསེབ་ཀྱི་རིག་གཞུང་ཞིང་ཁམས།",
    sacredCenter: "ནིའུ་ཡོག་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས།",
    footerText:
      "ནིའུ་ཡོག་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས། བོད་ཀྱི་སྐད་ཡིག་རིག་གཞུང་དང་དམ་ཆོས་ཉར་ཚགས་ཆེད།",
  },
};

export default function OdysseyPage() {
  const [lang, setLang] = useState<Language>("bo");
  const t = ODYSSEY_UI[lang];

  return (
    <div className="min-h-screen bg-[#0a0807] text-[#faf8f5] flex flex-col justify-between selection:bg-tibet-gold selection:text-black">
      {/* Top sacred ribbon */}
      <div
        aria-hidden="true"
        className="lungta-ribbon h-2 transition-all duration-300 relative z-20"
      >
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 relative z-20 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/tibetan-culture"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-tibet-gold hover:text-white transition-colors"
          >
            <span>{t.backCulture}</span>
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <span>{t.backHome}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 font-serif hidden md:inline">
            {t.sacredCenter}
          </span>

          {/* Language Switcher Toggle */}
          <div
            role="radiogroup"
            aria-label="Language selection"
            className="flex items-center rounded-sm border border-white/15 bg-white/5 backdrop-blur-md p-0.5 shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={lang === "en"}
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                lang === "en"
                  ? "bg-sakya-crimson text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={lang === "bo"}
              onClick={() => setLang("bo")}
              className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                lang === "bo"
                  ? "bg-sakya-crimson text-white font-serif"
                  : "text-white/60 hover:text-white font-serif"
              }`}
            >
              བོད་ཡིག
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Odyssey Experience */}
      <main className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 flex-1 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-tibet-gold/20 border border-tibet-gold/40 text-tibet-gold font-semibold font-mono">
              {t.badge}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Full-Scale 3D Odyssey */}
        <TibetanInteractiveOdyssey lang={lang} />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/80 py-6 text-center text-xs text-white/50 relative z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{t.footerText}</span>
          <div className="flex items-center gap-4 text-white/40">
            <Link href="/" className="hover:text-tibet-gold transition-colors">
              {lang === "bo" ? "གཙོ་ངོས།" : "Home"}
            </Link>
            <Link
              href="/tibetan-culture"
              className="hover:text-tibet-gold transition-colors"
            >
              {lang === "bo" ? "བོད་ཀྱི་རིག་གཞུང་།" : "Tibetan Culture"}
            </Link>
            <Link
              href="/archive"
              className="hover:text-tibet-gold transition-colors"
            >
              {lang === "bo" ? "ཡིག་ཚགས (༩༤)" : "Archive (94 Photos)"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

