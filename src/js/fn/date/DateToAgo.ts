import i18next from 'i18next';
import toSafeInteger from 'lodash/toSafeInteger';
import { DateExtensions } from './DateExtensions';
import { formatInterval } from './formatInterval';

export function dateToAgo(date: Date) {
    DateExtensions();
    
    const now = new Date();
    const diff = now.diff(date);

    const diffSecs = toSafeInteger(Math.abs((now.getTime() - date.getTime()) / 1000));

    if (diffSecs < 29) {
        return i18next.t("just_now", { ns: "datetime"});
    } else if (diffSecs < 86399) {
        return formatInterval(diff, 1) + " " + i18next.t("ago", { ns: "datetime"});
    } else {
        return date.toLocaleDateString();
    }
}