"use client";

import { useState } from "react";
import Link from "next/link";
import pagesData from "../../../scraped-data/pages.json";
import mediaManifest from "../../../scraped-data/media-manifest.json";

type Language = "en" | "bo";

const ARCHIVE_UI = {
  en: {
    back: "Back to Main Foundation Site",
    badge: "Complete Wix Backup · vikramasila.org",
    motto: "༄༅། །བི་ཀྲ་མ་ཤཱི་ལ་ཚོགས་པའི་དྲྭ་ཚིགས་ཡིག་མཛོད་ཉར་ཚགས།",
    heading: "Complete Archive of vikramasila.org",
    sub: "Every page, photograph, logo, and downloadable PDF prayer book from the existing Wix website has been backed up locally into this repository.",
    pagesScraped: "Pages Scraped (scraped-data/pages.json)",
    originalImages: "Original Images (public/wix-archive/images/)",
    prayerBooks: "PDF Prayer Books (public/wix-archive/documents/)",
    secPdfsTitle: "1. Backed-Up PDF Prayer Books",
    secPagesTitle: "2. All Scraped Pages",
    secPagesSub: "Click any page below to read its complete extracted text and image references.",
    linesLabel: "lines",
    imagesLabel: "images",
    metaDesc: "Meta description:",
    secImagesTitle: "3. All Downloaded Images",
    footerNotice: "Local archive stored in `/scraped-data` and `/public/wix-archive`",
    footerBack: "← Return to Main Foundation Site",
  },
  bo: {
    back: "དགེ་རྩ་ཚོགས་པའི་དྲྭ་ཚིགས་གཙོ་བོར་ཕྱིར་ལོག",
    badge: "vikramasila.org ཡིག་མཛོད་ཆ་ཚང་ཉར་ཚགས།",
    motto: "༄༅། །བི་ཀྲ་མ་ཤཱི་ལ་ཚོགས་པའི་དྲྭ་ཚིགས་ཡིག་མཛོད་ཉར་ཚགས།",
    heading: "vikramasila.org དྲྭ་ཚིགས་ཀྱི་ཡིག་མཛོད་ཆ་ཚང་།",
    sub: "སྔོན་ཡོད་ Wix དྲྭ་ཚིགས་ཀྱི་ཤོག་ངོས་དང་སྐུ་པར། མཚོན་རྟགས། ཆོས་སྤྱོད་ཞལ་འདོན་གྱི་ PDF ཡིག་ཆ་ཡོངས་རྫོགས་ཡིག་མཛོད་འདིར་ཉར་ཚགས་ཞུས་ཡོད།",
    pagesScraped: "ཤོག་ངོས་བསྡུ་ལེན་བྱས་པ (scraped-data/pages.json)",
    originalImages: "སྐུ་པར་དང་པར་རིས (public/wix-archive/images/)",
    prayerBooks: "ཆོས་སྤྱོད་ PDF ཕྱག་དེབ (public/wix-archive/documents/)",
    secPdfsTitle: "༡. ཉར་ཚགས་བྱས་པའི་ཆོས་སྤྱོད་ PDF ཕྱག་དེབ།",
    secPagesTitle: "༢. བསྡུ་ལེན་བྱས་པའི་ཤོག་ངོས་ཡོངས་རྫོགས།",
    secPagesSub: "གཤམ་གྱི་ཤོག་ངོས་ལ་མནན་ཏེ་ཡིག་ཆ་ཆ་ཚང་དང་པར་རིས་ཁག་ལ་གཟིགས།",
    linesLabel: "ཡིག་ཕྲེང་།",
    imagesLabel: "པར་རིས།",
    metaDesc: "ངོ་སྤྲོད་མདོར་བསྡུས།:",
    secImagesTitle: "༣. ཕབ་ལེན་བྱས་པའི་སྐུ་པར་དང་པར་རིས་ཡོངས་རྫོགས།",
    footerNotice: "ཡིག་མཛོད་ཉར་ཚགས་ས་གནས `/scraped-data` དང་ `/public/wix-archive`",
    footerBack: "← དགེ་རྩ་ཚོགས་པའི་དྲྭ་ཚིགས་གཙོ་བོར་ཕྱིར་ལོག",
  },
};

