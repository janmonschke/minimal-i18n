const defaultLocale = "en";
const supportedLocales = [
  { key: "en", flag: "🇬🇧" },
  { key: "de", flag: "🇩🇪" },
  { key: "fr", flag: "🇫🇷" }
];

const userLocale =
  getStoredLocale() ||
  navigator.language ||
  navigator.userLanguage ||
  navigator.browserLanguage;

function getSupportedLocale(supported, userLocale, fallback) {
  // simple string match of the locale
  const locale = supported.find(loc =>
    userLocale.toLowerCase().startsWith(loc.key)
  );
  return (locale && locale.key) || fallback;
}

let locale = getSupportedLocale(supportedLocales, userLocale, defaultLocale);

function indexEN(num) {
  return num === 1 ? 0 : 1;
}

function indexFR(num) {
  return num > 1 ? 1 : 0;
}
const pluralIndex = {
  en: indexEN,
  de: indexEN,
  fr: indexFR
};

export function pluralize(translationArr) {
  return function(num) {
    const index = pluralIndex[locale](num);
    const translationFn = translationArr[index];
    return translationFn.apply(null, arguments);
  };
}

/**
 * @param translationKey {string} the translation key
 */
export function t(translationKey) {
  const translations = strings[translationKey];

  if (translations) {
    const localized = translations[locale];
    const defaultString = translations[defaultLocale];
    if (localized) {
      return localized;
    } else if (defaultString) {
      return defaultString;
    }
  }

  return "";
}

function getStoredLocale() {
  // try getting the locale from local storage
  try {
    return localStorage.getItem("locale");
  } catch (e) {}
  return undefined;
}

export function getUserLocale() {
  if (locale) {
    return locale;
  }
  return defaultLocale;
}

export function getSupportedLocales() {
  return supportedLocales;
}

export function setLocale(newLocale) {
  locale = newLocale;
  try {
    localStorage.setItem("locale", newLocale);
  } catch (e) {}
}

const strings = {
  bus_tickets: {
    en: "Your bus tickets",
    de: "Deine Bustickets",
    fr: "Tes tickets de bus"
  },
  signed_in_as: {
    en: user => `Signed in as: ${user}`,
    de: user => `Eingeloggt als: ${user}`,
    fr: user => `Connecté en tant que: ${user}`
  },
  bus_tickets_booked: {
    en: pluralize([
      () => 'You have booked one ticket',
      num => `You have booked ${num} tickets`
    ]),
    de: pluralize([
      () => 'Du hast ein Ticket gebucht',
      (num) => `Du hast ${num} Tickets gebucht`
    ]),
    fr: pluralize([
      num => `Tu as réservé ${num} ticket`,
      num => `Tu as réservé ${num} tickets`
    ])
  },
  change_language: {
    en: "Change language",
    de: "Sprache ändern",
    fr: "Changer la langue"
  }
};
