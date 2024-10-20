import i18next from 'i18next';
import padStart from 'lodash/padStart';
import { timestampToInterval  } from './timestampToInterval';

export const formatTimer = (timestamp: number, isend?: string): string => {
    if (isNaN(timestamp)) {
        return i18next.t("empty", {ns: "timer"});
    }

    const interval = timestampToInterval(timestamp);
    const result: string[] = [];
    if (interval.invert || ((interval.d === 0) && (interval.h === 0) && (interval.i === 0) && (interval.s === 0) && (interval.f === 0))) {
        result.push(
            isend ?? i18next.t('isend', {ns: "timer"})
        );
    } else {
        if (interval.d > 0) {
            result.push(
                i18next.t('days', { ns: "timer", d: interval.d })
            );
            
            if (interval.h > 0) {
                result.push(
                    i18next.t('hours', { ns: "timer", h: interval.h })
                );
            }
        } else {
            const f = (interval.h === 0) && (interval.i === 0) && (interval.s < 10) && (interval.f > 0) ? "." + padStart(interval.f.toString(), 3, "0") : "";
            if (interval.h > 0) {
                result.push(
                    padStart(interval.h.toString(), 2, "0") + ":" + 
                    padStart(interval.i.toString(), 2, "0") + ":" + 
                    padStart(interval.s.toString(), 2, "0") + f
                );
            } else if (interval.i > 0) {
                result.push(
                    padStart(interval.i.toString(), 2, "0") + ":" + 
                    padStart(interval.s.toString(), 2, "0") + f
                );
            } else {
                if (f.length > 0) {
                    result.push(
                        padStart(interval.s.toString(), 2, "0") + f
                    );
                } else {
                    result.push(
                        padStart(interval.i.toString(), 2, "0") + ":" + 
                        padStart(interval.s.toString(), 2, "0") + f
                    );
                }
            }
        }
    }

    return result.join(" ");
}