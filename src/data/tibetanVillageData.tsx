import React from "react";

export type Language = "en" | "bo";

export interface CulturalLandmark {
  id: string;
  nameBo: string;
  nameEn: string;
  categoryBo: string;
  categoryEn: string;
  locationBo: string;
  locationEn: string;
  dialogueBo: string;
  dialogueEn: string;
  descriptionBo: string;
  descriptionEn: string;
  practicesBo: string[];
  practicesEn: string[];
  soundType: "hearth" | "horn" | "stream" | "lute" | "herbal" | "loom" | "wind" | "bell";
  freq: number;
  colorClass: string;
  borderClass: string;
  bgGlowClass: string;
  coords: { x: number; y: number; z: number };
  mapCoords: { x: number; y: number }; // Percentage (0-100) on isometric village map
  svgModel: React.ReactNode;
}

export interface InventoryItem {
  id: string;
  nameBo: string;
  nameEn: string;
  icon: string;
  descBo: string;
  descEn: string;
}

export const VILLAGE_ITEMS: InventoryItem[] = [
  {
    id: "po-cha",
    nameBo: "ཇ་བསྲུབས་མ།",
    nameEn: "Salted Butter Tea (Po Cha)",
    icon: "☕",
    descBo: "ཇ་ནག་དང་གཡག་མར། ཚྭ་བཅས་བསྲུབས་པའི་བོད་ཀྱི་དྲོ་སྐྱིད་ཇ་མཆོག",
    descEn: "Warm churned tea with rich yak butter and Himalayan mineral salt.",
  },
  {
    id: "tsampa",
    nameBo: "ནས་རྩམ་པ།",
    nameEn: "Roasted Highland Barley (Tsampa)",
    icon: "🥣",
    descBo: "ས་མཐོའི་ནས་བརྔོས་མ་རྩམ་པར་བཏགས་པའི་བོད་མིའི་སྲོག་རྟེན།",
    descEn: "Finely ground roasted highland barley flour, the staple food of Tibet.",
  },
  {
    id: "dramyin",
    nameBo: "སྒྲ་སྙན།",
    nameEn: "Six-Stringed Dramyin Lute",
    icon: "🪕",
    descBo: "རྟ་མགོ་ཅན་གྱི་སྒྲ་སྙན་དམངས་གཞས་དང་སྒོར་གཞས་ལ་དཀྲོལ་བ།",
    descEn: "Traditional horse-headed lute accompanying Gorshey folk dances.",
  },
  {
    id: "kata",
    nameBo: "ཁ་བཏགས།",
    nameEn: "White Offering Scarf (Khata)",
    icon: "🧣",
    descBo: "དག་གཙང་དང་བཀྲ་ཤིས་པའི་མཚོན་དོན་དུ་འབུལ་བའི་དར་དཀར།",
    descEn: "Pure white silk scarf symbolizing sincerity, goodwill, and auspicious blessings.",
  },
  {
    id: "desho",
    nameBo: "བོད་ཤོག",
    nameEn: "Handmade Daphne Paper (Desho)",
    icon: "📜",
    descBo: "དུག་མོ་ཉུང་གི་རྩ་བ་ལས་བཟོས་པའི་འབུ་མི་རྒྱག་པའི་བོད་ཤོག",
    descEn: "Insect-resistant archival parchment crafted from root fibers of Daphne shrubs.",
  },
  {
    id: "phurba",
    nameBo: "ཕུར་པ།",
    nameEn: "Sacred Ritual Kila",
    icon: "🗡️",
    descBo: "བར་ཆད་ཞི་ཞིང་ཞི་བདེ་སྤེལ་བའི་བྱིན་རླབས་ཅན་གྱི་ཕུར་པ།",
    descEn: "Three-sided ritual peg subduing obstacle spirits and securing peace.",
  },
];

