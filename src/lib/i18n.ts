export type Locale = 'fr' | 'ar';

export const locales: Locale[] = ['fr', 'ar'];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'FR',
  ar: 'AR',
};

export const localeDir: Record<Locale, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  ar: 'rtl',
};

type Translations = {
  [key in Locale]: {
    nav: {
      home: string;
      products: string;
      brands: string;
      about: string;
      contact: string;
    };
    hero: {
      subtitle: string;
      title: string;
      titleHighlight: string;
      description: string;
      cta: string;
    };
    products: {
      title: string;
      subtitle: string;
      viewAll: string;
      addToCart: string;
      wishlist: string;
      priceSuffix: string;
      all: string;
      noResults: string;
    };
    footer: {
      delivery: string;
      deliveryDesc: string;
      authentic: string;
      authenticDesc: string;
      support: string;
      supportDesc: string;
      cod: string;
      codDesc: string;
      brandTagline: string;
    };
    topbar: {
      announcement: string;
      searchPlaceholder: string;
      profile: string;
      wishlist: string;
      cart: string;
    };
    common: {
      language: string;
    };
    luxe: {
      iconEyebrow: string;
      boutiqueEyebrow: string;
      orderNow: string;
      shadeOfMonth: string;
      rechargeable: string;
      satinCaption: string;
      marqueeHold: string;
      marqueeCod: string;
      maisonEyebrow: string;
      maisonQuote: string;
      maisonSign: string;
      fact1: string;
      fact2: string;
      fact3: string;
      boutiqueNote: string;
      proofReviews: string;
      proofVegan: string;
      proofCod: string;
      footShop: string;
      footHouse: string;
      footHelp: string;
      footTagline: string;
      footRights: string;
      footPay: string;
    };
    cart: {
      title: string;
      close: string;
      empty: string;
      emptySub: string;
      loading: string;
      remove: string;
      freeDone: string;
      freeMore: string;
      subtotal: string;
      order: string;
    };
    checkout: {
      title: string;
      subtitle: string;
      step1: string;
      name: string;
      namePh: string;
      phone: string;
      phonePh: string;
      wilaya: string;
      wilayaPh: string;
      address: string;
      addressPh: string;
      notes: string;
      notesPh: string;
      step2: string;
      codTitle: string;
      codDesc: string;
      submit: string;
      sending: string;
      emptyCart: string;
      backToShop: string;
      consent: string;
      cartTitle: string;
      shipping: string;
      freeShip: string;
      moreForFree: string;
      total: string;
      successTitle: string;
      successSub: string;
      reqName: string;
      reqPhone: string;
      reqWilaya: string;
      reqAddress: string;
    };
    mobile: {
      home: string;
      shop: string;
      cart: string;
      order: string;
      installTitle: string;
      installAndroid: string;
      installIos: string;
      installBtn: string;
    };
  };
};

