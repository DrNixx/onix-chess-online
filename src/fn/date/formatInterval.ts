import i18next from 'i18next';
import { DateInterval, normalize } from './DateInterval';

export const formatInterval = (interval: DateInterval, parts = 0): string => {
    interval = normalize(interval);

    const format: (string|boolean)[] = [];
    if (interval.y !== 0) {
        format.push(
            i18next.t("years", { ns: "datetime", y: interval.y })
        );
    } else {
        format.push(false);
    }

    if (interval.m !== 0) {
        format.push(
            i18next.t("months", { ns: 'datetime', m: interval.m })
        );
    } else {
        format.push(false);
    }

    if (interval.d !== 0) {
        format.push(
            i18next.t("days", { ns: 'datetime', d: interval.d })
        );
    } else {
        format.push(false);
    }

    if (interval.h !== 0) {
        format.push(
            i18next.t("hours", { ns: 'datetime', h: interval.h })
        );
    } else {
        format.push(false);
    }

    if (interval.i !== 0) {
        format.push(
            i18next.t("minutes", { ns: 'datetime', i: interval.i })
        );
    } else {
        format.push(false);
    }

    if (interval.s !== 0) {
        format.push(
            i18next.t("seconds", { ns: 'datetime', s: interval.s })
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