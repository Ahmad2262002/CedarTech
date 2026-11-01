import { SupportedLocale } from '../context/LanguageContext';
import { translateSpecKey, translateSpecValue } from './specTranslations';

export interface LocalizedProductResult {
  name: string;
  description: string;
  shortDescription?: string;
  warrantyInfo?: string;
  specifications: Record<string, string>;
}

const CATEGORY_DICTIONARY: Record<string, Record<SupportedLocale, { name: string; description?: string }>> = {
  'cell-phones': {
    en: { name: 'Smartphones', description: 'Flagship smartphones, iPhones & Android devices' },
    ar: { name: 'هواتف ذكية', description: 'أحدث الهواتف الذكية من آيفون وسامسونج وغيرها' },
    fr: { name: 'Smartphones & Mobiles', description: 'Smartphones phares, iPhones et Android' },
    it: { name: 'Smartphone e Cellulari', description: 'Smartphone top di gamma, iPhone e Android' },
    es: { name: 'Smartphones y Móviles', description: 'Smartphones insignia, iPhones y Android' },
    tr: { name: 'Akıllı Telefonlar', description: 'Amiral gemisi telefonlar, iPhone ve Android' },
  },
  'laptops': {
    en: { name: 'Laptops', description: 'MacBooks, gaming laptops & pro workstations' },
    ar: { name: 'لابتوبات ومحمولات', description: 'ماك بوك، لابتوبات ألعاب ومحطات عمل احترافية' },
    fr: { name: 'Ordinateurs Portables', description: 'MacBooks, PC portables gaming et stations de travail' },
    it: { name: 'Notebook e Laptop', description: 'MacBook, laptop da gioco e workstation' },
    es: { name: 'Ordenadores Portátiles', description: 'MacBooks, portátiles gaming y estaciones de trabajo' },
    tr: { name: 'Dizüstü Bilgisayarlar', description: 'MacBook\'lar, oyun bilgisayarları ve iş istasyonları' },
  },
  'desktops-rigs': {
    en: { name: 'Custom PCs', description: 'Custom desktop rigs & high-end workstations' },
    ar: { name: 'كمبيوترات مخصصة', description: 'تجميعات كمبيوتر ألعاب احترافية ومحطات عمل' },
    fr: { name: 'PC Sur Mesure', description: 'Configurations PC gaming et stations de travail' },
    it: { name: 'PC Su Misura', description: 'PC da gioco assemblati e workstation' },
    es: { name: 'PCs a Medida', description: 'Equipos PC gaming y estaciones de trabajo' },
    tr: { name: 'Özel Masaüstü PC', description: 'Özel toplama oyun ve iş bilgisayarları' },
  },
  'gaming-gear': {
    en: { name: 'Gaming Rigs', description: 'High-FPS gaming gear, GPUs & accessories' },
    ar: { name: 'أجهزة وتجهيزات القيمنق', description: 'كروت شاشة عالية الأداء وتجهيزات الألعاب' },
    fr: { name: 'Configurations Gaming', description: 'Matériel gaming haute performance, cartes graphiques' },
    it: { name: 'Postazioni Gaming', description: 'Hardware da gioco ad alte prestazioni e GPU' },
    es: { name: 'Equipos Gaming', description: 'Hardware gaming de alto rendimiento y tarjetas gráficas' },
    tr: { name: 'Oyuncu Ekipmanları', description: 'Yüksek performanslı oyun donanımları ve ekran kartları' },
  },
  'audio-anc': {
    en: { name: 'Audio & ANC', description: 'AirPods, Sony ANC headphones & premium audio' },
    ar: { name: 'صوتيات وسماعات', description: 'سماعات آيربودز، سوني مع إلغاء الضوضاء' },
    fr: { name: 'Audio & Casques ANC', description: 'Casques à réduction de bruit, AirPods et audio premium' },
    it: { name: 'Audio e Cuffie ANC', description: 'Cuffie con cancellazione del rumore e AirPods' },
    es: { name: 'Audio y Auriculares ANC', description: 'Auriculares con cancelación de ruido y AirPods' },
    tr: { name: 'Ses ve Kulaklıklar', description: 'Gürültü engelleyici kulaklıklar ve AirPods' },
  },
  'components-parts': {
    en: { name: 'Components', description: 'DDR5 RAM, Gen4 NVMe SSDs, GPUs & PSUs' },
    ar: { name: 'قطع وتطوير الكمبيوتر', description: 'ذاكرة رام DDR5، أقراص SSD، كروت شاشة ومزودات طاقة' },
    fr: { name: 'Composants & Pièces', description: 'RAM DDR5, SSD NVMe, cartes graphiques et alims' },
    it: { name: 'Componenti e Parti', description: 'RAM DDR5, SSD NVMe Gen4, GPU e alimentatori' },
    es: { name: 'Componentes y Piezas', description: 'Memoria RAM DDR5, SSDs NVMe, GPUs y fuentes' },
    tr: { name: 'Bilgisayar Parçaları', description: 'DDR5 RAM, Gen4 NVMe SSD\'ler, ekran kartları' },
  },
  'tablets': {
    en: { name: 'Tablets & iPads', description: 'iPad Pro, Galaxy Tab & accessories' },
    ar: { name: 'أجهزة لوحية وآيباد', description: 'آيباد برو، جالكسي تاب وملحقاتها' },
    fr: { name: 'Tablettes & iPads', description: 'iPad Pro, Galaxy Tab et accessoires' },
    it: { name: 'Tablet e iPad', description: 'iPad Pro, Galaxy Tab e accessori' },
    es: { name: 'Tabletas e iPads', description: 'iPad Pro, Galaxy Tab y accesorios' },
    tr: { name: 'Tabletler ve iPad\'ler', description: 'iPad Pro, Galaxy Tab ve aksesuarlar' },
  },
  'accessories': {
    en: { name: 'Accessories & Chargers', description: 'MagSafe chargers, cables & adapters' },
    ar: { name: 'الملحقات والشواحن', description: 'شواحن ماج سيف، كابلات ومحولات' },
    fr: { name: 'Accessoires & Chargeurs', description: 'Chargeurs MagSafe, câbles et adaptateurs' },
    it: { name: 'Accessori e Caricatori', description: 'Caricatori MagSafe, cavi e adattatori' },
    es: { name: 'Accesorios y Cargadores', description: 'Cargadores MagSafe, cables y adaptadores' },
    tr: { name: 'Aksesuarlar ve Şarj Aletleri', description: 'MagSafe şarj aletleri, kablolar ve adaptörler' },
  },
  'smart-wearables': {
    en: { name: 'Smart Wearables', description: 'Apple Watch, Galaxy Watch & fitness bands' },
    ar: { name: 'ساعات وسوارات ذكية', description: 'آبل ووتش، جالكسي ووتش وسوارات اللياقة' },
    fr: { name: 'Montres & Bracelets Connectés', description: 'Apple Watch, Galaxy Watch et bracelets de sport' },
    it: { name: 'Smartwatch e Wearable', description: 'Apple Watch, Galaxy Watch e fitness tracker' },
    es: { name: 'Relojes y Pulseras Inteligentes', description: 'Apple Watch, Galaxy Watch y pulseras de actividad' },
    tr: { name: 'Akıllı Saatler ve Bileklikler', description: 'Apple Watch, Galaxy Watch ve akıllı bileklikler' },
  },
  'wearables': {
    en: { name: 'Smart Wearables', description: 'Apple Watch, Galaxy Watch & fitness bands' },
    ar: { name: 'ساعات وسوارات ذكية', description: 'آبل ووتش، جالكسي ووتش وسوارات اللياقة' },
    fr: { name: 'Montres & Bracelets Connectés', description: 'Apple Watch, Galaxy Watch et bracelets de sport' },
    it: { name: 'Smartwatch e Wearable', description: 'Apple Watch, Galaxy Watch e fitness tracker' },
    es: { name: 'Relojes y Pulseras Inteligentes', description: 'Apple Watch, Galaxy Watch y pulseras de actividad' },
    tr: { name: 'Akıllı Saatler ve Bileklikler', description: 'Apple Watch, Galaxy Watch ve akıllı bileklikler' },
  },
  'networks': {
    en: { name: 'Networks & Routers', description: 'Wi-Fi 7 routers, Mesh systems & switches' },
    ar: { name: 'شبكات وراوترات', description: 'راوترات واي فاي 7، أنظمة مش وموزعات شبكة' },
    fr: { name: 'Réseaux & Routeurs', description: 'Routeurs Wi-Fi 7, systèmes Mesh et switches' },
    it: { name: 'Reti e Router', description: 'Router Wi-Fi 7, sistemi Mesh e switch' },
    es: { name: 'Redes y Enrutadores', description: 'Enrutadores Wi-Fi 7, sistemas Mesh y switches' },
    tr: { name: 'Ağ ve Yönlendiriciler', description: 'Wi-Fi 7 yönlendiriciler, Mesh sistemleri ve anahtarlar' },
  },
  'networking': {
    en: { name: 'Networks & Routers', description: 'Wi-Fi 7 routers, Mesh systems & switches' },
    ar: { name: 'شبكات وراوترات', description: 'راوترات واي فاي 7، أنظمة مش وموزعات شبكة' },
    fr: { name: 'Réseaux & Routeurs', description: 'Routeurs Wi-Fi 7, systèmes Mesh et switches' },
    it: { name: 'Reti e Router', description: 'Router Wi-Fi 7, sistemi Mesh e switch' },
    es: { name: 'Redes y Enrutadores', description: 'Enrutadores Wi-Fi 7, sistemas Mesh y switches' },
    tr: { name: 'Ağ ve Yönlendiriciler', description: 'Wi-Fi 7 yönlendiriciler, Mesh sistemleri ve anahtarlar' },
  },
  'storage-nas': {
    en: { name: 'Storage & NAS', description: 'Synology NAS, external SSDs & enterprise storage' },
    ar: { name: 'وحدات تخزين وNAS', description: 'أجهزة سينولوجي NAS، أقراص SSD خارجية ووحدات تخزين' },
    fr: { name: 'Stockage & NAS', description: 'Serveurs NAS Synology, SSD externes et stockage' },
    it: { name: 'Archiviazione e NAS', description: 'NAS Synology, SSD esterni e archiviazione aziendale' },
    es: { name: 'Almacenamiento y NAS', description: 'Servidores NAS Synology, SSDs externos y almacenamiento' },
    tr: { name: 'Depolama ve NAS', description: 'Synology NAS sunucuları, harici SSD\'ler ve depolama' },
  },
  'storage': {
    en: { name: 'Storage & NAS', description: 'Synology NAS, external SSDs & enterprise storage' },
    ar: { name: 'وحدات تخزين وNAS', description: 'أجهزة سينولوجي NAS، أقراص SSD خارجية ووحدات تخزين' },
    fr: { name: 'Stockage & NAS', description: 'Serveurs NAS Synology, SSD externes et stockage' },
    it: { name: 'Archiviazione e NAS', description: 'NAS Synology, SSD esterni e archiviazione aziendale' },
    es: { name: 'Almacenamiento y NAS', description: 'Servidores NAS Synology, SSDs externos y almacenamiento' },
    tr: { name: 'Depolama ve NAS', description: 'Synology NAS sunucuları, harici SSD\'ler ve depolama' },
  },
  'monitors-displays': {
    en: { name: 'Monitors & Displays', description: 'OLED 240Hz gaming monitors & 4K pro displays' },
    ar: { name: 'شاشات وعروض', description: 'شاشات قيمنق أوليد 240 هرتز وشاشات احترافية 4K' },
    fr: { name: 'Écrans & Moniteurs', description: 'Écrans gaming OLED 240Hz et moniteurs pro 4K' },
    it: { name: 'Monitor e Display', description: 'Monitor da gioco OLED 240Hz e schermi 4K' },
    es: { name: 'Monitores y Pantallas', description: 'Monitores gaming OLED 240Hz y pantallas 4K' },
    tr: { name: 'Monitörler ve Ekranlar', description: 'OLED 240Hz oyuncu monitörleri ve 4K profesyonel ekranlar' },
  },
  'monitors': {
    en: { name: 'Monitors & Displays', description: 'OLED 240Hz gaming monitors & 4K pro displays' },
    ar: { name: 'شاشات وعروض', description: 'شاشات قيمنق أوليد 240 هرتز وشاشات احترافية 4K' },
    fr: { name: 'Écrans & Moniteurs', description: 'Écrans gaming OLED 240Hz et moniteurs pro 4K' },
    it: { name: 'Monitor e Display', description: 'Monitor da gioco OLED 240Hz e schermi 4K' },
    es: { name: 'Monitores y Pantallas', description: 'Monitores gaming OLED 240Hz y pantallas 4K' },
    tr: { name: 'Monitörler ve Ekranlar', description: 'OLED 240Hz oyuncu monitörleri ve 4K profesyonel ekranlar' },
  }
};

