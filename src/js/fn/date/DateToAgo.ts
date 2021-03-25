import toSafeInteger from 'lodash/toSafeInteger';
import { DateExtensions } from './DateExtensions';
import { _ } from '../../i18n/i18n';
import { formatInterval } from './formatInterval';

export function dateToAgo(date: Date) {
    DateExtensions();
    
    const now = new Date();
    const diff = now.diff(date);

    const diffSecs = toSafeInteger(Math.abs((now.getTime() - date.getTime()) / 1000));

    if (diffSecs < 29) {
        return _("datetime", "just_now");
    } else if (diffSecs < 86399) {
        return formatInterval(diff, 1) + " " + _("datetime", "ago");
    } else {
        return date.toLocaleDateString();
    }
}