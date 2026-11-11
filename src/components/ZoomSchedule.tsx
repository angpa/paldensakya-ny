"use client";

import { useEffect, useState } from "react";

type Language = "en" | "bo";
type SeasonMode = "auto" | "winter" | "summer";

interface ZoomScheduleProps {
  lang: Language;
  programId?: "daily-prayers" | "weekly-tara" | "all";
}

interface SessionTime {
  titleEn: string;
  titleBo: string;
  nyTime: string;
  argWinterTime: string; // +2 hours (EST)
  argSummerTime: string; // +1 hour (EDT)
  localHintEn: string;
  localHintBo: string;
}

const DAILY_SESSIONS: SessionTime[] = [
  {
    titleEn: "Morning Lineage Prayers",
    titleBo: "ཞོགས་པའི་བརྒྱུད་འདེབས་ཞལ་འདོན།",
    nyTime: "7:00 AM – 7:30 AM",
    argWinterTime: "9:00 AM – 9:30 AM",
    argSummerTime: "8:00 AM – 8:30 AM",
    localHintEn: "Every day · Morning session",
    localHintBo: "ཉིན་ལྟར་ཞོགས་པའི་ཆུ་ཚོད།",
  },
  {
    titleEn: "Evening Lineage Prayers",
    titleBo: "དགོང་མོའི་བརྒྱུད་འདེབས་ཞལ་འདོན།",
    nyTime: "8:30 PM – 9:00 PM",
    argWinterTime: "10:30 PM – 11:00 PM",
    argSummerTime: "9:30 PM – 10:00 PM",
    localHintEn: "Every day · Evening session",
    localHintBo: "ཉིན་ལྟར་དགོང་མོའི་ཆུ་ཚོད།",
  },
];

const SUNDAY_SESSIONS: SessionTime[] = [
  {
    titleEn: "Green Tara Four Mandala Practice",
    titleBo: "སྒྲོལ་མ་བཞི་ཆོག་དང་ཕྱག་འཚལ་ཉེར་གཅིག",
    nyTime: "12:00 PM (noon) – 1:30 PM",
    argWinterTime: "2:00 PM – 3:30 PM",
    argSummerTime: "1:00 PM – 2:30 PM",
    localHintEn: "Sundays only · Liturgy & Puja",
    localHintBo: "གཟའ་ཉི་མ་ཁོ་ནར། སྒྲོལ་ཆོག",
  },
  {
    titleEn: "Guided & Silent Meditation",
    titleBo: "ཞི་གནས་སྒོམ་སྒྲུབ་མཉམ་ཚོགས།",
    nyTime: "2:00 PM – 3:00 PM",
    argWinterTime: "4:00 PM – 5:00 PM",
    argSummerTime: "3:00 PM – 4:00 PM",
    localHintEn: "Sundays only · Sitting practice",
    localHintBo: "གཟའ་ཉི་མ་ཁོ་ནར། མཉམ་སྒོམ།",
  },
];

