import { IntlMessageFormat } from 'intl-messageformat';
import warning from 'warning';
import * as enTranslation from './en-us.json';
import * as esTranslation from './es-es.json';
import * as ruTranslation from './ru-ru.json';

const defaultLocale = "en-us";
let initialized = false;

class IntlManager {
    private currentLocale: string = defaultLocale;
    private strings: i18n.Strings = {};

    public constructor() {
        if ((window !== undefined) && (window["navigator"])) {
            this.setLocale(window.navigator.language);
        }

        this.register();
    }

    public setLocale = (value: string) => {
        if (value) {
            if (value.length === 2) {
                value = value + "-" + value;
            }
            
            const msg = new IntlMessageFormat('', value);
            const locale = msg.resolvedOptions().locale;
            if (locale) {
                this.currentLocale = locale.toLowerCase();
            } else {
                this.currentLocale = defaultLocale;
            }
        }
        
        
        return this.currentLocale;
    };

    private safeT = (category: string, locale: string, key: string) => {
        let result: string = key;
        if (this.strings[locale] && this.strings[locale][category] && this.strings[locale][category][key]) {
            result = <string>this.strings[locale][category][key];
        }
        
        return result;
    };

    public t = (category: string, key: string, args?: any): string => {
        let message = this.safeT(category, this.currentLocale, key);
        if (message === key) {
            message = this.safeT(category, defaultLocale, key);
        }

        warning(message !== key,
            `Empty string for category ${category} and key ${key}.`
        );

        const formatter = new IntlMessageFormat(message, this.currentLocale);
        const result = formatter.format(args);
        if (result) {
            if (typeof result === "string") {
                return result;
            } else {
                return result.join(" ");
            }
        }
        return message;
    };

    private registerStrings = (lang: string, category: string, strings: i18n.StringsMap) => {
        if (this.strings[lang] === undefined) {
            this.strings[lang] = {};
        }

        if (this.strings[lang][category] === undefined) {
            this.strings[lang][category] = {};
        }

        for (const key in strings) {
            this.strings[lang][category][key] = strings[key];
        }
    };

    public registerCategories = (lang: string, strings: i18n.StringsCategory) => {
        for (const category in strings) {
            this.registerStrings(lang, category, strings[category]);    
        }    
    }

    public register = (i18n?: i18n.StringsCategory) => {
        if (!initialized) {
            this.registerCategories("en-us", enTranslation);
            this.registerCategories("es-es", esTranslation);
            this.registerCategories("ru-ru", ruTranslation);

            initialized = true;
        }

        if (i18n !== undefined) {
            this.registerCategories(this.currentLocale, i18n);
        }
    }
}

const manager = new IntlManager(); 
export const _ = manager.t;

export namespace i18n {
    export interface StringsMap {
        [key: string]: string | string[];
    }
    
    export interface StringsCategory {
        [module: string]: StringsMap;
    }
    
    export interface Strings {
        [lang: string]: StringsCategory;
    }

    
    export const setLocale = manager.setLocale;
    export const register = manager.register;
    export const registerCategories = manager.registerCategories;
}

