"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Language = "en" | "bo";
type ViewMode = "village" | "bento" | "chronicle";

interface CulturalLandmark {
  id: string;
  nameBo: string;
  nameEn: string;
  categoryBo: string;
  categoryEn: string;
  locationBo: string;
  locationEn: string;
  descriptionBo: string;
  descriptionEn: string;
  practicesBo: string[];
  practicesEn: string[];
  soundType: "hearth" | "horn" | "stream" | "lute" | "herbal" | "loom" | "wind" | "bell";
  freq: number;
  colorClass: string;
  borderClass: string;
  bgGlowClass: string;
  coords: { x: number; y: number; z: number }; // Isometric grid coordinates on village plateau
  svgModel: React.ReactNode;
}

const VILLAGE_LANDMARKS: CulturalLandmark[] = [
  {
    id: "homestead",
    nameBo: "ཁང་པ། · རྡོ་ཁང་སྲོལ་རྒྱུན།",
    nameEn: "The Stone Homestead & Hearth",
    categoryBo: "འཚོ་བའི་རིག་གཞུང་དང་མགྲོན་བསུ།",
    categoryEn: "Domestic Living & Hospitality",
    locationBo: "གྲོང་གསེབ་དཀྱིལ་གྱི་གཞིས་ཀ",
    locationEn: "Central Village Settlement",
    descriptionBo:
      "བོད་ཀྱི་སྲོལ་རྒྱུན་རྡོ་ཁང་ནི་རྡོ་དང་ཤིང་ལས་བསྐྲུན་ཞིང་སྒེའུ་ཁུང་ལ་ནག་རིས་དང་ཐོག་ཁར་དར་ལྕོག་བཙུགས་ཡོད། ཐབ་ཚང་དུ་ཇ་བསྲུབས་མ་དང་རྩམ་པ། མར་ཁུ་བཅས་ཀྱིས་མགྲོན་པོར་སྣེ་ལེན་བྱེད་པའི་དྲོ་སྐྱིད་ཀྱི་གནས་མཆོག་ཡིན།",
    descriptionEn:
      "Traditional multi-story whitewashed stone homesteads built with timber lintels, black trapezoidal window frames, and flat roofs adorned with prayer flags. The hearth is the heart of family hospitality, where churned salted butter tea (Po Cha) and roasted barley flour (Tsampa) are shared with warmth and reverence.",
    practicesBo: [
      "ཇ་སྲུབ་མདོང་ནང་ཇ་བསྲུབས་པ་དང་མར་དང་ཚྭ་སྦྱོར་བ།",
      "ནས་རྩམ་པ་མར་ཁུ་དང་ལྷན་དུ་བརྫིས་ཏེ་ཟ་བའི་གོམས་གཤིས།",
      "དགུན་དུས་ཐབ་ཀའི་མཐའ་སྐོར་དུ་ཁྱིམ་ཚང་མཉམ་འཛོམས་ཀྱི་གཏམ་རྒྱུད།",
    ],
    practicesEn: [
      "Churning tea leaves, yak butter, and salt in tall wooden dongmo churns.",
      "Kneading fragrant roasted highland barley flour into savory tsampa dough.",
      "Gathering around the central wood-fired hearth for multi-generational oral storytelling.",
    ],
    soundType: "hearth",
    freq: 432,
    colorClass: "text-amber-400",
    borderClass: "border-amber-400/50",
    bgGlowClass: "from-amber-500/25 to-amber-700/5",
    coords: { x: 30, y: 55, z: 20 },
    svgModel: (
      /* Traditional Stone Homestead with Black Windows & Rooftop Flag */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* House walls */}
        <polygon points="12,56 16,24 48,24 52,56" strokeWidth="2.5" className="fill-stone-100/90 stroke-amber-500/80" />
        {/* Flat parapet roof */}
        <rect x="14" y="20" width="36" height="5" strokeWidth="2" className="fill-amber-900 stroke-amber-600" />
        {/* Penba frieze trim */}
        <rect x="15" y="24" width="34" height="2" className="fill-red-800" />
        {/* Black trapezoid windows */}
        <polygon points="22,34 24,30 30,30 32,34" className="fill-stone-900 stroke-amber-400/80" strokeWidth="1.2" />
        <polygon points="34,34 36,30 42,30 44,34" className="fill-stone-900 stroke-amber-400/80" strokeWidth="1.2" />
        {/* Heavy timber entrance doorway */}
        <rect x="27" y="44" width="10" height="12" className="fill-stone-900 stroke-amber-500" strokeWidth="1.5" />
        <line x1="27" y1="44" x2="37" y2="44" strokeWidth="2" className="stroke-amber-300" />
        {/* Rooftop prayer flag pole */}
        <line x1="46" y1="20" x2="46" y2="8" strokeWidth="1.5" className="stroke-stone-300" />
        <polygon points="46,8 54,11 46,14" className="fill-amber-400 stroke-amber-500" strokeWidth="1" />
        {/* Hearth smoke swirl */}
        <path d="M22,18 Q20,12 24,8 Q28,4 25,2" strokeWidth="1.2" strokeLinecap="round" className="stroke-white/40" />
      </svg>
    ),
  },
  {
    id: "nomad-tent",
    nameBo: "སྦྲ་ནག · འབྲོག་པའི་རྫི་སྦྲ།",
    nameEn: "The Black Yak-Hair Nomad Tent",
    categoryBo: "འབྲོག་པའི་འཚོ་བ་དང་རང་བྱུང་ཁམས།",
    categoryEn: "Pastoral Nomadism & High Plateau Ecology",
    locationBo: "སྤང་རི་མཐོན་པོའི་འབྲོག་ས།",
    locationEn: "Alpine Summer Pastures",
    descriptionBo:
      "གཡག་རྩིད་ལས་བཐགས་པའི་སྦྲ་ནག་ནི་བོད་ཀྱི་འབྲོག་པའི་ཐུན་མོང་མ་ཡིན་པའི་སྡོད་གནས་ཡིན། ཆར་རླུང་དང་གྲང་ངར་འགོག་ཅིང་རྩྭ་ཐང་གི་རང་དབང་དང་གཡག་ལུག་འཚོ་སྐྱོང་གི་རིག་གཞུང་མཚོན་པར་བྱེད།",
    descriptionEn:
      "Handwoven from the coarse, weather-resistant outer hair of the yak, the ba-nak (black tent) is the resilient mobile sanctuary of the Drokpa (Tibetan pastoralists). It breathes open in fair weather and tightens against blizzard winds, embodying harmonious existence on the world's highest plateau.",
    practicesBo: [
      "གཡག་ལུག་རྩྭ་ཁར་འདེབས་པ་དང་འབྲོག་གླུ་ལེན་པའི་གོམས་སྲོལ།",
      "འོ་མ་དཀྲོགས་ཏེ་མར་དང་ཐུད་བཟོ་བའི་ལག་རྩལ།",
      "དུས་ཚིགས་བཞིར་རྩྭ་ཁ་བརྗེ་བའི་རང་བྱུང་སྲུང་སྐྱོབ་ཀྱི་ཤེས་རབ།",
    ],
    practicesEn: [
      "Herding yaks across high meadows while singing resonant pastoral mountain songs (glu).",
      "Churning rich milk into golden butter, hard dried curd (chhurpi), and wholesome cheeses.",
      "Rotating seasonal pastures in profound reverence for plateau ecological equilibrium.",
    ],
    soundType: "horn",
    freq: 196,
    colorClass: "text-stone-300",
    borderClass: "border-stone-400/50",
    bgGlowClass: "from-stone-500/25 to-stone-700/5",
    coords: { x: 70, y: 25, z: 25 },
    svgModel: (
      /* Nomad Yak-Hair Tent with Ridge Poles, Guy Lines & Smoke Hole */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Tent Body */}
        <polygon points="6,52 32,20 58,52" strokeWidth="2.5" className="fill-stone-900 stroke-stone-400" />
        {/* Central Ridge opening for smoke */}
        <line x1="28" y1="20" x2="36" y2="20" strokeWidth="3" className="stroke-amber-400" />
        <path d="M32,18 Q34,12 31,6" strokeWidth="1.2" strokeLinecap="round" className="stroke-white/30" />
        {/* Exterior Guy Lines and Wooden Stakes */}
        <line x1="16" y1="36" x2="2" y2="52" strokeWidth="1.2" className="stroke-stone-500" />
        <line x1="48" y1="36" x2="62" y2="52" strokeWidth="1.2" className="stroke-stone-500" />
        {/* Wooden tent pole crest */}
        <line x1="32" y1="20" x2="32" y2="14" strokeWidth="2" className="stroke-amber-600" />
        {/* Flap entrance */}
        <polygon points="26,52 32,34 38,52" className="fill-stone-950 stroke-stone-600" strokeWidth="1.5" />
        {/* Grazing Yak silhouette */}
        <ellipse cx="14" cy="46" rx="4" ry="3" className="fill-stone-800" />
        <circle cx="11" cy="44" r="1.8" className="fill-stone-800" />
        <line x1="11" y1="43" x2="9" y2="41" strokeWidth="1.2" className="stroke-stone-300" />
      </svg>
    ),
  },
  {
    id: "barley-fields",
    nameBo: "ནས་ཞིང་། · གསེར་མདོག་རྩམ་པའི་ཞིང་ས།",
    nameEn: "Highland Barley Terraces & Watermill",
    categoryBo: "ཞིང་ལས་དང་ལོ་ཏོག་དུས་ཆེན།",
    categoryEn: "Terraced Agriculture & Harvest Traditions",
    locationBo: "ཆུ་བོའི་འགྲམ་གྱི་ཞིང་ས།",
    locationEn: "Glacial River Basin",
    descriptionBo:
      "བོད་ཀྱི་ས་མཐོར་ལོ་ངོ་སྟོང་ཕྲག་རིང་སྐྱེས་པའི་ནས་ནི་བོད་མིའི་སྲོག་རྟེན་ཡིན། ཆུ་འཁོར་གྱིས་ནས་བརྔོས་མ་རྩམ་པར་འཐག་ཅིང་། སྟོན་བསྡུའི་དུས་སུ་འོང་སྐོར་གྱི་དགའ་སྟོན་རོལ་བའི་སྲོལ་རྒྱུན་ལྡན།",
    descriptionEn:
      "Cultivated for millennia above 3,500 meters, resilient Tibetan highland barley (nas) is the staple crop of Himalayan civilization. Rushing mountain aqueducts power wooden watermills (chudkor) to grind roasted grains into fine tsampa, celebrated during the autumn harvest procession (Ongkor).",
    practicesBo: [
      "དཔྱིད་ཀར་གླང་ཆེན་གཉིས་ལ་གཉའ་ཤིང་བཀལ་ཏེ་ཞིང་ཁ་རྨོ་བ།",
      "སྟོན་དུས་འོང་སྐོར་དུས་ཆེན་ལ་ལོ་ཏོག་གི་མཐའ་བསྐོར་ཞིང་གཞས་ལེན་པ།",
      "རང་བྱུང་ཆུ་འཁོར་གྱིས་ནས་རྩམ་པར་འཐག་པའི་ལག་རྩལ།",
    ],
    practicesEn: [
      "Yoking decorated dzo (ox-yak hybrids) with painted wooden plows to bless spring planting.",
      "Circumambulating golden terraces during Ongkor while singing lyrical harvest ballads.",
      "Channeling glacial mountain torrents to turn horizontal wooden watermill grinding stones.",
    ],
    soundType: "stream",
    freq: 396,
    colorClass: "text-yellow-400",
    borderClass: "border-yellow-400/50",
    bgGlowClass: "from-yellow-500/25 to-yellow-700/5",
    coords: { x: 20, y: 30, z: 15 },
    svgModel: (
      /* Terraced Mountain Barley Fields with Aqueduct & Watermill */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Tiered Terrace Steps */}
        <path d="M4,48 Q20,44 40,48 Q54,50 60,46" strokeWidth="2.5" className="stroke-yellow-600 fill-amber-900/30" />
        <path d="M8,38 Q26,34 46,38 Q56,40 62,36" strokeWidth="2.5" className="stroke-yellow-500 fill-amber-800/30" />
        <path d="M14,28 Q32,24 50,28" strokeWidth="2.5" className="stroke-yellow-400 fill-amber-700/30" />
        {/* Barley Stalks */}
        <line x1="20" y1="34" x2="20" y2="28" strokeWidth="1.5" className="stroke-yellow-300" />
        <circle cx="20" cy="27" r="1.5" className="fill-yellow-400" />
        <line x1="28" y1="33" x2="28" y2="27" strokeWidth="1.5" className="stroke-yellow-300" />
        <circle cx="28" cy="26" r="1.5" className="fill-yellow-400" />
        <line x1="38" y1="36" x2="38" y2="30" strokeWidth="1.5" className="stroke-yellow-300" />
        <circle cx="38" cy="29" r="1.5" className="fill-yellow-400" />
        {/* Wooden Waterwheel Mill */}
        <rect x="44" y="44" width="14" height="12" className="fill-stone-800 stroke-amber-500" strokeWidth="1.5" />
        <circle cx="51" cy="50" r="4.5" className="stroke-yellow-400" strokeWidth="1.5" />
        <line x1="51" y1="45.5" x2="51" y2="54.5" strokeWidth="1" className="stroke-yellow-300" />
        <line x1="46.5" y1="50" x2="55.5" y2="50" strokeWidth="1" className="stroke-yellow-300" />
        {/* Flowing Water Stream */}
        <path d="M51,55 Q53,60 56,64" strokeWidth="2" className="stroke-cyan-400" />
      </svg>
    ),
  },
  {
    id: "folk-square",
    nameBo: "གཞས་རའི་སྒོར་གཞས། · དམངས་ཁྲོད་རིག་གནས།",
    nameEn: "The Village Square & Dramyin Lute",
    categoryBo: "དམངས་གཞས་དང་སྒོར་གཞས་སྒྱུ་རྩལ།",
    categoryEn: "Folk Music, Dance & Epic Storytelling",
    locationBo: "གྲོང་གསེབ་ཀྱི་མདུན་ཐང་།",
    locationEn: "Central Cobblestone Plaza",
    descriptionBo:
      "གྲོང་ཚོའི་མདུན་ཐང་ནི་དུས་ཆེན་དང་དགའ་སྟོན་སྐབས་སྒོར་གཞས་འཁྲབ་པ་དང་སྒྲ་སྙན་དཀྲོལ་བའི་ས་གནས་ཡིན། གླིང་གེ་སར་རྒྱལ་པོའི་སྒྲུང་དང་དམངས་ཁྲོད་གཏམ་རྒྱུད་ཀྱི་འབྱུང་ཁུངས་གཙོ་བོ་ཡིན།",
    descriptionEn:
      "The communal heart of the settlement where villagers gather during Losar and summer festivals for Gorshey (circular communal dances), rhythmic stepping, and six-stringed Dramyin lute performances, carrying forward the living oral epics of King Gesar.",
    practicesBo: [
      "ཕོ་མོ་རྒན་གཞོན་ཚང་མས་ལག་སྦྲེལ་ཏེ་སྒོར་གཞས་འཁྲབ་པ།",
      "སྒྲ་སྙན་སྦྲེལ་བའི་དབྱངས་རྟ་དང་མཉམ་དུ་ཞབས་བྲོ་རྒྱག་པ།",
      "གླིང་གེ་སར་རྒྱལ་པོའི་དཔའ་བོའི་སྒྲུང་གཏམ་ཉན་པའི་སྲོལ་རྒྱུན།",
    ],
    practicesEn: [
      "Forming joyous interlocking concentric circles for rhythmic foot-stomping Gorshey dances.",
      "Strumming the horse-headed Dramyin lute with bone picks to accompany traditional folk couplets.",
      "Reciting poetic verses from the million-line Epic of King Gesar by the fireside.",
    ],
    soundType: "lute",
    freq: 528,
    colorClass: "text-rose-400",
    borderClass: "border-rose-400/50",
    bgGlowClass: "from-rose-500/25 to-rose-700/5",
    coords: { x: 50, y: 50, z: 22 },
    svgModel: (
      /* Village Square with Dramyin Lute, Bonfire & Cobblestone Rings */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Concentric cobblestone dancing circles */}
        <circle cx="32" cy="40" r="20" strokeWidth="1" strokeDasharray="3 3" className="stroke-amber-400/40" />
        <circle cx="32" cy="40" r="12" strokeWidth="1.2" className="stroke-amber-400/60" />
        {/* Central Communal Fire / Hearth */}
        <ellipse cx="32" cy="42" rx="4" ry="2" className="fill-amber-900" />
        <path d="M30,42 Q32,32 34,42 Q33,36 32,30 Q31,36 30,42" className="fill-orange-500 stroke-yellow-300" strokeWidth="1" />
        {/* The Sacred 6-Stringed Dramyin Lute */}
        {/* Lute Body */}
        <ellipse cx="32" cy="22" rx="6" ry="8" className="fill-amber-800 stroke-amber-400" strokeWidth="1.5" />
        <ellipse cx="32" cy="22" rx="2.5" ry="3.5" className="fill-stone-950" />
        {/* Lute Neck */}
        <rect x="30.5" y="6" width="3" height="12" className="fill-amber-700 stroke-amber-400" strokeWidth="1" />
        {/* Horse-head finial (Rakta) */}
        <path d="M30.5,6 Q28,3 32,1 Q35,3 33.5,6" strokeWidth="1.2" className="fill-amber-400 stroke-amber-200" />
        {/* Pegs */}
        <line x1="28" y1="8" x2="36" y2="8" strokeWidth="1" className="stroke-amber-200" />
        <line x1="28" y1="11" x2="36" y2="11" strokeWidth="1" className="stroke-amber-200" />
        <line x1="28" y1="14" x2="36" y2="14" strokeWidth="1" className="stroke-amber-200" />
        {/* Sound waves radiating */}
        <path d="M42,16 Q45,22 42,28" strokeWidth="1" strokeLinecap="round" className="stroke-rose-400" />
        <path d="M22,16 Q19,22 22,28" strokeWidth="1" strokeLinecap="round" className="stroke-rose-400" />
      </svg>
    ),
  },
  {
    id: "medicine-house",
    nameBo: "གསོ་རིག་སྨན་ཁང་། · བོད་ཀྱི་སྨན་རྩིས་རིག་པ།",
    nameEn: "Sowa Rigpa Apothecary & Teahouse",
    categoryBo: "གསོ་བ་རིག་པ་དང་རྩི་སྨན་རིག་གཞུང་།",
    categoryEn: "Traditional Tibetan Medicine (Sowa Rigpa) & Botany",
    locationBo: "གྲོང་གསེབ་ཀྱི་ཤར་ཕྱོགས།",
    locationEn: "Eastern Meadow Foothills",
    descriptionBo:
      "བོད་ཀྱི་གསོ་བ་རིག་པ་ནི་ལོ་ངོ་ཉིས་སྟོང་ལྷག་གི་ལོ་རྒྱུས་ལྡན་པའི་རང་བྱུང་སྨན་གཞུང་ཡིན། ས་མཐོའི་རྩི་སྨན་དང་རྩ་བརྟག་ཆུ་བརྟག རླུང་མཁྲིས་བད་ཀན་གྱི་དོ་མཉམ་སྲུང་བའི་གནས་མཆོག་ཡིན།",
    descriptionEn:
      "The village center for Sowa Rigpa (The Science of Healing), one of the world's oldest surviving medical systems. Rooted in the Four Tantras (Gyushi), amchis (physicians) balance the three humors (Lung, Tripa, Baekan) through high-altitude botanical remedies and pulse diagnosis.",
    practicesBo: [
      "གངས་རིའི་རྩི་སྨན་དང་དབྱར་རྩྭ་དགུན་འབུ་སོགས་བསྡུ་ལེན་གྱི་ཤེས་རབ།",
      "འཕར་རྩ་བརྟག་པ་དང་གཟུགས་ཁམས་དོ་མཉམ་སྙོམས་པའི་སྨན་བཅོས།",
      "རྩི་སྨན་ཇ་དང་གསོལ་ཇ་མངར་མོ་འཐུང་བའི་འཚོ་བའི་རོལ་སྟངས།",
    ],
    practicesEn: [
      "Harvesting wild alpine medicinal botanicals (Rhodiola, Snow Lotus, saffron) according to lunar cycles.",
      "Reading the 28 subtle pulse waveforms to discern internal organ equilibrium.",
      "Blending therapeutic herbal infusions and spiced sweet tea (cha ngarmo) for physical vigor.",
    ],
    soundType: "herbal",
    freq: 639,
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-400/50",
    bgGlowClass: "from-emerald-500/25 to-emerald-700/5",
    coords: { x: 75, y: 55, z: 18 },
    svgModel: (
      /* Apothecary with Mortar, Pestle, Medicine Pouches & Brass Teapot */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Traditional Mortar & Pestle */}
        <path d="M16,36 Q16,52 32,52 Q48,52 48,36 Z" strokeWidth="2" className="fill-stone-800 stroke-emerald-400" />
        <rect x="14" y="32" width="36" height="5" rx="1.5" className="fill-stone-700 stroke-emerald-300" strokeWidth="1.5" />
        {/* Pestle diagonally */}
        <line x1="42" y1="20" x2="28" y2="44" strokeWidth="3" strokeLinecap="round" className="stroke-amber-400" />
        {/* Medicinal Himalayan Herb Leaves (Snow Lotus / Rhodiola) */}
        <path d="M32,24 Q26,14 32,8 Q38,14 32,24" className="fill-emerald-600/70 stroke-emerald-300" strokeWidth="1.2" />
        <path d="M26,20 Q18,16 22,10 Q28,14 26,20" className="fill-emerald-600/60 stroke-emerald-300" strokeWidth="1.2" />
        <path d="M38,20 Q46,16 42,10 Q36,14 38,20" className="fill-emerald-600/60 stroke-emerald-300" strokeWidth="1.2" />
        {/* Traditional Brass Teapot on stand */}
        <ellipse cx="54" cy="46" rx="6" ry="4" className="fill-amber-700 stroke-yellow-400" strokeWidth="1.2" />
        <path d="M54,42 Q52,36 54,34" strokeWidth="1" className="stroke-yellow-300" />
        <path d="M58,44 Q62,42 61,48" strokeWidth="1.2" className="stroke-yellow-400" />
      </svg>
    ),
  },
  {
    id: "crafts-loom",
    nameBo: "ལག་ཤེས་བཟོ་གྲྭ། · ཐགས་དང་ཤིང་བཟོ།",
    nameEn: "Artisans' Loom & Woodcraft Studio",
    categoryBo: "ལག་ཤེས་བཟོ་རིག་དང་འཐག་ལས།",
    categoryEn: "Handcrafts, Textile Weaving & Woodcarving",
    locationBo: "གྲོང་གསེབ་ཀྱི་ནུབ་ཕྱོགས།",
    locationEn: "Western Craft Quarter",
    descriptionBo:
      "བོད་ཀྱི་ཐགས་ལས་ནི་བུད་མེད་ཚོའི་སྤང་གདན་དང་ས་གདན་བཐག་པའི་ལག་རྩལ་མཆོག་གྱུར་ཡིན། ཤིང་བཟོ་བས་པར་ཤིང་བརྐོས་ཏེ་དྭངས་གསལ་ཅན་གྱི་ཤོག་གུ་བཟོ་བའི་ལོ་རྒྱུས་ལྡན།",
    descriptionEn:
      "The atelier of master weavers and woodcarvers. Women handloom the celebrated pangden (vibrant multi-striped aprons) and high-density highland wool carpets, while artisans carve intricate pear-wood blocks to print manuscripts on handmade Daphne bark paper (desho).",
    practicesBo: [
      "ལག་ཐགས་ཁྲོད་ཚོན་ཁྲ་ཅན་གྱི་སྤང་གདན་དང་ས་གདན་བཐག་པ།",
      "ཤིང་བཟོ་མཁས་པས་ཤིང་པར་བརྐོས་ཏེ་དཔེ་ཆ་དཔར་བསྐྲུན་བྱེད་པ།",
      "བོད་ཤོག་བཟོ་བའི་སྲོལ་རྒྱུན་ལག་རྩལ་རྒྱུན་འཛིན།",
    ],
    practicesEn: [
      "Weaving rainbow-striped pangden woolen aprons on traditional horizontal floor looms.",
      "Hand-chiseling reverse Tibetan calligraphy into cured birch blocks for xylographic printing.",
      "Harvesting and beating Daphne shrub roots into archival, insect-repellent paper sheets.",
    ],
    soundType: "loom",
    freq: 741,
    colorClass: "text-indigo-300",
    borderClass: "border-indigo-300/50",
    bgGlowClass: "from-indigo-400/25 to-indigo-600/5",
    coords: { x: 25, y: 75, z: 15 },
    svgModel: (
      /* Upright Handloom with Pangden Striped Fabric & Shuttle */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Loom Wooden Frame */}
        <line x1="12" y1="8" x2="12" y2="56" strokeWidth="3" className="stroke-amber-800" />
        <line x1="52" y1="8" x2="52" y2="56" strokeWidth="3" className="stroke-amber-800" />
        <line x1="8" y1="12" x2="56" y2="12" strokeWidth="3" className="stroke-amber-700" />
        <line x1="8" y1="52" x2="56" y2="52" strokeWidth="3" className="stroke-amber-700" />
        {/* Taut Warp Threads */}
        <line x1="20" y1="12" x2="20" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="26" y1="12" x2="26" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="32" y1="12" x2="32" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="38" y1="12" x2="38" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="44" y1="12" x2="44" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        {/* Woven Pangden Textile with vibrant horizontal stripes */}
        <rect x="18" y="24" width="28" height="6" className="fill-red-600 stroke-none" />
        <rect x="18" y="30" width="28" height="6" className="fill-amber-400 stroke-none" />
        <rect x="18" y="36" width="28" height="6" className="fill-teal-500 stroke-none" />
        <rect x="18" y="42" width="28" height="6" className="fill-indigo-600 stroke-none" />
        {/* Weaving Shuttle (Thung) */}
        <polygon points="10,22 48,22 52,24 48,26 10,26" className="fill-amber-400 stroke-amber-600" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "lungta-ridge",
    nameBo: "རླུང་རྟའི་ལ་རྩེ། · དར་ལྕོག་དང་ལ་བཙས།",
    nameEn: "Wind Horse Ridge & Mountain Pass",
    categoryBo: "རང་བྱུང་ཁམས་དང་རླུང་རྟའི་དད་མོས།",
    categoryEn: "Ecological Reverence & Sacred Geography",
    locationBo: "གྲོང་གསེབ་རྒྱབ་ཀྱི་ལ་ཁ།",
    locationEn: "High Mountain Pass & Pass Cairn",
    descriptionBo:
      "ལ་རྩེ་དང་ལ་ཁ་རྣམས་སུ་རླུང་རྟའི་དར་ལྕོག་ཕྱོགས་བཅུར་བསྒྲེངས་ཏེ་རླུང་གིས་བདེ་ལེགས་ཀྱི་སྨོན་ལམ་འཁྱེར་བར་ཡིད་ཆེས་བྱེད། རང་བྱུང་རི་ཀླུང་དང་མཐུན་ལམ་གྱི་མཚོན་དོན་ཡིན།",
    descriptionEn:
      "Erected on high mountain ridges (la-tse), cascading webs of five-colored prayer flags (Lungta: Blue space, White air, Red fire, Green water, Yellow earth) flutter in the fierce Himalayan winds, carrying prayers of peace, fortune, and harmony across valleys.",
    practicesBo: [
      "ལ་ཁར་སླེབས་དུས་ཀི་ཀི་བསོ་བསོ་ལྷ་རྒྱལ་ལོ་ཞེས་སྐད་གསང་མཐོན་པོས་འབོད་པ།",
      "རླུང་རྟ་དགུང་དུ་འཕུར་ཕྱིར་དར་ལྕོག་གསར་པ་འཛུགས་པའི་ལམ་སྲོལ།",
      "རི་བདག་དང་ཡུལ་ལྷ་མཆོད་པའི་གནའ་བོའི་རིག་གཞུང་།",
    ],
    practicesEn: [
      "Shouting the ancient mountain victor's cry 'Ki Ki So So Lha Gyal Lo!' upon summiting the high pass.",
      "Renewing prayer flag clusters during Losar to revitalize personal life-force (lungta).",
      "Building rock cairns (oboo) stone-by-stone as offerings of safety and gratitude to mountain spirits.",
    ],
    soundType: "wind",
    freq: 852,
    colorClass: "text-sky-300",
    borderClass: "border-sky-300/50",
    bgGlowClass: "from-sky-400/25 to-sky-600/5",
    coords: { x: 50, y: 12, z: 35 },
    svgModel: (
      /* Stone Cairn (La-tse) with Vibrant 5-Color Prayer Flag Webs Fluttering */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Stone Cairn (La-tse) */}
        <polygon points="24,56 40,56 36,40 28,40" className="fill-stone-700 stroke-stone-400" strokeWidth="1.5" />
        <polygon points="26,40 38,40 35,30 29,30" className="fill-stone-600 stroke-stone-300" strokeWidth="1.5" />
        <polygon points="28,30 36,30 34,22 30,22" className="fill-stone-500 stroke-stone-200" strokeWidth="1.5" />
        {/* Main Central Juniper Branch / Pole */}
        <line x1="32" y1="48" x2="32" y2="4" strokeWidth="2.5" className="stroke-amber-700" />
        {/* Cascading diagonal prayer flag strings */}
        <line x1="32" y1="12" x2="4" y2="36" strokeWidth="1.2" className="stroke-white/60" />
        <line x1="32" y1="12" x2="60" y2="36" strokeWidth="1.2" className="stroke-white/60" />
        <line x1="32" y1="18" x2="8" y2="48" strokeWidth="1.2" className="stroke-white/50" />
        <line x1="32" y1="18" x2="56" y2="48" strokeWidth="1.2" className="stroke-white/50" />
        {/* Fluttering Five-Color Flags (Blue, White, Red, Green, Yellow) */}
        <polygon points="26,16 22,20 28,21" className="fill-blue-600" />
        <polygon points="20,21 16,25 22,26" className="fill-white" />
        <polygon points="14,27 10,31 16,32" className="fill-red-600" />
        <polygon points="8,32 4,36 10,37" className="fill-green-600" />
        {/* Right side flags */}
        <polygon points="38,16 42,20 36,21" className="fill-blue-600" />
        <polygon points="44,21 48,25 42,26" className="fill-white" />
        <polygon points="50,27 54,31 48,32" className="fill-red-600" />
        <polygon points="56,32 60,36 54,37" className="fill-yellow-400" />
      </svg>
    ),
  },
  {
    id: "chorten-wall",
    nameBo: "མཆོད་རྟེན་དང་མ་ཎི་རྡོ་ཕུང་། · རྡོ་བརྐོས་རིག་གནས།",
    nameEn: "Village Gateway Chorten & Mani Stones",
    categoryBo: "རྡོ་བརྐོས་སྒྱུ་རྩལ་དང་མཆོད་རྟེན་རིག་གཞུང་།",
    categoryEn: "Sacred Architecture & Stone Calligraphy",
    locationBo: "གྲོང་གསེབ་ཀྱི་འཇུག་སྒོ།",
    locationEn: "Village Gateway Entrance",
    descriptionBo:
      "གྲོང་གསེབ་ཀྱི་སྒོ་འགྲམ་དུ་མཆོད་རྟེན་དཀར་པོ་དང་མ་ཎི་ཡིག་དྲུག་བརྐོས་པའི་རྡོ་ཕུང་རིང་པོ་ཡོད། གྲོང་མི་ཚོས་དུས་རྒྱུན་སྐོར་བ་བྱེད་ཅིང་བདེ་སྐྱིད་དང་ཞི་བདེའི་སྨོན་ལམ་འདེབས་སྲོལ་ཡོད།",
    descriptionEn:
      "Standing proudly at the village perimeter, the gateway chorten (stupa) and adjacent wall of slate stones painstakingly carved with Tibetan mantras (Mani stones) provide architectural protection. Villagers circumambulate (kora) in clockwise devotion on their morning walks.",
    practicesBo: [
      "མ་ཎི་ཡིག་དྲུག་རྡོ་ལེབ་སྟེང་དབུ་ཅན་གཟུགས་སུ་བརྐོ་བའི་ལག་རྩལ།",
      "ཞོགས་པར་ཕྱོགས་གཡས་སྐོར་གྱིས་མཆོད་རྟེན་ལ་སྐོར་བ་བྱེད་པའི་གོམས་གཤིས།",
      "འགྲོ་འོང་བྱེད་མཁན་ཚང་མར་བདེ་ལེགས་ཀྱི་མཚོན་དོན་དུ་བཞེངས་པ།",
    ],
    practicesEn: [
      "Carving the six-syllable mantra 'Om Mani Padme Hum' into layered mountain slate slabs.",
      "Walking daily clockwise circumambulation (kora) while softly turning handheld prayer wheels.",
      "Offering white silk scarves (katas) at the gateway to welcome arriving travelers.",
    ],
    soundType: "bell",
    freq: 963,
    colorClass: "text-amber-300",
    borderClass: "border-amber-300/50",
    bgGlowClass: "from-amber-400/25 to-amber-600/5",
    coords: { x: 50, y: 88, z: 28 },
    svgModel: (
      /* White Tibetan Chorten (Stupa) with Stepped Base & Mani Wall */
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        {/* Stepped Base (Throne / Seng-tri) */}
        <rect x="20" y="52" width="24" height="4" className="fill-stone-100 stroke-amber-500" strokeWidth="1.5" />
        <rect x="22" y="48" width="20" height="4" className="fill-stone-100 stroke-amber-500" strokeWidth="1.5" />
        <rect x="24" y="44" width="16" height="4" className="fill-stone-100 stroke-amber-500" strokeWidth="1.5" />
        {/* Stupa Dome (Bumba) */}
        <path d="M26,44 C24,34 40,34 38,44 Z" className="fill-stone-50 stroke-amber-500" strokeWidth="1.5" />
        <rect x="30" y="38" width="4" height="4" className="fill-red-800" />
        {/* Harmika & 13 Wheels Spire (Chorten Rings) */}
        <polygon points="28,34 36,34 34,20 30,20" className="fill-amber-600 stroke-amber-300" strokeWidth="1.2" />
        <line x1="29" y1="31" x2="35" y2="31" strokeWidth="1" className="stroke-yellow-300" />
        <line x1="30" y1="27" x2="34" y2="27" strokeWidth="1" className="stroke-yellow-300" />
        <line x1="31" y1="23" x2="33" y2="23" strokeWidth="1" className="stroke-yellow-300" />
        {/* Crescent Moon & Sun Finial (Nyi-Da) */}
        <circle cx="32" cy="16" r="3" className="fill-yellow-400 stroke-yellow-200" strokeWidth="1" />
        <path d="M29,18 Q32,21 35,18 Q32,19 29,18" className="fill-yellow-200" />
        {/* Flanking Mani Stone Wall */}
        <polygon points="4,56 18,56 16,50 6,50" className="fill-stone-600 stroke-stone-400" strokeWidth="1.2" />
        <polygon points="46,56 60,56 58,50 48,50" className="fill-stone-600 stroke-stone-400" strokeWidth="1.2" />
        <text x="7" y="55" fontSize="4" fill="#fbbf24" fontFamily="serif">ཨོཾ</text>
        <text x="49" y="55" fontSize="4" fill="#fbbf24" fontFamily="serif">ཧཱུྃ</text>
      </svg>
    ),
  },
];

