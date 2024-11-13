const getLocales = () => [
  // you can choose / add the locales you want
  { countryCode: 'DE', languageTag: 'en', languageCode: 'en', isRTL: false },
];

// use a provided translation, or return undefined to test your fallback
const findBestAvailableLanguage = () => ({
  languageTag: 'en',
  isRTL: false,
});

const getNumberFormatSettings = () => ({
  decimalSeparator: '.',
  groupingSeparator: ',',
});

const getCalendar = () => 'gregorian'; // or "japanese", "buddhist"
const getCountry = () => 'DE'; // the country code you want
const getCurrencies = () => ['EUR']; // can be empty array
const getTemperatureUnit = () => 'celsius'; // or "fahrenheit"
const getTimeZone = () => 'Europe/Paris'; // the timezone you want
const uses24HourClock = () => true;
const usesMetricSystem = () => true;

const addEventListener = jest.fn();
const removeEventListener = jest.fn();

export {
  findBestAvailableLanguage,
  getLocales,
  getNumberFormatSettings,
  getCalendar,
  getCountry,
  getCurrencies,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  addEventListener,
  removeEventListener,
};
