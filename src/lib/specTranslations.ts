import { SupportedLocale } from '../context/LanguageContext';

const SPEC_KEY_DICTIONARY: Record<string, Record<SupportedLocale, string>> = {
  processor: { en: 'Processor', ar: 'المعالج', fr: 'Processeur', it: 'Processore', es: 'Procesador', tr: 'İşlemci' },
  cpu: { en: 'Processor (CPU)', ar: 'المعالج (CPU)', fr: 'Processeur (CPU)', it: 'Processore (CPU)', es: 'Procesador (CPU)', tr: 'İşlemci (CPU)' },
  chip: { en: 'Chip / Chipset', ar: 'الشريحة والمعالج', fr: 'Puce / Chipset', it: 'Chipset', es: 'Chipset', tr: 'Yonga Seti' },
  chipset: { en: 'Chipset', ar: 'الشريحة', fr: 'Puce / Chipset', it: 'Chipset', es: 'Chipset', tr: 'Yonga Seti' },
  ram: { en: 'RAM Memory', ar: 'ذاكرة الرام', fr: 'Mémoire RAM', it: 'Memoria RAM', es: 'Memoria RAM', tr: 'RAM Bellek' },
  memory: { en: 'Memory', ar: 'الذاكرة', fr: 'Mémoire', it: 'Memoria', es: 'Memoria', tr: 'Bellek' },
  storage: { en: 'Storage', ar: 'سعة التخزين', fr: 'Stockage', it: 'Archiviazione', es: 'Almacenamiento', tr: 'Depolama' },
  ssd: { en: 'SSD Storage', ar: 'تخزين SSD', fr: 'Stockage SSD', it: 'Archiviazione SSD', es: 'Almacenamiento SSD', tr: 'SSD Depolama' },
  harddrive: { en: 'Hard Drive', ar: 'القرص الصلب', fr: 'Disque dur', it: 'Disco rigido', es: 'Disco duro', tr: 'Sabit Sürücü' },
  graphics: { en: 'Graphics Card', ar: 'كرت الشاشة', fr: 'Carte graphique', it: 'Scheda grafica', es: 'Tarjeta gráfica', tr: 'Ekran Kartı' },
  gpu: { en: 'GPU', ar: 'معالج الرسوميات', fr: 'Processeur graphique', it: 'GPU', es: 'GPU', tr: 'Grafik İşlemci' },
  display: { en: 'Display / Screen', ar: 'الشاشة', fr: 'Écran', it: 'Schermo', es: 'Pantalla', tr: 'Ekran' },
  screen: { en: 'Screen Size', ar: 'حجم الشاشة', fr: 'Taille de l\'écran', it: 'Dimensione schermo', es: 'Tamaño de pantalla', tr: 'Ekran Boyutu' },
  resolution: { en: 'Resolution', ar: 'الدقة', fr: 'Résolution', it: 'Risoluzione', es: 'Resolución', tr: 'Çözünürlük' },
  refreshrate: { en: 'Refresh Rate', ar: 'معدل التحديث', fr: 'Taux de rafraîchissement', it: 'Frequenza di aggiornamento', es: 'Tasa de refresco', tr: 'Yenileme Hızı' },
  battery: { en: 'Battery', ar: 'البطارية', fr: 'Batterie', it: 'Batteria', es: 'Batería', tr: 'Pil' },
  batterylife: { en: 'Battery Life', ar: 'عمر البطارية', fr: 'Autonomie batterie', it: 'Autonomia batteria', es: 'Duración de batería', tr: 'Pil Ömrü' },
  charging: { en: 'Charging', ar: 'الشحن', fr: 'Recharge', it: 'Ricarica', es: 'Carga', tr: 'Şarj' },
  operatingsystem: { en: 'Operating System', ar: 'نظام التشغيل', fr: 'Système d\'exploitation', it: 'Sistema operativo', es: 'Sistema operativo', tr: 'İşletim Sistemi' },
  os: { en: 'OS', ar: 'نظام التشغيل', fr: 'Système', it: 'OS', es: 'SO', tr: 'İşletim Sistemi' },
  color: { en: 'Color', ar: 'اللون', fr: 'Couleur', it: 'Colore', es: 'Color', tr: 'Renk' },
  weight: { en: 'Weight', ar: 'الوزن', fr: 'Poids', it: 'Peso', es: 'Peso', tr: 'Ağırlık' },
  warranty: { en: 'Warranty', ar: 'الضمان والكفالة', fr: 'Garantie', it: 'Garanzia', es: 'Garantía', tr: 'Garanti' },
  camera: { en: 'Camera', ar: 'الكاميرا', fr: 'Appareil photo', it: 'Fotocamera', es: 'Cámara', tr: 'Kamera' },
  frontcamera: { en: 'Front Camera', ar: 'الكاميرا الأمامية', fr: 'Caméra avant', it: 'Fotocamera frontale', es: 'Cámara frontal', tr: 'Ön Kamera' },
  maincamera: { en: 'Main Camera', ar: 'الكاميرا الرئيسية', fr: 'Caméra principale', it: 'Fotocamera principale', es: 'Cámara principal', tr: 'Ana Kamera' },
  connectivity: { en: 'Connectivity', ar: 'الاتصالات والشبكات', fr: 'Connectivité', it: 'Connettività', es: 'Conectividad', tr: 'Bağlantı' },
  ports: { en: 'Ports & Connectors', ar: 'المنافذ والتوصيلات', fr: 'Connectique & Ports', it: 'Porte e Connessioni', es: 'Puertos y Conexiones', tr: 'Portlar ve Bağlantılar' },
  audio: { en: 'Audio & Sound', ar: 'الصوتيات', fr: 'Audio & Son', it: 'Audio e Suono', es: 'Audio y Sonido', tr: 'Ses Özellikleri' },
  bluetooth: { en: 'Bluetooth', ar: 'البلوتوث', fr: 'Bluetooth', it: 'Bluetooth', es: 'Bluetooth', tr: 'Bluetooth' },
  wifi: { en: 'Wi-Fi', ar: 'الواي فاي', fr: 'Wi-Fi', it: 'Wi-Fi', es: 'Wi-Fi', tr: 'Wi-Fi' },
  sensors: { en: 'Sensors', ar: 'الحساسات', fr: 'Capteurs', it: 'Sensori', es: 'Sensores', tr: 'Sensörler' },
  driverunit: { en: 'Driver Unit', ar: 'وحدة المكبر الصوتي', fr: 'Transducteur', it: 'Unità driver', es: 'Unidad de controlador', tr: 'Sürücü Birimi' },
  frequencyresponse: { en: 'Frequency Response', ar: 'استجابة التردد', fr: 'Réponse en fréquence', it: 'Risposta in frequenza', es: 'Respuesta de frecuencia', tr: 'Frekans Tepkisi' },
  anc: { en: 'Active Noise Canceling', ar: 'عزل الضوضاء النشط', fr: 'Réduction de bruit active', it: 'Cancellazione del rumore', es: 'Cancelación de ruido activa', tr: 'Aktif Gürültü Engelleme' },
  vram: { en: 'VRAM', ar: 'ذاكرة كرت الشاشة VRAM', fr: 'Mémoire vidéo VRAM', it: 'VRAM', es: 'VRAM', tr: 'Ekran Kartı Belleği VRAM' },
  cudacores: { en: 'CUDA Cores', ar: 'أنوية CUDA', fr: 'Cœurs CUDA', it: 'Cores CUDA', es: 'Núcleos CUDA', tr: 'CUDA Çekirdekleri' },
  architecture: { en: 'Architecture', ar: 'المعمارية', fr: 'Architecture', it: 'Architettura', es: 'Arquitectura', tr: 'Mimari' },
  tdp: { en: 'TDP Power', ar: 'استهلاك الطاقة TDP', fr: 'Consommation TDP', it: 'Consumo TDP', es: 'Consumo TDP', tr: 'Güç Tüketimi TDP' },
  motherboard: { en: 'Motherboard', ar: 'اللوحة الأم', fr: 'Carte mère', it: 'Scheda madre', es: 'Placa base', tr: 'Anakart' },
  psu: { en: 'Power Supply (PSU)', ar: 'مزود الطاقة (PSU)', fr: 'Bloc d\'alimentation', it: 'Alimentatore', es: 'Fuente de alimentación', tr: 'Güç Kaynağı' },
  cooling: { en: 'Cooling System', ar: 'نظام التبريد', fr: 'Système de refroidissement', it: 'Sistema di raffreddamento', es: 'Sistema de refrigeración', tr: 'Soğutma Sistemi' }
};

