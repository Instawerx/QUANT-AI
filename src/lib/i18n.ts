import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation resources
import enTranslations from '../../public/locales/en/common.json';
import esTranslations from '../../public/locales/es/common.json';
import frTranslations from '../../public/locales/fr/common.json';
import zhTranslations from '../../public/locales/zh/common.json';
import deTranslations from '../../public/locales/de/common.json';
import jaTranslations from '../../public/locales/ja/common.json';
import koTranslations from '../../public/locales/ko/common.json';
import ptTranslations from '../../public/locales/pt/common.json';
import ruTranslations from '../../public/locales/ru/common.json';
import arTranslations from '../../public/locales/ar/common.json';

// Language configuration
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
  de: 'Deutsch',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Language detection order
const detectionOrder = [
  'querystring', // ?lng=en
  'cookie', // lng cookie
  'localStorage', // lng in localStorage
  'sessionStorage', // lng in sessionStorage
  'navigator', // browser language
  'htmlTag', // html lang attribute
  'path', // path: /en/page
  'subdomain', // subdomain: en.domain.com
];

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language detection
    detection: {
      order: detectionOrder,
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'],
      cookieMinutes: 10080, // 7 days
      cookieDomain: process.env.NODE_ENV === 'production' ? '.quantai.com' : 'localhost',
    },

    // Fallback language
    fallbackLng: 'en',

    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',

    // Namespace configuration
    ns: ['common', 'trading', 'wallet', 'auth', 'dashboard'],
    defaultNS: 'common',

    // Resource loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.missing.json',
    },

    // Interpolation
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
    },

    // Resources (for initial load)
    resources: {
      en: { common: enTranslations },
      es: { common: esTranslations },
      fr: { common: frTranslations },
      zh: { common: zhTranslations },
      de: { common: deTranslations },
      ja: { common: jaTranslations },
      ko: { common: koTranslations },
      pt: { common: ptTranslations },
      ru: { common: ruTranslations },
      ar: { common: arTranslations },
    },

    // React specific
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
    },

    // Load translations
    load: 'languageOnly', // Remove region code (en-US -> en)

    // Cleanup code
    cleanCode: true,

    // Language whitelist
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
    nonExplicitSupportedLngs: true,

    // Key separator
    keySeparator: '.',
    nsSeparator: ':',
  });

// Export language utilities
export const getLanguageDirection = (lng: string): 'ltr' | 'rtl' => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
};

export const getLanguageFlag = (lng: string): string => {
  const flags: Record<string, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
    zh: '🇨🇳',
    de: '🇩🇪',
    ja: '🇯🇵',
    ko: '🇰🇷',
    pt: '🇧🇷',
    ru: '🇷🇺',
    ar: '🇸🇦',
  };
  return flags[lng] || '🌐';
};

export const getCurrentLanguage = (): SupportedLanguage => {
  const current = i18n.language || 'en';
  return (Object.keys(SUPPORTED_LANGUAGES).includes(current)
    ? current
    : 'en') as SupportedLanguage;
};

export const changeLanguage = async (lng: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(lng);

  // Update document direction
  document.documentElement.dir = getLanguageDirection(lng);
  document.documentElement.lang = lng;

  // Store user preference
  localStorage.setItem('userLanguagePreference', lng);

  // Optional: Send to backend for user profile
  if (typeof window !== 'undefined') {
    try {
      // This would integrate with your user preferences API
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`,
        },
        body: JSON.stringify({ language: lng }),
      });

      if (!response.ok) {
        console.warn('Failed to save language preference to backend');
      }
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }
};

// Auto-detect language based on user's IP or location
export const detectUserLanguage = async (): Promise<SupportedLanguage> => {
  try {
    // Check if user has a saved preference
    const userPreference = localStorage.getItem('userLanguagePreference');
    if (userPreference && Object.keys(SUPPORTED_LANGUAGES).includes(userPreference)) {
      return userPreference as SupportedLanguage;
    }

    // Try to detect from IP geolocation
    const response = await fetch('/api/geolocation/language', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.language) {
        const detectedLang = data.language.toLowerCase();
        if (Object.keys(SUPPORTED_LANGUAGES).includes(detectedLang)) {
          return detectedLang as SupportedLanguage;
        }
      }
    }
  } catch (error) {
    console.warn('IP-based language detection failed:', error);
  }

  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0];
  if (Object.keys(SUPPORTED_LANGUAGES).includes(browserLang)) {
    return browserLang as SupportedLanguage;
  }

  // Final fallback
  return 'en';
};

// Initialize language detection on app load
export const initializeLanguage = async (): Promise<void> => {
  try {
    const detectedLanguage = await detectUserLanguage();
    await changeLanguage(detectedLanguage);
  } catch (error) {
    console.warn('Language initialization failed, using English:', error);
    await changeLanguage('en');
  }
};

export default i18n;