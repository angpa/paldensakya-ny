"use client";

import { useState } from "react";
import Link from "next/link";

type Language = "en" | "bo";

const CONTENT = {
  en: {
    siteTitle: "Vikramaśila Foundation",
    siteSubtitle: "Palden Sakya Center · New York",
    navFoundation: "Foundation",
    navPrograms: "Programs",
    navContact: "Visit",
    skipLink: "Skip to main content",
    motto: "༄༅། །དམ་པའི་ཆོས་ནི་སྐྱབས་ཀྱི་མཆོག།",
    heroHeading: "Bringing meditation and the wisdom of the Buddha to the West.",
    p1: "The Vikramaśila Foundation is a nonprofit charitable organization dedicated to bringing meditation and the wisdom of the Buddha to the West. The organization was established under the auspices of His Holiness Sakya Trichen and is directed since 1989 by Venerable Khenpo Pema Wangdak.",
    p2: "The Foundation oversees programs in the Americas and the Himalayas. These include courses in meditation, study, special empowerment teachings, and Tibetan cultural events in and around New York City and South America through the Palden Sakya Centers, as well as projects promoting the education and well-being of young Tibetans in Nepal and India through the Pema Ts'al (Lotus Grove) Schools.",
    teachersToggle: "Teachers, Lineage & Pema Ts'al Schools",
    teachersHeadingHH: "H.H. Sakya Trichen Rinpoche",
    teachersRoleHH: "Spiritual Patron",
    teachersDescHH:
      "41st head of the Sakya Order of Tibetan Buddhism, founded in 1073 by Khön Könchok Gyalpo in an unbroken lineage of masters.",
    teachersHeadingKhenpo: "Venerable Khenpo Pema Wangdak",
    teachersRoleKhenpo: "Founder & Director",
    teachersDescKhenpo:
      "Sent to New York in 1982 by H.H. Sakya Trizin. Creator of Bur Yig (Tibetan Braille) and 2009 recipient of the Ellis Island Medal of Honor.",
    centersSummary:
      "Palden Sakya Centers: New York City (4 W 101st St), Englewood (NJ), Walden (NY · Tsechen Kunchab Ling), Woodstock & Philmont (NY), Springfield (VT), Portland (ME), and Dayton (OH).",
    schoolsSummary:
      "Pema Ts'al Schools: Pema Ts'al School in Mundgod, India (Tibetan lay children & Mango Project), Pema Ts'al Sakya Monastic Institute in Pokhara, Nepal, and Pema Ts'al School in New York City.",
    programsHeading: "Programs & Practice",
    programsSub: "Select any practice below to view schedules, liturgy details, and downloadable texts.",
    programsTag: "New York & Online",
    downloadPdfs: "Downloadable Prayer Books (PDF):",
    contactHeading: "Location & Contact",
    hqTitle: "New York Headquarters",
    hqAddress1: "Vikramaśila Foundation · Palden Sakya NYC",
    hqAddress2: "4 West 101st Street, No. 63",
    hqAddress3: "New York, NY 10025, USA",
    hqNJ: "Affiliated NJ Center: 318 Marlboro Road, Englewood, NJ 07631",
    directContact: "Direct Contact",
    phone: "Phone",
    email: "Email",
    ein: "EIN: 22-2998005 · 501(c)(3) Tax-Exempt",
    footerCopy: "© 2026 Vikramaśila Foundation · www.vikramasila.org",
    archiveLink: "Wix Backup Archive (61 Pages & 94 Images)",
    pilotLink: "2026–2029 Tibetan Culture Initiative",
  },
  bo: {
    siteTitle: "བི་ཀྲ་མ་ཤཱི་ལ་ཚོགས་པ།",
    siteSubtitle: "ནིའུ་ཡོག་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས།",
    navFoundation: "ཚོགས་པའི་ངོ་སྤྲོད།",
    navPrograms: "ཆོས་ཕྱོགས་ལས་རིམ།",
    navContact: "འབྲེལ་གཏུགས།",
    skipLink: "གཙོ་བོའི་ནང་དོན་ལ་མཆོང་བ།",
    motto: "༄༅། །དམ་པའི་ཆོས་ནི་སྐྱབས་ཀྱི་མཆོག།",
    heroHeading: "ནུབ་ཕྱོགས་ཡུལ་གྲུར་སངས་རྒྱས་ཀྱི་བསྟན་པ་དང་སྒོམ་སྒྲུབ་ཀྱི་ཉམས་ལེན་སྤེལ་བ།",
    p1: "བི་ཀྲ་མ་ཤཱི་ལ་ཚོགས་པ་ནི་དཔལ་ས་སྐྱ་གོང་མ་ཁྲི་ཆེན་རིན་པོ་ཆེ་མཆོག་གི་དགོངས་བཞེད་ལྟར་ཕྱི་ལོ་ ༡༩༨༩ ལོར་དབུ་བརྙེས་ཤིང་། མཁན་པོ་པདྨ་དབང་གྲགས་མཆོག་ནས་འགོ་འཁྲིད་གནང་བའི་ཁེ་མེད་དགེ་རྩའི་ཆོས་ཚོགས་ཤིག་ཡིན། འདི་ནི་ནུབ་ཕྱོགས་ཡུལ་གྲུ་ཁག་ཏུ་སངས་རྒྱས་ཀྱི་བསྟན་པ་དང་སྒོམ་སྒྲུབ་ཉམས་ལེན་དར་སྤེལ་གཏོང་རྒྱུར་དམིགས་པ་ཡིན།",
    p2: "ཚོགས་པ་འདིས་བྱང་ཨ་རི་དང་ཧི་མ་ལ་ཡའི་རི་རྒྱུད་ཀྱི་ལས་གཞི་ཁག་ལ་ལྟ་རྟོག་གནང་བཞིན་ཡོད། དེའི་ནང་ནིའུ་ཡོག་དང་ལྷོ་ཨ་རིའི་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས་ཁག་གི་སྒོམ་སྒྲུབ་དང་དབང་ལུང་ཁྲིད་གསུམ། བོད་ཀྱི་རིག་གཞུང་ལས་རིམ་ཁག་དང་། རྒྱ་གར་དང་བལ་ཡུལ་དུ་ཡོད་པའི་པདྨ་ཚལ་སློབ་གྲྭ་ཁག་བརྒྱུད་བོད་ཕྲུག་ཚོའི་ཤེས་ཡོན་དང་བདེ་དོན་ལ་རྒྱབ་སྐྱོར་གནང་བཞིན་ཡོད།",
    teachersToggle: "བླ་མ་བརྒྱུད་པ་དང་པདྨ་ཚལ་སློབ་གྲྭ་ཁག",
    teachersHeadingHH: "དཔལ་ས་སྐྱ་གོང་མ་ཁྲི་ཆེན་རིན་པོ་ཆེ།",
    teachersRoleHH: "དབུ་ཁྲིད་དམ་པ།",
    teachersDescHH:
      "དཔལ་ས་སྐྱའི་ཁྲི་འཛིན་ཞེ་གཅིག་པ་མཆོག འཁོན་དཀོན་མཆོག་རྒྱལ་པོས་ཕྱི་ལོ་ ༡༠༧༣ ལོར་དབུ་བརྙེས་པའི་ས་སྐྱའི་བསྟན་པ་འཛིན་སྐྱོང་སྤེལ་གསུམ་མཛད་མཁན།",
    teachersHeadingKhenpo: "མཁན་པོ་པདྨ་དབང་གྲགས་མཆོག",
    teachersRoleKhenpo: "དབུ་འཛིན་དང་སློབ་དཔོན།",
    teachersDescKhenpo:
      "ཕྱི་ལོ་ ༡༩༨༢ ལོར་ས་སྐྱ་གོང་མ་རིན་པོ་ཆེས་ནིའུ་ཡོག་ཏུ་ཆོས་སྤེལ་བར་མངགས། བོད་ཀྱི་ལོང་ཡིག་ (Bur Yig - Tibetan Braille) གསར་གཏོད་མཛད་མཁན་དང་ ༢༠༠༩ ལོའི་ Ellis Island གཟེངས་རྟགས་བཞེས་མཁན།",
    centersSummary:
      "དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས་ཁག: ནིའུ་ཡོག་གྲོང་ཁྱེར། (4 W 101st St) དང་ Englewood (NJ)། Walden (NY · བརྩེ་ཆེན་ཀུན་ཁྱབ་གླིང་)། Woodstock (NY)། Vermont དང་ Ohio སོགས་ཡིན།",
    schoolsSummary:
      "པདྨ་ཚལ་སློབ་གྲྭ་ཁག: རྒྱ་གར་མོན་གྷོ་པདྨ་ཚལ་སློབ་གྲྭ་ (བོད་ཕྲུག་དང་ཨམ་འབྲས་ལས་གཞི)། བལ་ཡུལ་པོ་ཁ་ར་པདྨ་ཚལ་ས་སྐྱའི་དགོན་སྡེའི་མཐོ་སློབ། ནིའུ་ཡོག་པདྨ་ཚལ་སློབ་གྲྭ་བཅས་ཡིན།",
    programsHeading: "ཆོས་ཕྱོགས་ལས་རིམ་དང་ཉམས་ལེན།",
    programsSub: "དུས་ཚོད་དང་གསུང་ཆོག དྲྭ་ཐོག་ཞལ་འདོན་ཕྱག་དེབ་གཟིགས་ཆེད་གཤམ་གསལ་རེ་རེར་གནོན་རོགས།",
    programsTag: "ནིའུ་ཡོག་དང་དྲྭ་ཐོག",
    downloadPdfs: "ཞལ་འདོན་ཕྱག་དེབ་ཕབ་ལེན (PDF):",
    contactHeading: "བཞུགས་གནས་དང་འབྲེལ་གཏུགས།",
    hqTitle: "ནིའུ་ཡོག་ལས་ཁུངས་ལྟེ་བ།",
    hqAddress1: "བི་ཀྲ་མ་ཤཱི་ལ་ཚོགས་པ། · ནིའུ་ཡོག་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས།",
    hqAddress2: "4 West 101st Street, No. 63",
    hqAddress3: "New York, NY 10025, USA",
    hqNJ: "ནིའུ་ཇར་སི་ཡན་ལག: 318 Marlboro Road, Englewood, NJ 07631",
    directContact: "འབྲེལ་གཏུགས།",
    phone: "ཁ་པར།",
    email: "གློག་འཕྲིན།",
    ein: "དཔྱ་ཁྲལ་གློད་ཡངས་ཨང་: 22-2998005 · 501(c)(3)",
    footerCopy: "© ༢༠༢༦ བི་ཀྲ་མ་ཤཱི་ལ་ཚོགས་པ། · www.vikramasila.org",
    archiveLink: "Wix ཡིག་མཛོད་ཉར་ཚགས (ཤོག་ངོས་ ༦༡ དང་པར་རིས་ ༩༤)",
    pilotLink: "༢༠༢༦–༢༠༢༩ བོད་ཀྱི་རིག་གཞུང་དང་སྐད་ཡིག་ལས་གཞི།",
  },
};

