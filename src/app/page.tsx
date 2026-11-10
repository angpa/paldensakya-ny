import Link from "next/link";

const PRAYER_BOOKS = [
  {
    title: "Samantabhadra Wishing Prayer",
    tibetanTitle: "བརྗོད་པའི་ལེའུ་",
    enPdf: "/wix-archive/documents/bd1c21_62b7b6be52a24b95bfbbe78eb43ed1e3.pdf",
    boPdf: "/wix-archive/documents/bd1c21_be63e73983f54dd1bd8197d5f4bf4105.pdf",
  },
  {
    title: "Amitayus Buddha Dharani",
    tibetanTitle: "ཚེག་འགྲོས་ཀྱི་ལེའུ་",
    enPdf: "/wix-archive/documents/bd1c21_925bc9a0fe1e4309bc79c5f90ad06ee9.pdf",
    boPdf: "/wix-archive/documents/bd1c21_42cbaa9f4c604a9ba48298e4433a98ba.pdf",
  },
  {
    title: "Medicine Buddha Empowerment",
    tibetanTitle: "ཁྱད་ཆོས་༡/༢",
    enPdf: "/wix-archive/documents/bd1c21_fdd2b608805343c68c811ba9315dd994.pdf",
    boPdf: "/wix-archive/documents/bd1c21_9a227a12077548598bedbf559e2f3650.pdf",
  },
  {
    title: "Medicine Buddha Mantra",
    tibetanTitle: "སྨན་བླའི་གཟུངས་སྔགས།",
    enPdf: "/wix-archive/documents/bd1c21_f81a48d196ad43378034bc9271544c3a.pdf",
    boPdf: "/wix-archive/documents/bd1c21_ff7980b825f4468b9ae382377839dfff.pdf",
  },
  {
    title: "The Timeless Practice of Sojong",
    tibetanTitle: "༄། གསོ࿝སྦྱོང་།",
    enPdf: "/wix-archive/documents/bd1c21_2389ba9a3e404b2ea8c307a0aa48baf6.pdf",
    boPdf: "/wix-archive/documents/bd1c21_88cc871a4bdb4eadb40b2ea70777cc4c.pdf",
  },
];