const WARRANTY_DICTIONARY: Record<string, Record<SupportedLocale, string>> = {
  '1 year official warranty': {
    en: '1 Year Official Warranty',
    ar: 'كفالة رسمية لمدة سنة',
    fr: 'Garantie officielle de 1 an',
    it: 'Garanzia ufficiale di 1 anno',
    es: 'Garantía oficial de 1 año',
    tr: '1 Yıl Resmi Garanti'
  },
  '1 year local warranty': {
    en: '1 Year Local Warranty',
    ar: 'كفالة محلية لمدة سنة',
    fr: 'Garantie locale de 1 an',
    it: 'Garanzia locale de 1 an',
    es: 'Garantía local de 1 año',
    tr: '1 Yıl Yerel Garanti'
  },
  '2 years warranty': {
    en: '2 Years Warranty',
    ar: 'كفالة سنتين',
    fr: 'Garantie 2 ans',
    it: 'Garanzia di 2 anni',
    es: 'Garantía de 2 años',
    tr: '2 Yıl Garanti'
  },
  'official warranty': {
    en: 'Official Warranty',
    ar: 'كفالة رسمية',
    fr: 'Garantie officielle',
    it: 'Garanzia ufficiale',
    es: 'Garantía oficial',
    tr: 'Resmi Garanti'
  }
};

