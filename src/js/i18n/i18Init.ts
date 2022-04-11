import i18n from "i18next";
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
        .use(HttpBackend)
        .use(initReactI18next)
        .init({
            lng: getLocale(locale),
            fallbackLng: 'en',
            load: "languageOnly",
            ns: ['core'],
            defaultNS: 'core',
            debug: true,
        })
        .then((p) => {
            i18n.services.formatter?.add('intl', (message, lng, options) => {
                const formatter = new IntlMessageFormat(message, lng);
                const result = formatter.format(options);
                if (result) {
                    if (typeof result === "string") {
                        return result;
                    } else {
                        return result.join(" ");
                    }
                }

                return message;
            });

            return p;
        });
}

export function change(locale: string) {
    return i18n.changeLanguage(getLocale(locale));
}

export default i18n;