const PROGRAMS = [
  {
    id: "daily-prayers",
    category: "Daily",
    title: "Daily Prayers & Liturgy",
    tibetan: "ཉིན་རེའི་ཞལ་འདོན།",
    summary:
      "Morning and evening lineage supplications, Samantabhadra Wishing Prayer, Medicine Buddha, and downloadable prayer books.",
    schedule: "Every Day · Morning & Evening Practice",
    details: [
      "Samantabhadra's 'Noble Wishing Prayer' (Zangcho Mönlam) & Refuge/Bodhicitta",
      "Medicine Buddha Sutra & Mantra Recitation ('The Buddha Who Heals the World')",
      "Amitayus Buddha Long-Life Dharani & Three Deities Long Life Prayer",
      "The Timeless Practice of Sojong (observed from 7:00 AM to 7:00 AM on sacred lunar days)",
    ],
    note: "Downloadable bilingual PDF prayer books (English & Tibetan) from our archive are included below.",
    hasPrayerBooks: true,
  },
  {
    id: "weekly-tara",
    category: "Weekly",
    title: "Weekly Green Tara Practice & Meditation",
    tibetan: "སྒྲོལ་མ་བཞི་ཆོག",
    summary:
      "Green Tara Four Mandala Practice and Sitting Meditation led by Venerable Khenpo Pema Wangdak.",
    schedule:
      "Every Sunday on Zoom · 12:00 PM – 1:30 PM & 2:00 PM – 3:00 PM (EDT)",
    details: [
      "12:00 PM – 1:30 PM (EDT): Green Tara Four Mandala Practice (Dolma Shichok) and Twenty-One Praises to Tara",
      "2:00 PM – 3:00 PM (EDT): Guided & Silent Sitting Meditation",
      "Co-hosted with Sakya Kachod Choling & Palden Sakya Centers",
      "Everyone is welcome to join; there are no prerequisites (contact paldensakya@vikramasila.org for the Zoom link)",
    ],
    note: "Tara Puja with Four Mandala Offerings is also available by request for blessings and removing obstacles.",
    image: "/wix-archive/images/dbaf06_4ee68230b6684c238cf3eed6caac708b~mv2.jpg",
    imageAlt:
      "Venerable Khenpo Pema Wangdak leading the Green Tara Four Mandala Practice",
  },
  {
    id: "tibetan-language",
    category: "Language",
    title: "Tibetan Language & Cultural Studies",
    tibetan: "བོད་ཀྱི་སྐད་ཡིག",
    summary:
      "\"Letters are the foundation of all knowledge\" — Classical and colloquial Tibetan grammar, sentence structure, and Bur Yig.",
    schedule: "Weekly Sessions · West 101st Street & Online",
    details: [
      "Course Series: 'The Elements of Tibetan Sentences' — nouns, adjectives, and classical grammar structure",
      "Bilingual and trilingual study workshops for students, translators, and practitioners",
      "Liturgical reading, Uchen script, and accurate Tibetan pronunciation",
      "Bur Yig (Tibetan Braille): Pioneered by Khenpo Pema Wangdak for blind Tibetan students",
    ],
    note: "4-hour intensive modules and weekly classes available online and in New York City.",
  },
  {
    id: "annual-activities",
    category: "Annual",
    title: "Annual Activities, Retreats & Holy Days",
    tibetan: "ལོ་འཁོར་དུས་ཆེན་ཁག",
    summary:
      "Losar & Chötrul Month, New Year Retreats, Young Buddhist international gatherings, and Sakya lineage empowerments.",
    schedule: "Throughout the Tibetan Lunar & Solar Year",
    details: [
      "Losar & Chötrul Month Celebrations (February – March): Auspicious prayers and community gatherings at Palden Sakya NYC",
      "Annual New Year Retreat (Dec 31 – Jan 3): Practical instruction on prayer and meditation with Khenpo Pema Wangdak",
      "Public Blessings & Oral Transmissions with His Holiness the Sakya Gongma Trichen Rinpoche",
      "Special Teachings: Shantideva's Guide to the Bodhisattva's Way of Life & 'A Trilogy of the Open Heart' (Generosity, Enthusiasm, Patience)",
      "Humanitarian Projects: Pema Ts'al Schools (Mundgod, Pokhara & NYC) and the One Million Mango Trees initiative",
    ],
    note: "All donations supporting annual humanitarian and educational programs are 100% tax-deductible (EIN: 22-2998005).",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Traditional Sakya Rigsum Gonpo subtle top border (Terracotta, Ivory, Slate) */}
      <div aria-hidden="true" className="w-full h-1.5 grid grid-cols-3">
        <div className="bg-sakya-terracotta" />
        <div className="bg-border-subtle" />
        <div className="bg-sakya-slate" />
      </div>

      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between border-b border-border-subtle/70">
        <a
          href="#main-heading"
          className="visually-hidden focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sakya-crimson focus:text-white focus:rounded-sm focus:text-sm"
        >
          Skip to main content
        </a>

        <div className="flex items-center gap-3.5">
          {/* Official Vikramasila Foundation Logo scraped from vikramasila.org */}
          <img
            src="/wix-archive/images/bd1c21_be160bfafedf4d4ab5f6dd15ee4f0057~mv2.png"
            alt="Vikramasila Foundation Dharma Wheel Emblem"
            width={44}
            height={44}
            fetchPriority="high"
            className="w-11 h-11 object-contain shrink-0"
          />
          <div>
            <span className="block font-serif text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              Vikramaśila Foundation
            </span>
            <span className="block text-xs tracking-widest uppercase text-muted">
              Palden Sakya Center · New York
            </span>
          </div>
        </div>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 sm:gap-6 text-sm text-muted">
            <li>
              <a
                href="#foundation"
                className="hover:text-sakya-crimson transition-colors py-1"
              >
                Foundation
              </a>
            </li>
            <li>
              <a
                href="#programs"
                className="hover:text-sakya-crimson transition-colors py-1"
              >
                Programs
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-sakya-crimson transition-colors py-1"
              >
                Visit
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content — Minimalist, serene single-column layout */}
      <main className="w-full max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-20 flex-1">
        {/* 1. Foundation Description ("Simple face, almost like there's nothing there. Except you give the description of the foundation. I use the same information.") */}
        <section id="foundation" className="space-y-8">
          <div className="space-y-3">
            <p
              lang="bo"
              className="text-sm sm:text-base text-sakya-gold tracking-wide"
            >
              ༄༅། །དམ་པའི་ཆོས་ནི་སྐྱབས་ཀྱི་མཆོག། · དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས།
            </p>
            <h1
              id="main-heading"
              tabIndex={-1}
              className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-foreground tracking-tight outline-none"
            >
              Bringing meditation and the wisdom of the Buddha to the West.
            </h1>
          </div>

          <div className="w-12 h-px bg-sakya-crimson/40" aria-hidden="true" />

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
            <p>
              The <strong>Vikramaśila Foundation</strong> is a nonprofit
              charitable organization dedicated to bringing meditation and the
              wisdom of the Buddha to the West. The organization was established
              under the auspices of{" "}
              <strong>His Holiness Sakya Trichen</strong> and is directed since
              1989 by <strong>Venerable Khenpo Pema Wangdak</strong>.
            </p>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              The Foundation oversees programs in the Americas and the
              Himalayas. These include courses in meditation, study, special
              empowerment teachings, and Tibetan cultural events in and around
              New York City and South America through the{" "}
              <strong>Palden Sakya Centers</strong>, as well as projects
              promoting the education and well-being of young Tibetans in Nepal
              and India through the{" "}
              <strong>Pema Ts&apos;al (Lotus Grove) Schools</strong>.
            </p>
          </div>

          {/* Expandable Lineage & Teachers section with official photos from vikramasila.org */}
          <div className="pt-2">
            <details className="group border border-border-subtle bg-card-bg/40 rounded-sm px-5 py-3.5">
              <summary className="cursor-pointer flex items-center justify-between text-xs uppercase tracking-widest text-sakya-crimson font-semibold select-none">
                <span>
                  Teachers, Lineage &amp; Pema Ts&apos;al Schools
                </span>
                <span
                  aria-hidden="true"
                  className="text-base transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-5 pt-5 border-t border-border-subtle space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <img
                      src="/wix-archive/images/bd1c21_89afc292e32f4798bbb45f1c679c5a88~mv2.jpg"
                      alt="His Holiness Sakya Kyabgon Gongma Trichen Rinpoche"
                      width={72}
                      height={90}
                      loading="lazy"
                      className="w-18 h-22 object-cover rounded-sm border border-border-subtle shrink-0"
                    />
                    <div className="space-y-1">
                      <h2 className="font-serif text-base font-semibold text-foreground">
                        H.H. Sakya Trichen Rinpoche
                      </h2>
                      <p className="text-[11px] uppercase tracking-wider text-sakya-gold font-medium">
                        Spiritual Patron
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        41st head of the Sakya Order of Tibetan Buddhism,
                        founded in 1073 by Khön Könchok Gyalpo in an unbroken
                        lineage of masters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <img
                      src="/wix-archive/images/bd1c21_95c6fa5f3fd34b89add2ac4060892ad0~mv2.jpg"
                      alt="Venerable Khenpo Pema Wangdak"
                      width={72}
                      height={90}
                      loading="lazy"
                      className="w-18 h-22 object-cover rounded-sm border border-border-subtle shrink-0"
                    />
                    <div className="space-y-1">
                      <h2 className="font-serif text-base font-semibold text-foreground">
                        Venerable Khenpo Pema Wangdak
                      </h2>
                      <p className="text-[11px] uppercase tracking-wider text-sakya-gold font-medium">
                        Founder &amp; Director
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        Sent to New York in 1982 by H.H. Sakya Trizin. Creator
                        of <em>Bur Yig</em> (Tibetan Braille) and 2009 recipient
                        of the Ellis Island Medal of Honor.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle/70 text-xs text-muted space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-foreground">
                      Palden Sakya Centers:
                    </strong>{" "}
                    New York City (4 W 101st St), Englewood (NJ), Walden (NY ·
                    Tsechen Kunchab Ling), Woodstock &amp; Philmont (NY),
                    Springfield (VT), Portland (ME), and Dayton (OH).
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Pema Ts&apos;al Schools:
                    </strong>{" "}
                    Pema Ts&apos;al School in Mundgod, India (Tibetan lay
                    children &amp; Mango Project), Pema Ts&apos;al Sakya
                    Monastic Institute in Pokhara, Nepal, and Pema Ts&apos;al
                    School in New York City.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* 2. Simple Programs Section ("Daily prayers, weekly Tara, Tibetan language, annual activities... We can always expand it.") */}
        <section
          id="programs"
          aria-labelledby="programs-heading"
          className="space-y-8 pt-4 border-t border-border-subtle"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2
                id="programs-heading"
                className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
              >
                Programs &amp; Practice
              </h2>
              <p className="text-sm text-muted mt-1">
                Select any practice below to view schedules, liturgy details,
                and downloadable texts.
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-sakya-gold font-medium">
              New York &amp; Online
            </span>
          </div>

          <div className="divide-y divide-border-subtle border-y border-border-subtle">
            {PROGRAMS.map((program) => (
              <details
                key={program.id}
                name="palden-sakya-programs"
                className="group py-5 transition-colors"
              >
                <summary className="cursor-pointer flex items-start justify-between gap-4 py-1 select-none">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm bg-card-bg text-sakya-crimson border border-border-subtle">
                        {program.category}
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-medium text-foreground group-hover:text-sakya-crimson transition-colors">
                        {program.title}
                      </span>
                      <span
                        lang="bo"
                        className="text-xs sm:text-sm text-muted/80"
                      >
                        {program.tibetan}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">
                      {program.summary}
                    </p>
                  </div>

                  {/* Visual expansion indicator */}
                  <span
                    aria-hidden="true"
                    className="mt-1 w-7 h-7 rounded-full border border-border-subtle flex items-center justify-center text-muted group-hover:border-sakya-crimson group-hover:text-sakya-crimson transition-colors shrink-0"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </summary>

                <div className="mt-4 pt-4 border-t border-border-subtle/60 pl-1 sm:pl-4 space-y-4 text-sm text-foreground/90">
                  <p className="text-xs uppercase tracking-wider text-sakya-gold font-semibold">
                    {program.schedule}
                  </p>

                  {program.image && (
                    <div className="flex items-center gap-4 py-1">
                      <img
                        src={program.image}
                        alt={program.imageAlt}
                        width={160}
                        height={110}
                        loading="lazy"
                        className="w-36 h-24 object-cover rounded-sm border border-border-subtle"
                      />
                      <p className="text-xs text-muted italic">
                        Venerable Khenpo Pema Wangdak leading Green Tara Four
                        Mandala Practice at Palden Sakya.
                      </p>
                    </div>
                  )}

                  <ul className="list-disc pl-5 space-y-1.5 text-muted">
                    {program.details.map((item) => (
                      <li key={item} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {program.hasPrayerBooks && (
                    <div className="pt-2 space-y-2">
                      <p className="text-xs uppercase tracking-wider font-semibold text-foreground">
                        Downloadable Prayer Books (PDF):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PRAYER_BOOKS.map((book) => (
                          <div
                            key={book.title}
                            className="p-3 rounded-sm bg-card-bg/70 border border-border-subtle flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-medium text-foreground block">
                                {book.title}
                              </span>
                              <span lang="bo" className="text-muted">
                                {book.tibetanTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={book.enPdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Download ${book.title} in English (PDF)`}
                                className="px-2 py-1 bg-background border border-border-subtle rounded-sm hover:border-sakya-crimson hover:text-sakya-crimson transition-colors"
                              >
                                English
                              </a>
                              <a
                                href={book.boPdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Download ${book.title} in Tibetan (PDF)`}
                                className="px-2 py-1 bg-background border border-border-subtle rounded-sm hover:border-sakya-crimson hover:text-sakya-crimson transition-colors"
                              >
                                བོད་ཡིག
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs italic text-muted pt-1">
                    {program.note}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 3. Address & Contact Section ("With the, you know, the address remains the same. Correct.") */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="space-y-6 pt-4 border-t border-border-subtle"
        >
          <h2
            id="contact-heading"
            className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
          >
            Location &amp; Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-card-bg/70 border border-border-subtle p-6 sm:p-8 rounded-sm">
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-sakya-crimson font-semibold">
                New York Headquarters
              </h3>
              <address className="not-italic text-sm sm:text-base text-foreground leading-relaxed space-y-0.5">
                <p className="font-medium">
                  Vikramaśila Foundation · Palden Sakya NYC
                </p>
                <p>4 West 101st Street, No. 63</p>
                <p>New York, NY 10025, USA</p>
              </address>
              <p className="text-xs text-muted pt-2">
                Affiliated NJ Center: 318 Marlboro Road, Englewood, NJ 07631
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-sakya-crimson font-semibold">
                Direct Contact
              </h3>
              <dl className="text-sm sm:text-base space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted text-xs uppercase tracking-wider w-20 shrink-0">
                    Phone
                  </dt>
                  <dd>
                    <a
                      href="tel:+12128664339"
                      className="hover:text-sakya-crimson underline underline-offset-4 decoration-border-subtle hover:decoration-sakya-crimson transition-colors"
                    >
                      +1 (212) 866-4339
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted text-xs uppercase tracking-wider w-20 shrink-0">
                    WhatsApp
                  </dt>
                  <dd className="text-foreground/90">+1 (917) 285-4795</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted text-xs uppercase tracking-wider w-20 shrink-0">
                    Email
                  </dt>
                  <dd>
                    <a
                      href="mailto:paldensakya@vikramasila.org"
                      className="hover:text-sakya-crimson underline underline-offset-4 decoration-border-subtle hover:decoration-sakya-crimson transition-colors"
                    >
                      paldensakya@vikramasila.org
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted text-xs uppercase tracking-wider w-20 shrink-0">
                    EIN
                  </dt>
                  <dd className="text-muted text-xs">
                    22-2998005 · 501(c)(3) Tax-Exempt
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* Minimalist Footer with links to the scraped Wix archive and Khenpo's 2nd Concept Pilot */}
      <footer className="w-full max-w-3xl mx-auto px-6 py-10 border-t border-border-subtle text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p>
            &copy; 2026 Vikramaśila Foundation · www.vikramasila.org
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/archive"
            className="text-muted hover:text-sakya-crimson underline underline-offset-4"
          >
            Wix Backup Archive (61 Pages &amp; 94 Images)
          </Link>
          <Link
            href="/tibetan-culture"
            className="inline-flex items-center gap-1.5 text-sakya-crimson hover:underline underline-offset-4 font-medium"
          >
            <span>2026–2029 Tibetan Culture Pilot</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
