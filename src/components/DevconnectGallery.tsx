"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import galleryItemsRaw from "@/data/archive-gallery.json";

type Language = "en" | "bo";
type CategoryKey = "all" | "masters" | "pujas" | "teachings" | "schools" | "art";

export interface GalleryItem {
  id: string;
  filename: string;
  path: string;
  bytes: number;
  width: number;
  height: number;
  aspect: "wide" | "tall" | "standard";
  category: "masters" | "pujas" | "teachings" | "schools" | "art";
  titleEn: string;
  contextPages: string[];
  description: string;
}

const galleryItems = galleryItemsRaw as GalleryItem[];

const CATEGORIES: {
  key: CategoryKey;
  labelEn: string;
  labelBo: string;
}[] = [
  { key: "all", labelEn: "All Photos", labelBo: "ཚང་མ།" },
  { key: "masters", labelEn: "Masters & Lineage", labelBo: "བླ་མ་བརྒྱུད་པ།" },
  { key: "pujas", labelEn: "Pujas & Liturgies", labelBo: "ཆོ་ག་དང་ཞལ་འདོན།" },
  { key: "teachings", labelEn: "Teachings & Retreats", labelBo: "གསུང་ཆོས་དང་སྒོམ་སྒྲུབ།" },
  { key: "schools", labelEn: "Pema Ts'al & Youth", labelBo: "པདྨ་ཚལ་དང་གཞོན་ནུ།" },
  { key: "art", labelEn: "Sacred Art & Altars", labelBo: "སྐུ་བརྙན་དང་མཆོད་རྫས།" },
];

interface DevconnectGalleryProps {
  lang: Language;
}

