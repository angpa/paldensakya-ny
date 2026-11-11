"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface BuddhistOffering {
  id: string;
  sanskrit: string;
  tibetan: string;
  english: string;
  meaning: string;
  svgPath: React.ReactNode;
}

const SEVEN_OFFERINGS: BuddhistOffering[] = [
  {
    id: "argham",
    sanskrit: "Argham",
    tibetan: "ཆབ་བསིལ།",
    english: "Drinking Water",
    meaning: "Purity of mind, speech, and deeds.",
    svgPath: (
      /* Sacred Water Jug / Pure Drinking Water */
      <path
        d="M12 3v3m-4 5c0 4.418 3.582 8 8 8s8-3.582 8-8c0-3.5-3.5-7-8-12-4.5 5-8 8.5-8 12z"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "padhya",
    sanskrit: "Pādhya",
    tibetan: "ཞབས་བསིལ།",
    english: "Cleansing Water",
    meaning: "Cooling water for washing the feet; purification of karma.",
    svgPath: (
      /* Cleansing Water Basin */
      <path
        d="M4 14c0 4.418 3.582 6 8 6s8-1.582 8-6H4zm8-10v5m-4-2.5l4 4 4-4"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "pushpe",
    sanskrit: "Pushpe",
    tibetan: "མེ་ཏོག",
    english: "Flowers",
    meaning: "Beauty of awakening and blooming generosity.",
    svgPath: (
      /* Lotus Blossom */
      <path
        d="M12 21c-4-4-7-8-7-12 0-3 2.5-5 5-5 1.5 0 2 1 2 1s.5-1 2-1c2.5 0 5 2 5 5 0 4-3 8-7 12zm-5-9c2 0 4-2 5-6 1 4 3 6 5 6"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "dhupe",
    sanskrit: "Dhupe",
    tibetan: "བདུག་སྤོས།",
    english: "Incense",
    meaning: "Fragrance of pure ethical discipline pervading the world.",
    svgPath: (
      /* Incense Censer & Rising Smoke */
      <path
        d="M8 17h8v3a1 1 0 01-1 1H9a1 1 0 01-1-1v-3zm4-3v-3m-3-1c0-2 2-3 2-5m4 5c0-2-2-3-2-5"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "aloke",
    sanskrit: "Āloke",
    tibetan: "མར་མེ།",
    english: "Luminous Lamp",
    meaning: "Butter lamp light dispelling the darkness of ignorance.",
    svgPath: (
      /* Traditional Butter Lamp */
      <path
        d="M6 14h12l-2 5H8l-2-5zm6-11c-1.5 2-2.5 3.5-2.5 5.5 0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5C14.5 6.5 13.5 5 12 3zm-4 16h8v2H8v-2z"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "gandhe",
    sanskrit: "Gandhe",
    tibetan: "དྲི་ཆབ།",
    english: "Perfumed Water",
    meaning: "Scented saffron water applied to the heart; devotion.",
    svgPath: (
      /* Perfume Flask / Essence Container */
      <path
        d="M10 4h4v3h-4V4zm-3 7a5 5 0 0010 0V7H7v4zm5 3a2 2 0 100-4 2 2 0 000 4zm-4 6h8v1H8v-1z"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "naivedya",
    sanskrit: "Naivedya",
    tibetan: "ཞལ་ཟས།",
    english: "Celestial Food",
    meaning: "Pure sustenance and nourishment of meditative absorption.",
    svgPath: (
      /* Sacred Food Bowl / Torma Offering */
      <path
        d="M5 13c0 4 3 7 7 7s7-3 7-7H5zm7-9l3 6H9l3-6zm-4 16h8v2H8v-2z"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

type Language = "en" | "bo";

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
  labelEn: string;
  labelBo: string;
  descEn: string;
  descBo: string;
  suggestionsEn: string[];
  suggestionsBo: string[];
}

const ROLES: RoleConfig[] = [
  {
    id: "individual",
    labelEn: "Individual Practitioner",
    labelBo: "སྒེར་སྒྲུབ་པ་པོ།",
    descEn:
      "Participate in your own personal rhythm—through recitation, silent meditation, study, or sponsorship.",
    descBo:
      "རང་ཉིད་ཀྱི་དུས་ཚོད་དང་མཐུན་པར་ཞལ་འདོན་དང་སྒོམ་སྒྲུབ། སློབ་གཉེར། སྦྱིན་བདག་སོགས་ཀྱི་སྒོ་ནས་མཉམ་ཞུགས་གནང་བ།",
    suggestionsEn: [
      "Recite the 21 Praises to Tara 1,000 times during the year",
      "Dedicate 18 hours of silent meditation over the course of the year",
      "Study 'A Minor Treatise on Grammar: Syllabic Cadence' (བརྡ་སྤྲོད་ཕྲན་ཚེགས) by Lama Pema Wangdak",
      "Learn to read and pronounce the 30 letters of the Tibetan Uchen alphabet",
      "Sponsor a child's education or a Tibetan cultural publication",
    ],
    suggestionsBo: [
      "ལོ་གཅིག་ནང་སྒྲོལ་མ་ཕྱག་འཚལ་ཉེར་གཅིག་ཚར་ ༡,༠༠༠ གསུང་འདོན་གནང་བ།",
      "ལོ་གཅིག་གི་རིང་ཞི་གནས་སྒོམ་སྒྲུབ་ཆུ་ཚོད་ ༡༨ རིང་ཉམས་ལེན་གནང་བ།",
      "བླ་མ་པདྨ་དབང་གྲགས་ཀྱིས་མཛད་པའི་ 'བརྡ་སྤྲོད་ཕྲན་ཚེགས' (ཚེག་འགྲོས་ཀྱི་ལེའུ) ལ་སློབ་གཉེར་གནང་བ།",
      "བོད་ཡིག་དབུ་ཅན་གྱི་གསལ་བྱེད་སུམ་ཅུའི་ཀློག་གདངས་དང་འབྲི་ཀློག་སྦྱོང་བ།",
      "བོད་ཕྲུག་ཅིག་གི་ཤེས་ཡོན་ནམ་བོད་ཀྱི་དཔེ་དེབ་དཔར་སྐྲུན་ལ་སྦྱིན་བདག་གནང་བ།",
    ],
  },
  {
    id: "monastery",
    labelEn: "Monastery / Dharma Center",
    labelBo: "དགོན་སྡེ་དང་ཆོས་ཚོགས།",
    descEn:
      "Dedicate special pujas, lineage teachings, or open-house days celebrating Tibetan heritage.",
    descBo:
      "བོད་ཀྱི་རིག་གཞུང་སྲུང་སྐྱོབ་ཆེད་དམིགས་བསལ་ཞབས་བརྟན་དང་ཆོས་འབྲེལ། སྒོ་འབྱེད་མཛད་སྒོ་གོ་སྒྲིག་གནང་བ།",
    suggestionsEn: [
      "Dedicate annual Tara or Medicine Buddha accumulations to cultural preservation",
      "Host free weekly Tibetan reading and liturgical chanting workshops",
      "Display the International Year of Tibetan Culture & Language emblem at the temple entrance",
    ],
    suggestionsBo: [
      "ལོ་རེའི་སྒྲོལ་མ་དང་སྨན་བླའི་བཟླས་བརྗོད་རིག་གཞུང་སྲུང་སྐྱོབ་ཆེད་བསྔོ་སྨོན་གནང་བ།",
      "བདུན་རེར་དབུ་ཅན་འབྲི་ཀློག་དང་ཆོས་སྤྱོད་ཞལ་འདོན་གྱི་རིན་མེད་ཟབ་སྦྱོང་སྤེལ་བ།",
      "ཆོས་ཚོགས་ཀྱི་སྒོ་འགྲམ་དུ་ལོ་ཉིས་སྟོང་དུས་སྟོན་གྱི་མཚོན་རྟགས་སྦྱར་བ།",
    ],
  },
  {
    id: "school",
    labelEn: "School / University / Student Group",
    labelBo: "སློབ་གྲྭ་དང་གཙུག་ལག་སློབ་ཁང་།",
    descEn:
      "Invite students and faculty to explore over 2,000 years of Tibetan civilization, literature, and philosophy.",
    descBo:
      "སློབ་མ་དང་དགེ་རྒན་རྣམས་ཀྱིས་ལོ་ཉིས་སྟོང་ལྷག་གི་བོད་ཀྱི་ལོ་རྒྱུས་དང་རྩོམ་རིག ཚད་མ་རིག་པར་སློབ་གཉེར་གནང་བ།",
    suggestionsEn: [
      "Organize a Tibetan Culture & Language symposium or film screening on campus",
      "Establish a student reading circle on Tibetan history, logic, or poetry",
      "Partner with Tibetan youth and monastic schools for language exchange",
    ],
    suggestionsBo: [
      "སློབ་གྲྭའི་ནང་བོད་ཀྱི་རིག་གཞུང་སྐོར་གྱི་བགྲོ་གླེང་དང་གློག་བརྙན་གཟིགས་འབུལ་གོ་སྒྲིག་གནང་བ།",
      "བོད་ཀྱི་ལོ་རྒྱུས་དང་སྙན་ངག རྟོག་གེ་བཅས་ཀྱི་སློབ་མའི་དེབ་ཀློག་ཚོགས་པ་འཛུགས་པ།",
      "བོད་པའི་དགོན་སྡེ་དང་སློབ་གྲྭ་ཁག་དང་མཉམ་དུ་སྐད་ཡིག་བརྗེ་ལེན་གནང་བ།",
    ],
  },
  {
    id: "restaurant",
    labelEn: "Restaurant / Business",
    labelBo: "ཟ་ཁང་དང་ཚོང་ལས་ཁང་།",
    descEn:
      "Share awareness in your storefront, menus, or workplace and support community initiatives.",
    descBo:
      "སྒོ་ཁ་དང་ཟ་ཐོ། ལས་ཁུངས་བཅས་སུ་རིག་གཞུང་གོ་རྟོགས་སྤེལ་ཞིང་སྤྱི་ཚོགས་ལས་དོན་ལ་རྒྱབ་སྐྱོར་གནང་བ།",
    suggestionsEn: [
      "Display the official celebration decal on storefront doors and windows",
      "Feature a Tibetan cultural note or word-of-the-week for guests",
      "Pledge a portion of a special day's proceeds to sponsor a Tibetan book or student",
    ],
    suggestionsBo: [
      "ཚོང་ཁང་གི་སྒོ་དང་སྒེའུ་ཁུང་དུ་དུས་སྟོན་གྱི་མཚོན་རྟགས་སྦྱར་བ།",
      "མགྲོན་པོ་རྣམས་ལ་བདུན་རེའི་བོད་ཡིག་མིང་ཚིག་གམ་རིག་གཞུང་ངོ་སྤྲོད་གནང་བ།",
      "དམིགས་བསལ་ཉིན་མོའི་ཁེ་བཟང་གི་ཆ་ཤས་ཤིག་བོད་ཡིག་དེབ་དཔར་སྐྲུན་ལ་ཞལ་འདེབས་གནང་བ།",
    ],
  },
  {
    id: "artist",
    labelEn: "Writer / Poet / Artist",
    labelBo: "རྩོམ་པ་པོ་དང་སྒྱུ་རྩལ་པ།",
    descEn:
      "Create, publish, translate, or perform works inspired by Tibetan language and artistic traditions.",
    descBo:
      "བོད་ཀྱི་སྐད་ཡིག་དང་སྒྱུ་རྩལ་ལ་དམིགས་པའི་བརྩམས་ཆོས་གསར་རྩོམ་དང་ལོ་ཙཱ། འཁྲབ་སྟོན་གནང་བ།",
    suggestionsEn: [
      "Author or translate a book, essay, or collection of poems celebrating Tibet",
      "Create calligraphy, thangka-inspired visual art, music, or drama",
      "Connect with sponsors to publish a completed manuscript on Tibetan culture",
    ],
    suggestionsBo: [
      "བོད་ཀྱི་སྐོར་ལ་དཔེ་དེབ་དང་དཔྱད་རྩོམ། སྙན་ངག་གསར་རྩོམ་མམ་ལོ་ཙཱ་གནང་བ།",
      "བོད་ཀྱི་ཡིག་གཟུགས་དང་ཐང་ག རོལ་མོ། ཟློས་གར་སོགས་གསར་གཏོད་གནང་བ།",
      "བོད་ཀྱི་རིག་གཞུང་སྐོར་གྱི་ཕྱག་དེབ་དཔར་སྐྲུན་ཆེད་སྦྱིན་བདག་དང་འབྲེལ་མཐུད་གནང་བ།",
    ],
  },
  {
    id: "youth",
    labelEn: "Kids & Youth",
    labelBo: "བྱིས་པ་དང་གཞོན་སྐྱེས།",
    descEn:
      "Even children can participate with simple daily habits of kindness, language learning, and generosity.",
    descBo:
      "བྱིས་པ་ཚོས་ཀྱང་ཉིན་རེའི་གོམས་གཤིས་བཟང་པོ་དང་སྐད་ཡིག་སློབ་སྦྱོང་། གཞན་ཕན་གྱི་སྒོ་ནས་མཉམ་ཞུགས་ཆོག",
    suggestionsEn: [
      "Save a few pennies each day in a dedication jar to help sponsor a classmate in Asia",
      "Learn 5 Tibetan greetings, numbers, or songs with family",
      "Draw or paint a symbol of peace and Tibetan heritage",
    ],
    suggestionsBo: [
      "ཉིན་རེར་སྒོར་ཟུར་རེ་བསགས་ཏེ་ཧི་མ་ལ་ཡའི་སློབ་ཕྲུག་ཚོར་རོགས་སྐྱོར་གནང་བ།",
      "ཁྱིམ་ཚང་མཉམ་དུ་བོད་པའི་འཚམས་འདྲི་དང་ཨང་གྲངས། གཞས་ ༥ རེ་སྦྱོང་བ།",
      "ཞི་བདེ་དང་བོད་ཀྱི་རིག་གཞུང་མཚོན་པའི་རི་མོ་འབྲི་བ།",
    ],
  },
];

const CULTURE_UI = {
  en: {
    back: "Back to Vikramasila Foundation · Palden Sakya",
    badgeJubilee: "2,000 Years Jubilation",
    badgeInitiative: "2026–2029 Initiative",
    heroHonoring: "Honoring 20 Centuries of Living Wisdom & Language",
    heroHeadingPrefix: "Celebration of Tibetan Culture & Language",
    heroHeadingHighlight: "2,000 Years",
    heroIntro:
      "Honoring over 2,000 years of living Tibetan civilization, literature, spiritual wisdom, and language. This global initiative does not impose rules—instead, it invites everyone (monasteries, schools, universities, businesses, poets, artists, children, and individual practitioners worldwide) to subscribe an idea and participate in your own authentic way.",
    heroSubscribeLink: "subscribe an idea and participate in your own authentic way",
    decalTitle: "The Official Commemorative Decal",
    decalBadge: "Universal Emblem",
    decalDesc:
      "Created to be printed out and displayed proudly on storefront doors, cars, laptops, classrooms, home altars, and dharma centers—signaling: \"We participate in honoring 2,000 years of Tibetan Culture & Language.\"",
    btnVideoOpen: "Close Video Player · བརྙན་འཕྲིན་སྒོ་རྒྱག",
    btnVideoClosed: "View Video Stream: Pema Ts'al Institute (Pokhara, Nepal) · བརྙན་འཕྲིན།",
    videoAmbientNotice: "(Ambient video stream continues in the full-width background)",
    videoCaptionTitle: "Pema Ts'al Sakya Monastic Institute · Living Heritage",
    videoCaptionSub:
      "Young monks preserving 2,000+ years of classical language, calligraphy, debate, and Buddhist wisdom.",
    videoYoutubeLink: "Full Video on YouTube →",
    videoMapsLink: "Google Maps (Pokhara, Nepal) ↗",
    offeringsTitle: "The Seven Traditional Offerings to the Buddha",
    offeringsTibetan: "༄༅། །སངས་རྒྱས་ལ་མཆོད་པ་བདུན།",
    offeringsSub:
      "Seven sacred outer sensory offerings placed upon the altar, honoring the enlightened body, speech, and mind.",
    offeringsBadge: "Sacred Tradition",
    step1Title: "1. Explore Ways to Participate",
    step1Sub:
      "Select your group below to see suggested ways to celebrate 2,000 years of heritage.",
    step1PickPrompt: "Suggested ideas for the 2,000 years commemoration (click to select):",
    step2Title: "2. Subscribe Your Commitment",
    step2Sub:
      "Register how you, your school, temple, or company celebrate 2,000 years of living heritage.",
    fieldName: "Your Name or Organization",
    placeholderName: "e.g., Tenzin Dorje or Lotus Bookshop",
    fieldLocation: "City / Country",
    placeholderLocation: "e.g., New York, USA",
    fieldPledge: "Our Participation Commitment",
    fieldPledgeHint:
      "Describe your recitation, silent meditation, exhibition, class, or sponsorship in your own words.",
    btnSubmit: "Subscribe Idea & Join Community Register",
    btnSubmitting: "Registering commitment...",
    step3Title: "3. Community Participation Register",
    step3Sub:
      "See who has subscribed an idea and what people are accomplishing for 2,000 years of Tibetan culture.",
    registeredCountSuffix: "Registered Commitments",
    statusSubscribed: "Subscribed",
    statusAccomplished: "Accomplished",
    footerText:
      "Celebration of Tibetan Culture & Language 2000 Years (2026–2029) · Vikramasila Foundation",
    footerBack: "← Return to Main Foundation Site",
  },
  bo: {
    back: "ཝི་ཀྲ་མ་ཤཱི་ལའི་དགེ་རྩ་ཚོགས་པ་དང་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས་སུ་ཕྱིར་ལོག",
    badgeJubilee: "ལོ་ཉིས་སྟོང་འཁོར་བའི་དུས་ཆེན།",
    badgeInitiative: "༢༠༢༦–༢༠༢༩ ལས་གཞི།",
    heroHonoring: "བོད་ཀྱི་ཤེས་རིག་དང་སྐད་ཡིག་ལོ་ཉིས་སྟོང་འཁོར་བར་གུས་འདུད་ཞུ།",
    heroHeadingPrefix: "བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་ལོ་ཉིས་སྟོང་འཁོར་བའི་དུས་སྟོན།",
    heroHeadingHighlight: "ལོ་ཉིས་སྟོང་།",
    heroIntro:
      "ལོ་ཉིས་སྟོང་ལྷག་གི་བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག ནང་དོན་རིག་པའི་བཅུད་བཟང་ལ་གུས་འདུད་ཞུ། འདི་ནི་བཀའ་བཀོད་གཏོང་བའི་ལས་གཞི་ཞིག་མིན་པར། དགོན་སྡེ་དང་སློབ་གྲྭ། གཙུག་ལག་སློབ་ཁང་། ཚོང་ལས། རྩོམ་པ་པོ། སྒྱུ་རྩལ་པ། བྱིས་པ། སྒེར་སོ་སོ་བཅས་ཀུན་གྱིས་རང་གི་ནུས་པ་དང་འདོད་མོས་ལྟར་མཉམ་ཞུགས་དམ་བཅའ་འཇོག་པར་འབོད་སྐུལ་ཞུ་བཞིན་ཡོད།",
    heroSubscribeLink: "རང་ཉིད་ཀྱི་འདོད་མོས་ལྟར་དམ་བཅའ་བཞག་སྟེ་མཉམ་ཞུགས་གནང་བ།",
    decalTitle: "མཉམ་ཞུགས་རྟགས་མ་དང་སྦྱར་བྱང་།",
    decalBadge: "སྤྱིའི་མཚོན་རྟགས།",
    decalDesc:
      "སྒོ་དང་རླངས་འཁོར། གློག་ཀླད། འཛིན་གྲྭ། མཆོད་ཁང་དང་ཆོས་ཚོགས་སོགས་སུ་སྦྱར་ཆོག་པའི་རྟགས་མ་སྟེ། 'ང་ཚོ་བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་ལོ་ཉིས་སྟོང་འཁོར་བའི་དུས་སྟོན་དུ་མཉམ་ཞུགས་བྱེད' ཅེས་པའི་མཚོན་རྟགས་ཡིན།",
    btnVideoOpen: "Close Video Player · བརྙན་འཕྲིན་སྒོ་རྒྱག",
    btnVideoClosed: "View Video Stream: Pema Ts'al Institute (Pokhara, Nepal) · བརྙན་འཕྲིན།",
    videoAmbientNotice: "(རྒྱབ་ལྗོངས་སུ་བརྙན་འཕྲིན་རྒྱུན་མཐུད་དུ་གཟིགས་ཐུབ)",
    videoCaptionTitle: "པདྨ་ཚལ་ས་སྐྱའི་དགོན་པའི་སློབ་གཉེར་ཁང་། · གསོན་ཉམས་ལྡན་པའི་རིག་གཞུང་།",
    videoCaptionSub:
      "དགེ་འདུན་པ་གཞོན་ནུ་རྣམས་ཀྱིས་ལོ་ཉིས་སྟོང་ལྷག་གི་སྐད་ཡིག་དང་ཡིག་གཟུགས། རྩོད་པ། ནང་ཆོས་ཀྱི་ལྟ་གྲུབ་ཉམས་པ་མེད་པར་འཛིན་སྐྱོང་གནང་བཞིན་པ།",
    videoYoutubeLink: "YouTube ཐོག་བརྙན་འཕྲིན་ཆ་ཚང་གཟིགས། →",
    videoMapsLink: "གུ་གྷལ་ས་ཁྲ། (པོ་ཁ་ར་བལ་ཡུལ) ↗",
    offeringsTitle: "སངས་རྒྱས་ལ་མཆོད་པ་བདུན།",
    offeringsTibetan: "༄༅། །སངས་རྒྱས་ལ་མཆོད་པ་བདུན།",
    offeringsSub:
      "སྐུ་གསུང་ཐུགས་ཀྱི་ཡོན་ཏན་ལ་དམིགས་ཏེ་མཆོད་བཤམས་སུ་འབུལ་བའི་ཕྱིའི་མཆོད་པ་བདུན།",
    offeringsBadge: "དམ་པའི་ཆོས་སྲོལ།",
    step1Title: "༡. མཉམ་ཞུགས་གནང་ཕྱོགས།",
    step1Sub:
      "ཁྱེད་ཀྱི་སྡེ་ཚན་བདམས་ཏེ་ལོ་ཉིས་སྟོང་གི་རིག་གཞུང་སྲུང་སྐྱོབ་ཆེད་མཉམ་ཞུགས་གནང་ཕྱོགས་ཀྱི་ལམ་སྟོན་ལ་གཟིགས།",
    step1PickPrompt: "ལོ་ཉིས་སྟོང་དུས་སྟོན་མཉམ་ཞུགས་ཀྱི་ལམ་སྟོན (མནན་ཏེ་འདེམས་ཆོག):",
    step2Title: "༢. མཉམ་ཞུགས་དམ་བཅའ་འཇོག་པ།",
    step2Sub:
      "ཁྱེད་རང་ཉིད་དང་སློབ་གྲྭ། དགོན་པ། ཚོང་ལས་ཁང་བཅས་ཀྱིས་ཇི་ལྟར་མཉམ་ཞུགས་གནང་མིན་ཐོ་འགོད་གནང་རོགས།",
    fieldName: "ཁྱེད་ཀྱི་མཚན་ནམ་ཚོགས་པའི་མིང་།",
    placeholderName: "དཔེར་ན། བསྟན་འཛིན་རྡོ་རྗེའམ་པདྨའི་དེབ་ཁང་།",
    fieldLocation: "གྲོང་ཁྱེར་དང་རྒྱལ་ཁབ།",
    placeholderLocation: "དཔེར་ན། ནིའུ་ཡོག ཨ་རི།",
    fieldPledge: "ང་ཚོའི་མཉམ་ཞུགས་དམ་བཅའ།",
    fieldPledgeHint:
      "ཁྱེད་ཀྱི་ཞལ་འདོན་གྲངས་ཚད། སྒོམ་སྒྲུབ། འགྲེམས་སྟོན། སློབ་ཁྲིད། སྦྱིན་བདག་གི་ལས་གཞི་སོགས་རང་གི་ཚིག་གིས་འབྲི་རོགས།",
    btnSubmit: "དམ་བཅའ་ཐོ་འགོད་དང་མཉམ་ཞུགས་གནང་བ།",
    btnSubmitting: "དམ་བཅའ་ཐོ་འགོད་བྱེད་བཞིན་པ...",
    step3Title: "༣. མཉམ་ཞུགས་མི་མང་གི་ཐོ་གཞུང་།",
    step3Sub:
      "བོད་ཀྱི་རིག་གཞུང་ལོ་ཉིས་སྟོང་ཆེད་སུས་དམ་བཅའ་བཞག་པ་དང་ཅི་ཞིག་གྲུབ་ཟིན་པར་གཟིགས།",
    registeredCountSuffix: "ཐོ་འགོད་དམ་བཅའ།",
    statusSubscribed: "དམ་བཅས་པ།",
    statusAccomplished: "གྲུབ་ཟིན་པ།",
    footerText:
      "བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་ལོ་ཉིས་སྟོང་འཁོར་བའི་དུས་སྟོན (༢༠༢༦–༢༠༢༩) · ཝི་ཀྲ་མ་ཤཱི་ལའི་དགེ་རྩ་ཚོགས་པ།",
    footerBack: "← དགེ་རྩ་ཚོགས་པའི་དྲྭ་ཚིགས་གཙོ་བོར་ཕྱིར་ལོག",
  },
};

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
  const [lang, setLang] = useState<Language>("bo");
  const t = CULTURE_UI[lang];
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const playerVideoRef = useRef<HTMLVideoElement>(null);
  const [videoSpeed, setVideoSpeed] = useState<"1x" | "1.5x" | "2x">("1.5x");
  const [isPlayerOpen, setIsPlayerOpen] = useState(true);
  const [visualTheme, setVisualTheme] =
    useState<VisualTheme>("lungta-festive");
  const [selectedRole, setSelectedRole] =
    useState<ParticipantRole>("individual");
  const [pledges, setPledges] = useState<PledgeItem[]>(INITIAL_PLEDGES);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [customPledge, setCustomPledge] = useState(
    ROLES[0].suggestionsBo[0]
  );
  const [submittedNotice, setSubmittedNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Load persistent pledges from localStorage and server API */
  useEffect(() => {
    try {
      const cached = localStorage.getItem("paldensakya_pledges_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPledges(parsed);
        }
      }
    } catch {
      // ignore localStorage parse errors
    }

    const fetchPledges = async () => {
      try {
        const res = await fetch("/api/pledges", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.pledges) && data.pledges.length > 0) {
            setPledges(data.pledges);
            try {
              localStorage.setItem("paldensakya_pledges_v1", JSON.stringify(data.pledges));
            } catch {
              // ignore localStorage write errors
            }
          }
        }
      } catch (err) {
        console.error("Failed to load pledges from server:", err);
      }
    };

    fetchPledges();
  }, []);

  /* Synchronize both background and player video streams */
  useEffect(() => {
    const player = playerVideoRef.current;
    const bg = bgVideoRef.current;
    if (!player || !bg) return;

    const rateMap = { "1x": 1.0, "1.5x": 1.5, "2x": 2.0 };
    const rate = rateMap[videoSpeed];
    player.playbackRate = rate;
    bg.playbackRate = rate;

    const syncTime = () => {
      if (Math.abs(bg.currentTime - player.currentTime) > 0.15) {
        bg.currentTime = player.currentTime;
      }
    };

    player.addEventListener("timeupdate", syncTime);
    player.addEventListener("seeking", syncTime);
    player.addEventListener("seeked", syncTime);

    return () => {
      player.removeEventListener("timeupdate", syncTime);
      player.removeEventListener("seeking", syncTime);
      player.removeEventListener("seeked", syncTime);
    };
  }, [isPlayerOpen, videoSpeed]);

  const handleSpeedChange = (spd: "1x" | "1.5x" | "2x") => {
    setVideoSpeed(spd);
    const rateMap = { "1x": 1.0, "1.5x": 1.5, "2x": 2.0 };
    const rate = rateMap[spd];
    if (playerVideoRef.current) playerVideoRef.current.playbackRate = rate;
    if (bgVideoRef.current) {
      bgVideoRef.current.playbackRate = rate;
      if (playerVideoRef.current) {
        bgVideoRef.current.currentTime = playerVideoRef.current.currentTime;
      }
    }
  };

  const currentRole =
    ROLES.find((r) => r.id === selectedRole) ?? ROLES[0];

  const handleRoleSelect = (roleId: ParticipantRole) => {
    setSelectedRole(roleId);
    const found = ROLES.find((r) => r.id === roleId);
    if (found) {
      const suggestions = lang === "bo" ? found.suggestionsBo : found.suggestionsEn;
      if (suggestions.length > 0) {
        setCustomPledge(suggestions[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !customPledge.trim() || isSubmitting) return;

    const newEntry: PledgeItem = {
      id: String(Date.now()),
      name: name.trim(),
      location: location.trim() || (lang === "bo" ? "ཀུན་ཁྱབ་མཉམ་ཞུགས་པ།" : "Global Participant"),
      roleLabel: lang === "bo" ? currentRole.labelBo : currentRole.labelEn,
      pledge: customPledge.trim(),
      status: "Subscribed",
    };

    // Optimistic instant local update
    const updated = [newEntry, ...pledges];
    setPledges(updated);
    try {
      localStorage.setItem("paldensakya_pledges_v1", JSON.stringify(updated));
    } catch {
      // ignore localStorage errors
    }

    const submittedName = name.trim();
    setName("");
    setLocation("");
    setSubmittedNotice(
      lang === "bo"
        ? `ཐུགས་རྗེ་ཆེ། ${submittedName}། ཁྱེད་ཀྱི་དམ་བཅའ་མི་མང་ཐོ་གཞུང་དུ་བཀོད་ཟིན།`
        : `Thank you, ${submittedName}. Your participation pledge has been added to the community register.`
    );

    // Persist to server / Vercel Blob store
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEntry.name,
          location: newEntry.location,
          roleLabel: newEntry.roleLabel,
          pledge: newEntry.pledge,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.pledges) && data.pledges.length > 0) {
          setPledges(data.pledges);
          try {
            localStorage.setItem("paldensakya_pledges_v1", JSON.stringify(data.pledges));
          } catch {
            // ignore localStorage errors
          }
        }
      }
    } catch (err) {
      console.error("Failed to persist pledge to server:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFestive = visualTheme === "lungta-festive";

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      {/* ══════════════════════════════════════════════════════════════════
          Full-width Ambient Background Video (L2 High-Speed Background)
          ══════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      >
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-60 sm:opacity-70 transition-opacity"
          src="/videos/pema-tsal-loop-fast.mp4"
        />
        {/* Soft atmospheric gradient: ensures video is clearly visible while keeping text sharp & readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80" />
      </div>

      {/* Top ribbon: Sacred 5 Lungta Elements or Traditional 3 Sakya Stripes */}
      {isFestive ? (
        <div
          aria-hidden="true"
          className="lungta-ribbon h-2 transition-all duration-300 relative z-10"
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
          className="w-full h-1.5 grid grid-cols-3 transition-all duration-300 relative z-10"
        >
          <div className="bg-sakya-terracotta" />
          <div className="bg-border-subtle" />
          <div className="bg-sakya-slate" />
        </div>
      )}

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-8 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle/80 relative z-10 bg-background/60 backdrop-blur-md rounded-b-sm">
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
          <span>{t.back}</span>
        </Link>

        {/* Controls: Language Switcher & Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Switcher Toggle */}
          <div
            role="radiogroup"
            aria-label="Language selection"
            className="flex items-center rounded-sm border border-border-subtle bg-card-bg/90 backdrop-blur-md p-0.5 shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={lang === "en"}
              onClick={() => {
                setLang("en");
                const found = ROLES.find((r) => r.id === selectedRole);
                if (found) setCustomPledge(found.suggestionsEn[0]);
              }}
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
              onClick={() => {
                setLang("bo");
                const found = ROLES.find((r) => r.id === selectedRole);
                if (found) setCustomPledge(found.suggestionsBo[0]);
              }}
              className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                lang === "bo"
                  ? "bg-sakya-crimson text-white font-serif"
                  : "text-muted hover:text-foreground font-serif"
              }`}
            >
              བོད་ཡིག
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <div
            role="radiogroup"
            aria-label="Select visual style"
            className="flex items-center gap-1 p-1 rounded-sm bg-card-bg/90 backdrop-blur-md border border-border-subtle shadow-2xs"
          >
            <span className="text-[11px] uppercase tracking-wider text-muted px-2 font-medium">
              Theme · བཀོད་པ།:
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
              ✨ 2,000 Years · ལོ་ཉིས་སྟོང་།
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
              🏛️ Sakya Classic · ས་སྐྱ་སྲོལ་རྒྱུན།
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-16 flex-1 relative z-10">
        {/* Hero */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-tibet-gold-light border border-tibet-gold/30 text-tibet-gold-rich font-semibold">
              {t.badgeJubilee}
            </span>
            <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-sm bg-card-bg/90 border border-border-subtle text-tibet-crimson font-medium">
              {t.badgeInitiative}
            </span>
          </div>

          <p
            lang="bo"
            className={`text-lg sm:text-xl tracking-wide font-serif ${
              isFestive ? "text-tibet-gold-rich" : "text-sakya-gold"
            }`}
          >
            ༄༅། །བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་ལོ་ཉིས་སྟོང་འཁོར་བའི་དུས་སྟོན།
          </p>

          <h1
            id="culture-heading"
            tabIndex={-1}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-foreground outline-none tracking-tight"
          >
            {t.heroHeadingPrefix}{" "}
            <span
              className={
                isFestive ? "text-tibet-crimson italic" : "text-foreground"
              }
            >
              {t.heroHeadingHighlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-3xl">
            {t.heroIntro}
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
                    {t.decalTitle} (Lungta Jubilee)
                  </h2>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-tibet-crimson text-white">
                    {t.decalBadge}
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  {t.decalDesc}
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
                  {t.decalTitle} (Classic Sakya)
                </h2>
                <p className="text-muted leading-relaxed">
                  {t.decalDesc}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsPlayerOpen(!isPlayerOpen)}
              aria-expanded={isPlayerOpen}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-sm text-xs sm:text-sm font-medium transition-all shadow-2xs cursor-pointer ${
                isPlayerOpen
                  ? "bg-foreground text-background hover:opacity-90"
                  : isFestive
                    ? "bg-tibet-crimson text-white hover:bg-tibet-crimson-deep"
                    : "bg-sakya-crimson text-white hover:opacity-90"
              }`}
            >
              <span aria-hidden="true" className="text-sm">
                {isPlayerOpen ? "✕" : "▶"}
              </span>
              <span>{isPlayerOpen ? t.btnVideoOpen : t.btnVideoClosed}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-wider">
                L2 Stream
              </span>
            </button>

            <span className="text-xs text-muted">
              {t.videoAmbientNotice}
            </span>
          </div>

          {/* L2 Fast-Paced Visual Stream · Pema Ts'al Monastic Institute (Expandable) */}
          {isPlayerOpen && (
            <div className="relative overflow-hidden rounded-md border border-border-subtle bg-black/95 shadow-lg transition-all animate-in fade-in duration-300">
              <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden">
                <video
                  ref={playerVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover opacity-90 transition-opacity"
                  src="/videos/pema-tsal-loop-fast.mp4"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                {/* L2 High-Frequency Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    L2 Fast Stream · {videoSpeed}
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Pema+Ts%27al+Sakya+Monastic+Institute+Pokhara+Nepal"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Pema Ts'al Sakya Monastic Institute on Google Maps"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tibet-gold/85 hover:bg-tibet-gold backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white hover:text-white transition-all shadow-xs hover:shadow-md cursor-pointer group"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white transition-transform group-hover:scale-110 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Pokhara, Nepal · Pema Ts&apos;al ↗</span>
                  </a>
                </div>

                {/* Video Speed Toggle */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-full p-1 border border-white/20 text-white text-[10px] sm:text-[11px]">
                  <span className="px-2 text-white/70">Speed:</span>
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
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white z-10">
                  <div>
                    <p className="font-serif text-base sm:text-xl font-medium drop-shadow-sm text-white">
                      {t.videoCaptionTitle}
                    </p>
                    <p className="text-xs sm:text-sm text-white/80 drop-shadow-sm max-w-xl">
                      {t.videoCaptionSub}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto shrink-0">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Pema+Ts%27al+Sakya+Monastic+Institute+Pokhara+Nepal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-tibet-gold hover:text-white underline underline-offset-4 flex items-center gap-1"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-3 h-3 text-tibet-gold"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t.videoMapsLink}
                    </a>
                    <span className="text-white/40 text-xs hidden sm:inline">·</span>
                    <a
                      href="https://www.youtube.com/watch?v=T9o-r5kd2h8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-tibet-gold hover:text-white underline underline-offset-4"
                    >
                      {t.videoYoutubeLink}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* The Seven Traditional Offerings to the Buddha */}
          <div className="bg-card-bg/85 backdrop-blur-md border border-border-subtle p-5 sm:p-6 rounded-md shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-border-subtle/70 pb-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground flex items-center gap-2">
                  <span>{t.offeringsTitle}</span>
                  <span lang="bo" className="text-xs sm:text-sm text-tibet-gold-rich font-normal">
                    {t.offeringsTibetan}
                  </span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {t.offeringsSub}
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-tibet-gold-light border border-tibet-gold/30 text-tibet-gold-rich self-start sm:self-auto">
                {t.offeringsBadge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {SEVEN_OFFERINGS.map((offering) => (
                <div
                  key={offering.id}
                  className="flex flex-col items-center text-center p-3 rounded-sm bg-background/80 border border-border-subtle/80 hover:border-tibet-gold hover:shadow-xs transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-tibet-gold-light border border-tibet-gold/30 flex items-center justify-center text-tibet-gold-rich group-hover:scale-110 transition-transform mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-none stroke-current"
                    >
                      {offering.svgPath}
                    </svg>
                  </div>
                  <span className="font-serif text-sm font-semibold text-foreground group-hover:text-tibet-crimson transition-colors">
                    {offering.sanskrit}
                  </span>
                  <span
                    lang="bo"
                    className="text-xs text-tibet-gold-rich font-medium mt-0.5 font-serif"
                  >
                    {offering.tibetan}
                  </span>
                  <span className="text-[11px] text-muted font-medium mt-1">
                    {offering.english}
                  </span>
                  <p className="text-[10px] text-muted/80 mt-1 leading-tight hidden sm:block">
                    {offering.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Foundation Grammar Treatise */}
        <section
          aria-labelledby="grammar-treatise-heading"
          className="rounded-sm border border-sakya-gold/50 bg-card-bg/85 backdrop-blur-md p-6 sm:p-7 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-tibet-gold-light border border-tibet-gold/30 text-tibet-gold-rich">
                  {lang === "bo" ? "གཞུང་ལུགས་གལ་ཆེན།" : "Foundational Study Text · 2,000 Years"}
                </span>
                <span className="text-xs text-muted">
                  {lang === "bo" ? "བླ་མ་པདྨ་དབང་གྲགས" : "Venerable Lama Khenpo Pema Wangdak"}
                </span>
              </div>
              <h3
                id="grammar-treatise-heading"
                className="font-serif text-xl sm:text-2xl font-medium text-foreground"
              >
                {lang === "bo"
                  ? "བརྡ་སྤྲོད་ཕྲན་ཚེགས། (ཚེག་འགྲོས་ཀྱི་ལེའུ)"
                  : "A Minor Treatise on Grammar: The Chapter on Syllabic Cadence"}
              </h3>
              <div className="space-y-1.5 pt-1 text-xs sm:text-sm text-foreground/90 font-serif leading-relaxed max-w-2xl border-l-2 border-sakya-gold/60 pl-3">
                <p className="font-semibold text-foreground">
                  ༄༅། །རིགས་སྟོབས་ཀྱི་ལམ་ལ་གཙོ་བོར་མ་བྱས་པར་གོམས་པའི་སྟོབས་ལ་གཙོ་བོར་བྱས་ཏེ་བོད་རིགས་བོད་སྐད་སྨྲ་བའི་སྐད་ཡིག་ཤེས་པའི་ལྷན་ཐབས་སུ་བྱས་པ་ཞིག
                </p>
                <p className="text-sakya-gold font-medium">
                  བོད་ཀྱི་ཕ་སྐད་ཀྱི་ཆ་མནའ་སྐད་ཁ་སྐད་ཡིག་སྐད་ཀྱི་ཆུ་བོ་གཅིག་འགྲིལ།
                </p>
                <p className="text-xs text-muted font-sans italic pt-0.5">
                  {lang === "bo"
                    ? "བོད་ཀྱི་སྐད་ཡིག་དང་བརྡ་སྤྲོད་སློབ་གཉེར་བ་རྣམས་ཀྱི་ཆེད་དུ་བླ་མ་པདྨ་དབང་གྲགས་ཀྱིས་མཛད་པའི་སློབ་དེབ།"
                    : "\"Created not through abstract dialectics alone, but through the power of habituated practice, to assist Tibetans and Tibetan speakers in mastering the language. The confluence of ancestral speech, colloquial tongue, and literary tradition.\""}
                </p>
              </div>
            </div>

            <a
              href="/wix-archive/documents/bd1c21_42cbaa9f4c604a9ba48298e4433a98ba.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-sakya-crimson hover:bg-sakya-crimson/90 text-white rounded-xs text-xs sm:text-sm font-medium transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{lang === "bo" ? "ཕྱག་དེབ་ཕབ་ལེན (PDF)" : "Download Treatise (PDF)"}</span>
            </a>
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
              {t.step1Title}
            </h2>
            <p className="text-sm text-muted">
              {t.step1Sub}
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter suggestions by participant category"
            className="flex flex-wrap gap-2.5"
          >
            {ROLES.map((role) => {
              const active = role.id === selectedRole;
              const label = lang === "bo" ? role.labelBo : role.labelEn;
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
                  {label}
                </button>
              );
            })}
          </div>

          <div className="bg-card-bg/70 border border-border-subtle p-6 rounded-sm space-y-4 shadow-2xs">
            <div className="border-b border-border-subtle/80 pb-3">
              <h3 className="font-serif text-xl font-medium text-foreground">
                {lang === "bo" ? currentRole.labelBo : currentRole.labelEn}
              </h3>
              <p className="text-sm text-muted mt-1">
                {lang === "bo" ? currentRole.descBo : currentRole.descEn}
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs uppercase tracking-wider text-tibet-gold-rich font-bold">
                {t.step1PickPrompt}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(lang === "bo" ? currentRole.suggestionsBo : currentRole.suggestionsEn).map((suggestion) => (
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
              {t.step2Title}
            </h2>
            <p className="text-sm text-muted">
              {t.step2Sub}
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
                  {t.fieldName}
                </label>
                <input
                  id="participant-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.placeholderName}
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground focus:border-tibet-crimson"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="participant-location"
                  className="block text-xs uppercase tracking-wider font-semibold text-foreground"
                >
                  {t.fieldLocation}
                </label>
                <input
                  id="participant-location"
                  type="text"
                  autoComplete="address-level2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.placeholderLocation}
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border-subtle rounded-sm text-foreground focus:border-tibet-crimson"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="participant-pledge"
                className="block text-xs uppercase tracking-wider font-semibold text-foreground"
              >
                {t.fieldPledge} ({lang === "bo" ? currentRole.labelBo : currentRole.labelEn})
              </label>
              <span
                id="pledge-hint"
                className="block text-xs text-muted pb-1"
              >
                {t.fieldPledgeHint}
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
                disabled={isSubmitting}
                className="px-7 py-3 bg-tibet-crimson text-white text-sm font-medium rounded-sm hover:bg-tibet-crimson-deep transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                <span>{isSubmitting ? t.btnSubmitting : t.btnSubmit}</span>
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
                {t.step3Title}
              </h2>
              <p className="text-sm text-muted mt-1">
                {t.step3Sub}
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-tibet-gold-rich font-bold bg-tibet-gold-light px-3 py-1 rounded-sm border border-tibet-gold/30">
              {pledges.length} {t.registeredCountSuffix}
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
                    {item.status === "Accomplished" ? t.statusAccomplished : t.statusSubscribed}
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

      <footer className="w-full border-t border-border-subtle/80 text-xs text-muted relative z-10 bg-background/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p>
            {t.footerText}
          </p>
          <Link
            href="/"
            className="text-tibet-crimson hover:underline underline-offset-4 font-medium"
          >
            {t.footerBack}
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
