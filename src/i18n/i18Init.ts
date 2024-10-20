import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from 'i18next-http-backend'

import { format as formatDate, formatRelative, formatDistance, isDate, Locale } from "date-fns";
import { enUS as en, ru, es, fr } from "date-fns/locale";

const locales = new Map<string, Locale>([['en-US', en], ['ru-RU', ru], ['es-ES', es], ['fr-FR', fr]]);

export function init(locale: string) {
    return i18n
        .use(HttpBackend)
        .use(initReactI18next)
        .init({
            lng: locale,
            fallbackLng: 'en',
            load: "languageOnly",
            ns: ['core'],
            defaultNS: 'core',
            returnNull: false,
            saveMissing: false,
            saveMissingTo: 'all',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
                addPath: '/locales/add/{{lng}}/{{ns}}',
            },
            debug: process.env.NODE_ENV !== 'production',
            interpolation: {
                escapeValue: false,
                format: (value, format, lng) => {
                    if (isDate(value)) {
                        const lang = lng ?? '';
                        const locale = locales.has(lang) ? locales.get(lang) : en;

                        if (format === "short")
                            return formatDate(value, "P", { locale });
                        if (format === "long")
                            return formatDate(value, "PPPP", { locale });
                        if (format === "relative")
                            return formatRelative(value, new Date(), { locale });
                        if (format === "ago")
                            return formatDistance(value, new Date(), {
                                locale,
                                addSuffix: true
                            });

                        return formatDate(value, format ?? 'short', { locale });
                    }

                    return value;
                }
            }
        });
}

export function change(locale: string) {
    return i18n.changeLanguage(locale);
}

export default i18n;