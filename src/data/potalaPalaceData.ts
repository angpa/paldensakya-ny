export type Language = "en" | "bo";

export interface PotalaHotspot {
  id: string;
  number: string;
  nameBo: string;
  nameEn: string;
  subtitleBo: string;
  subtitleEn: string;
  elevation: string;
  eraBo: string;
  eraEn: string;
  descriptionBo: string;
  descriptionEn: string;
  architectureBo: string[];
  architectureEn: string[];
  position3D: [number, number, number];
  cameraPos3D: [number, number, number];
  cameraTarget3D: [number, number, number];
  freq: number;
  colorHex: string;
}

export interface PotalaReferenceAsset {
  id: string;
  titleBo: string;
  titleEn: string;
  typeBo: string;
  typeEn: string;
  src: string;
  tripoPrompt: string;
}

export const POTALA_REFERENCE_ASSETS: PotalaReferenceAsset[] = [
  {
    id: "diorama-model",
    titleBo: "པོ་ཏ་ལའི་གླིང་ཕྲན་དཔེ་གཟུགས།",
    titleEn: "Potala Floating Island 3D Diorama",
    typeBo: "༣D དཔེ་གཟུགས་མ་དཔེ།",
    typeEn: "Tripo3D Image-to-3D Reference",
    src: "/potala/potala-diorama-model.png",
    tripoPrompt:
      "Miniature 3D isometric diorama of Potala Palace in Lhasa Tibet on a floating island pedestal, crimson Red Palace in center with golden roofs, sloping whitewashed White Palace wings, zigzagging staircases on green pine hill, Shol village walls at base, stylized PBR clay and stone textures, studio lighting.",
  },
  {
    id: "architectural-render",
    titleBo: "ཕོ་བྲང་པོ་ཏ་ལའི་ཟུར་མཐོང་༣D།",
    titleEn: "Low-Angle 3D Architectural Maquette",
    typeBo: "བཟོ་བཀོད་ཐིག་རིས།",
    typeEn: "3D Massing & Window Study",
    src: "/potala/potala-3d-render.jpg",
    tripoPrompt:
      "3D architectural model of Potala Palace sitting on faceted white mountain rock, inward-sloping Tibetan fortress walls, deep crimson Red Palace, hundreds of trapezoidal windows, golden roof finials, grand stepped staircase ascending from bottom right to center.",
  },
  {
    id: "front-elevation",
    titleBo: "ལྷོ་ངོས་ཀྱི་བཀོད་པ་ཆ་ཚང་།",
    titleEn: "Complete Southern Facade & Stairways",
    typeBo: "མདུན་ངོས་རི་མོ།",
    typeEn: "Orthographic Elevation Reference",
    src: "/potala/potala-elevation.jpg",
    tripoPrompt:
      "Full southern elevation 3D diorama of Potala Palace, symmetrical white perimeter wall with three traditional gates, pine tree forest on Marpo Ri slope, white zigzagging staircases, White Palace wings and central Red Palace crowned with golden roofs.",
  },
  {
    id: "artistic-illustration",
    titleBo: "ཚོན་རིས་སྒྱུ་རྩལ་གྱི་བཀོད་པ།",
    titleEn: "Stylized Tibetan Chromatic Study",
    typeBo: "ཚོན་མདོག་མ་དཔེ།",
    typeEn: "Color & Material Palette Reference",
    src: "/potala/potala-illustration.png",
    tripoPrompt:
      "Hand-crafted 3D heritage monument of the Potala Palace in Lhasa, authentic Tibetan mineral pigments: white lime walls, crimson red tamarisk friezes, ochre yellow chapels, and gilded bronze roofs on a lush green mountain.",
  },
];

