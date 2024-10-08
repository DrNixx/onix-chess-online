import toSafeInteger from 'lodash/toSafeInteger';

export interface DateInterval {
    y: number,
    m: number,
    d: number,
    h: number,
    i: number,
    s: number,
    f: number,
    invert: boolean,
    days: number | boolean,
}

function date_range_limit(start: number, end: number, adj: number, a: string, b: string, interval: DateInterval): DateInterval {
    const result = (interval as { [key: string]: any });
    if (result[a] < start) {
        result[b] -= toSafeInteger((start - result[a] - 1) / adj) + 1;
        result[a] += adj * toSafeInteger((start - result[a] - 1) / adj + 1);
    }

    if (result[a] >= end) {
        result[b] += toSafeInteger(result[a] / adj);
        result[a] -= adj * toSafeInteger(result[a] / adj);
    }

    return result as DateInterval;
}

function date_range_limit_days(base: Date, result: DateInterval)
{
    const days_in_month_leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const days_in_month =      [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // date_range_limit(1, 13, 12, "m", "y", base);

    let year = base.getFullYear();
    let month = base.getMonth();
    if (!result.invert) {
        while (result.d < 0) {
            month--;
            if (month < 0) {
                month += 12;
                year--;
            }

            const leapyear = year % 400 == 0 || (year % 100 != 0 && year % 4 == 0);
            const days = leapyear ? days_in_month_leap[month] : days_in_month[month];

            result.d += days;
            result.m--;
        }
    } else {
        while (result.d < 0) {
            const leapyear = year % 400 == 0 || (year % 100 != 0 && year % 4 == 0);
            const days = leapyear ? days_in_month_leap[month] : days_in_month[month];

            result.d += days;
            result.m--;

            month++;
            if (month > 11) {
                month -= 12;
                year++;
            }
        }
    }

    return result;
}

export function normalize(interval: DateInterval, base?: Date) {
    if (base === undefined) {
        base = new Date();
    }

    interval = date_range_limit(0, 1000, 1000, "f", "s", interval);
    interval = date_range_limit(0, 60, 60, "s", "i", interval);
    interval = date_range_limit(0, 60, 60, "i", "h", interval);
    interval = date_range_limit(0, 24, 24, "h", "d", interval);
    interval = date_range_limit(0, 12, 12, "m", "y", interval);

    interval = date_range_limit_days(base, interval);

    interval = date_range_limit(0, 12, 12, "m", "y", interval);

    return interval;
}