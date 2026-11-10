"use client";

import { useState } from "react";
import Link from "next/link";

type ParticipantRole =
  | "individual"
  | "monastery"
  | "school"
  | "restaurant"
  | "artist"
  | "youth";

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
  const [selectedRole, setSelectedRole] =
    useState<ParticipantRole>("individual");
  const [pledges, setPledges] = useState<PledgeItem[]>(INITIAL_PLEDGES);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [customPledge, setCustomPledge] = useState(
    ROLES[0].suggestions[0]
  );
  const [submittedNotice, setSubmittedNotice] = useState("");

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

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Sakya stripe */}
      <div aria-hidden="true" className="w-full h-1.5 grid grid-cols-3">
        <div className="bg-sakya-terracotta" />
        <div className="bg-border-subtle" />
        <div className="bg-sakya-slate" />
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-8 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle">
        <a
          href="#culture-heading"
          className="visually-hidden focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sakya-crimson focus:text-white focus:rounded-sm text-sm"
        >
          Skip to main content
        </a>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-sakya-crimson transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to Vikramasila Foundation · Palden Sakya</span>
        </Link>

        <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-sm bg-card-bg border border-border-subtle text-sakya-crimson font-medium">
          Concept Pilot · 2026–2029 Initiative
        </span>
      </header>

      <main className="w-full max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-16 flex-1">
        {/* Hero */}
        <section className="space-y-6">
          <p
            lang="bo"
            className="text-base sm:text-lg text-sakya-gold tracking-wide"
          >
            ༄༅། །བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་དུས་སྟོན།
          </p>

          <h1
            id="culture-heading"
            tabIndex={-1}
            className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-foreground outline-none"
          >
            International Celebration of Tibetan Culture &amp; Language
            (2026–2029)
          </h1>

          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-3xl">
            Honoring over 2,000 years of living Tibetan civilization, wisdom,
            and language. This platform does not tell you what to do—instead, it
            invites <strong>everyone</strong> (monasteries, schools,
            universities, restaurants, writers, artists, children, and
            individuals) to{" "}
            <span className="underline decoration-sakya-gold/60 underline-offset-4">
              subscribe an idea and participate in your own way
            </span>
            .
          </p>

          {/* Emblem / Decal Preview Card ("A logo that can be printed out on doors, cars, computers") */}
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
            <div className="space-y-1.5 text-sm">
              <h2 className="font-serif text-lg font-medium text-foreground">
                The Shared Participation Emblem
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
              Select your role below to see examples of commitments you can
              adopt or adapt in your own way.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter suggestions by participant category"
            className="flex flex-wrap gap-2"
          >
            {ROLES.map((role) => {
              const active = role.id === selectedRole;
              return (
                <button
                  key={role.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm rounded-sm border transition-colors cursor-pointer ${
                    active
                      ? "bg-sakya-crimson text-white border-sakya-crimson font-medium"
                      : "bg-card-bg text-foreground border-border-subtle hover:border-sakya-crimson"
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          <div className="bg-card-bg/60 border border-border-subtle p-6 rounded-sm space-y-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-foreground">
                {currentRole.label}
              </h3>
              <p className="text-sm text-muted mt-1">
                {currentRole.description}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-sakya-gold font-semibold">
                Click an idea to use it in your pledge below, or write your own:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentRole.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setCustomPledge(suggestion)}
                    className={`text-left p-3 rounded-sm border text-sm transition-colors cursor-pointer ${
                      customPledge === suggestion
                        ? "border-sakya-crimson bg-background text-foreground font-medium"
                        : "border-border-subtle bg-background/60 text-muted hover:text-foreground hover:border-sakya-gold"
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
              Register how you, your school, monastery, or business are
              participating.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card-bg/70 border border-border-subtle p-6 sm:p-8 rounded-sm space-y-5"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="participant-pledge"
                className="block text-xs uppercase tracking-wider font-semibold text-foreground"
              >
                How We Are Participating ({currentRole.label})
              </label>
              <span
                id="pledge-hint"
                className="block text-xs text-muted pb-1"
              >
                Describe your goal, recitation count, meditation hours, event,
                or sponsorship in your own words.
              </span>
              <textarea
                id="participant-pledge"
                required
                rows={3}
                aria-describedby="pledge-hint"
                value={customPledge}
                onChange={(e) => setCustomPledge(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-sakya-crimson text-white text-sm font-medium rounded-sm hover:opacity-95 transition-opacity cursor-pointer"
              >
                Subscribe Idea &amp; Join Register
              </button>

              <div
                role="status"
                aria-live="polite"
                className="text-xs sm:text-sm text-sakya-crimson font-medium"
              >
                {submittedNotice}
              </div>
            </div>
          </form>
        </section>

        {/* Step 3: Community Register ("Who is subscribed for what, and who has done what") */}
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
                See who has subscribed an idea and what participants around the
                world are accomplishing.
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-sakya-gold font-semibold">
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
                    className={`text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm ${
                      item.status === "Accomplished"
                        ? "bg-sakya-gold/15 text-sakya-gold"
                        : "bg-sakya-crimson/10 text-sakya-crimson"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  &ldquo;{item.pledge}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="w-full max-w-4xl mx-auto px-6 py-10 border-t border-border-subtle text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p>
          Pilot prototype prepared for Venerable Khenpo Pema Wangdak ·
          Vikramasila Foundation
        </p>
        <Link
          href="/"
          className="text-sakya-crimson hover:underline underline-offset-4 font-medium"
        >
          &larr; Return to Main Foundation Site
        </Link>
      </footer>
    </div>
  );
}