/**
 * Powerful automatic translation engine for English product titles and descriptions
 */
function translateProductTerm(text: string, locale: SupportedLocale): string {
  if (!text || locale === 'en') return text;

  let result = text;

  // Replacements dictionary for phrases and terms
  const TERM_MAP: Array<{ regex: RegExp; map: Record<SupportedLocale, string> }> = [
    // Phrases & Sentence Templates
    {
      regex: /Genuine Apple product sold factory sealed with all original accessories and warranty card\. Covered under official Apple Lebanon warranty\./gi,
      map: {
        en: 'Genuine Apple product sold factory sealed with all original accessories and warranty card. Covered under official Apple Lebanon warranty.',
        ar: 'منتج أبل أصلي يباع مختوماً من المصنع مع كافة الملحقات الأصلية وكرت الكفالة. مشمول بالكفالة الرسمية لشركة أبل في لبنان.',
        fr: 'Produit Apple d\'origine vendu scellé en usine avec tous les accessoires d\'origine et la carte de garantie. Couvert par la garantie officielle Apple Liban.',
        it: 'Prodotto Apple originale venduto sigillato di fabbrica con tutti gli accessori originali e certificato di garanzia. Coperto da garanzia ufficiale Apple Libano.',
        es: 'Producto Apple original vendido sellado de fábrica con todos los accesorios originales y tarjeta de garantía. Cubierto por la garantía oficial Apple Líbano.',
        tr: 'Tüm orijinal aksesuarları ve garanti belgesi ile fabrika ambalajında satılan orijinal Apple ürünü. Resmi Apple Lübnan garantisi kapsamındadır.',
      },
    },
    {
      regex: /Original Samsung device\. Factory sealed with full local warranty and all accessories included\./gi,
      map: {
        en: 'Original Samsung device. Factory sealed with full local warranty and all accessories included.',
        ar: 'جهاز سامسونج أصلي. مختوم من المصنع مع كفالة محلية كاملة وجميع الملحقات مرفقة.',
        fr: 'Appareil Samsung d\'origine. Scellé en usine avec garantie locale complète et tous les accessoires inclus.',
        it: 'Dispositivo Samsung originale. Sigillato di fabbrica con garanzia locale completa e tutti gli accessori inclusi.',
        es: 'Dispositivo Samsung original. Sellado de fábrica con garantía local completa y todos los accesorios incluidos.',
        tr: 'Orijinal Samsung cihazı. Tüm aksesuarları dahil, tam yerel garanti ile fabrika ambalajlı.',
      },
    },
    {
      regex: /High-performance ASUS device built for professionals and gamers\. Factory sealed with full warranty\./gi,
      map: {
        en: 'High-performance ASUS device built for professionals and gamers. Factory sealed with full warranty.',
        ar: 'جهاز أسوس عالي الأداء صُمم للمحترفين واللاعبين. مختوم من المصنع مع كفالة كاملة.',
        fr: 'Appareil ASUS haute performance conçu pour les professionnels et les gamers. Scellé en usine avec garantie complète.',
        it: 'Dispositivo ASUS ad alte prestazioni progettato per professionisti e gamer. Sigillato di fabbrica con garanzia completa.',
        es: 'Dispositivo ASUS de alto rendimiento diseñado para profesionales y gamers. Sellado de fábrica con garantía completa.',
        tr: 'Profesyoneller ve oyuncular için tasarlanmış yüksek performanslı ASUS cihazı. Tam garanti ile fabrika ambalajlı.',
      },
    },
    {
      regex: /Premium Sony product with industry-leading audio and display technology\. Factory sealed\./gi,
      map: {
        en: 'Premium Sony product with industry-leading audio and display technology. Factory sealed.',
        ar: 'منتج سوني فاخر مع تقنيات الصوت والعرض الرائدة عالمياً. مختوم من المصنع.',
        fr: 'Produit Sony premium avec une technologie audio et d\'affichage de pointe. Scellé en usine.',
        it: 'Prodotto Sony premium con tecnologia audio e display leader del settore. Sigillato di fabbrica.',
        es: 'Producto Sony premium con tecnología de audio y pantalla líder en la industria. Sellado de fábrica.',
        tr: 'Sektör lideri ses ve ekran teknolojisine sahip premium Sony ürünü. Fabrika ambalajlı.',
      },
    },
    {
      regex: /Professional-grade NVIDIA GPU for gaming and AI workloads\. Brand new sealed in box\./gi,
      map: {
        en: 'Professional-grade NVIDIA GPU for gaming and AI workloads. Brand new sealed in box.',
        ar: 'كرت شاشة انفيديا احترافي للألعاب والذكاء الاصطناعي. جديد كلياً ومختوم في علبته.',
        fr: 'Carte graphique NVIDIA professionnelle pour le jeu et l\'IA. Neuf scellé dans sa boîte.',
        it: 'GPU NVIDIA professionale per gaming e intelligenza artificiale. Nuovo sigillato nella confezione.',
        es: 'GPU NVIDIA profesional para juegos y cargas de IA. Nuevo sellado en su caja.',
        tr: 'Oyun ve yapay zeka iş yükleri için profesyonel NVIDIA ekran kartı. Kutusunda sıfır ambalajlı.',
      },
    },
    {
      regex: /Dell workstation-class device built for professional use\. Original factory sealed with full warranty\./gi,
      map: {
        en: 'Dell workstation-class device built for professional use. Original factory sealed with full warranty.',
        ar: 'محطة عمل ديل احترافية صُممت للاستخدام الشاق. أصلية ومختومة من المصنع مع كفالة كاملة.',
        fr: 'Station de travail Dell conçue pour un usage professionnel. D\'origine scellée en usine avec garantie complète.',
        it: 'Workstation Dell progettata per uso professionale. Originale sigillata di fabbrica con garanzia completa.',
        es: 'Estación de trabajo Dell diseñada para uso profesional. Original sellada de fábrica con garantía completa.',
        tr: 'Profesyonel kullanım için tasarlanmış Dell iş istasyonu cihazı. Tam garanti ile fabrika ambalajlı.',
      },
    },
    // Common Terms
    {
      regex: /\bGaming Laptop\b/gi,
      map: { en: 'Gaming Laptop', ar: 'لابتوب ألعاب قيمنق', fr: 'PC portable gaming', it: 'Notebook da gioco', es: 'Portátil gaming', tr: 'Oyuncu Dizüstü Bilgisayarı' },
    },
    {
      regex: /\bGaming PC\b|\bGaming Rig\b/gi,
      map: { en: 'Gaming PC', ar: 'كمبيوتر ألعاب قيمنق', fr: 'PC gamer sur mesure', it: 'PC gaming assemblato', es: 'PC gaming', tr: 'Oyuncu Bilgisayarı' },
    },
    {
      regex: /\bSmart Watch\b|\bSmartwatch\b/gi,
      map: { en: 'Smartwatch', ar: 'ساعة ذكية', fr: 'Montre connectée', it: 'Smartwatch', es: 'Reloj inteligente', tr: 'Akıllı Saat' },
    },
    {
      regex: /\bWireless Headphones\b|\bWireless Earbuds\b/gi,
      map: { en: 'Wireless Headphones', ar: 'سماعات لاسلكية', fr: 'Casque sans fil', it: 'Cuffie wireless', es: 'Auriculares inalámbricos', tr: 'Kablosuz Kulaklık' },
    },
    {
      regex: /\bGaming Monitor\b/gi,
      map: { en: 'Gaming Monitor', ar: 'شاشة قيمنق للألعاب', fr: 'Écran gaming', it: 'Monitor da gioco', es: 'Monitor gaming', tr: 'Oyuncu Monitörü' },
    },
    {
      regex: /\bNAS Storage\b|\bNetwork Attached Storage\b/gi,
      map: { en: 'NAS Storage', ar: 'وحدة تخزين شبكية NAS', fr: 'Stockage NAS', it: 'Archiviazione NAS', es: 'Almacenamiento NAS', tr: 'NAS Depolama' },
    },
    {
      regex: /\bWi-Fi Router\b/gi,
      map: { en: 'Wi-Fi Router', ar: 'راوتر واي فاي', fr: 'Routeur Wi-Fi', it: 'Router Wi-Fi', es: 'Enrutador Wi-Fi', tr: 'Wi-Fi Yönlendirici' },
    },
    {
      regex: /\bGraphics Card\b/gi,
      map: { en: 'Graphics Card', ar: 'كرت شاشة للرسوميات', fr: 'Carte graphique', it: 'Scheda grafica', es: 'Tarjeta gráfica', tr: 'Ekran Kartı' },
    },
    {
      regex: /\bFactory Sealed\b/gi,
      map: { en: 'Factory Sealed', ar: 'مختوم من المصنع', fr: 'Scellé en usine', it: 'Sigillato di fabbrica', es: 'Sellado de fábrica', tr: 'Fabrika Ambalajlı' },
    },
    {
      regex: /\bGenuine\b|\bOriginal\b/gi,
      map: { en: 'Genuine', ar: 'أصلي', fr: 'D\'origine', it: 'Originale', es: 'Original', tr: 'Orijinal' },
    },
  ];

  for (const item of TERM_MAP) {
    if (item.map[locale]) {
      result = result.replace(item.regex, item.map[locale]);
    }
  }

  return result;
}