export function TibetanInteractiveOdyssey({ lang }: { lang: Language }) {
  const [viewMode, setViewMode] = useState<ViewMode>("village");
  const [activeLandmark, setActiveLandmark] = useState<CulturalLandmark | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<CulturalLandmark | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotate, setTargetRotate] = useState({ rx: 18, ry: -12 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* ══════════════════════════════════════════════════════════════════
     Authentic Himalayan Acoustic Synthesizer (Web Audio API)
     Generates authentic folk instruments:
     - Dramyin lute string pluck
     - Singing bowl resonance
     - High mountain wind flute
     - Resonant horn
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
          // Dramyin Pluck: Fast attack, harmonic overtones, quick decay
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
          // Ethereal Mountain Wind & Flute
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
          // Singing Bowl / Bell Modal Synthesis
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
    // Isometric tilt limits
    setTargetRotate({ rx: 22 - y * 16, ry: -12 + x * 24 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setTargetRotate({ rx: 18, ry: -12 });
    setHoveredLandmark(null);
  }, []);

  /* Himalayan Morning Mist & Golden Stardust Particle Engine */
  useEffect(() => {
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

    const colors = [
      "rgba(217, 163, 39, ",  // Himalayan Gold
      "rgba(244, 212, 122, ", // Morning Sunlight
      "rgba(255, 255, 255, ", // Glacial Mist
      "rgba(56, 189, 248, ",  // Turquoise Sky
    ];

    for (let i = 0; i < 48; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1, // Drifts gently upward like morning valley hearth smoke
        alpha: Math.random() * 0.5 + 0.2,
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
  }, []);

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
              : "Explore the miniature 3D Himalayan settlement: stone homesteads, nomad yak-hair tents, barley terraces, folk dance squares, weaving studios, and herbal tea sanctuaries. Tilt the landscape and tap landmarks to enter living traditions."}
          </p>
        </div>

        {/* View Mode & Audio Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          {/* Folk Sound Resonance Switch */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound(VILLAGE_LANDMARKS[3]); // Pluck lute
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

          {/* Perspective Switcher */}
          <div
            role="radiogroup"
            aria-label="View mode toggle"
            className="flex items-center rounded-full border border-border-subtle bg-card-bg/90 p-0.5 text-xs shadow-2xs"
          >
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
              <span>{lang === "bo" ? "གྲོང་གསེབ་༣D" : "3D Village"}</span>
            </button>
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
          SPATIAL REALM: 3D MINI TIBETAN VILLAGE (Jasmin Karatas Inspiration)
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "village" && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full min-h-[620px] sm:min-h-[700px] rounded-sm border border-sakya-gold/40 bg-gradient-to-b from-[#0a0807] via-[#140f0c] to-[#080706] overflow-hidden shadow-2xl p-4 sm:p-8 flex flex-col justify-between select-none"
          style={{ perspective: "1300px" }}
        >
          {/* Background Canvas: Floating Golden Stardust & Morning Mountain Mist */}
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
              {/* Back Mountains */}
              <polygon points="0,240 80,120 180,180 320,80 440,160 580,60 720,150 860,70 1000,160 1000,240" opacity="0.3" />
              {/* Mid Snowcaps */}
              <polygon points="0,240 140,100 260,170 390,70 510,140 660,50 800,130 920,85 1000,140 1000,240" opacity="0.5" />
              {/* Glowing Glacier Peaks */}
              <polygon points="370,70 390,70 410,100 375,100" fill="#fef08a" opacity="0.7" />
              <polygon points="640,50 660,50 680,85 645,85" fill="#fef08a" opacity="0.8" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#140f0c]/60 to-[#140f0c]" />
          </div>

          {/* Central Radial Golden Sun Spotlight following cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
            style={{
              background: `radial-gradient(circle 420px at ${50 + mousePos.x * 40}% ${
                50 + mousePos.y * 40
              }%, rgba(217, 163, 39, 0.20), transparent 75%)`,
            }}
          />

          {/* Top Telemetry Bar (Swiss Architectural Style) */}
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
                ELEVATION 3,650M · HIMALAYAN HIGHLAND ARCHITECTURE
              </span>
              <span className="text-tibet-gold-light px-2 py-0.5 rounded-xs bg-white/5 border border-white/10">
                {currentInspector.soundType.toUpperCase()} ACOUSTIC ({currentInspector.freq} HZ)
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
              className="absolute w-[360px] h-[360px] sm:w-[580px] sm:h-[580px] rounded-2xl border border-sakya-gold/30 bg-gradient-to-br from-[#1a1411]/90 via-[#221b16]/80 to-[#120e0c]/95 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none"
              style={{
                transform: "translateZ(0px) rotateX(45deg)",
              }}
            >
              {/* Stepped mountain terrace curves etched into ground */}
              <div className="absolute inset-4 rounded-xl border border-amber-600/20" />
              <div className="absolute inset-16 rounded-xl border border-dashed border-amber-500/15" />
              {/* Flowing mountain stream path */}
              <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-gradient-to-b from-cyan-600/30 via-cyan-400/20 to-cyan-500/30 blur-[1px] transform -rotate-12" />
            </div>

            {/* 8 Interactive Cultural Landmarks Positioned on the Village Stage */}
            <div className="relative w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 px-2">
              {VILLAGE_LANDMARKS.map((landmark, idx) => {
                const isHovered = hoveredLandmark?.id === landmark.id;
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
                    className="group relative rounded-sm p-4 bg-black/75 hover:bg-black/95 backdrop-blur-xl border border-white/15 hover:border-tibet-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-tibet-gold/30 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-3 hover:scale-105"
                    style={{
                      transformStyle: "preserve-3d",
                      animation: "floating-gentle 5s ease-in-out infinite",
                      animationDelay: floatDelay,
                    }}
                  >
                    {/* Glowing Aura Halo */}
                    <div
                      className={`absolute inset-0 rounded-sm bg-gradient-to-br ${landmark.bgGlowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                    />

                    {/* Miniature Building Model SVG */}
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md border ${landmark.borderClass} bg-stone-950/70 p-2 flex items-center justify-center ${landmark.colorClass} shadow-md group-hover:scale-115 transition-transform duration-300 mb-2.5`}
                    >
                      {landmark.svgModel}
                    </div>

                    {/* Tibetan Uchen Name */}
                    <span
                      lang="bo"
                      className="font-serif text-xs sm:text-sm font-semibold text-tibet-gold-light group-hover:text-tibet-gold transition-colors tracking-wide line-clamp-1"
                    >
                      {landmark.nameBo}
                    </span>

                    {/* English Name */}
                    <span className="text-[10px] sm:text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
                      {landmark.nameEn}
                    </span>

                    {/* Cultural Domain Tag */}
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider mt-1 truncate max-w-[130px]">
                      {lang === "bo" ? landmark.categoryBo : landmark.categoryEn}
                    </span>

                    {/* Explore Badge */}
                    <span className="mt-2.5 text-[9px] uppercase tracking-widest text-tibet-gold border border-tibet-gold/30 px-2 py-0.5 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-tibet-gold/20 transition-all">
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
          SPATIAL REALM: CULTURAL PANORAMA BENTO VIEW
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
          SPATIAL REALM: CHRONICLE ARCHIVE CATALOGUE MODE
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
          CULTURAL SANCTUARY MODAL DRAWER (Deep Immersion)
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
            {/* Ambient Modal Glow */}
            <div
              className={`absolute inset-0 rounded-sm bg-gradient-to-b ${activeLandmark.bgGlowClass} opacity-60 pointer-events-none`}
            />

            {/* Modal Header */}
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

            {/* Deep Cultural Narrative */}
            <div className="relative z-10 space-y-4 text-sm leading-relaxed text-white/90">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-tibet-gold font-semibold block font-mono">
                  {lang === "bo" ? "ལོ་རྒྱུས་དང་འཚོ་བའི་རིན་ཐང་།" : "Living Cultural Heritage & Meaning"}
                </span>
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-serif">
                  {lang === "bo" ? activeLandmark.descriptionBo : activeLandmark.descriptionEn}
                </p>
              </div>

              {/* Traditional Living Practices */}
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

            {/* Modal Footer */}
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
