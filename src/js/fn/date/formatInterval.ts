import { _ } from '../../i18n/i18n';
import { DateInterval, normalize } from './DateInterval';

export const formatInterval = (interval: DateInterval, parts: number = 0): string => {
    interval = normalize(interval);

    const format: (string|boolean)[] = [];
    if (interval.y !== 0) {
        format.push(
            _("datetime", "years", { y: interval.y })
        );
    } else {
        format.push(false);
    }

    if (interval.m !== 0) {
        format.push(
            _("datetime", "months", { m: interval.m })
        );
    } else {
        format.push(false);
    }

    if (interval.d !== 0) {
        format.push(
            _("datetime", "days", { d: interval.d })
        );
    } else {
        format.push(false);
    }

    if (interval.h !== 0) {
        format.push(
            _("datetime", "hours", { h: interval.h })
        );
    } else {
        format.push(false);
    }

    if (interval.i !== 0) {
        format.push(
            _("datetime", "minutes", { i: interval.i })
        );
    } else {
        format.push(false);
    }

    if (interval.s !== 0) {
        format.push(
            _("datetime", "seconds", { s: interval.s })
        );
    } else {
        format.push(false);
    }

    while ((format.length > 0) && !format[0]) {
        format.shift();
    }

    if (format.length === 0) {
        return "";
    }

    let values: string[];
    if ((parts > 0) && (format.length > 1)) {
        const slice = format.slice(0, parts);
        values = <string[]>slice.filter((a) => !!a);
    } else {
        values = <string[]>format.filter((a) => !!a);
    }

    return values.join(" ");
}