const PRAYER_BOOKS = [
  {
    titleEn: "Samantabhadra Wishing Prayer",
    titleBo: "བཟང་སྤྱོད་སྨོན་ལམ། (བརྗོད་པའི་ལེའུ)",
    enPdf: "/wix-archive/documents/bd1c21_62b7b6be52a24b95bfbbe78eb43ed1e3.pdf",
    boPdf: "/wix-archive/documents/bd1c21_be63e73983f54dd1bd8197d5f4bf4105.pdf",
  },
  {
    titleEn: "Amitayus Buddha Dharani",
    titleBo: "ཚེ་དཔག་མེད་ཀྱི་གཟུངས། (ཚེག་འགྲོས་ཀྱི་ལེའུ)",
    enPdf: "/wix-archive/documents/bd1c21_925bc9a0fe1e4309bc79c5f90ad06ee9.pdf",
    boPdf: "/wix-archive/documents/bd1c21_42cbaa9f4c604a9ba48298e4433a98ba.pdf",
  },
  {
    titleEn: "Medicine Buddha Empowerment",
    titleBo: "སྨན་བླའི་རྗེས་གནང་། (ཁྱད་ཆོས་༡/༢)",
    enPdf: "/wix-archive/documents/bd1c21_fdd2b608805343c68c811ba9315dd994.pdf",
    boPdf: "/wix-archive/documents/bd1c21_9a227a12077548598bedbf559e2f3650.pdf",
  },
  {
    titleEn: "Medicine Buddha Mantra",
    titleBo: "སྨན་བླའི་གཟུངས་སྔགས།",
    enPdf: "/wix-archive/documents/bd1c21_f81a48d196ad43378034bc9271544c3a.pdf",
    boPdf: "/wix-archive/documents/bd1c21_ff7980b825f4468b9ae382377839dfff.pdf",
  },
  {
    titleEn: "The Timeless Practice of Sojong",
    titleBo: "གསོ་སྦྱོང་གི་སྡོམ་པའི་ཉམས་ལེན།",
    enPdf: "/wix-archive/documents/bd1c21_2389ba9a3e404b2ea8c307a0aa48baf6.pdf",
    boPdf: "/wix-archive/documents/bd1c21_88cc871a4bdb4eadb40b2ea70777cc4c.pdf",
  },
];

