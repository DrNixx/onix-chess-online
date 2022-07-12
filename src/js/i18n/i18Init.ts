import i18n from "i18next";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";
import HttpBackend from 'i18next-http-backend'
import { IntlMessageFormat } from 'intl-messageformat';

const defaultLocale = "en-US";

function getLocale(value: string) {
    if (value.length === 2) {
        value = value + "-" + value;
    }

    const msg = new IntlMessageFormat('', value);
    return msg.resolvedOptions().locale ?? defaultLocale;
}

export function init(locale: string) {
    return i18n
        .use(ICU)
        .use(HttpBackend)
        .use(initReactI18next)
        .init({
            lng: getLocale(locale),
            fallbackLng: 'en',
            load: "languageOnly",
            ns: ['core'],
            defaultNS: 'core',
            debug: process.env.NODE_ENV !== 'production',
        });
}

export function change(locale: string) {
    return i18n.changeLanguage(getLocale(locale));
}

export default i18n;