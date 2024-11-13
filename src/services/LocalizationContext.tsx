import React, { createContext, useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE, localization } from '@match-app/shared';
import * as RNLocalize from 'react-native-localize';

import LocalizedStrings from 'react-native-localization';
import enTranslation from '@match-app/shared/src/localization/streami18n/en.json';
import deTranslation from '@match-app/shared/src/localization/streami18n/de.json';
import { Streami18n } from 'stream-chat-react-native';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import moment from 'moment';
import 'moment/locale/de';

const translations = new LocalizedStrings(localization);

// Reference: https://blog.codecentric.de/en/2019/11/localization-react-native-mobile-app-react-context-hooks/

interface ILocalizationContextType {
  l10n: any;
  streami18n: any;
  setAppLanguage: (language: string) => Promise<void>;
  appLanguage: string;
  initializeAppLanguage: () => Promise<void>;
}

// Init stream io localization files
const streami18n = new Streami18n();
streami18n.registerTranslation('en', enTranslation);
streami18n.registerTranslation('de', deTranslation);

// Use a localization context to change the language at runtime.

export const LocalizationContext = createContext<ILocalizationContextType>({
  l10n: translations,
  streami18n: streami18n,
  setAppLanguage: async () => {},
  appLanguage: DEFAULT_LANGUAGE,
  initializeAppLanguage: async () => {},
});

interface ILocalizationProviderProps {
  children: any;
}

export const LocalizationProvider: React.FC<ILocalizationProviderProps> = (
  props: ILocalizationProviderProps,
) => {
  const { children } = props;
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

  const setLanguage = async (language: string) => {
    moment.locale(language);
    translations.setLanguage(language);
    setAppLanguage(language);
    streami18n.setLanguage(language);
  };

  useEffect(() => {
    initializeAppLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAppLanguage = async () => {
    const supportedLocaleCodes = translations.getAvailableLanguages();
    const phoneLocaleCodes = RNLocalize.getLocales().map((l) => l.languageCode);
    const preferredLocaleCode = phoneLocaleCodes.find((e) =>
      supportedLocaleCodes.includes(e),
    );
    await setLanguage(
      preferredLocaleCode !== undefined
        ? preferredLocaleCode
        : DEFAULT_LANGUAGE,
    );
  };

  return (
    <LocalizationContext.Provider
      value={{
        l10n: translations,
        streami18n: streami18n,
        setAppLanguage: setLanguage,
        appLanguage,
        initializeAppLanguage,
      }}>
      {children}
    </LocalizationContext.Provider>
  );
};
