import { DateInterval } from './DateInterval';

const secondsInDay = 86400;

export const timestampToInterval = (ts: number): DateInterval => {
    const neg = (ts < 0);
    ts = Math.abs(ts);
    
    let timeval = Math.floor(ts / 1000);    
    const msecs = ts - timeval * 1000;

    const days = Math.floor(timeval / secondsInDay); 
    
    timeval -= days * secondsInDay;
    const hours = Math.floor(timeval / 3600); 

    timeval -= hours * 3600;
    const mins = Math.floor(timeval / 60); 
    
    timeval -= mins * 60;
    const secs = timeval;

    return {
        y: 0,
        m: 0,
        d: days,
        h: hours,
        i: mins,
        s: secs,
        f: msecs,
        invert: neg,
        days: false
    };
}