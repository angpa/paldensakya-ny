"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type ParticipantRole =
  | "individual"
  | "monastery"
  | "school"
  | "restaurant"
  | "artist"
  | "youth";

type VisualTheme = "lungta-festive" | "sakya-classic";

interface RoleConfig {
  id: ParticipantRole;
  label: string;
  description: string;
  suggestions: string[];
}

const ROLES: RoleConfig[] = [
  {
    id: "individual",
    label: "Individual Practitioner",
    description:
      "Participate in your own personal rhythm—through recitation, silent meditation, study, or sponsorship.",
    suggestions: [
      "Recite the 21 Praises to Tara 1,000 times during the year",
      "Dedicate 18 hours of silent meditation over the course of the year",
      "Learn to read and pronounce the 30 letters of the Tibetan Uchen alphabet",
      "Sponsor a child's education or a Tibetan cultural publication",
    ],
  },
  {
    id: "monastery",
    label: "Monastery / Dharma Center",
    description:
      "Dedicate special pujas, lineage teachings, or open-house days celebrating Tibetan heritage.",
    suggestions: [
      "Dedicate annual Tara or Medicine Buddha accumulations to cultural preservation",
      "Host free weekly Tibetan reading and liturgical chanting workshops",
      "Display the International Year of Tibetan Culture & Language emblem at the temple entrance",
    ],
  },
  {
    id: "school",
    label: "School / University / Student Group",
    description:
      "Invite students and faculty to explore over 2,000 years of Tibetan civilization, literature, and philosophy.",
    suggestions: [
      "Organize a Tibetan Culture & Language symposium or film screening on campus",
      "Establish a student reading circle on Tibetan history, logic, or poetry",
      "Partner with Tibetan youth and monastic schools for language exchange",
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant / Business",
    description:
      "Share awareness in your storefront, menus, or workplace and support community initiatives.",
    suggestions: [
      "Display the official celebration decal on storefront doors and windows",
      "Feature a Tibetan cultural note or word-of-the-week for guests",
      "Pledge a portion of a special day's proceeds to sponsor a Tibetan book or student",
    ],
  },
  {
    id: "artist",
    label: "Writer / Poet / Artist",
    description:
      "Create, publish, translate, or perform works inspired by Tibetan language and artistic traditions.",
    suggestions: [
      "Author or translate a book, essay, or collection of poems celebrating Tibet",
      "Create calligraphy, thangka-inspired visual art, music, or drama",
      "Connect with sponsors to publish a completed manuscript on Tibetan culture",
    ],
  },
  {
    id: "youth",
    label: "Kids & Youth",
    description:
      "Even children can participate with simple daily habits of kindness, language learning, and generosity.",
    suggestions: [
      "Save a few pennies each day in a dedication jar to help sponsor a classmate in Asia",
      "Learn 5 Tibetan greetings, numbers, or songs with family",
      "Draw or paint a symbol of peace and Tibetan heritage",
    ],
  },
];

interface PledgeItem {
  id: string;
  name: string;
  location: string;
  roleLabel: string;
  pledge: string;
  status: "Subscribed" | "Accomplished";
}

const INITIAL_PLEDGES: PledgeItem[] = [
  {
    id: "1",
    name: "Tenzin & Pema",
    location: "New York, NY",
    roleLabel: "Individual Practitioner",
    pledge:
      "Reciting the Twenty-One Praises to Tara 1,000 times over the year for the flourishing of Tibetan language.",
    status: "Subscribed",
  },
  {
    id: "2",
    name: "Columbia & NYU Student Circle",
    location: "New York, NY",
    roleLabel: "School / University / Student Group",
    pledge:
      "Hosting an autumn lecture series and classical Tibetan calligraphy demonstration open to the university body.",
    status: "Subscribed",
  },
  {
    id: "3",
    name: "Himalayan Tea & Kitchen",
    location: "Jackson Heights, NY",
    roleLabel: "Restaurant / Business",
    pledge:
      "Displaying the celebration emblem on our front door and sponsoring the printing of 200 bilingual children's readers.",
    status: "Accomplished",
  },
  {
    id: "4",
    name: "Sarah M.",
    location: "Burlington, VT",
    roleLabel: "Individual Practitioner",
    pledge:
      "Sitting for 18 hours of dedicated silent meditation and sponsoring one young monk's annual school supplies.",
    status: "Subscribed",
  },
];

export default function TibetanCulturePilotPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSpeed, setVideoSpeed] = useState<"1x" | "1.5x" | "2x">("1.5x");
  const [visualTheme, setVisualTheme] =
    useState<VisualTheme>("lungta-festive");
  const [selectedRole, setSelectedRole] =
    useState<ParticipantRole>("individual");
  const [pledges, setPledges] = useState<PledgeItem[]>(INITIAL_PLEDGES);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [customPledge, setCustomPledge] = useState(
    ROLES[0].suggestions[0]
  );
  const [submittedNotice, setSubmittedNotice] = useState("");

  const handleSpeedChange = (spd: "1x" | "1.5x" | "2x") => {
    setVideoSpeed(spd);
    if (videoRef.current) {
      const rateMap = { "1x": 1.0, "1.5x": 1.5, "2x": 2.0 };
      videoRef.current.playbackRate = rateMap[spd];
    }
  };

  const currentRole =
    ROLES.find((r) => r.id === selectedRole) ?? ROLES[0];

  const handleRoleSelect = (roleId: ParticipantRole) => {
    setSelectedRole(roleId);
    const found = ROLES.find((r) => r.id === roleId);
    if (found && found.suggestions.length > 0) {
      setCustomPledge(found.suggestions[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !customPledge.trim()) return;

    const newEntry: PledgeItem = {
      id: String(Date.now()),
      name: name.trim(),
      location: location.trim() || "Global Participant",
      roleLabel: currentRole.label,
      pledge: customPledge.trim(),
      status: "Subscribed",
    };

    setPledges((prev) => [newEntry, ...prev]);
    setName("");
    setLocation("");
    setSubmittedNotice(
      `Thank you, ${newEntry.name}. Your participation pledge has been added to the community register.`
    );
  };

  const isFestive = visualTheme === "lungta-festive";

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top ribbon: Sacred 5 Lungta Elements or Traditional 3 Sakya Stripes */}
      {isFestive ? (
        <div
          aria-hidden="true"
          className="lungta-ribbon h-2 transition-all duration-300"
        >
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="w-full h-1.5 grid grid-cols-3 transition-all duration-300"
        >
          <div className="bg-sakya-terracotta" />
          <div className="bg-border-subtle" />
          <div className="bg-sakya-slate" />
        </div>
      )}

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-8 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle">
        <a
          href="#culture-heading"
          className="visually-hidden focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-tibet-crimson focus:text-white focus:rounded-sm text-sm"
        >
          Skip to main content
        </a>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-tibet-crimson transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to Vikramasila Foundation · Palden Sakya</span>
        </Link>

        {/* Theme Switcher Toggle */}
        <div
          role="radiogroup"
          aria-label="Select visual style"
          className="flex items-center gap-1 p-1 rounded-sm bg-card-bg border border-border-subtle"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted px-2 font-medium">
            Theme / བཀོད་པ།:
          </span>
          <button
            type="button"
            role="radio"
            aria-checked={isFestive}
            onClick={() => setVisualTheme("lungta-festive")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-all cursor-pointer ${
              isFestive
                ? "bg-tibet-gold text-white font-semibold shadow-2xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            ✨ 2,000 Years (Lungta &amp; Gold) / ལོ་ཉིས་སྟོང་།
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={!isFestive}
            onClick={() => setVisualTheme("sakya-classic")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-all cursor-pointer ${
              !isFestive
                ? "bg-sakya-crimson text-white font-semibold shadow-2xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            🏛️ Sakya Classic / ས་སྐྱ་སྲོལ་རྒྱུན།
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-16 flex-1">
        {/* Hero */}
        <section className="space-y-6">
          {isFestive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tibet-gold-light/80 border border-tibet-gold/40 text-xs font-semibold text-tibet-gold-rich">
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full bg-tibet-gold animate-pulse"
              />
              <span>Honoring 20 Centuries of Living Wisdom &amp; Language</span>
            </div>
          ) : (
            <span className="inline-block text-xs uppercase tracking-widest px-2.5 py-1 rounded-sm bg-card-bg border border-border-subtle text-sakya-crimson font-medium">
              Concept Pilot · 2026–2029 Initiative
            </span>
          )}

          <p
            lang="bo"
            className={`text-lg sm:text-xl tracking-wide font-serif ${
              isFestive ? "text-tibet-gold-rich" : "text-sakya-gold"
            }`}
          >
            {isFestive
              ? "༄༅། །བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་ལོ་ཉིས་སྟོང་འཁོར་བའི་དུས་སྟོན།"
              : "༄༅། །བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་དུས་སྟོན།"}
          </p>

          <h1
            id="culture-heading"
            tabIndex={-1}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-foreground outline-none tracking-tight"
          >
            Celebration of Tibetan Culture &amp; Language{" "}
            <span
              className={
                isFestive ? "text-tibet-crimson italic" : "text-foreground"
              }
            >
              2,000 Years
            </span>
          </h1>

          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-3xl">
            Honoring over 2,000 years of living Tibetan civilization, literature, spiritual wisdom,
            and language. This global initiative does not impose rules—instead, it
            invites <strong>everyone</strong> (monasteries, schools,
            universities, businesses, poets, artists, children, and
            individual practitioners worldwide) to{" "}
            <span
              className={`underline underline-offset-4 font-medium text-foreground ${
                isFestive
                  ? "decoration-tibet-gold decoration-2"
                  : "decoration-sakya-gold/60"
              }`}
            >
              subscribe an idea and participate in your own authentic way
            </span>
            .
          </p>

          {/* Emblem / Decal Preview Card */}
          {isFestive ? (
            <div className="tibet-gold-gradient border border-tibet-gold/40 p-6 sm:p-8 rounded-md flex flex-col sm:flex-row items-center gap-6 tibet-seal-glow">
              <div className="relative w-28 h-28 rounded-full border-4 border-tibet-gold bg-background flex flex-col items-center justify-center text-center p-2.5 shrink-0 shadow-md">
                <div className="absolute inset-1 rounded-full border border-dashed border-tibet-crimson/40 pointer-events-none" />
                <span
                  lang="bo"
                  className="text-xs text-tibet-crimson font-bold leading-none"
                >
                  བོད་ཡིག
                </span>
                <span className="font-serif text-[11px] font-bold tracking-wider uppercase text-foreground mt-1">
                  2,000 YEARS
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-tibet-gold-rich mt-0.5">
                  2026–2029
                </span>
                <span className="text-[8px] uppercase tracking-wider text-muted font-medium mt-0.5">
                  We Participate
                </span>
              </div>
              <div className="space-y-2 text-sm text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    The Official Commemorative Decal (Lungta Jubilee)
                  </h2>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-tibet-crimson text-white">
                    Universal Emblem
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Created to be printed out and displayed proudly on storefront doors, cars,
                  laptops, classrooms, home altars, and dharma centers—signaling:{" "}
                  <em className="font-serif text-tibet-crimson font-medium">
                    &ldquo;We participate in honoring 2,000 years of Tibetan Culture &amp; Language.&rdquo;
                  </em>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-card-bg border border-border-subtle p-6 rounded-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full border-2 border-sakya-crimson bg-background flex flex-col items-center justify-center text-center p-2 shrink-0 shadow-xs">
                <span
                  lang="bo"
                  className="text-xs text-sakya-crimson font-semibold"
                >
                  བོད་ཀྱི་སྐད་ཡིག
                </span>
                <span className="font-serif text-xs font-bold tracking-wider uppercase text-foreground mt-0.5">
                  TIBET 2026–29
                </span>
                <span className="text-[9px] uppercase tracking-widest text-sakya-gold mt-0.5">
                  We Participate
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-center sm:text-left">
                <h2 className="font-serif text-lg font-medium text-foreground">
                  The Shared Participation Emblem (Classic Sakya)
                </h2>
                <p className="text-muted leading-relaxed">
                  Designed to be printed as a decal for storefront doors, cars,
                  laptops, classrooms, and community centers—signaling:{" "}
                  <em>
                    &ldquo;We are participating in celebrating 2,000+ years of
                    Tibetan Culture and Language.&rdquo;
                  </em>
                </p>
              </div>
            </div>
          )}

          {/* L2 Fast-Paced Visual Stream · Pema Ts'al Monastic Institute */}
          <div className="relative overflow-hidden rounded-md border border-border-subtle bg-black/95 shadow-md">
            <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover opacity-85 transition-opacity"
                src="/videos/pema-tsal-loop-fast.mp4"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* L2 High-Frequency Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  L2 Fast Stream · {videoSpeed}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-tibet-gold/80 backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white">
                  Pokhara, Nepal · Pema Ts&apos;al
                </span>
              </div>

              {/* Video Speed Toggle */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-full p-1 border border-white/20 text-white text-[10px] sm:text-[11px]">
                <span className="px-2 text-white/70">Velocidad:</span>
                {(["1x", "1.5x", "2x"] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                      videoSpeed === spd
                        ? "bg-white text-black font-bold"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <p className="font-serif text-base sm:text-xl font-medium drop-shadow-sm text-white">
                    Pema Ts&apos;al Sakya Monastic Institute · Living Heritage
                  </p>
                  <p className="text-xs sm:text-sm text-white/80 drop-shadow-sm max-w-xl">
                    Young monks preserving 2,000+ years of classical language, calligraphy, debate, and Buddhist wisdom.
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/watch?v=T9o-r5kd2h8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] uppercase tracking-wider text-tibet-gold hover:text-white underline underline-offset-4 self-start sm:self-auto shrink-0"
                >
                  Full Video on YouTube &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: Choose how you participate */}
        <section
          aria-labelledby="ways-to-participate-heading"
          className="space-y-6 pt-6 border-t border-border-subtle"
        >
          <div className="space-y-1">
            <h2
              id="ways-to-participate-heading"
              className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
            >
              1. Explore Ways to Participate
            </h2>
            <p className="text-sm text-muted">
              Select your group below to see suggested ways to celebrate 2,000 years of heritage.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter suggestions by participant category"
            className="flex flex-wrap gap-2.5"
          >
            {ROLES.map((role) => {
              const active = role.id === selectedRole;
              return (
                <button
                  key={role.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`px-4 py-2.5 text-xs sm:text-sm rounded-sm border transition-all cursor-pointer font-medium ${
                    active
                      ? "bg-tibet-crimson text-white border-tibet-crimson shadow-sm"
                      : "bg-card-bg text-foreground border-border-subtle hover:border-tibet-gold hover:bg-tibet-gold-light/40"
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          <div className="bg-card-bg/70 border border-border-subtle p-6 rounded-sm space-y-4 shadow-2xs">
            <div className="border-b border-border-subtle/80 pb-3">
              <h3 className="font-serif text-xl font-medium text-foreground">
                {currentRole.label}
              </h3>
              <p className="text-sm text-muted mt-1">
                {currentRole.description}
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-wider text-tibet-gold-rich font-bold">
                Suggested ideas for the 2,000 years commemoration (click to select):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentRole.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setCustomPledge(suggestion)}
                    className={`text-left p-3.5 rounded-sm border text-sm transition-all cursor-pointer leading-relaxed ${
                      customPledge === suggestion
                        ? "border-tibet-gold bg-tibet-gold-light/60 text-foreground font-medium shadow-2xs"
                        : "border-border-subtle bg-background/80 text-muted hover:text-foreground hover:border-tibet-crimson/50"
                    }`}
                  >
                    &ldquo;{suggestion}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Subscribe your idea */}
        <section
          aria-labelledby="subscribe-heading"
          className="space-y-6 pt-6 border-t border-border-subtle"
        >
          <div className="space-y-1">
            <h2
              id="subscribe-heading"
              className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
            >
              2. Subscribe Your Commitment
            </h2>
            <p className="text-sm text-muted">
              Register how you, your school, temple, or company celebrate 2,000 years of living heritage.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card-bg/80 border border-border-subtle p-6 sm:p-8 rounded-sm space-y-5 shadow-2xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="participant-name"
                  className="block text-xs uppercase tracking-wider font-semibold text-foreground"
                >
                  Your Name or Organization
                </label>
                <input
                  id="participant-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tenzin Dorje or Lotus Bookshop"
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground focus:border-tibet-crimson"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="participant-location"
                  className="block text-xs uppercase tracking-wider font-semibold text-foreground"
                >
                  City / Country
                </label>
                <input
                  id="participant-location"
                  type="text"
                  autoComplete="address-level2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, USA"
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground focus:border-tibet-crimson"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="participant-pledge"
                className="block text-xs uppercase tracking-wider font-semibold text-foreground"
              >
                Our Participation Commitment ({currentRole.label})
              </label>
              <span
                id="pledge-hint"
                className="block text-xs text-muted pb-1"
              >
                Describe your recitation, silent meditation, exhibition, class, or sponsorship in your own words.
              </span>
              <textarea
                id="participant-pledge"
                required
                rows={3}
                aria-describedby="pledge-hint"
                value={customPledge}
                onChange={(e) => setCustomPledge(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground focus:border-tibet-crimson"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="px-7 py-3 bg-tibet-crimson text-white text-sm font-medium rounded-sm hover:bg-tibet-crimson-deep transition-all shadow-sm cursor-pointer"
              >
                Subscribe Idea &amp; Join Community Register
              </button>

              <div
                role="status"
                aria-live="polite"
                className="text-xs sm:text-sm text-tibet-crimson font-medium"
              >
                {submittedNotice}
              </div>
            </div>
          </form>
        </section>

        {/* Step 3: Community Register */}
        <section
          aria-labelledby="register-heading"
          className="space-y-6 pt-6 border-t border-border-subtle"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2
                id="register-heading"
                className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
              >
                3. Community Participation Register
              </h2>
              <p className="text-sm text-muted mt-1">
                See who has subscribed an idea and what people are accomplishing for 2,000 years of Tibetan culture.
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-tibet-gold-rich font-bold bg-tibet-gold-light px-3 py-1 rounded-sm border border-tibet-gold/30">
              {pledges.length} Registered Commitments
            </span>
          </div>

          <ul className="divide-y divide-border-subtle border-y border-border-subtle">
            {pledges.map((item) => (
              <li key={item.id} className="py-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-lg font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted">
                      · {item.location}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-sm bg-card-bg border border-border-subtle text-muted">
                      {item.roleLabel}
                    </span>
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-sm ${
                      item.status === "Accomplished"
                        ? "bg-lungta-green/15 text-lungta-green border border-lungta-green/30"
                        : "bg-tibet-crimson/10 text-tibet-crimson border border-tibet-crimson/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
                  &ldquo;{item.pledge}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="w-full border-t border-border-subtle text-xs text-muted">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p>
            Celebration of Tibetan Culture &amp; Language 2000 Years (2026–2029) · Vikramasila Foundation
          </p>
          <Link
            href="/"
            className="text-tibet-crimson hover:underline underline-offset-4 font-medium"
          >
            &larr; Return to Main Foundation Site
          </Link>
        </div>
        {/* Bottom ribbon matching selected visual theme */}
        {isFestive ? (
          <div aria-hidden="true" className="lungta-ribbon h-1.5">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        ) : (
          <div aria-hidden="true" className="w-full h-1 grid grid-cols-3">
            <div className="bg-sakya-terracotta" />
            <div className="bg-border-subtle" />
            <div className="bg-sakya-slate" />
          </div>
        )}
      </footer>
    </div>
  );
}