const PROGRAMS = [
  {
    id: "daily-prayers",
    categoryEn: "Daily",
    categoryBo: "ཉིན་རེ།",
    titleEn: "Daily Prayers & Liturgy",
    titleBo: "ཉིན་རེའི་ཞལ་འདོན།",
    summaryEn:
      "Morning and evening lineage supplications, Samantabhadra Wishing Prayer, Medicine Buddha, and downloadable prayer books.",
    summaryBo:
      "ཞོགས་པ་དང་དགོང་མོའི་བརྒྱུད་འདེབས་དང་བཟང་སྤྱོད་སྨོན་ལམ། སྨན་བླའི་མདོ་ཆོག་སོགས་ཀྱི་ཉམས་ལེན།",
    scheduleEn: "Every Day · Morning & Evening Practice",
    scheduleBo: "ཉིན་ལྟར་ཞོགས་པ་དང་དགོང་མོ།",
    detailsEn: [
      "Samantabhadra's 'Noble Wishing Prayer' (Zangcho Mönlam) & Refuge/Bodhicitta",
      "Medicine Buddha Sutra & Mantra Recitation ('The Buddha Who Heals the World')",
      "Amitayus Buddha Long-Life Dharani & Three Deities Long Life Prayer",
      "The Timeless Practice of Sojong (observed from 7:00 AM to 7:00 AM on sacred lunar days)",
    ],
    detailsBo: [
      "བཟང་སྤྱོད་སྨོན་ལམ་དང་སྐྱབས་འགྲོ་སེམས་བསྐྱེད།",
      "སྨན་བླའི་མདོ་ཆོག་དང་གཟུངས་སྔགས་གསུང་འདོན།",
      "ཚེ་དཔག་མེད་ཀྱི་གཟུངས་དང་ཚེ་ལྷ་རྣམ་གསུམ་གྱི་ཞལ་འདོན།",
      "དུས་བཟང་ཁག་ཏུ་ཞོགས་པའི་ཆུ་ཚོད་ ༧:༠༠ ནས་ཕྱི་ཉིན་བར་གསོ་སྦྱོང་གི་སྡོམ་པ་བསྲུང་བ།",
    ],
    noteEn: "Downloadable bilingual PDF prayer books (English & Tibetan) from our archive are included below.",
    noteBo: "དབྱིན་ཡིག་དང་བོད་ཡིག་གཉིས་ལྡན་གྱི་ཞལ་འདོན་ཕྱག་དེབ་གཤམ་དུ་ཕབ་ལེན་གནང་ཐུབ།",
    hasPrayerBooks: true,
  },
  {
    id: "weekly-tara",
    categoryEn: "Weekly",
    categoryBo: "བདུན་རེ།",
    titleEn: "Weekly Green Tara Practice & Meditation",
    titleBo: "སྒྲོལ་མ་བཞི་ཆོག་དང་སྒོམ།",
    summaryEn:
      "Green Tara Four Mandala Practice and Sitting Meditation led by Venerable Khenpo Pema Wangdak.",
    summaryBo:
      "མཁན་པོ་པདྨ་དབང་གྲགས་མཆོག་ནས་དབུ་ཁྲིད་གནང་བའི་སྒྲོལ་མ་བཞི་ཆོག་དང་ཞི་གནས་སྒོམ།",
    scheduleEn: "Every Sunday on Zoom · 12:00 PM – 1:30 PM & 2:00 PM – 3:00 PM (EDT)",
    scheduleBo: "གཟའ་ཉི་མ་ནམ་ཡིན་ལ་ Zoom བརྒྱུད་ཉིན་གུང་ ༡༢:༠༠ ནས་ ༡:༣༠ དང་ ༢:༠༠ ནས་ ༣:༠༠ བར།",
    detailsEn: [
      "12:00 PM – 1:30 PM (EDT): Green Tara Four Mandala Practice (Dolma Shichok) and Twenty-One Praises to Tara",
      "2:00 PM – 3:00 PM (EDT): Guided & Silent Sitting Meditation",
      "Co-hosted with Sakya Kachod Choling & Palden Sakya Centers",
      "Everyone is welcome to join; there are no prerequisites (contact paldensakya@vikramasila.org for the Zoom link)",
    ],
    detailsBo: [
      "ཉིན་གུང་ ༡༢:༠༠–༡:༣༠: སྒྲོལ་མ་ཕྱག་འཚལ་ཉེར་གཅིག་དང་སྒྲོལ་མ་བཞི་ཆོག་གསུང་འདོན།",
      "ཉིན་གུང་ ༢:༠༠–༣:༠༠: ཞི་གནས་སྒོམ་སྒྲུབ་ཀྱི་ལམ་སྟོན་དང་མཉམ་སྒོམ།",
      "དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས་དང་ས་སྐྱ་མཁའ་སྤྱོད་ཆོས་གླིང་ནས་མཉམ་སྦྲེལ་གོ་སྒྲིག་ཞུས།",
      "སེར་སྐྱ་མི་མང་ཀུན་མཉམ་ཞུགས་གནང་ཆོག (Zoom འབྲེལ་ཐག་ཆེད་ paldensakya@vikramasila.org ལ་འབྲེལ་གཏུགས་གནང་རོགས)།",
    ],
    noteEn: "Tara Puja with Four Mandala Offerings is also available by request for blessings and removing obstacles.",
    noteBo: "བར་ཆད་ཞི་བ་དང་དགེ་མཚན་རྒྱས་ཕྱིར་དམིགས་བསལ་སྒྲོལ་མ་བཞི་ཆོག་གསུང་འདོན་ཡང་མངགས་ཆོག",
    image: "/wix-archive/images/dbaf06_4ee68230b6684c238cf3eed6caac708b~mv2.jpg",
    imageAlt: "Venerable Khenpo Pema Wangdak leading Green Tara practice",
  },
  {
    id: "tibetan-language",
    categoryEn: "Language",
    categoryBo: "སྐད་ཡིག",
    titleEn: "Tibetan Language & Cultural Studies",
    titleBo: "བོད་ཀྱི་སྐད་ཡིག་དང་རིག་གཞུང་།",
    summaryEn:
      "\"Letters are the foundation of all knowledge\" — Classical and colloquial Tibetan grammar, sentence structure, and Bur Yig.",
    summaryBo:
      "\"ཡི་གེ་ཤེས་བྱ་ཀུན་གྱི་གཞི་མ་ཡིན།\" བོད་ཀྱི་བརྡ་སྤྲོད་དང་ཚིག་སྦྱོར། བོད་ཀྱི་ལོང་ཡིག་སློབ་ཁྲིད།",
    scheduleEn: "Weekly Sessions · West 101st Street & Online",
    scheduleBo: "བདུན་རེའི་སློབ་ཁྲིད། ནིའུ་ཡོག་དང་དྲྭ་ཐོག",
    detailsEn: [
      "Course Series: 'The Elements of Tibetan Sentences' — nouns, adjectives, and classical grammar structure",
      "Bilingual and trilingual study workshops for students, translators, and practitioners",
      "Liturgical reading, Uchen script, and accurate Tibetan pronunciation",
      "Bur Yig (Tibetan Braille): Pioneered by Khenpo Pema Wangdak for blind Tibetan students",
    ],
    detailsBo: [
      "བརྡ་སྤྲོད་ཀྱི་འགྲོས་ལ་འོང་བའི་ཁྱད་གཞི་དང་ཁྱད་ཆོས་ཀྱི་མིང་ཚིག་དང་ཚིག་ཁྱིམ།",
      "དབུ་ཅན་ཡིག་གཟུགས་འབྲི་ཀློག་དང་ཆོས་སྤྱོད་ཀྱི་སྒྲ་གདངས་དག་ཐོན།",
      "ལོ་ཙཱ་བ་དང་སློབ་གཉེར་བ། དོན་གཉེར་ཅན་རྣམས་ལ་དམིགས་པའི་ཟབ་སྦྱོང་།",
      "མཁན་པོ་པདྨ་དབང་གྲགས་མཆོག་ནས་གསར་གཏོད་གནང་བའི་བོད་ཀྱི་ལོང་ཡིག (Bur Yig)།",
    ],
    noteEn: "4-hour intensive modules and weekly classes available online and in New York City.",
    noteBo: "ཆུ་ཚོད་ ༤ ཅན་གྱི་ཟབ་ཁྲིད་དང་བདུན་རེའི་སློབ་ཚན་དྲྭ་ཐོག་དང་ནིའུ་ཡོག་ཏུ་ཚོགས་བཞིན་ཡོད།",
  },
  {
    id: "annual-activities",
    categoryEn: "Annual",
    categoryBo: "ལོ་འཁོར།",
    titleEn: "Annual Activities, Retreats & Holy Days",
    titleBo: "ལོ་འཁོར་དུས་ཆེན་དང་གསོ་སྦྱོང་།",
    summaryEn:
      "Losar & Chötrul Month, New Year Retreats, Young Buddhist international gatherings, and Sakya lineage empowerments.",
    summaryBo:
      "བོད་ཀྱི་ལོ་གསར་དང་ཆོ་འཕྲུལ་ཟླ་བ། ལོ་གསར་སྒོམ་སྒྲུབ། གཞོན་ནུ་ནང་པའི་ལས་རིམ་དང་ས་སྐྱའི་བཀའ་ཆོས།",
    scheduleEn: "Throughout the Tibetan Lunar & Solar Year",
    scheduleBo: "བོད་ཀྱི་ཟླ་ཐོ་ལྟར་ལོ་ཧྲིལ་པོར།",
    detailsEn: [
      "Losar & Chötrul Month Celebrations (February – March): Auspicious prayers and community gatherings at Palden Sakya NYC",
      "Annual New Year Retreat (Dec 31 – Jan 3): Practical instruction on prayer and meditation with Khenpo Pema Wangdak",
      "Public Blessings & Oral Transmissions with His Holiness the Sakya Gongma Trichen Rinpoche",
      "Special Teachings: Shantideva's Guide to the Bodhisattva's Way of Life & 'A Trilogy of the Open Heart' (Generosity, Enthusiasm, Patience)",
      "Humanitarian Projects: Pema Ts'al Schools (Mundgod, Pokhara & NYC) and the One Million Mango Trees initiative",
    ],
    detailsBo: [
      "བོད་ཀྱི་ལོ་གསར་དང་ཆོ་འཕྲུལ་ཟླ་བའི་སྨོན་ལམ་ཞལ་འདོན།",
      "ཕྱི་ལོའི་ལོ་གསར་གྱི་སྒོམ་སྒྲུབ་ཉམས་ལེན་ (ཟླ་ ༡༢ ཚེས་ ༣༡ ནས་ ཟླ་ ༡ ཚེས་ ༣ བར)།",
      "དཔལ་ས་སྐྱ་གོང་མ་ཁྲི་ཆེན་རྡོ་རྗེ་འཆང་མཆོག་གི་སྨན་བླའི་རྗེས་གནང་དང་བཟང་སྤྱོད་ལུང་འབོགས།",
      "སྤྱོད་འཇུག་ཆེན་མོའི་བཤད་ཁྲིད་དང་སྙིང་རྗེའི་སྐོར་གྱི་བཀའ་ཁྲིད།",
      "པདྨ་ཚལ་སློབ་གྲྭ་ཁག་དང་ཨམ་འབྲས་ཤིང་སྡོང་ས་ཡ་གཅིག་འདེབས་འཛུགས་ཀྱི་དགེ་རྩའི་ལས་གཞི།",
    ],
    noteEn: "All donations supporting annual humanitarian and educational programs are 100% tax-deductible (EIN: 22-2998005).",
    noteBo: "དགེ་རྩའི་ཞལ་འདེབས་ཡོངས་རྫོགས་ཁྲལ་གློད་ཡངས་ཆོག་པ་ཡིན (EIN: 22-2998005)།",
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Language>("bo");
  const t = CONTENT[lang];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Traditional Sakya Rigsum Gonpo stripe */}
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
          {t.skipLink}
        </a>

        <div className="flex items-center gap-3.5">
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
              {t.siteTitle}
            </span>
            <span className="block text-xs tracking-widest uppercase text-muted">
              {t.siteSubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex items-center gap-5 text-sm text-muted">
              <li>
                <a
                  href="#foundation"
                  className="hover:text-sakya-crimson transition-colors py-1"
                >
                  {t.navFoundation}
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="hover:text-sakya-crimson transition-colors py-1"
                >
                  {t.navPrograms}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-sakya-crimson transition-colors py-1"
                >
                  {t.navContact}
                </a>
              </li>
            </ul>
          </nav>

          {/* Language Switcher Toggle */}
          <div
            role="radiogroup"
            aria-label="Language selection"
            className="flex items-center rounded-sm border border-border-subtle bg-card-bg p-0.5"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-20 flex-1">
        {/* Foundation Description */}
        <section id="foundation" className="space-y-8">
          <div className="space-y-3">
            <p
              lang="bo"
              className="text-sm sm:text-base text-sakya-gold tracking-wide font-serif"
            >
              {t.motto}
            </p>
            <h1
              id="main-heading"
              tabIndex={-1}
              className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-foreground tracking-tight outline-none"
            >
              {t.heroHeading}
            </h1>
          </div>

          <div className="w-12 h-px bg-sakya-crimson/40" aria-hidden="true" />

          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
            <p>{t.p1}</p>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              {t.p2}
            </p>
          </div>

          {/* Expandable Lineage & Teachers */}
          <div className="pt-2">
            <details className="group border border-border-subtle bg-card-bg/40 rounded-sm px-5 py-3.5">
              <summary className="cursor-pointer flex items-center justify-between text-xs uppercase tracking-widest text-sakya-crimson font-semibold select-none">
                <span>{t.teachersToggle}</span>
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
                        {t.teachersHeadingHH}
                      </h2>
                      <p className="text-[11px] uppercase tracking-wider text-sakya-gold font-medium">
                        {t.teachersRoleHH}
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        {t.teachersDescHH}
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
                        {t.teachersHeadingKhenpo}
                      </h2>
                      <p className="text-[11px] uppercase tracking-wider text-sakya-gold font-medium">
                        {t.teachersRoleKhenpo}
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        {t.teachersDescKhenpo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle/70 text-xs text-muted space-y-2 leading-relaxed">
                  <p>{t.centersSummary}</p>
                  <p>{t.schoolsSummary}</p>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Programs Section */}
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
                {t.programsHeading}
              </h2>
              <p className="text-sm text-muted mt-1">{t.programsSub}</p>
            </div>
            <span className="text-xs uppercase tracking-widest text-sakya-gold font-medium">
              {t.programsTag}
            </span>
          </div>

          <div className="divide-y divide-border-subtle border-y border-border-subtle">
            {PROGRAMS.map((program) => {
              const category = lang === "bo" ? program.categoryBo : program.categoryEn;
              const title = lang === "bo" ? program.titleBo : program.titleEn;
              const subTitle = lang === "bo" ? program.titleEn : program.titleBo;
              const summary = lang === "bo" ? program.summaryBo : program.summaryEn;
              const schedule = lang === "bo" ? program.scheduleBo : program.scheduleEn;
              const details = lang === "bo" ? program.detailsBo : program.detailsEn;
              const note = lang === "bo" ? program.noteBo : program.noteEn;

              return (
                <details
                  key={program.id}
                  name="palden-sakya-programs"
                  className="group py-5 transition-colors"
                >
                  <summary className="cursor-pointer flex items-start justify-between gap-4 py-1 select-none">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm bg-card-bg text-sakya-crimson border border-border-subtle">
                          {category}
                        </span>
                        <span className="font-serif text-xl sm:text-2xl font-medium text-foreground group-hover:text-sakya-crimson transition-colors">
                          {title}
                        </span>
                        <span
                          lang={lang === "bo" ? "en" : "bo"}
                          className="text-xs sm:text-sm text-muted/80 font-serif"
                        >
                          {subTitle}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-muted leading-relaxed">
                        {summary}
                      </p>
                    </div>

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
                      {schedule}
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
                          {lang === "bo"
                            ? "མཁན་པོ་པདྨ་དབང་གྲགས་མཆོག་ནས་དཔལ་ལྡན་ས་སྐྱའི་ཆོས་ཚོགས་སུ་སྒྲོལ་མ་བཞི་ཆོག་གནང་བཞིན་པ།"
                            : "Venerable Khenpo Pema Wangdak leading Green Tara Four Mandala Practice at Palden Sakya."}
                        </p>
                      </div>
                    )}

                    <ul className="list-disc pl-5 space-y-1.5 text-muted">
                      {details.map((item) => (
                        <li key={item} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>

                    {program.hasPrayerBooks && (
                      <div className="pt-2 space-y-2">
                        <p className="text-xs uppercase tracking-wider font-semibold text-foreground">
                          {t.downloadPdfs}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {PRAYER_BOOKS.map((book) => (
                            <div
                              key={book.titleEn}
                              className="p-3 rounded-sm bg-card-bg/70 border border-border-subtle flex items-center justify-between gap-2 text-xs"
                            >
                              <div>
                                <span className="font-medium text-foreground block">
                                  {lang === "bo" ? book.titleBo : book.titleEn}
                                </span>
                                <span
                                  lang={lang === "bo" ? "en" : "bo"}
                                  className="text-muted"
                                >
                                  {lang === "bo" ? book.titleEn : book.titleBo}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href={book.enPdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Download ${book.titleEn} in English (PDF)`}
                                  className="px-2 py-1 bg-background border border-border-subtle rounded-sm hover:border-sakya-crimson hover:text-sakya-crimson transition-colors"
                                >
                                  English
                                </a>
                                <a
                                  href={book.boPdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Download ${book.titleBo} in Tibetan (PDF)`}
                                  className="px-2 py-1 bg-background border border-border-subtle rounded-sm hover:border-sakya-crimson hover:text-sakya-crimson transition-colors font-serif"
                                >
                                  བོད་ཡིག
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs italic text-muted pt-1">{note}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* Location & Contact Section */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="space-y-6 pt-4 border-t border-border-subtle"
        >
          <h2
            id="contact-heading"
            className="font-serif text-2xl sm:text-3xl font-normal text-foreground"
          >
            {t.contactHeading}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-card-bg/70 border border-border-subtle p-6 sm:p-8 rounded-sm">
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-sakya-crimson font-semibold">
                {t.hqTitle}
              </h3>
              <address className="not-italic text-sm sm:text-base text-foreground leading-relaxed space-y-0.5">
                <p className="font-medium">{t.hqAddress1}</p>
                <p>{t.hqAddress2}</p>
                <p>{t.hqAddress3}</p>
              </address>
              <p className="text-xs text-muted pt-2">{t.hqNJ}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-sakya-crimson font-semibold">
                {t.directContact}
              </h3>
              <dl className="text-sm sm:text-base space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted text-xs uppercase tracking-wider w-20 shrink-0">
                    {t.phone}
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
                    {t.email}
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
                  <dd className="text-muted text-xs">{t.ein}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto px-6 py-10 border-t border-border-subtle text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p>{t.footerCopy}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/archive"
            className="text-muted hover:text-sakya-crimson underline underline-offset-4"
          >
            {t.archiveLink}
          </Link>
          <Link
            href="/tibetan-culture"
            className="inline-flex items-center gap-1.5 text-sakya-crimson hover:underline underline-offset-4 font-medium"
          >
            <span>{t.pilotLink}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