export const POTALA_HOTSPOTS: PotalaHotspot[] = [
  {
    id: "red-palace",
    number: "01",
    nameBo: "ཕོ་བྲང་དམར་པོ།",
    nameEn: "The Red Palace (Potrang Marpo)",
    subtitleBo: "དབུས་ཀྱི་གཙུག་ལག་ཁང་དང་མཆོད་རྟེན་ཁང་།",
    subtitleEn: "Central Sacred Sanctuary & Reliquary Halls",
    elevation: "3,700m · Central Summit",
    eraBo: "དུས་རབས་ ༡༧ པ། (༡༦༩༠–༡༩༤)",
    eraEn: "17th Century (1690–1694 CE)",
    descriptionBo:
      "ཕོ་བྲང་དམར་པོ་ནི་པོ་ཏ་ལའི་དབུས་སུ་བརྗིད་ཉམས་དང་ལྡན་པར་བཞེངས་ཤིང་། ཐོག་བརྩེགས་བཅུ་གསུམ་གྱི་དབུས་སུ་ཚོམས་ཆེན་སྲིད་ཞིའི་ཕུན་ཚོགས་དང་། གསེར་གྱི་མཆོད་རྟེན་ཁག བཀའ་འགྱུར་དང་བསྟན་འགྱུར་གྱི་གསུང་རབ་སྟོང་ཕྲག་མང་པོ་བཞུགས་པའི་གནས་མཆོག་ཡིན།",
    descriptionEn:
      "Rising at the heart of the complex in deep mineral crimson, the Red Palace is dedicated entirely to spiritual study, sacred art, and Buddhist devotion. Its upper stories feature continuous bands of fragrant bound tamarisk twigs (penba) painted with sacred red earth, housing the Great West Assembly Hall, exquisite three-dimensional mandalas, and thousands of illuminated manuscripts.",
    architectureBo: [
      "ཕྱིའི་རྩིགས་ངོས་ལ་སྤེན་མ་དམར་པོའི་མཐའ་རྒྱན་དང་གསེར་ཟངས་ཀྱི་རྒྱན་ཆ།",
      "ནང་དུ་ཀ་བ་བརྒྱ་ཕྲག་ལྷག་ཡོད་པའི་ཚོམས་ཆེན་དང་ལྡེབས་རིས་ངོ་མཚར་ཅན།",
      "བོད་ཀྱི་ཤིང་བཟོ་དང་རྡོ་བཟོའི་ལག་རྩལ་མཐོ་ཤོས་ཀྱི་མཚོན་དོན།",
    ],
    architectureEn: [
      "Deep crimson mineral-washed walls crowned with lightness-enhancing penba (tamarisk) friezes.",
      "Four prominent vertical timber bay window columns illuminating the central assembly chambers.",
      "Supported internally by a forest of hand-carved wooden pillars and bracketed beams without iron nails.",
    ],
    position3D: [0, 7.6, 0.2],
    cameraPos3D: [0, 10.5, 13.5],
    cameraTarget3D: [0, 6.2, 0],
    freq: 528,
    colorHex: "#ef4444",
  },
  {
    id: "white-palace",
    number: "02",
    nameBo: "ཕོ་བྲང་དཀར་པོ།",
    nameEn: "The White Palace (Potrang Karpo)",
    subtitleBo: "ཤར་ནུབ་ཀྱི་ཕོ་བྲང་དང་ཚོམས་ཆེན་ཤར།",
    subtitleEn: "The Alabaster Fortress Wings & Sunlight Halls",
    elevation: "3,660m · East & West Ridges",
    eraBo: "དུས་རབས་ ༡༧ པ། (༡༦༤༥–༡༦༤༨)",
    eraEn: "17th Century (1645–1648 CE)",
    descriptionBo:
      "ཕོ་བྲང་དཀར་པོ་ནི་ཞི་བ་དང་དག་གཙང་གི་མཚོན་དོན་དུ་ས་དཀར་དང་འོ་མ། སྦྲང་རྩི་བཅས་བསྲེས་ཏེ་བྱུགས་ཤིང་། དེའི་ནང་དུ་ཚོམས་ཆེན་ཤར་སྲིད་ཞིའི་ཕུན་ཚོགས་དང་། ཉི་འོད་འཕྲོ་བའི་གཟིམ་ཆུང་། ཡིག་ཚང་དང་སློབ་གཉེར་ཁང་བཅས་ཆགས་ཡོད།",
    descriptionEn:
      "Flanking the central sanctuary like massive white wings, the White Palace climbs the natural contours of Marpo Ri Hill. Annually whitewashed with a traditional mixture of lime, milk, sugar, and saffron during the autumn Lhabab Duchen season, its inward-sloping granite walls projects peace, resilience, and brilliance under the high-altitude Himalayan sun.",
    architectureBo: [
      "རྡོ་རྩིག་མཐུག་པོ་གྱེན་དུ་ཕྲ་རུ་འགྲོ་བའི་བོད་ཀྱི་མཁར་རྫོང་བཟོ་བཀོད།",
      "སྒེའུ་ཁུང་གྲུ་བཞི་ནག་རིས་ཅན་བརྒྱ་ཕྲག་མང་པོས་ཉི་འོད་བསྡུ་བ།",
      "ནུབ་ངོས་ཀྱི་མཁར་རྫོང་ཟླུམ་པོ་དང་ཤར་ངོས་ཀྱི་བདེ་དགའ་རྫིང་།",
    ],
    architectureEn: [
      "Battered granite walls up to 5 meters thick at the base, engineered to withstand Himalayan earthquakes.",
      "Hundreds of black-bordered trapezoidal windows framed to absorb warmth from the winter sun.",
      "Anchored on the west by the iconic cylindrical drum tower and on the east by the terraced plaza.",
    ],
    position3D: [-4.6, 5.4, 1.4],
    cameraPos3D: [-10.5, 8.2, 14.5],
    cameraTarget3D: [-3.5, 4.8, 0.5],
    freq: 432,
    colorHex: "#f8fafc",
  },
  {
    id: "golden-roofs",
    number: "03",
    nameBo: "གསེར་ཐོག་དང་རྒྱ་ཕིབས།",
    nameEn: "The Gilded Golden Roofs (Serdong)",
    subtitleBo: "གསེར་ཟངས་ཀྱི་རྒྱ་ཕིབས་དང་ཆོས་འཁོར་རི་དྭགས།",
    subtitleEn: "Gilded Bronze Pinnacles & Dharma Wheel Summit",
    elevation: "3,750m · Palace Pinnacle",
    eraBo: "སྲོལ་རྒྱུན་གསེར་ཟངས་ལག་རྩལ།",
    eraEn: "Master Gilded Copper Metallurgy",
    descriptionBo:
      "ཕོ་བྲང་གི་རྩེ་མོར་གསེར་ཟངས་ལས་གྲུབ་པའི་རྒྱ་ཕིབས་དང་། གཉྫི་ར། རྒྱལ་མཚན། ཆོས་ཀྱི་འཁོར་ལོ་དང་རི་དྭགས་ཕོ་མོ་བཅས་ཀྱིས་བརྒྱན་ཡོད། ཉི་མའི་འོད་ཟེར་འཕྲོས་ཚེ་ལྷ་སའི་སྐྱིད་ཆུའི་ལུང་གཞུང་ཡོངས་ལ་གསེར་འོད་འཕྲོ་བར་བྱེད།",
    descriptionEn:
      "Crowning the rooftop of the Red Palace are sweeping canopies crafted from fire-gilded bronze and copper. Adorned with auspicious makara dragon eaves, victory banners (gyaltsen), stupa finials (ganjira), and the eight-spoked Dharma Wheel flanked by two kneeling deer, these roofs catch the first rays of dawn across the Lhasa valley.",
    architectureBo: [
      "མེ་གསེར་བཏང་བའི་ཟངས་ཀྱི་རྒྱ་ཕིབས་དང་གསེར་གྱི་གཉྫི་ར།",
      "ཐོག་ཁའི་མཐའ་སྐོར་དུ་གསེར་གྱི་རྒྱལ་མཚན་དང་དྲིལ་བུ་ཆུང་ངུ།",
      "ཆོས་འཁོར་དང་རི་དྭགས་ཕོ་མོས་ཆོས་ཀྱི་འཁོར་ལོ་བསྐོར་བ་མཚོན་པ།",
    ],
    architectureEn: [
      "Hand-hammered copper tiles coated in mercury-free traditional gold leaf amalgam.",
      "Rooftop bronze victory banners (Dhvaja) protecting the four cardinal directions.",
      "Interconnected rooftop skywalks offering panoramic vistas of the surrounding snow peaks.",
    ],
    position3D: [0, 9.5, -0.1],
    cameraPos3D: [3.5, 12.2, 9.5],
    cameraTarget3D: [0, 8.2, -0.2],
    freq: 963,
    colorHex: "#fbbf24",
  },
  {
    id: "dharma-cave",
    number: "04",
    nameBo: "ཆོས་རྒྱལ་སྒྲུབ་ཕུག",
    nameEn: "Dharma King's Meditation Cave (Chogyal Drupuk)",
    subtitleBo: "དུས་རབས་ ༧ པའི་ཆོས་རྒྱལ་སྲོང་བཙན་སྒམ་པོའི་སྒྲུབ་ཕུག",
    subtitleEn: "7th-Century Sanctuary of King Songtsen Gampo",
    elevation: "3,685m · Bedrock Core",
    eraBo: "དུས་རབས་ ༧ པ། (ཕྱི་ལོ་ ༦༣༧)",
    eraEn: "7th Century (c. 637 CE)",
    descriptionBo:
      "དམར་པོ་རིའི་བྲག་རྡོའི་དཀྱིལ་དུ་ཆགས་པའི་ཆོས་རྒྱལ་སྒྲུབ་ཕུག་ནི་པོ་ཏ་ལའི་ནང་གི་ལོ་རྒྱུས་རྙིང་ཤོས་ཀྱི་གནས་མཆོག་ཡིན། འདིར་ཆོས་རྒྱལ་སྲོང་བཙན་སྒམ་པོ་དང་ཐོན་མི་སམ་བྷོ་ཊ་རྣམས་ཀྱིས་བོད་ཡིག་གསར་གཏོད་དང་དམ་པའི་ཆོས་ཀྱི་སྲོལ་བཏོད་མཛད།",
    descriptionEn:
      "Hewn directly into the natural crag of Marpo Ri at the very core of the palace, the Chogyal Drupuk is one of the two original 7th-century structures surviving from King Songtsen Gampo's reign. Within this intimate rock chamber, the Dharma King meditated and scholar Thonmi Sambhota codified the classical Tibetan alphabet.",
    architectureBo: [
      "དམར་པོ་རིའི་རང་བྱུང་བྲག་ཕུག་ལ་བརྟེན་ནས་བཞེངས་པའི་གནའ་བོའི་ལྷ་ཁང་།",
      "ཆོས་རྒྱལ་སྲོང་བཙན་སྒམ་པོ་དང་བཙུན་མོ་རྣམས་ཀྱི་སྐུ་བརྙན་རྙིང་མ།",
      "ལོ་ངོ་ ༡༣༠༠ ལྷག་གི་ལོ་རྒྱུས་ལྡན་པའི་བོད་ཀྱི་རིག་གཞུང་གི་འབྱུང་ཁུངས།",
    ],
    architectureEn: [
      "Built directly around the sacred summit boulder of Red Hill over 1,300 years ago.",
      "Preserves ancient polychrome clay sculptures of Songtsen Gampo, Princess Wencheng, and Bhrikuti.",
      "Symbolizes the birthplace of classical Tibetan grammar and literary civilization.",
    ],
    position3D: [2.2, 6.8, 0.5],
    cameraPos3D: [6.8, 8.8, 10.2],
    cameraTarget3D: [1.8, 6.2, 0.2],
    freq: 639,
    colorHex: "#f59e0b",
  },
  {
    id: "zigzag-stairs",
    number: "05",
    nameBo: "གཟིམ་ཆུང་ལམ་དང་བདེ་དགའ་རྫིང་།",
    nameEn: "Grand Zigzag Staircases & Deyangshar",
    subtitleBo: "རྡོ་སྐས་དཀར་པོ་དང་ཤར་གྱི་མདུན་ཐང་ཆེན་མོ།",
    subtitleEn: "Ceremonial Stone Ascents & Eastern Courtyard",
    elevation: "3,620m – 3,660m · Southern Slope",
    eraBo: "སྲོལ་རྒྱུན་རྡོ་སྐས་བཟོ་བཀོད།",
    eraEn: "Monumental Stone Switchbacks",
    descriptionBo:
      "དམར་པོ་རིའི་ལྷོ་ངོས་སུ་རྡོ་ལེབ་ཆེན་པོས་བསྐྲུན་པའི་རྡོ་སྐས་ཀྱག་ཀྱོག་རིང་པོ་རྣམས་ཀྱིས་ཞོལ་གྲོང་ནས་ཕོ་བྲང་དཀར་པོའི་བདེ་དགའ་རྫིང་བར་སྦྲེལ་ཡོད། རྡོ་སྐས་ཀྱི་ལག་སྐོར་དཀར་པོ་དང་སྟེང་གི་དམར་རྩིས་རི་ངོས་ལ་མཛེས་སྡུག་ཁྱད་པར་བ་སྟེར།",
    descriptionEn:
      "Sweeping across the southern face of the mountain in dramatic geometric switchbacks, these wide granite staircases allow pilgrims and horsemen a gentle, meditative ascent. Bordered by thick whitewashed parapets capped in crimson ochre, they lead to the 1,600-square-meter Deyangshar courtyard where sacred Cham dances were performed.",
    architectureBo: [
      "རི་ངོས་ཀྱི་གཟར་ཚད་དང་བསྟུན་ནས་བཟོས་པའི་རྡོ་སྐས་ཀྱག་ཀྱོག",
      "མཐའ་ལྕགས་དཀར་པོའི་སྟེང་དམར་རྩི་བྱུགས་པའི་མིག་དབང་འཕྲོག་པའི་ཐིག་རིས།",
      "ཤར་ངོས་ཀྱི་བདེ་དགའ་རྫིང་ནི་དུས་ཆེན་སྐབས་གར་འཆམ་འཁྲབ་སའི་ཐང་ཆེན།",
    ],
    architectureEn: [
      "Broad, low-riser granite steps flanked by stepped crimson-capped whitewashed balustrades.",
      "Three converging pathways separating pedestrian pilgrims and ceremonial processions.",
      "Opens onto Deyangshar, the sunlit eastern plaza framed by monastic quarters.",
    ],
    position3D: [2.8, 3.0, 4.2],
    cameraPos3D: [8.5, 6.0, 14.0],
    cameraTarget3D: [2.0, 3.0, 2.5],
    freq: 396,
    colorHex: "#fb923c",
  },
  {
    id: "shol-village",
    number: "06",
    nameBo: "ཞོལ་གྲོང་དང་ཞོལ་རྡོ་རིང་།",
    nameEn: "Shol Walled Village & Ancient Pillar",
    subtitleBo: "པོ་ཏ་ལའི་ཞོལ་གྱི་གྲོང་སྡེ་དང་པར་ཁང་།",
    subtitleEn: "Foot-of-the-Palace Settlement & Woodblock Press",
    elevation: "3,590m · Southern Base",
    eraBo: "དུས་རབས་ ༨ པ་ནས་ ༡༧ པ།",
    eraEn: "8th to 17th Century CE",
    descriptionBo:
      "ཕོ་བྲང་གི་འདབས་སུ་ཆགས་པའི་ཞོལ་གྲོང་ནི་ལྕགས་རི་དཀར་པོ་དང་རྒྱལ་སྒོ་གསུམ་གྱིས་བསྐོར་ཞིང་། དེར་ཞོལ་པར་ཁང་ཆེན་མོ་དང་། ལག་ཤེས་བཟོ་གྲྭ། ཕྱི་ལོ་ ༧༦༣ ལོར་བཙུགས་པའི་བོད་ཡིག་གི་རྡོ་རིང་རྙིང་ཤོས་ཞོལ་རྡོ་རིང་བཅས་བཞུགས་ཡོད།",
    descriptionEn:
      "Enclosed by a turreted perimeter wall with three traditional gateways at the foot of the hill, Shol Village served as the vibrant civic and artisanal counterpart to the palace above. It housed the renowned Shol Parkhang (woodblock printing house), treasury granaries, artisan guilds, and the 763 CE Shol Doring—the oldest known dated Tibetan stone pillar inscription.",
    architectureBo: [
      "ལྷོ་ངོས་ཀྱི་ལྕགས་རི་ཆེན་མོ་དང་བོད་ལུགས་ཀྱི་རྒྱལ་སྒོ་གསུམ།",
      "ཞོལ་པར་ཁང་དུ་ཤིང་པར་སྟོང་ཕྲག་མང་པོ་ཉར་ཚགས་དང་དཔར་བསྐྲུན།",
      "ཕྱི་ལོ་ ༧༦༣ ལོའི་ཞོལ་རྡོ་རིང་སྟེང་གི་གནའ་བོའི་བོད་ཡིག་ཡིག་རྙིང་།",
    ],
    architectureEn: [
      "Three monumental entrance gates crowned with golden-tiled roofs along the southern wall.",
      "Ochre and whitewashed courtyards housing traditional xylographic woodblock presses.",
      "Site of the 8th-century Shol Doring monolith inscribed with early classical Tibetan script.",
    ],
    position3D: [-0.8, 1.3, 6.2],
    cameraPos3D: [-2.5, 4.2, 15.5],
    cameraTarget3D: [-0.5, 1.5, 4.5],
    freq: 741,
    colorHex: "#facc15",
  },
  {
    id: "marpo-ri",
    number: "07",
    nameBo: "དམར་པོ་རི། · གླིང་ཕྲན་རྨང་གཞི།",
    nameEn: "Marpo Ri (Red Mountain) & Pine Groves",
    subtitleBo: "ལྷ་སའི་སྐྱིད་ཆུའི་ལུང་གཞུང་གི་བླ་རི།",
    subtitleEn: "Sacred Crag & Alpine Cypress Slopes",
    elevation: "3,590m – 3,700m · Sacred Hill",
    eraBo: "རང་བྱུང་ས་ཁམས་དང་སྐྱེད་ཚལ།",
    eraEn: "Sacred Himalayan Topography",
    descriptionBo:
      "དམར་པོ་རི་ནི་ལྷ་སའི་ཐང་གཞུང་དུ་གླང་པོ་ཆེ་ཉལ་བ་ལྟར་འབུར་དུ་ཐོན་པའི་རི་བོ་ཞིག་ཡིན་ལ། རི་ངོས་སུ་ཤུག་པ་དང་ཐང་ཤིང་སྔོ་ལྗང་དུ་སྐྱེས་ཤིང་། བོད་ཀྱི་རི་བོ་གསུམ་གྱི་ནང་ཚན་སྤྱན་རས་གཟིགས་ཀྱི་བླ་རིར་བརྩི་བའི་གནས་མཆོག་ཡིན།",
    descriptionEn:
      "Rising 130 meters above the flat Lhasa river valley like a reclining guardian elephant, Marpo Ri ('Red Mountain') is revered as one of the three protector hills of Lhasa. Its terraced red-granite cliffs and emerald juniper-pine groves merge seamlessly with the palace foundations so that rock and architecture become one.",
    architectureBo: [
      "བྲག་རི་དང་ཕོ་བྲང་གི་རྨང་གཞི་གཅིག་ཏུ་འདྲེས་པའི་ངོ་མཚར་བཟོ་བཀོད།",
      "རི་ངོས་ཀྱི་ཤུག་པ་དང་ལྗོན་ཤིང་གིས་དུས་བཞིར་སྔོ་ལྗང་གི་མཛེས་པ་སྟེར་བ།",
      "༣D གླིང་ཕྲན་དཔེ་གཟུགས་ཀྱིས་རི་དང་ཕོ་བྲང་གི་ཆ་ཚད་ཆ་ཚང་མངོན་པར་བྱེད།",
    ],
    architectureEn: [
      "Granite foundations interlocked directly into natural mountain fissures.",
      "Terraced groves of Himalayan cypress, pine, and willow softening the stone ramparts.",
      "Presented as a suspended 360° sculptural island diorama for complete spatial inspection.",
    ],
    position3D: [-5.2, 2.2, 3.8],
    cameraPos3D: [-13.5, 6.5, 13.5],
    cameraTarget3D: [0, 3.2, 0],
    freq: 852,
    colorHex: "#34d399",
  },
];