export function DevconnectGallery({ lang }: DevconnectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {
      all: galleryItems.length,
      masters: 0,
      pujas: 0,
      teachings: 0,
      schools: 0,
      art: 0,
    };
    for (const item of galleryItems) {
      if (item.category in counts) {
        counts[item.category]++;
      }
    }
    return counts;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return galleryItems.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      const inTitle = item.titleEn.toLowerCase().includes(q);
      const inFilename = item.filename.toLowerCase().includes(q);
      const inContext = item.contextPages.some((p) => p.toLowerCase().includes(q));
      const inDesc = item.description.toLowerCase().includes(q);

      return inTitle || inFilename || inContext || inDesc;
    });
  }, [selectedCategory, searchQuery]);

  // Modal navigation handlers
  const handleOpenModal = (index: number) => {
    setActiveItemIndex(index);
  };

  const handleCloseModal = useCallback(() => {
    setActiveItemIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeItemIndex === null || filteredItems.length === 0) return;
    setActiveItemIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length
    );
  }, [activeItemIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (activeItemIndex === null || filteredItems.length === 0) return;
    setActiveItemIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filteredItems.length
    );
  }, [activeItemIndex, filteredItems.length]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (activeItemIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItemIndex, handleCloseModal, handlePrev, handleNext]);

  const activeItem =
    activeItemIndex !== null && filteredItems[activeItemIndex]
      ? filteredItems[activeItemIndex]
      : null;

  return (
    <div className="space-y-6">
      {/* Devconnect-style Filter Bar & Search */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div
          role="radiogroup"
          aria-label="Filter gallery by category"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.key;
            const count = categoryCounts[cat.key];
            const label = lang === "bo" ? cat.labelBo : cat.labelEn;

            return (
              <button
                key={cat.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-sakya-crimson text-white shadow-xs"
                    : "bg-card-bg/80 border border-border-subtle text-foreground/80 hover:text-foreground hover:border-sakya-gold"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? "bg-white/20 text-white" : "bg-black/5 text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Live Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "bo"
                  ? "སྐུ་པར་ ༩༤ ནང་བླ་མ། ཆོས་མཛད། དུས་ཆེན་བཅས་འཚོལ་ཞིབ..."
                  : "Search 94 photos by teacher, puja, event, or file..."
              }
              className="w-full pl-9 pr-8 py-2 text-xs bg-background/90 border border-border-subtle rounded-sm text-foreground focus:border-sakya-crimson outline-none placeholder:text-muted/70 transition-colors"
            />
            <svg
              className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs p-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-muted font-mono flex items-center gap-2">
            <span>
              {lang === "bo"
                ? `པར་རིས་ ${filteredItems.length} / ${galleryItems.length} སྟོན་བཞིན་པ།`
                : `Showing ${filteredItems.length} of ${galleryItems.length} photos`}
            </span>
          </div>
        </div>
      </div>

      {/* Devconnect Bento / Masonry Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-sm border border-border-subtle bg-card-bg/40 space-y-2">
          <p className="text-sm text-muted">
            {lang === "bo"
              ? "འཚོལ་ཞིབ་དང་མཐུན་པའི་སྐུ་པར་མ་རྙེད།"
              : "No photos found matching your search."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-xs text-sakya-crimson underline underline-offset-4 cursor-pointer"
          >
            {lang === "bo" ? "ཚང་མ་སྟོན།" : "Reset filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => {
            const kbSize = Math.round(item.bytes / 1024);
            const isMega = kbSize > 1024;
            const sizeLabel = isMega
              ? `${(kbSize / 1024).toFixed(1)} MB`
              : `${kbSize} KB`;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenModal(index)}
                className="group relative rounded-sm border border-border-subtle bg-card-bg/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-sakya-gold/70 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container with Devconnect Hover Zoom */}
                <div className="relative aspect-4/3 w-full bg-black/5 overflow-hidden">
                  <img
                    src={item.path}
                    alt={item.titleEn}
                    width={400}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Scrim on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] uppercase font-semibold tracking-wider text-white border border-white/15">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/15">
                      {item.width ? `${item.width}×${item.height}` : sizeLabel}
                    </span>
                  </div>

                  {/* Quick Preview Icon in Center on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="w-10 h-10 rounded-full bg-sakya-crimson/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Card Footer Information */}
                <div className="p-3 bg-card-bg/90 border-t border-border-subtle/70 space-y-1">
                  <p className="font-serif text-xs font-semibold text-foreground truncate group-hover:text-sakya-crimson transition-colors">
                    {item.titleEn}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                    <span className="truncate max-w-[140px]">{item.filename}</span>
                    <span>{sizeLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Devconnect Fullscreen Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.titleEn}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 p-3 sm:p-6"
          onClick={handleCloseModal}
        >
          {/* Main Modal Card */}
          <div
            className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-sm border border-white/15 bg-neutral-950 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3 bg-black/50">
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90 truncate">
                  {activeItem.titleEn}
                </span>
                <span className="text-[11px] font-mono text-white/50 hidden sm:inline">
                  ({activeItemIndex !== null ? activeItemIndex + 1 : 1} /{" "}
                  {filteredItems.length})
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Image Preview Canvas */}
            <div className="relative flex-1 min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center bg-black/80 p-2 sm:p-4 select-none">
              <img
                src={activeItem.path}
                alt={activeItem.titleEn}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xs shadow-lg"
              />

              {/* Previous / Next Arrow Controls */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-sakya-crimson border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title="Previous photo (Left Arrow)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-sakya-crimson border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title="Next photo (Right Arrow)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Metadata Footer Drawer */}
            <div className="p-4 bg-neutral-900 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-serif text-sm font-medium text-white">
                  {activeItem.titleEn}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/60 font-mono text-[11px]">
                  <span><strong>File:</strong> {activeItem.filename}</span>
                  <span><strong>Resolution:</strong> {activeItem.width}×{activeItem.height} px</span>
                  <span><strong>Size:</strong> {Math.round(activeItem.bytes / 1024)} KB</span>
                  <span className="uppercase px-1.5 py-0.2 rounded-xs bg-white/10 text-white">
                    {activeItem.category}
                  </span>
                </div>
                {activeItem.contextPages.length > 0 && (
                  <p className="text-[11px] text-white/50 pt-0.5">
                    <strong>Published in:</strong> {activeItem.contextPages.join(" · ")}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeItem.path}
                  download={activeItem.filename}
                  className="px-3 py-2 rounded-xs bg-sakya-crimson hover:bg-sakya-crimson/90 text-white text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{lang === "bo" ? "སྐུ་པར་ཕབ་ལེན" : "Download Original"}</span>
                </a>
                <a
                  href={activeItem.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xs border border-white/20 bg-white/5 hover:bg-white/15 text-white/90 text-xs font-medium transition-colors"
                >
                  {lang === "bo" ? "ཐད་ཀར་གཟིགས" : "Open Fullscreen ↗"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