export const VILLAGE_LANDMARKS: CulturalLandmark[] = [
  {
    id: "homestead",
    nameBo: "ཁང་པ། · རྡོ་ཁང་སྲོལ་རྒྱུན།",
    nameEn: "The Stone Homestead & Hearth",
    categoryBo: "འཚོ་བའི་རིག་གཞུང་དང་མགྲོན་བསུ།",
    categoryEn: "Domestic Living & Hospitality",
    locationBo: "གྲོང་གསེབ་དཀྱིལ་གྱི་གཞིས་ཀ",
    locationEn: "Central Village Settlement",
    dialogueBo: "བཀྲ་ཤིས་བདེ་ལེགས། རྡོ་ཁང་གི་ཐབ་ཚང་དུ་ཇ་བསྲུབས་མ་དང་ནས་རྩམ་པ་གྲ་སྒྲིག་ཡོད། དྲོ་སྐྱིད་ཀྱི་ཐབ་ཀའི་འགྲམ་དུ་བཞུགས་རོགས།",
    dialogueEn: "Tashi Delek! Welcome to our stone homestead. The wood-fired hearth is warm, and a steaming bowl of salted yak butter tea (Po Cha) and fragrant Tsampa awaits you.",
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
    mapCoords: { x: 24, y: 56 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <polygon points="12,56 16,24 48,24 52,56" strokeWidth="2.5" className="fill-stone-100/90 stroke-amber-500/80" />
        <rect x="14" y="20" width="36" height="5" strokeWidth="2" className="fill-amber-900 stroke-amber-600" />
        <rect x="15" y="24" width="34" height="2" className="fill-red-800" />
        <polygon points="22,34 24,30 30,30 32,34" className="fill-stone-900 stroke-amber-400/80" strokeWidth="1.2" />
        <polygon points="34,34 36,30 42,30 44,34" className="fill-stone-900 stroke-amber-400/80" strokeWidth="1.2" />
        <rect x="27" y="44" width="10" height="12" className="fill-stone-900 stroke-amber-500" strokeWidth="1.5" />
        <line x1="27" y1="44" x2="37" y2="44" strokeWidth="2" className="stroke-amber-300" />
        <line x1="46" y1="20" x2="46" y2="8" strokeWidth="1.5" className="stroke-stone-300" />
        <polygon points="46,8 54,11 46,14" className="fill-amber-400 stroke-amber-500" strokeWidth="1" />
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
    dialogueBo: "འབྲོག་པའི་སྦྲ་ནག་འདི་གཡག་རྩིད་ཀྱིས་བཐགས་པ་ཡིན། ཆར་རླུང་འགོག་ཅིང་རང་བྱུང་དང་མཐུན་པའི་འཚོ་བ་སྐྱེལ་སྟངས་ཡིན། གཡག་འོ་མར་བཞུགས་རོགས།",
    dialogueEn: "This Ba-Nak tent is woven from coarse yak hair. It expands in the sun to breathe and tightens in blizzards. Enjoy fresh golden yak butter and dried chhurpi curd!",
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
    mapCoords: { x: 78, y: 28 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <polygon points="6,52 32,20 58,52" strokeWidth="2.5" className="fill-stone-900 stroke-stone-400" />
        <line x1="28" y1="20" x2="36" y2="20" strokeWidth="3" className="stroke-amber-400" />
        <path d="M32,18 Q34,12 31,6" strokeWidth="1.2" strokeLinecap="round" className="stroke-white/30" />
        <line x1="16" y1="36" x2="2" y2="52" strokeWidth="1.2" className="stroke-stone-500" />
        <line x1="48" y1="36" x2="62" y2="52" strokeWidth="1.2" className="stroke-stone-500" />
        <line x1="32" y1="20" x2="32" y2="14" strokeWidth="2" className="stroke-amber-600" />
        <polygon points="26,52 32,34 38,52" className="fill-stone-950 stroke-stone-600" strokeWidth="1.5" />
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
    dialogueBo: "གངས་ཆུའི་རྒྱུན་གྱིས་ཤིང་གི་ཆུ་འཁོར་བསྐོར་ནས་ནས་རྩམ་པར་འཐག སྟོན་ཀའི་འོང་སྐོར་དུས་ཆེན་ལ་ལོ་ཏོག་བསྡུ་བའི་གཞས་གཏོང་བཞིན་ཡོད།",
    dialogueEn: "Rushing glacial meltwaters turn the ancient wooden watermill wheel, grinding golden roasted barley into silky tsampa. The villagers are singing Ongkor harvest songs!",
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
    mapCoords: { x: 22, y: 30 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M4,48 Q20,44 40,48 Q54,50 60,46" strokeWidth="2.5" className="stroke-yellow-600 fill-amber-900/30" />
        <path d="M8,38 Q26,34 46,38 Q56,40 62,36" strokeWidth="2.5" className="stroke-yellow-500 fill-amber-800/30" />
        <path d="M14,28 Q32,24 50,28" strokeWidth="2.5" className="stroke-yellow-400 fill-amber-700/30" />
        <line x1="20" y1="34" x2="20" y2="28" strokeWidth="1.5" className="stroke-yellow-300" />
        <circle cx="20" cy="27" r="1.5" className="fill-yellow-400" />
        <line x1="28" y1="33" x2="28" y2="27" strokeWidth="1.5" className="stroke-yellow-300" />
        <circle cx="28" cy="26" r="1.5" className="fill-yellow-400" />
        <line x1="38" y1="36" x2="38" y2="30" strokeWidth="1.5" className="stroke-yellow-300" />
        <circle cx="38" cy="29" r="1.5" className="fill-yellow-400" />
        <rect x="44" y="44" width="14" height="12" className="fill-stone-800 stroke-amber-500" strokeWidth="1.5" />
        <circle cx="51" cy="50" r="4.5" className="stroke-yellow-400" strokeWidth="1.5" />
        <line x1="51" y1="45.5" x2="51" y2="54.5" strokeWidth="1" className="stroke-yellow-300" />
        <line x1="46.5" y1="50" x2="55.5" y2="50" strokeWidth="1" className="stroke-yellow-300" />
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
    dialogueBo: "དམངས་ཁྲོད་སྒོར་གཞས་ལ་མཉམ་དུ་ཞུགས་རོགས། སྒྲ་སྙན་དཀྲོལ་ཞིང་གླིང་གེ་སར་རྒྱལ་པོའི་དཔའ་བོའི་སྒྲུང་གཏམ་ཉན་པའི་དུས་ཚོད་ཡིན།",
    dialogueEn: "Join the dancing circle! Villagers lock arms in rhythmic Gorshey stomping around the central fire. The bard plucks his Dramyin lute to recount the Epic of King Gesar.",
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
    mapCoords: { x: 50, y: 50 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <circle cx="32" cy="40" r="20" strokeWidth="1" strokeDasharray="3 3" className="stroke-amber-400/40" />
        <circle cx="32" cy="40" r="12" strokeWidth="1.2" className="stroke-amber-400/60" />
        <ellipse cx="32" cy="42" rx="4" ry="2" className="fill-amber-900" />
        <path d="M30,42 Q32,32 34,42 Q33,36 32,30 Q31,36 30,42" className="fill-orange-500 stroke-yellow-300" strokeWidth="1" />
        <ellipse cx="32" cy="22" rx="6" ry="8" className="fill-amber-800 stroke-amber-400" strokeWidth="1.5" />
        <ellipse cx="32" cy="22" rx="2.5" ry="3.5" className="fill-stone-950" />
        <rect x="30.5" y="6" width="3" height="12" className="fill-amber-700 stroke-amber-400" strokeWidth="1" />
        <path d="M30.5,6 Q28,3 32,1 Q35,3 33.5,6" strokeWidth="1.2" className="fill-amber-400 stroke-amber-200" />
        <line x1="28" y1="8" x2="36" y2="8" strokeWidth="1" className="stroke-amber-200" />
        <line x1="28" y1="11" x2="36" y2="11" strokeWidth="1" className="stroke-amber-200" />
        <line x1="28" y1="14" x2="36" y2="14" strokeWidth="1" className="stroke-amber-200" />
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
    dialogueBo: "གསོ་རིག་སྨན་པས་འཕར་རྩ་བརྟག་ཅིང་རླུང་མཁྲིས་བད་ཀན་གྱི་དོ་མཉམ་སྙོམས། གངས་ལྷ་མེ་ཏོག་དང་དབྱར་རྩྭ་དགུན་འབུའི་རྩི་སྨན་ཇ་མཆོད་རོགས།",
    dialogueEn: "The Amchi physician reads your arterial pulses to harmonize the three humors (Lung, Tripa, Baekan). Sip an infusion of Snow Lotus and high-altitude wild botanicals.",
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
    mapCoords: { x: 76, y: 56 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <path d="M16,36 Q16,52 32,52 Q48,52 48,36 Z" strokeWidth="2" className="fill-stone-800 stroke-emerald-400" />
        <rect x="14" y="32" width="36" height="5" rx="1.5" className="fill-stone-700 stroke-emerald-300" strokeWidth="1.5" />
        <line x1="42" y1="20" x2="28" y2="44" strokeWidth="3" strokeLinecap="round" className="stroke-amber-400" />
        <path d="M32,24 Q26,14 32,8 Q38,14 32,24" className="fill-emerald-600/70 stroke-emerald-300" strokeWidth="1.2" />
        <path d="M26,20 Q18,16 22,10 Q28,14 26,20" className="fill-emerald-600/60 stroke-emerald-300" strokeWidth="1.2" />
        <path d="M38,20 Q46,16 42,10 Q36,14 38,20" className="fill-emerald-600/60 stroke-emerald-300" strokeWidth="1.2" />
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
    dialogueBo: "འདིར་ཚོན་ཁྲའི་སྤང་གདན་འཐག་བཞིན་ཡོད། ཤིང་བཟོ་མཁས་པས་ཤིང་པར་བརྐོས་ཏེ་དྭངས་གསལ་ཅན་གྱི་བོད་ཤོག་སྟེང་དཔེ་ཆ་དཔར་བསྐྲུན་བྱེད།",
    dialogueEn: "The floor loom clatters rhythmically weaving colorful Pangden aprons. Master carvers hand-chisel ancient woodblocks to print on archival Daphne paper.",
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
    mapCoords: { x: 26, y: 78 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <line x1="12" y1="8" x2="12" y2="56" strokeWidth="3" className="stroke-amber-800" />
        <line x1="52" y1="8" x2="52" y2="56" strokeWidth="3" className="stroke-amber-800" />
        <line x1="8" y1="12" x2="56" y2="12" strokeWidth="3" className="stroke-amber-700" />
        <line x1="8" y1="52" x2="56" y2="52" strokeWidth="3" className="stroke-amber-700" />
        <line x1="20" y1="12" x2="20" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="26" y1="12" x2="26" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="32" y1="12" x2="32" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="38" y1="12" x2="38" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <line x1="44" y1="12" x2="44" y2="52" strokeWidth="0.8" className="stroke-stone-300" />
        <rect x="18" y="24" width="28" height="6" className="fill-red-600 stroke-none" />
        <rect x="18" y="30" width="28" height="6" className="fill-amber-400 stroke-none" />
        <rect x="18" y="36" width="28" height="6" className="fill-teal-500 stroke-none" />
        <rect x="18" y="42" width="28" height="6" className="fill-indigo-600 stroke-none" />
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
    dialogueBo: "ལ་རྩེའི་རླུང་དམར་ཁྲོད་དར་ལྕོག་ལྔ་ཚོན་ཕྱོགས་བཅུར་ལྡེང་བཞིན་འདུག ཀི་ཀི་བསོ་བསོ་ལྷ་རྒྱལ་ལོ། རླུང་རྟ་དར་བའི་སྨོན་ལམ་འདེབས་སོ།",
    dialogueEn: "Five-color prayer flags flutter in the fierce pass winds. The ancient mountain victor's cry echoes: Ki Ki So So Lha Gyal Lo! May personal life-force soar!",
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
    mapCoords: { x: 50, y: 14 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <polygon points="24,56 40,56 36,40 28,40" className="fill-stone-700 stroke-stone-400" strokeWidth="1.5" />
        <polygon points="26,40 38,40 35,30 29,30" className="fill-stone-600 stroke-stone-300" strokeWidth="1.5" />
        <polygon points="28,30 36,30 34,22 30,22" className="fill-stone-500 stroke-stone-200" strokeWidth="1.5" />
        <line x1="32" y1="48" x2="32" y2="4" strokeWidth="2.5" className="stroke-amber-700" />
        <line x1="32" y1="12" x2="4" y2="36" strokeWidth="1.2" className="stroke-white/60" />
        <line x1="32" y1="12" x2="60" y2="36" strokeWidth="1.2" className="stroke-white/60" />
        <line x1="32" y1="18" x2="8" y2="48" strokeWidth="1.2" className="stroke-white/50" />
        <line x1="32" y1="18" x2="56" y2="48" strokeWidth="1.2" className="stroke-white/50" />
        <polygon points="26,16 22,20 28,21" className="fill-blue-600" />
        <polygon points="20,21 16,25 22,26" className="fill-white" />
        <polygon points="14,27 10,31 16,32" className="fill-red-600" />
        <polygon points="8,32 4,36 10,37" className="fill-green-600" />
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
    dialogueBo: "མཆོད་རྟེན་དཀར་པོ་དང་མ་ཎི་རྡོ་ཕུང་གིས་གྲོང་གསེབ་སྲུང་བཞིན་ཡོད། གཡས་སྐོར་དུ་སྐོར་བ་བྱས་ཏེ་མ་ཎི་ཡིག་དྲུག་བཟླས་ན་བཀྲ་ཤིས་ཞི་བདེ་འབྱུང་།",
    dialogueEn: "The whitewashed stupa stands guardian at the village gateway. Carved slate stones bear 'Om Mani Padme Hum'. Walking clockwise circumambulation brings peace.",
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
    mapCoords: { x: 50, y: 84 },
    svgModel: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full">
        <rect x="20" y="52" width="24" height="4" className="fill-stone-100 stroke-amber-500" strokeWidth="1.5" />
        <rect x="22" y="48" width="20" height="4" className="fill-stone-100 stroke-amber-500" strokeWidth="1.5" />
        <rect x="24" y="44" width="16" height="4" className="fill-stone-100 stroke-amber-500" strokeWidth="1.5" />
        <path d="M26,44 C24,34 40,34 38,44 Z" className="fill-stone-50 stroke-amber-500" strokeWidth="1.5" />
        <rect x="30" y="38" width="4" height="4" className="fill-red-800" />
        <polygon points="28,34 36,34 34,20 30,20" className="fill-amber-600 stroke-amber-300" strokeWidth="1.2" />
        <line x1="29" y1="31" x2="35" y2="31" strokeWidth="1" className="stroke-yellow-300" />
        <line x1="30" y1="27" x2="34" y2="27" strokeWidth="1" className="stroke-yellow-300" />
        <line x1="31" y1="23" x2="33" y2="23" strokeWidth="1" className="stroke-yellow-300" />
        <circle cx="32" cy="16" r="3" className="fill-yellow-400 stroke-yellow-200" strokeWidth="1" />
        <path d="M29,18 Q32,21 35,18 Q32,19 29,18" className="fill-yellow-200" />
        <polygon points="4,56 18,56 16,50 6,50" className="fill-stone-600 stroke-stone-400" strokeWidth="1.2" />
        <polygon points="46,56 60,56 58,50 48,50" className="fill-stone-600 stroke-stone-400" strokeWidth="1.2" />
        <text x="7" y="55" fontSize="4" fill="#fbbf24" fontFamily="serif">ཨོཾ</text>
        <text x="49" y="55" fontSize="4" fill="#fbbf24" fontFamily="serif">ཧཱུྃ</text>
      </svg>
    ),
  },
];