/**
 * Returns localized product fields (name, description, specs, etc.) for a given locale
 */
export function getLocalizedProduct(product: any, locale: SupportedLocale): LocalizedProductResult {
  if (!product) {
    return {
      name: '',
      description: '',
      shortDescription: '',
      warrantyInfo: '',
      specifications: {},
    };
  }

  // Base fallback defaults (English / raw product fields)
  let name = product.name || '';
  let description = product.description || '';
  let shortDescription = product.shortDescription || '';
  let warrantyInfo = product.warrantyInfo || '';
  let rawSpecs: Record<string, string> = product.specifications || {};

  // 1. Check if explicit manual translation exists in product.translations[locale]
  if (product.translations && product.translations[locale]) {
    const trans = product.translations[locale];
    if (trans.name) name = trans.name;
    if (trans.description) description = trans.description;
    if (trans.shortDescription) shortDescription = trans.shortDescription;
    if (trans.warrantyInfo) warrantyInfo = trans.warrantyInfo;
    if (trans.specifications && Object.keys(trans.specifications).length > 0) {
      rawSpecs = { ...rawSpecs, ...trans.specifications };
    }
  } else if (locale !== 'en') {
    // 2. Perform REAL-TIME AUTOMATIC TRANSLATION for un-translated English products
    name = translateProductTerm(name, locale);
    description = translateProductTerm(description, locale);
    if (shortDescription) shortDescription = translateProductTerm(shortDescription, locale);
  }

  // Translate common warranty strings if not explicitly set
  if (warrantyInfo) {
    const cleanWarranty = warrantyInfo.trim().toLowerCase();
    if (WARRANTY_DICTIONARY[cleanWarranty] && WARRANTY_DICTIONARY[cleanWarranty][locale]) {
      warrantyInfo = WARRANTY_DICTIONARY[cleanWarranty][locale];
    } else if (locale !== 'en') {
      warrantyInfo = translateProductTerm(warrantyInfo, locale);
    }
  }

  // Translate spec keys & common values for display
  const specifications: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawSpecs)) {
    const translatedKey = translateSpecKey(key, locale);
    const translatedVal = translateSpecValue(String(val), locale);
    specifications[translatedKey] = translatedVal;
  }

  return {
    name,
    description,
    shortDescription,
    warrantyInfo,
    specifications,
  };
}

/**
 * Returns localized category name & description for a given locale
 */
export function getLocalizedCategory(category: any, locale: SupportedLocale): { name: string; description?: string } {
  if (!category) return { name: '' };

  let name = category.name || '';
  let description = category.description || '';

  // 1. Check explicit translations on object
  if (category.translations && category.translations[locale]) {
    if (category.translations[locale].name) name = category.translations[locale].name;
    if (category.translations[locale].description) description = category.translations[locale].description;
    return { name, description };
  }

  // 2. Fallback to built-in CATEGORY_DICTIONARY by slug or normalized name
  const slugKey = (category.slug || '').toLowerCase();
  const nameKey = (category.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (CATEGORY_DICTIONARY[slugKey] && CATEGORY_DICTIONARY[slugKey][locale]) {
    return CATEGORY_DICTIONARY[slugKey][locale];
  }

  for (const [key, dict] of Object.entries(CATEGORY_DICTIONARY)) {
    if (key.includes(nameKey) || nameKey.includes(key.replace('-', ''))) {
      if (dict[locale]) return dict[locale];
    }
  }

  return { name, description };
}