export const translations: Translations = {
  fr: {
    nav: {
      home: 'Accueil',
      products: 'Produits',
      brands: 'Marques',
      about: 'À propos',
      contact: 'Contact',
    },
    hero: {
      subtitle: 'MAKEUP & BEAUTY',
      title: 'Les plus grandes marques',
      titleHighlight: 'au même endroit',
      description: 'Des produits originaux, des high copies de qualité, et une sélection pensée pour sublimer ta beauté.',
      cta: 'Découvrir la collection →',
    },
    products: {
      title: 'Nos Produits',
      subtitle: 'Une sélection soignée pour votre beauté',
      viewAll: 'Voir tout →',
      addToCart: 'Ajouter au panier',
      wishlist: 'Ajouter aux favoris',
      priceSuffix: 'DA',
      all: 'Tous',
      noResults: 'Aucun produit trouvé',
    },
    footer: {
      delivery: 'Livraison rapide',
      deliveryDesc: 'Partout en Algérie',
      authentic: 'Produits authentiques',
      authenticDesc: '100% originaux',
      support: 'Service client',
      supportDesc: 'À votre écoute',
      cod: 'Paiement à la livraison',
      codDesc: 'Plus de confiance',
      brandTagline: 'Beauty is you',
    },
    topbar: {
      announcement: 'Livraison gratuite pour toute commande supérieure à 6000 DA >',
      searchPlaceholder: 'Rechercher un produit...',
      profile: 'Mon compte',
      wishlist: 'Liste de souhaits',
      cart: 'Panier',
    },
    common: {
      language: 'Langue',
    },
    luxe: {
      iconEyebrow: 'N° I — Rouge Opéra, notre icône',
      boutiqueEyebrow: 'La Boutique',
      orderNow: 'Commander',
      shadeOfMonth: 'Teinte du mois',
      rechargeable: 'Étui rechargeable',
      satinCaption: 'Rouge Opéra — fini satin',
      marqueeHold: 'Tenue 8 heures',
      marqueeCod: 'Paiement cash à la livraison',
      maisonEyebrow: 'La Maison',
      maisonQuote: '« Je voulais un rouge qu’on garde dix ans, pas une saison. Un objet, pas un produit. »',
      maisonSign: 'Béatrice N., fondatrice',
      fact1: 'd’origine naturelle',
      fact2: 'test sur animaux',
      fact3: 'références en boutique',
      boutiqueNote: 'Paiement cash à la livraison · Expédition vers toutes les wilayas · Retours 7 jours',
      proofReviews: 'Avis vérifiés',
      proofVegan: 'Non testé sur animaux',
      proofCod: 'Paiement à la livraison',
      footShop: 'Boutique',
      footHouse: 'Maison',
      footHelp: 'Aide',
      footTagline: 'Rouges rechargeables, paiement cash à la livraison.',
      footRights: 'Tous droits réservés',
      footPay: 'Visa · CIB · EDAHABIA · Cash à la livraison',
    },
    cart: {
      title: 'Votre panier',
      close: 'Fermer ×',
      empty: 'Votre panier est vide.',
      emptySub: 'Livraison offerte dès 6000 DA.',
      loading: 'Chargement…',
      remove: 'Retirer',
      freeDone: 'Livraison offerte — merci.',
      freeMore: 'Plus que',
      subtotal: 'Sous-total',
      order: 'Commander →',
    },
    checkout: {
      title: 'Commander',
      subtitle: '— paiement à la livraison',
      step1: '1. Vos coordonnées',
      name: 'Nom complet *',
      namePh: 'Ex. Amine Benali',
      phone: 'Téléphone *',
      phonePh: '0550 12 34 56',
      wilaya: 'Wilaya *',
      wilayaPh: 'Choisir…',
      address: 'Commune / Adresse *',
      addressPh: 'Rue, immeuble, point de repère…',
      notes: 'Note (optionnel)',
      notesPh: 'Heure de livraison souhaitée…',
      step2: '2. Paiement',
      codTitle: 'Cash à la livraison — vous payez le livreur.',
      codDesc: 'Espèces à la réception. On vous appelle avant pour confirmer.',
      submit: 'Confirmer',
      sending: 'Envoi…',
      emptyCart: 'Panier vide.',
      backToShop: 'Retour boutique',
      consent: 'En commandant, vous acceptez d’être contacté par téléphone pour confirmation.',
      cartTitle: 'Votre panier',
      shipping: 'Livraison',
      freeShip: 'Offerte',
      moreForFree: 'pour la livraison offerte.',
      total: 'Total',
      successTitle: 'Commande envoyée !',
      successSub: 'On vous appellera pour confirmer. Redirection…',
      reqName: 'Nom obligatoire',
      reqPhone: 'Numéro algérien invalide (ex. 0550 12 34 56)',
      reqWilaya: 'Wilaya obligatoire',
      reqAddress: 'Adresse obligatoire',
    },
    mobile: {
      home: 'Accueil',
      shop: 'Boutique',
      cart: 'Panier',
      order: 'Commander',
      installTitle: 'Installer BN STORE',
      installAndroid: '1 touche pour commander plus vite, comme une vraie app.',
      installIos: 'Touchez Partager puis « Sur l’écran d’accueil »',
      installBtn: 'Installer',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      brands: 'العلامات',
      about: 'من نحن',
      contact: 'اتصل بنا',
    },
    hero: {
      subtitle: 'المكياج والجمال',
      title: 'أكبر الماركات',
      titleHighlight: 'في مكان واحد',
      description: 'منتجات أصلية، نسخ عالية الجودة، وتشكيلة مختارة لتعزيز جمالك.',
      cta: 'اكتشف المجموعة ←',
    },
    products: {
      title: 'منتجاتنا',
      subtitle: 'تشكيلة مختارة بعناية لجمالك',
      viewAll: 'عرض الكل ←',
      addToCart: 'أضف للسلة',
      wishlist: 'أضف للمفضلة',
      priceSuffix: 'د.ج',
      all: 'الكل',
      noResults: 'لا توجد منتجات مطابقة',
    },
    footer: {
      delivery: 'توصيل سريع',
      deliveryDesc: 'لكل أنحاء الجزائر',
      authentic: 'منتجات أصلية',
      authenticDesc: '100% مضمونة',
      support: 'خدمة العملاء',
      supportDesc: 'بخدمتكم',
      cod: 'الدفع عند الاستلام',
      codDesc: 'ثقة أكبر',
      brandTagline: 'الجمال أنتِ',
    },
    topbar: {
      announcement: 'توصيل مجاني للطلبات فوق 6000 د.ج >',
      searchPlaceholder: 'ابحث عن منتج...',
      profile: 'حسابي',
      wishlist: 'قائمة الرغبات',
      cart: 'السلة',
    },
    common: {
      language: 'اللغة',
    },
    luxe: {
      iconEyebrow: 'رقم ١ — روج أوبرا، أيقونتنا',
      boutiqueEyebrow: 'المتجر',
      orderNow: 'اطلب الآن',
      shadeOfMonth: 'لون الشهر',
      rechargeable: 'علبة قابلة لإعادة التعبئة',
      satinCaption: 'روج أوبرا — لمسة ساتان',
      marqueeHold: 'ثبات ٨ ساعات',
      marqueeCod: 'الدفع نقداً عند الاستلام',
      maisonEyebrow: 'الدار',
      maisonQuote: '«أردت أحمر شفاه نحتفظ به عشر سنوات، لا موسماً واحداً. قطعة فنية، لا مجرد منتج.»',
      maisonSign: 'بياتريس ن.، المؤسِّسة',
      fact1: 'مكونات طبيعية',
      fact2: 'تجربة على الحيوانات',
      fact3: 'منتجاً في المتجر',
      boutiqueNote: 'الدفع نقداً عند الاستلام · التوصيل لكل الولايات · إرجاع خلال ٧ أيام',
      proofReviews: 'تقييمات موثوقة',
      proofVegan: 'بدون تجربة على الحيوانات',
      proofCod: 'الدفع عند الاستلام',
      footShop: 'المتجر',
      footHouse: 'الدار',
      footHelp: 'مساعدة',
      footTagline: 'أحمر شفاه قابل لإعادة التعبئة، والدفع نقداً عند الاستلام.',
      footRights: 'كل الحقوق محفوظة',
      footPay: 'CIB · EDAHABIA · الدفع نقداً عند الاستلام',
    },
    cart: {
      title: 'سلة التسوق',
      close: 'إغلاق ×',
      empty: 'سلتك فارغة.',
      emptySub: 'التوصيل مجاني فوق 6000 د.ج.',
      loading: 'جارٍ التحميل…',
      remove: 'حذف',
      freeDone: 'التوصيل مجاني — شكراً لك.',
      freeMore: 'بقي',
      subtotal: 'المجموع',
      order: 'اطلب الآن ←',
    },
    checkout: {
      title: 'تأكيد الطلب',
      subtitle: '— الدفع عند الاستلام',
      step1: '١. معلوماتك',
      name: 'الاسم الكامل *',
      namePh: 'مثال: أمين بن علي',
      phone: 'الهاتف *',
      phonePh: '0550 12 34 56',
      wilaya: 'الولاية *',
      wilayaPh: 'اختر…',
      address: 'البلدية / العنوان *',
      addressPh: 'الشارع، العمارة، علامة مميزة…',
      notes: 'ملاحظة (اختياري)',
      notesPh: 'وقت التوصيل المفضل…',
      step2: '٢. الدفع',
      codTitle: 'الدفع نقداً عند الاستلام — تدفع لموظف التوصيل.',
      codDesc: 'نتصل بك قبل الإرسال للتأكيد.',
      submit: 'تأكيد الطلب',
      sending: 'جارٍ الإرسال…',
      emptyCart: 'السلة فارغة.',
      backToShop: 'عودة للمتجر',
      consent: 'بتأكيد الطلب أنت توافق على أن نتصل بك هاتفياً للتأكيد.',
      cartTitle: 'سلتك',
      shipping: 'التوصيل',
      freeShip: 'مجاني',
      moreForFree: 'للحصول على توصيل مجاني.',
      total: 'المجموع الكلي',
      successTitle: 'تم إرسال طلبك!',
      successSub: 'سنتصل بك للتأكيد. جارٍ التحويل…',
      reqName: 'الاسم إجباري',
      reqPhone: 'رقم جزائري غير صحيح (مثال: 0550123456)',
      reqWilaya: 'الولاية إجبارية',
      reqAddress: 'العنوان إجباري',
    },
    mobile: {
      home: 'الرئيسية',
      shop: 'المتجر',
      cart: 'السلة',
      order: 'اطلب',
      installTitle: 'ثبّت تطبيق BN STORE',
      installAndroid: 'زر واحد للطلب أسرع، مثل تطبيق حقيقي.',
      installIos: 'اضغط مشاركة ثم «على الشاشة الرئيسية»',
      installBtn: 'تثبيت',
    },
  },
};

export function getTranslation(locale: Locale) {
  return translations[locale];
}

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return localeDir[locale];
}

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  const v = window.localStorage.getItem('bn_locale');
  return v === 'ar' || v === 'fr' ? v : defaultLocale;
}

export function setStoredLocale(locale: Locale) {
  try {
    window.localStorage.setItem('bn_locale', locale);
    window.dispatchEvent(new CustomEvent('bn-locale', { detail: locale }));
  } catch { /* ignore */ }
}