import toSafeInteger from 'lodash/toSafeInteger';
import { DateInterval, normalize } from './DateInterval';

declare global {
    interface Date {
       addDays(days: number): Date;
       diff(date: Date): DateInterval;
    }
 }

export function DateExtensions() {
    if (!Date.prototype.addDays) {
        Date.prototype.addDays = function(days: number): Date {
            const date = new Date(this.getTime());
            if (!days) return date;
            date.setDate(date.getDate() + days);
            return date;
        };
    }
    
    if (!Date.prototype.diff) {
        Date.prototype.diff = function(date: Date): DateInterval {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let d1: Date = this;
            let d2: Date = date; 
        
            const result: DateInterval = {
                y: 0,
                m: 0,
                d: 0,
                h: 0,
                i: 0,
                s: 0,
                f: 0,
                invert: false,
                days: false
            };
            
            if (date.getTime() > this.getTime()) {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                d1 = date; d2 = this; result.invert = true;
            }
        
            result.y = d1.getUTCFullYear() - d2.getFullYear();
            result.m = d1.getUTCMonth() - d2.getUTCMonth();
            result.d = d1.getUTCDate() - d2.getUTCDate();
            result.h = d1.getUTCHours() - d2.getUTCHours();
            result.i = d1.getUTCMinutes() - d2.getUTCMinutes();
            result.s = d1.getUTCMinutes() - d2.getUTCSeconds();
            result.f = d1.getUTCMilliseconds() - d2.getUTCMilliseconds();
            result.days = toSafeInteger(Math.abs((d1.getTime() - d2.getTime()) / 86400000));
        
            if (result.invert) {
                normalize(result, d2);
            } else {
                normalize(result, d1);
            }
            
            return result;
        };
    }
 }