export function ZoomSchedule({ lang, programId = "all" }: ZoomScheduleProps) {
  const [currentSeason, setCurrentSeason] = useState<"winter" | "summer">("winter");
  const [activeSeason, setActiveSeason] = useState<SeasonMode>("auto");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Automatically detect whether New York is in Daylight Saving Time (EDT) or Standard Time (EST)
  useEffect(() => {
    try {
      const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        timeZoneName: "short",
      });
      const parts = dtf.formatToParts(new Date());
      const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "EST";
      const isDaylight = tzName === "EDT" || tzName.includes("Daylight");
      setCurrentSeason(isDaylight ? "summer" : "winter");
    } catch {
      setCurrentSeason("winter");
    }
  }, []);

  const resolvedSeason =
    activeSeason === "auto" ? currentSeason : activeSeason;

  const isWinter = resolvedSeason === "winter";

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  const showDaily = programId === "all" || programId === "daily-prayers";
  const showSunday = programId === "all" || programId === "weekly-tara";

  return (
    <div className="space-y-4 rounded-sm border border-border-subtle bg-card-bg/60 p-4 sm:p-5 shadow-2xs">
      {/* Header and Automatic Season Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-serif text-base sm:text-lg font-medium text-foreground">
              {lang === "bo"
                ? "དྲྭ་ཐོག་ཞལ་འདོན་དང་སྒོམ་སྒྲུབ་ཀྱི་ཆུ་ཚོད (Zoom)"
                : "Live Zoom Practice & Meditation Schedule"}
            </h4>
          </div>
          <p className="text-xs text-muted">
            {lang === "bo"
              ? isWinter
                ? "དགུན་དུས་ཆུ་ཚོད (EST) · ནིའུ་ཡོག་དང་ཨར་ཇེན་ཊི་ནའི་བར་ཆུ་ཚོད་ ༢ ཀྱི་ཁྱད་པར། (རང་འགུལ་འགྱུར་ལྡོག)"
                : "དབྱར་དུས་ཆུ་ཚོད (EDT) · ནིའུ་ཡོག་དང་ཨར་ཇེན་ཊི་ནའི་བར་ཆུ་ཚོད་ ༡ གི་ཁྱད་པར། (རང་འགུལ་འགྱུར་ལྡོག)"
              : isWinter
              ? "Winter Schedule (EST) · Argentina is +2 hours ahead of New York (Auto-adjusted)"
              : "Summer Schedule (EDT) · Argentina is +1 hour ahead of New York (Auto-adjusted)"}
          </p>
        </div>

        {/* Season Mode Selector */}
        <div
          role="radiogroup"
          aria-label="Daylight saving season"
          className="flex items-center rounded-sm border border-border-subtle bg-background p-0.5 text-xs self-start sm:self-auto shrink-0 shadow-2xs"
        >
          <button
            type="button"
            onClick={() => setActiveSeason("auto")}
            className={`px-2 py-1 rounded-xs transition-colors cursor-pointer font-medium ${
              activeSeason === "auto"
                ? "bg-sakya-crimson text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {lang === "bo"
              ? `རང་འགུལ (${currentSeason === "winter" ? "དགུན་དུས" : "དབྱར་དུས"})`
              : `Auto (${currentSeason === "winter" ? "Winter EST" : "Summer EDT"})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveSeason("winter")}
            className={`px-2 py-1 rounded-xs transition-colors cursor-pointer font-medium ${
              activeSeason === "winter"
                ? "bg-sakya-crimson text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {lang === "bo" ? "དགུན་དུས (EST)" : "Winter (EST)"}
          </button>
          <button
            type="button"
            onClick={() => setActiveSeason("summer")}
            className={`px-2 py-1 rounded-xs transition-colors cursor-pointer font-medium ${
              activeSeason === "summer"
                ? "bg-sakya-crimson text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {lang === "bo" ? "དབྱར་དུས (EDT)" : "Summer (EDT)"}
          </button>
        </div>
      </div>

      {/* Daily Prayers Schedule */}
      {showDaily && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-sakya-gold block">
                {lang === "bo" ? "ཉིན་རེའི་ཞལ་འདོན། · ཉིན་ལྟར" : "Daily Prayers · Every Day"}
              </span>
              <span className="text-xs text-muted">
                {lang === "bo"
                  ? "ཞོགས་པ་དང་དགོང་མོའི་བརྒྱུད་འདེབས་ཞལ་འདོན།"
                  : "Morning & Evening Lineage Supplications"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://us02web.zoom.us/j/81927980136?pwd=Q3dxYlRmcnRzSW5uT1Z5dlkzMWxQQT09"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-sakya-crimson hover:bg-sakya-crimson/90 text-white rounded-xs text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 4.5A2.5 2.5 0 002 7v10a2.5 2.5 0 002.5 2.5h10a2.5 2.5 0 002.5-2.5v-2.129l3.586 2.39A1 1 0 0022 16.429V7.571a1 1 0 00-1.414-.832L17 9.129V7a2.5 2.5 0 00-2.5-2.5h-10z" />
                </svg>
                <span>{lang === "bo" ? "Zoom མཉམ་ཞུགས།" : "Join Daily Zoom"}</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    "daily",
                    "https://us02web.zoom.us/j/81927980136?pwd=Q3dxYlRmcnRzSW5uT1Z5dlkzMWxQQT09"
                  )
                }
                className="px-2.5 py-1.5 border border-border-subtle bg-background hover:bg-card-bg text-foreground rounded-xs text-xs font-medium transition-colors cursor-pointer"
                title="Copy Zoom link"
              >
                {copiedId === "daily"
                  ? lang === "bo"
                    ? "✓ འདྲ་བཤུས་ཟིན"
                    : "✓ Copied"
                  : lang === "bo"
                  ? "འབྲེལ་ཐག"
                  : "Copy Link"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DAILY_SESSIONS.map((session) => (
              <div
                key={session.titleEn}
                className="p-3 rounded-xs border border-border-subtle bg-background/80 space-y-1.5 text-xs"
              >
                <div className="font-medium text-foreground">
                  {lang === "bo" ? session.titleBo : session.titleEn}
                </div>
                <div className="space-y-1 text-muted">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground/90">
                      🗽 {lang === "bo" ? "ནིའུ་ཡོག (NY)" : "New York (NY)"}:
                    </span>
                    <span className="font-mono text-foreground">{session.nyTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sakya-crimson">
                      🇦🇷 {lang === "bo" ? "ཨར་ཇེན་ཊི་ན (ARG)" : "Argentina (ARG)"}:
                    </span>
                    <span className="font-mono font-semibold text-sakya-crimson">
                      {isWinter ? session.argWinterTime : session.argSummerTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-muted flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
            <span>
              <strong>Meeting ID:</strong> 819 2798 0136
            </span>
            <span>
              <strong>Passcode:</strong> (embedded in link)
            </span>
          </div>
        </div>
      )}

      {/* Sunday Green Tara & Meditation Schedule */}
      {showSunday && (
        <div className="space-y-3 pt-3 border-t border-border-subtle/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-sakya-gold block">
                {lang === "bo"
                  ? "སྒྲོལ་མ་བཞི་ཆོག་དང་སྒོམ། · གཟའ་ཉི་མ་ཁོ་ནར"
                  : "Green Tara & Meditation · Sundays Only"}
              </span>
              <span className="text-xs text-muted">
                {lang === "bo"
                  ? "མཁན་པོ་པདྨ་དབང་གྲགས་མཆོག་ནས་དབུ་ཁྲིད་གནང་བ།"
                  : "Led by Venerable Khenpo Pema Wangdak"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://us02web.zoom.us/j/86941765020"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-sakya-crimson hover:bg-sakya-crimson/90 text-white rounded-xs text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 4.5A2.5 2.5 0 002 7v10a2.5 2.5 0 002.5 2.5h10a2.5 2.5 0 002.5-2.5v-2.129l3.586 2.39A1 1 0 0022 16.429V7.571a1 1 0 00-1.414-.832L17 9.129V7a2.5 2.5 0 00-2.5-2.5h-10z" />
                </svg>
                <span>{lang === "bo" ? "Zoom མཉམ་ཞུགས།" : "Join Sunday Zoom"}</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy("sunday", "https://us02web.zoom.us/j/86941765020")}
                className="px-2.5 py-1.5 border border-border-subtle bg-background hover:bg-card-bg text-foreground rounded-xs text-xs font-medium transition-colors cursor-pointer"
                title="Copy Zoom link"
              >
                {copiedId === "sunday"
                  ? lang === "bo"
                    ? "✓ འདྲ་བཤུས་ཟིན"
                    : "✓ Copied"
                  : lang === "bo"
                  ? "འབྲེལ་ཐག"
                  : "Copy Link"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUNDAY_SESSIONS.map((session) => (
              <div
                key={session.titleEn}
                className="p-3 rounded-xs border border-border-subtle bg-background/80 space-y-1.5 text-xs"
              >
                <div className="font-medium text-foreground">
                  {lang === "bo" ? session.titleBo : session.titleEn}
                </div>
                <div className="space-y-1 text-muted">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground/90">
                      🗽 {lang === "bo" ? "ནིའུ་ཡོག (NY)" : "New York (NY)"}:
                    </span>
                    <span className="font-mono text-foreground">{session.nyTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sakya-crimson">
                      🇦🇷 {lang === "bo" ? "ཨར་ཇེན་ཊི་ན (ARG)" : "Argentina (ARG)"}:
                    </span>
                    <span className="font-mono font-semibold text-sakya-crimson">
                      {isWinter ? session.argWinterTime : session.argSummerTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-muted flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
            <span>
              <strong>Meeting ID:</strong> 869 4176 5020
            </span>
            <span>
              <strong>Passcode:</strong> None required
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

