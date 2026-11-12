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
    nameBo: "ཕོ་བྲང་དམར་པོ། (pho-brang dmar-po)",
    nameEn: "The Red Palace (pho-brang dmar-po)",
    subtitleBo: "ཕུན་ཚོགས་བཀོད་པ་དང་གསེར་གདུང་ཁག (phun-tshogs bkod-pa)",
    subtitleEn: "Central Puntsok Kodpa Sanctuary & Reliquary Stupa Halls",
    elevation: "3,700m · Central Summit (85m × 70m)",
    eraBo: "དུས་རབས་ ༡༧ པ། (༡༦༩༠–༡༦༩༤)",
    eraEn: "17th Century (1690–1694 CE)",
    descriptionBo:
      "ཕོ་བྲང་དམར་པོ་ (pho-brang dmar-po) ནི་པོ་ཏ་ལའི་དབུས་སུ་བརྗིད་ཉམས་དང་ལྡན་པར་བཞེངས་ཤིང་། དབུས་ཀྱི་ཕུན་ཚོགས་བཀོད་པའི་ (phun-tshogs bkod-pa) ནང་དུ་ཚོམས་ཆེན་ནུབ་སྲིད་ཞིའི་ཕུན་ཚོགས་ (tshoms-chen nub) དང་། རྒྱལ་དབང་སྐུ་ཕྲེང་རིམ་བྱོན་གྱི་གསེར་གདུང་ (gser-gdung) ཁག བཀའ་འགྱུར་དང་བསྟན་འགྱུར་གྱི་གསུང་རབ་སྟོང་ཕྲག་མང་པོ་བཞུགས་པའི་གནས་མཆོག་ཡིན།",
    descriptionEn:
      "Rising at the heart of the complex in deep mineral crimson, the Red Palace (pho-brang dmar-po) centers around the three-tiered Puntsok Kodpa (phun-tshogs bkod-pa) sanctuary. Its upper stories feature continuous bands of bound tamarisk twigs (spen-ma / penba) studded with gilded brass mirror discs (spen-bad / me-long) and draped with black yak-hair portal curtains (snam-bu), housing the Great West Assembly Hall (tshoms-chen nub) and eight golden reliquary stupas (gser-gdung).",
    architectureBo: [
      "ཕྱིའི་རྩིགས་ངོས་ལ་སྤེན་མ་ (spen-ma) དམར་པོའི་མཐའ་རྒྱན་དང་གསེར་ཟངས་ཀྱི་སྤེན་བད། (spen-bad)",
      "སྒོ་ཆེན་ཁག་ལ་སྣམ་བུ་ (snam-bu) ནག་པོའི་སྒོ་ཡོལ་དང་ཤིང་ཚག་ (shing-tshag) བཀོད་པ།",
      "ནང་དུ་ཀ་བ་བརྒྱ་ཕྲག་ལྷག་ཡོད་པའི་ཚོམས་ཆེན་ནུབ་ (tshoms-chen nub) དང་དཀྱིལ་འཁོར་ཁང་།",
    ],
    architectureEn: [
      "Deep crimson mineral-washed walls crowned with compacted spen-ma (tamarisk) friezes and gilded spen-bad discs.",
      "Stepped three-tier Puntsok Kodpa (phun-tshogs bkod-pa) core with four vertical timber bay window columns.",
      "Adorned with woven black yak-hair portal curtains (snam-bu) and hand-carved bracketed beams without iron nails.",
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
    nameBo: "ཕོ་བྲང་དཀར་པོ་དང་གོས་སྐུའི་རྩིག་ངོས།",
    nameEn: "The White Palace (pho-brang dkar-po) & Gos-sku Wall",
    subtitleBo: "ཚོམས་ཆེན་ཤར་དང་གོས་སྐུ་བཤམས་སའི་རྩིག་ངོས་ཆེན་མོ། (gos-sku)",
    subtitleEn: "Alabaster Fortress Wings & Ceremonial Gos-sku Thangka Wall",
    elevation: "3,660m · East & West Ridges + South Bastion",
    eraBo: "དུས་རབས་ ༡༧ པ། (༡༦༤༥–༡༦༤༨)",
    eraEn: "17th Century (1645–1648 CE)",
    descriptionBo:
      "ཕོ་བྲང་དཀར་པོ་ (pho-brang dkar-po) ནི་ས་དཀར་དང་འོ་མ། སྦྲང་རྩི། གུར་གུམ་བཅས་བསྲེས་ཏེ་བྱུགས་ཤིང་། དེའི་ནང་དུ་ཚོམས་ཆེན་ཤར་ (tshoms-chen shar) དང་ཉི་འོད་གཟིམ་ཆུང་ (nyi-'od gzim-chung) ཆགས་ཡོད། ཕོ་བྲང་དམར་པོའི་མདུན་ངོས་ཀྱི་རྩིག་ངོས་དཀར་པོ་ཆེན་མོ་ནི་དུས་ཆེན་སྐབས་གོས་སྐུ་ (gos-sku) ཆེན་མོ་བཤམས་སའི་གོས་སྐུའི་རྩིག་ངོས་ཡིན།",
    descriptionEn:
      "Flanking the central sanctuary, the White Palace (pho-brang dkar-po) is annually whitewashed with lime, milk, honey, and saffron. Directly in front of and beneath the Red Palace rises the monumental smooth white Goku Wall (gos-sku, literally 'cloth image'), the sacred windowless facade where colossal silk appliqué thangkas are unfurled during the Sertreng (tshogs-mchod ser-sbreng) and Zhotön (zho-ston) Buddhist festivals.",
    architectureBo: [
      "ཕོ་བྲང་དམར་པོའི་མདུན་དུ་གོས་སྐུ་ (gos-sku · 'cloth image') ཆེན་མོ་བཤམས་སའི་རྩིག་ངོས་དཀར་པོ།",
      "སྒེའུ་ཁུང་གྲུ་བཞི་ནག་རིས་ཅན་ལ་ཤིང་ཚག་ (shing-tshag) དང་ཤམ་བུ་ (sham-bu) བཀལ་བ།",
      "རྡོ་རྩིག་མཐུག་པོ་གྱེན་དུ་ཕྲ་རུ་འགྲོ་བའི་བོད་ཀྱི་མཁར་རྫོང་བཟོ་བཀོད།",
    ],
    architectureEn: [
      "Monumental smooth white Gos-sku Wall (gos-sku, 'cloth image') in front of the Red Palace for unfurling giant festival thangkas.",
      "Battered granite walls (3–5m thick at base) with black-bordered trapezoidal windows, shing-tsak lintels, and sham-bu valences.",
      "Anchored on the west by the cylindrical drum bastion and on the top floor by the sunlit nyi-'od gzim-chung chambers.",
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
    nameBo: "གསེར་ཐོག་དང་རྒྱ་ཕིབས། (rgya-phibs)",
    nameEn: "The Seven Golden Roofs (gser-thog · rgya-phibs)",
    subtitleBo: "གསེར་ཟངས་ཀྱི་རྒྱ་ཕིབས་དང་ཆོས་འཁོར་རི་དྭགས། (chos-'khor)",
    subtitleEn: "Gilded Bronze Gyaphib Canopies, Ganjira & Chu-srin Gargoyles",
    elevation: "3,750m – 3,767m · Palace Pinnacle",
    eraBo: "སྲོལ་རྒྱུན་གསེར་ཟངས་ལག་རྩལ།",
    eraEn: "Master Gilded Copper Metallurgy",
    descriptionBo:
      "ཕོ་བྲང་གི་རྩེ་མོར་གསེར་ཟངས་ལས་གྲུབ་པའི་རྒྱ་ཕིབས་ (rgya-phibs) བདུན་དང་། གཉྫི་ར་ (ganjira)། རྒྱལ་མཚན་ (rgyal-mtshan)། ཆུ་སྲིན་ (chu-srin) གྱི་མཆུ་ཏོ། ཆོས་འཁོར་རི་དྭགས་ (chos-'khor ri-dwags) དང་ཉི་ཟླ་ (nyi-zla) བཅས་ཀྱིས་བརྒྱན་ཡོད།",
    descriptionEn:
      "Crowning the rooftop of the Red Palace over the reliquary tombs (gser-gdung) are seven sweeping canopies (rgya-phibs / Gyaphib) crafted from fire-gilded bronze. They are adorned with upturned sea-dragon corner spouts (chu-srin / Makara), cylindrical victory banners (rgyal-mtshan), treasure-vase finials (bum-pa / ganjira), and the Dharma Wheel with kneeling deer (chos-'khor ri-dwags).",
    architectureBo: [
      "མེ་གསེར་བཏང་བའི་ཟངས་ཀྱི་རྒྱ་ཕིབས་ (rgya-phibs) བདུན་དང་གསེར་གྱི་གཉྫི་ར། (ganjira)",
      "རྒྱ་ཕིབས་ཀྱི་ཟུར་བཞིར་ཆུ་སྲིན་ (chu-srin) གྱི་ཁ་དང་ཐོག་ཁའི་རྒྱལ་མཚན། (rgyal-mtshan)",
      "ཆོས་འཁོར་རི་དྭགས་ (chos-'khor ri-dwags) དང་ཉི་ཟླའི་ (nyi-zla) ཏོག",
    ],
    architectureEn: [
      "Seven fire-gilded copper-bronze canopies (rgya-phibs) crowning the funerary stupas (gser-gdung) of the Dalai Lamas.",
      "Corner eaves protected by bronze chu-srin (Makara) dragon-fish spouts and black-and-gold rgyal-mtshan victory banners.",
      "Surmounted by ganjira finials, the eight-spoked chos-'khor (Dharma Wheel), and the sacred nyi-zla (Sun & Moon) emblem.",
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
    nameBo: "ཆོས་རྒྱལ་སྒྲུབ་ཕུག (chos-rgyal sgrub-phug)",
    nameEn: "Dharma King's Cave (chos-rgyal sgrub-phug)",
    subtitleBo: "ཆོས་རྒྱལ་སྲོང་བཙན་སྒམ་པོའི་སྒྲུབ་ཕུག་དང་འཕགས་པ་ལྷ་ཁང་།",
    subtitleEn: "7th-Century Sanctuary of Songtsen Gampo & Phakpa Lhakhang",
    elevation: "3,685m · Bedrock Summit Core",
    eraBo: "དུས་རབས་ ༧ པ། (ཕྱི་ལོ་ ༦༣༧)",
    eraEn: "7th Century (c. 637 CE)",
    descriptionBo:
      "དམར་པོ་རིའི་ (dmar-po ri) བྲག་རྡོའི་དཀྱིལ་དུ་ཆགས་པའི་ཆོས་རྒྱལ་སྒྲུབ་ཕུག་ (chos-rgyal sgrub-phug) དང་འཕགས་པ་ལྷ་ཁང་ ('phags-pa lha-khang) ནི་པོ་ཏ་ལའི་ནང་གི་ལོ་རྒྱུས་རྙིང་ཤོས་ཀྱི་གནས་མཆོག་ཡིན། འདིར་ཆོས་རྒྱལ་སྲོང་བཙན་སྒམ་པོས་སྒྲུབ་པ་ཉམས་ལེན་མཛད།",
    descriptionEn:
      "Hewn directly into the natural granite crag of Marpo Ri (dmar-po ri) at the core of the palace, the Chögyal Drupuk (chos-rgyal sgrub-phug) and the adjoining Phakpa Lhakhang ('phags-pa lha-khang) are the two original 7th-century sanctuaries surviving from King Songtsen Gampo's (srong-btsan sgam-po) fortress.",
    architectureBo: [
      "དམར་པོ་རིའི་ (dmar-po ri) རང་བྱུང་བྲག་ཕུག་ལ་བརྟེན་ནས་བཞེངས་པའི་གནའ་བོའི་ལྷ་ཁང་།",
      "ཆོས་རྒྱལ་སྲོང་བཙན་སྒམ་པོ་ (srong-btsan sgam-po) དང་བཙུན་མོ་རྣམས་ཀྱི་སྐུ་བརྙན་རྙིང་མ།",
      "འཕགས་པ་ལྷ་ཁང་ ('phags-pa lha-khang) དང་ལོ་ངོ་ ༡༣༠༠ ལྷག་གི་ལོ་རྒྱུས་རྟེན་གཙོ།",
    ],
    architectureEn: [
      "Built directly around the sacred summit boulder of dmar-po ri over 1,300 years ago.",
      "Preserves ancient polychrome clay images of srong-btsan sgam-po, Princess Wencheng, and Bhrikuti.",
      "Paired with the 'phags-pa lha-khang, the oldest timber-and-stone chapel of the Potala complex.",
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
    nameBo: "གཟིམ་ཆུང་ལམ་དང་བདེ་དབྱངས་ཤར། (bde-dbyangs shar)",
    nameEn: "Zigzag Staircases (gzim-chung lam) & Deyangshar",
    subtitleBo: "རྡོ་སྐས་དཀར་པོ་དང་ཤར་གྱི་བདེ་དབྱངས་ཤར་མདུན་ཐང་།",
    subtitleEn: "Ceremonial Switchbacks & Deyangshar (bde-dbyangs shar) Plaza",
    elevation: "3,620m – 3,660m · Southern Slope & East Terrace",
    eraBo: "སྲོལ་རྒྱུན་རྡོ་སྐས་དང་ཨར་གའི་ཐང་ཆེན།",
    eraEn: "Monumental Stone Switchbacks & Ar-ga Terrace",
    descriptionBo:
      "དམར་པོ་རིའི་ལྷོ་ངོས་ཀྱི་གཟིམ་ཆུང་ལམ་ (gzim-chung lam) རྡོ་སྐས་ཀྱག་ཀྱོག་རིང་པོ་རྣམས་ཀྱིས་ཞོལ་གྲོང་ནས་ཕོ་བྲང་དཀར་པོའི་བདེ་དབྱངས་ཤར་ (bde-dbyangs shar) བར་སྦྲེལ་ཡོད། ཐང་ཆེན་འདིའི་ཨར་ག་ (ar-ga) བཏིང་བའི་རྡོ་གཅལ་དང་གཞུ་གདོང་ (gzhu-gdong) ཁྱམས་རའི་དབུས་སུ་དར་ཆེན་ (dar-chen) དང་རླུང་རྟ་ (rlung-rta) བསྐྱོད་ཅིང་། གར་འཆམ་ (gar-'cham) འཁྲབ་སའི་གནས་ཡིན།",
    descriptionEn:
      "Sweeping across the southern face in geometric switchbacks, the ceremonial staircases (gzim-chung lam) ascend beneath the Gos-sku Wall to the 1,600-square-meter Deyangshar courtyard (bde-dbyangs shar). Paved with polished waterproof ar-ga stone mortar and framed by vermilion pillared galleries (gzhu-gdong), the plaza features a tall prayer flagpole (dar-chen), strings of wind-horse flags (rlung-rta), and hosts sacred Cham dances (gar-'cham).",
    architectureBo: [
      "ཨར་ག་ (ar-ga) བཏིང་བའི་བདེ་དབྱངས་ཤར་ (bde-dbyangs shar) ཐང་ཆེན་དང་གཞུ་གདོང་ (gzhu-gdong) ཁྱམས་ར།",
      "ཐང་ཆེན་དབུས་ཀྱི་དར་ཆེན་ (dar-chen) དང་ཁ་དོག་ལྔ་ལྡན་གྱི་རླུང་རྟ། (rlung-rta)",
      "མཐའ་ལྕགས་དཀར་པོའི་སྟེང་དམར་རྩི་བྱུགས་པའི་གཟིམ་ཆུང་ལམ་ (gzim-chung lam) རྡོ་སྐས།",
    ],
    architectureEn: [
      "Broad granite switchbacks (gzim-chung lam) bordered by crimson-capped whitewashed balustrades.",
      "Opens onto bde-dbyangs shar courtyard, surfaced in hand-tamped ar-ga lime-stone terrazzo.",
      "Framed by vermilion gzhu-gdong galleries, central dar-chen flagpole, and five-color rlung-rta prayer flags.",
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
    nameBo: "ཞོལ་གྲོང་དང་ཞོལ་རྡོ་རིང་། (zhol rdo-ring)",
    nameEn: "Shol Village (zhol-grong) & Doring Pillar",
    subtitleBo: "པོ་ཏ་ལའི་ཞོལ་གྱི་གྲོང་སྡེ་དང་ཞོལ་པར་ཁང་། (zhol par-khang)",
    subtitleEn: "Walled Base Settlement, Shol Parkhang & 763 CE Monolith",
    elevation: "3,590m · Southern Base (360m × 140m)",
    eraBo: "དུས་རབས་ ༨ པ་ནས་ ༡༧ པ།",
    eraEn: "8th to 17th Century CE",
    descriptionBo:
      "ཕོ་བྲང་གི་འདབས་སུ་ཆགས་པའི་ཞོལ་གྲོང་ (zhol-grong) ནི་ལྕགས་རི་དཀར་པོ་དང་རྒྱལ་སྒོ་གསུམ་གྱིས་བསྐོར་ཞིང་། དེར་ཞོལ་པར་ཁང་ (zhol par-khang) ཆེན་མོ་དང་། མཆོད་རྟེན་ (mchod-rten) དཀར་པོ། ཕྱི་ལོ་ ༧༦༣ ལོར་བཙུགས་པའི་བོད་ཡིག་གི་རྡོ་རིང་རྙིང་ཤོས་ཞོལ་རྡོ་རིང་ (zhol rdo-ring) བཅས་བཞུགས་ཡོད།",
    descriptionEn:
      "Enclosed by a turreted perimeter wall with three traditional gateways at the foot of the hill, Shol Village (zhol-grong) housed the renowned Shol Parkhang (zhol par-khang) woodblock printing house, white reliquary stupas (mchod-rten), and the 763 CE Shol Doring (zhol rdo-ring)—the oldest dated classical Tibetan stone inscription (yi-ge).",
    architectureBo: [
      "ཕྱི་ལོ་ ༧༦༣ ལོའི་ཞོལ་རྡོ་རིང་ (zhol rdo-ring) སྟེང་གི་དབུ་ཅན་ (dbu-can) ཡིག་རྙིང་།",
      "ཞོལ་པར་ཁང་ (zhol par-khang) དང་ལྷོ་ངོས་ཀྱི་མཆོད་རྟེན་ (mchod-rten) དཀར་པོ།",
      "ལྷོ་ངོས་ཀྱི་ལྕགས་རི་ཆེན་མོ་དང་བོད་ལུགས་ཀྱི་རྒྱལ་སྒོ་གསུམ།",
    ],
    architectureEn: [
      "Site of the 763 CE zhol rdo-ring monolith inscribed in early classical Tibetan dbu-can script.",
      "Ochre and whitewashed courtyards housing the traditional zhol par-khang xylographic printing press.",
      "Flanked by whitewashed Tibetan stupas (mchod-rten) and three golden-roofed southern gateways.",
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
    nameBo: "དམར་པོ་རི། · གླིང་སྐོར་དང་མ་ཎི་འཁོར་ལོ།",
    nameEn: "Marpo Ri (dmar-po ri) & Lingkhor Path",
    subtitleBo: "ལྷ་སའི་བླ་རི་དམར་པོ་རི་དང་གླིང་སྐོར་མ་ཎི་འཁོར་ལོ། (gling-skor)",
    subtitleEn: "Sacred Red Hill Bedrock, Lingkhor Path & Mani Prayer Wheels",
    elevation: "3,590m – 3,700m · Sacred Crag & Pilgrim Circuit",
    eraBo: "རང་བྱུང་བྲག་རི་དང་གླིང་སྐོར་ལམ།",
    eraEn: "Sacred Himalayan Topography & Pilgrim Circuit",
    descriptionBo:
      "དམར་པོ་རི་ (dmar-po ri) ནི་ལྷ་སའི་ཐང་གཞུང་དུ་གླང་པོ་ཆེ་ཉལ་བ་ལྟར་འབུར་དུ་ཐོན་པའི་སྤྱན་རས་གཟིགས་ཀྱི་བླ་རི་ཡིན། བྲག་རིའི་རྨང་གཞི་དང་ཕོ་བྲང་གི་རྡོ་རྩིག་གཅིག་ཏུ་འདྲེས་ཤིང་། མཐའ་སྐོར་གྱི་གླིང་སྐོར་ (gling-skor) ལམ་དུ་གསེར་གྱི་མ་ཎི་འཁོར་ལོ་ (ma-ṇi 'khor-lo) དང་བསང་ཁང་ (bsang-khang) བསྒྲིགས་ཡོད།",
    descriptionEn:
      "Rising 130 meters above the Lhasa valley like a reclining guardian elephant, Marpo Ri (dmar-po ri, 'Red Mountain') is revered as the sacred hill of Avalokiteśvara. Its fractured granite crags interlock directly with the battered palace foundations, encircled at the base by the Lingkhor (gling-skor) circumambulation path lined with spinning golden prayer wheels (ma-ṇi 'khor-lo) and ritual incense burners (bsang-khang).",
    architectureBo: [
      "དམར་པོ་རིའི་ (dmar-po ri) བྲག་རི་དང་ཕོ་བྲང་གི་རྨང་གཞི་གཅིག་ཏུ་འདྲེས་པ།",
      "གླིང་སྐོར་ (gling-skor) ལམ་གྱི་གསེར་ཟངས་མ་ཎི་འཁོར་ལོ་ (ma-ṇi 'khor-lo) དང་བསང་ཁང་། (bsang-khang)",
      "རི་ངོས་ཀྱི་ཤུག་པ་ (shug-pa) དང་ལྗོན་ཤིང་གིས་བསྐོར་བའི་༣D གླིང་ཕྲན་དཔེ་གཟུགས།",
    ],
    architectureEn: [
      "Fractured granite outcrops of dmar-po ri emerging directly into the battered palace walls.",
      "Encircled by the gling-skor pilgrim path with instanced golden ma-ṇi 'khor-lo prayer wheels and bsang-khang burners.",
      "Terraced groves of Himalayan juniper (shug-pa) and cypress on a 360° sculptural island pedestal.",
    ],
    position3D: [-5.2, 2.2, 3.8],
    cameraPos3D: [-13.5, 6.5, 13.5],
    cameraTarget3D: [0, 3.2, 0],
    freq: 852,
    colorHex: "#34d399",
  },
];