const COMMON_SPEC_VALUES: Record<string, Record<SupportedLocale, string>> = {
  '1 year official warranty': {
    en: '1 Year Official Warranty',
    ar: 'كفالة رسمية لمدة سنة',
    fr: 'Garantie officielle 1 an',
    it: 'Garanzia ufficiale 1 anno',
    es: 'Garantía oficial de 1 año',
    tr: '1 Yıl Resmi Garanti'
  },
  '1 year local warranty': {
    en: '1 Year Local Warranty',
    ar: 'كفالة محلية لمدة سنة',
    fr: 'Garantie locale 1 an',
    it: 'Garanzia locale 1 anno',
    es: 'Garantía local de 1 año',
    tr: '1 Yıl Yerel Garanti'
  },
  '1 year apple lebanon warranty': {
    en: '1 Year Apple Lebanon Warranty',
    ar: 'كفالة أبل لبنان الرسمية لمدة سنة',
    fr: 'Garantie officielle Apple Liban 1 an',
    it: 'Garanzia ufficiale Apple Libano 1 anno',
    es: 'Garantía oficial Apple Líbano de 1 año',
    tr: '1 Yıl Resmi Apple Lübnan Garantisi'
  },
  '1 year samsung lebanon warranty': {
    en: '1 Year Samsung Lebanon Warranty',
    ar: 'كفالة سامسونج لبنان الرسمية لمدة سنة',
    fr: 'Garantie officielle Samsung Liban 1 an',
    it: 'Garanzia ufficiale Samsung Libano 1 anno',
    es: 'Garantía oficial Samsung Líbano de 1 año',
    tr: '1 Yıl Resmi Samsung Lübnan Garantisi'
  },
  '2 year asus lebanon warranty': {
    en: '2 Year ASUS Lebanon Warranty',
    ar: 'كفالة أسوس لبنان لمدة سنتين',
    fr: 'Garantie ASUS Liban 2 ans',
    it: 'Garanzia ASUS Libano 2 anni',
    es: 'Garantía ASUS Líbano de 2 años',
    tr: '2 Yıl ASUS Lübnan Garantisi'
  },
  '1 year sony lebanon warranty': {
    en: '1 Year Sony Lebanon Warranty',
    ar: 'كفالة سوني لبنان لمدة سنة',
    fr: 'Garantie Sony Liban 1 an',
    it: 'Garanzia Sony Libano 1 anno',
    es: 'Garantía Sony Líbano de 1 año',
    tr: '1 Yıl Sony Lübnan Garantisi'
  },
  '3 year nvidia warranty': {
    en: '3 Year NVIDIA Warranty',
    ar: 'كفالة انفيديا لمدة 3 سنوات',
    fr: 'Garantie NVIDIA 3 ans',
    it: 'Garanzia NVIDIA 3 anni',
    es: 'Garantía NVIDIA de 3 años',
    tr: '3 Yıl NVIDIA Garantisi'
  },
  '1 year dell lebanon warranty': {
    en: '1 Year Dell Lebanon Warranty',
    ar: 'كفالة ديل لبنان لمدة سنة',
    fr: 'Garantie Dell Liban 1 an',
    it: 'Garanzia Dell Libano 1 anno',
    es: 'Garantía Dell Líbano de 1 año',
    tr: '1 Yıl Dell Lübnan Garantisi'
  },
  'in stock': {
    en: 'In Stock',
    ar: 'متوفر في المخزون',
    fr: 'En stock',
    it: 'Disponibile',
    es: 'En stock',
    tr: 'Stokta Var'
  },
  'out of stock': {
    en: 'Out of Stock',
    ar: 'غير متوفر حالياً',
    fr: 'Rupture de stock',
    it: 'Esaurito',
    es: 'Agotado',
    tr: 'Stokta Yok'
  },
  'factory sealed': {
    en: 'Factory Sealed',
    ar: 'مختوم من المصنع',
    fr: 'Scellé en usine',
    it: 'Sigillato di fabbrica',
    es: 'Sellado de fábrica',
    tr: 'Fabrika Ambalajlı'
  },
  'natural titanium': {
    en: 'Natural Titanium',
    ar: 'تيتانيوم طبيعي',
    fr: 'Titane naturel',
    it: 'Titanio naturale',
    es: 'Titanio natural',
    tr: 'Doğal Titanyum'
  },
  'titanium black': {
    en: 'Titanium Black',
    ar: 'أسود تيتانيوم',
    fr: 'Noir titane',
    it: 'Nero titanio',
    es: 'Negro titanio',
    tr: 'Titanyum Siyahı'
  },
  'eclipse gray': {
    en: 'Eclipse Gray',
    ar: 'رمادي كسوف',
    fr: 'Gris éclipse',
    it: 'Grigio eclisse',
    es: 'Gris eclipse',
    tr: 'Tutulma Grisi'
  },
  'midnight black': {
    en: 'Midnight Black',
    ar: 'أسود منتصف الليل',
    fr: 'Noir minuit',
    it: 'Nero notte',
    es: 'Negro noche',
    tr: 'Gece Siyahı'
  }
};

/**
 * Translates technical specification key labels automatically into target locale
 */
export function translateSpecKey(key: string, locale: SupportedLocale): string {
  if (!key) return '';
  const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (SPEC_KEY_DICTIONARY[cleanKey] && SPEC_KEY_DICTIONARY[cleanKey][locale]) {
    return SPEC_KEY_DICTIONARY[cleanKey][locale];
  }
  return key;
}

/**
 * Translates specification values if matched in common terms
 */
export function translateSpecValue(value: string, locale: SupportedLocale): string {
  if (!value) return '';
  const cleanValue = value.trim().toLowerCase();
  if (COMMON_SPEC_VALUES[cleanValue] && COMMON_SPEC_VALUES[cleanValue][locale]) {
    return COMMON_SPEC_VALUES[cleanValue][locale];
  }
  return value;
}