export default function WixArchivePage() {
  const [lang, setLang] = useState<Language>("bo");
  const t = ARCHIVE_UI[lang];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Sakya stripe */}
      <div aria-hidden="true" className="w-full h-1.5 grid grid-cols-3">
        <div className="bg-sakya-terracotta" />
        <div className="bg-border-subtle" />
        <div className="bg-sakya-slate" />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 sm:px-8 pt-8 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle">
        <a
          href="#archive-heading"
          className="visually-hidden focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sakya-crimson focus:text-white focus:rounded-sm text-sm"
        >
          Skip to main content
        </a>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-sakya-crimson transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span>{t.back}</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Language Switcher Toggle */}
          <div
            role="radiogroup"
            aria-label="Language selection"
            className="flex items-center rounded-sm border border-border-subtle bg-card-bg p-0.5 shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={lang === "en"}
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                lang === "en"
                  ? "bg-sakya-crimson text-white"
                  : "text-muted hover:text-foreground"
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
                  : "text-muted hover:text-foreground font-serif"
              }`}
            >
              བོད་ཡིག
            </button>
          </div>

          <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-sm bg-card-bg border border-border-subtle text-sakya-crimson font-medium">
            {t.badge}
          </span>
        </div>
      </header>

      <main className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 space-y-16 flex-1">
        {/* Intro */}
        <section className="space-y-4">
          <p lang="bo" className="text-sm sm:text-base text-sakya-gold tracking-wide font-serif">
            {t.motto}
          </p>
          <h1
            id="archive-heading"
            tabIndex={-1}
            className="font-serif text-3xl sm:text-5xl font-normal text-foreground outline-none"
          >
            {t.heading}
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
            {t.sub}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-sm bg-card-bg border border-border-subtle">
              <span className="block font-serif text-3xl font-semibold text-sakya-crimson">
                {pagesData.length}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {t.pagesScraped}
              </span>
            </div>
            <div className="p-4 rounded-sm bg-card-bg border border-border-subtle">
              <span className="block font-serif text-3xl font-semibold text-sakya-crimson">
                {mediaManifest.images.length}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {t.originalImages}
              </span>
            </div>
            <div className="p-4 rounded-sm bg-card-bg border border-border-subtle">
              <span className="block font-serif text-3xl font-semibold text-sakya-crimson">
                {mediaManifest.documents.length}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {t.prayerBooks}
              </span>
            </div>
          </div>
        </section>

        {/* 1. PDF Prayer Books */}
        <section
          aria-labelledby="pdfs-heading"
          className="space-y-4 pt-6 border-t border-border-subtle"
        >
          <h2
            id="pdfs-heading"
            className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
          >
            {t.secPdfsTitle} ({mediaManifest.documents.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mediaManifest.documents.map((doc) => (
              <a
                key={doc.filename}
                href={doc.localPublicPath}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-sm bg-card-bg/60 border border-border-subtle hover:border-sakya-crimson flex items-center justify-between gap-3 text-xs transition-colors"
              >
                <span className="font-mono text-foreground truncate">
                  {doc.filename}
                </span>
                <span className="text-muted shrink-0">
                  {Math.round(doc.bytes / 1024)} KB &rarr;
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* 2. All 61 Scraped Pages */}
        <section
          aria-labelledby="pages-heading"
          className="space-y-4 pt-6 border-t border-border-subtle"
        >
          <h2
            id="pages-heading"
            className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
          >
            {t.secPagesTitle} ({pagesData.length})
          </h2>
          <p className="text-xs text-muted">
            {t.secPagesSub}
          </p>

          <div className="divide-y divide-border-subtle border-y border-border-subtle">
            {pagesData.map((page) => (
              <details key={page.url} className="group py-3.5">
                <summary className="cursor-pointer flex items-center justify-between gap-4 select-none">
                  <div>
                    <span className="font-serif text-lg font-medium text-foreground group-hover:text-sakya-crimson transition-colors">
                      {page.title}
                    </span>
                    <span className="block text-xs text-muted font-mono">
                      {page.url}
                    </span>
                  </div>
                  <span className="text-xs text-muted shrink-0">
                    {page.textLines.length} {t.linesLabel} · {page.images.length} {t.imagesLabel}
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-border-subtle/60 space-y-2 text-xs text-muted pl-3">
                  {page.description && (
                    <p className="italic text-foreground/80">
                      {t.metaDesc} {page.description}
                    </p>
                  )}
                  <div className="max-h-64 overflow-y-auto bg-card-bg/50 p-3 rounded-sm space-y-1.5 text-foreground/90">
                    {page.textLines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 3. All 94 Downloaded Images Gallery */}
        <section
          aria-labelledby="images-heading"
          className="space-y-6 pt-6 border-t border-border-subtle"
        >
          <h2
            id="images-heading"
            className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
          >
            {t.secImagesTitle} ({mediaManifest.images.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaManifest.images.map((img) => (
              <figure
                key={img.filename}
                className="bg-card-bg/60 border border-border-subtle rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <a
                  href={img.localPublicPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-4/3 bg-background overflow-hidden"
                >
                  <img
                    src={img.localPublicPath}
                    alt={`Archived media ${img.filename.replaceAll("_", "-")}`}
                    width={300}
                    height={225}
                    loading="lazy"
                    className="w-full h-full object-contain hover:scale-105 transition-transform"
                  />
                </a>
                <figcaption className="p-2.5 text-[11px] text-muted border-t border-border-subtle space-y-0.5">
                  <p className="font-mono truncate text-foreground">
                    {img.filename}
                  </p>
                  <p>{Math.round(img.bytes / 1024)} KB</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 sm:px-8 py-10 border-t border-border-subtle text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p>{t.footerNotice}</p>
        <Link
          href="/"
          className="text-sakya-crimson hover:underline underline-offset-4 font-medium"
        >
          {t.footerBack}
        </Link>
      </footer>
    </div>
  );
}
