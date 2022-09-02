import {describe, expect, it} from '@jest/globals';
import { DateExtensions } from "../../../src/js/fn/date/DateExtensions";

describe('fn/date/DateExtensions', function() {
    describe('#addDays()', function() {
        it('test add days to date', function() {
            DateExtensions();
            const d = new Date(2020, 2, 10, 12, 0, 0)
            const d2 = d.addDays(5);
            expect(d.getDate()).toBe(10);
            expect(d2.getDate()).toBe(15);
        });
    });

    describe('#diff()', function() {
        it('test diff two date', function() {
            DateExtensions();
            
            function examine_diff(start_date: Date|string, end_date: Date|string, expect_spec: string, expect_days: number) {
                let start: Date;
                let end: Date;
                if (typeof start_date === "string") {
                    start = new Date(start_date);
                } else {
                    start = start_date;
                }
                start_date = start.toISOString();
            
                if (typeof end_date === "string") {
                    end = new Date(end_date);
                } else {
                    end = end_date;
                }
                end_date = end.toISOString();

                const result_interval = start.diff(end);
                const result_spec = "P" + (result_interval.invert ? "-" : "+") + 
                    result_interval.y.toString() + "Y" +
                    result_interval.m.toString() + "M" + 
                    result_interval.d.toString() + "DT" + 
                    result_interval.h.toString() + "H" +
                    result_interval.i.toString() + "M" +
                    result_interval.s.toString() + "S";
                
                expect(result_spec, `DIFF spec: ${end_date} - ${start_date}`).to.equal(expect_spec);
                expect(result_interval.days, `DIFF days: ${end_date} - ${start_date}`).to.equal(expect_days);
            }

            examine_diff('2009-01-14', '2009-01-07', 'P+0Y0M7DT0H0M0S', 7);
            examine_diff('2007-02-07', '2000-02-07', 'P+7Y0M0DT0H0M0S', 2557);
            examine_diff('2007-02-08', '2000-02-07', 'P+7Y0M1DT0H0M0S', 2558);
            examine_diff('2007-02-06', '2000-02-07', 'P+6Y11M30DT0H0M0S', 2556);
            examine_diff('2007-03-07', '2000-02-07', 'P+7Y1M0DT0H0M0S', 2585);
            examine_diff('2007-01-07', '2000-02-07', 'P+6Y11M0DT0H0M0S', 2526);
            examine_diff('2007-01-07', '1999-12-07', 'P+7Y1M0DT0H0M0S', 2588);
            examine_diff('2006-12-07', '2000-01-07', 'P+6Y11M0DT0H0M0S', 2526);
            examine_diff('2009-01-07', '2009-01-14', 'P-0Y0M7DT0H0M0S', 7);
            examine_diff('2000-02-07', '2007-02-07', 'P-7Y0M0DT0H0M0S', 2557);
            examine_diff('2000-02-07', '2007-02-08', 'P-7Y0M1DT0H0M0S', 2558);
            examine_diff('2000-02-07', '2007-03-07', 'P-7Y1M0DT0H0M0S', 2585);
            examine_diff('2000-02-07', '2007-01-07', 'P-6Y11M0DT0H0M0S', 2526);
            examine_diff('2000-02-07', '2007-02-06', 'P-6Y11M28DT0H0M0S', 2556);
            examine_diff('1999-12-07', '2007-01-07', 'P-7Y1M0DT0H0M0S', 2588);
            examine_diff('2000-01-07', '2006-12-07', 'P-6Y11M0DT0H0M0S', 2526);

            examine_diff('2010-03-31', '2010-03-01', 'P+0Y0M30DT0H0M0S', 30);
            examine_diff('2010-04-01', '2010-03-01', 'P+0Y1M0DT0H0M0S', 31);

            examine_diff('2010-04-01', '2010-03-31', 'P+0Y0M1DT0H0M0S', 1);
            examine_diff('2010-04-29', '2010-03-31', 'P+0Y0M29DT0H0M0S', 29);
            examine_diff('2010-04-30', '2010-03-31', 'P+0Y0M30DT0H0M0S', 30);
            examine_diff('2010-04-30', '2010-03-30', 'P+0Y1M0DT0H0M0S', 31);
            examine_diff('2010-04-30', '2010-03-29', 'P+0Y1M1DT0H0M0S', 32);
            examine_diff('2010-01-29', '2010-01-01', 'P+0Y0M28DT0H0M0S', 28);
            examine_diff('2010-01-30', '2010-01-01', 'P+0Y0M29DT0H0M0S', 29);
            examine_diff('2010-01-31', '2010-01-01', 'P+0Y0M30DT0H0M0S', 30);
            examine_diff('2010-02-01', '2010-01-01', 'P+0Y1M0DT0H0M0S', 31);
            examine_diff('2010-02-01', '2010-01-31', 'P+0Y0M1DT0H0M0S', 1);
            examine_diff('2010-02-27', '2010-01-31', 'P+0Y0M27DT0H0M0S', 27);
            examine_diff('2010-02-28', '2010-01-31', 'P+0Y0M28DT0H0M0S', 28);
            examine_diff('2010-02-28', '2010-01-30', 'P+0Y0M29DT0H0M0S', 29);
            examine_diff('2010-02-28', '2010-01-29', 'P+0Y0M30DT0H0M0S', 30);
            examine_diff('2010-02-28', '2010-01-28', 'P+0Y1M0DT0H0M0S', 31);
            examine_diff('2010-02-28', '2010-01-27', 'P+0Y1M1DT0H0M0S', 32);
            examine_diff('2010-03-01', '2010-01-01', 'P+0Y2M0DT0H0M0S', 59);
            examine_diff('2010-03-01', '2010-01-31', 'P+0Y0M29DT0H0M0S', 29);
            examine_diff('2010-03-27', '2010-01-31', 'P+0Y1M24DT0H0M0S', 55);
            examine_diff('2010-03-28', '2010-01-31', 'P+0Y1M25DT0H0M0S', 56);
            examine_diff('2010-03-29', '2010-01-31', 'P+0Y1M26DT0H0M0S', 57);
            examine_diff('2010-03-30', '2010-01-31', 'P+0Y1M27DT0H0M0S', 58);
            examine_diff('2010-03-31', '2010-01-31', 'P+0Y2M0DT0H0M0S', 59);
            examine_diff('2010-03-31', '2010-01-30', 'P+0Y2M1DT0H0M0S', 60);
            examine_diff('2009-01-31', '2009-01-01', 'P+0Y0M30DT0H0M0S', 30);
            examine_diff('2010-03-27', '2010-02-28', 'P+0Y0M27DT0H0M0S', 27);
            examine_diff('2010-03-28', '2010-02-28', 'P+0Y1M0DT0H0M0S', 28);
            examine_diff('2010-03-29', '2010-02-28', 'P+0Y1M1DT0H0M0S', 29);
            examine_diff('2010-03-27', '2010-02-27', 'P+0Y1M0DT0H0M0S', 28);
            examine_diff('2010-03-27', '2010-02-26', 'P+0Y1M1DT0H0M0S', 29);
            examine_diff('2010-03-01', '2010-03-31', 'P-0Y0M30DT0H0M0S', 30);
            examine_diff('2010-03-01', '2010-04-01', 'P-0Y1M0DT0H0M0S', 31);
            examine_diff('2010-03-31', '2010-04-01', 'P-0Y0M1DT0H0M0S', 1);
            examine_diff('2010-03-31', '2010-04-29', 'P-0Y0M29DT0H0M0S', 29);
            examine_diff('2010-03-31', '2010-04-30', 'P-0Y0M30DT0H0M0S', 30);
            examine_diff('2010-03-30', '2010-04-30', 'P-0Y1M0DT0H0M0S', 31);
            examine_diff('2010-03-29', '2010-04-30', 'P-0Y1M1DT0H0M0S', 32);
            examine_diff('2010-01-01', '2010-01-29', 'P-0Y0M28DT0H0M0S', 28);
            examine_diff('2010-01-01', '2010-01-30', 'P-0Y0M29DT0H0M0S', 29);
            examine_diff('2010-01-01', '2010-01-31', 'P-0Y0M30DT0H0M0S', 30);
            examine_diff('2010-01-01', '2010-02-01', 'P-0Y1M0DT0H0M0S', 31);
            examine_diff('2010-01-31', '2010-02-01', 'P-0Y0M1DT0H0M0S', 1);
            examine_diff('2010-01-31', '2010-02-27', 'P-0Y0M27DT0H0M0S', 27);
            examine_diff('2010-01-31', '2010-02-28', 'P-0Y0M28DT0H0M0S', 28);
            examine_diff('2010-01-30', '2010-02-28', 'P-0Y0M29DT0H0M0S', 29);
            examine_diff('2010-01-29', '2010-02-28', 'P-0Y0M30DT0H0M0S', 30);
            examine_diff('2010-01-28', '2010-02-28', 'P-0Y1M0DT0H0M0S', 31);
            examine_diff('2010-01-27', '2010-02-28', 'P-0Y1M1DT0H0M0S', 32);
            examine_diff('2010-01-01', '2010-03-01', 'P-0Y2M0DT0H0M0S', 59);
            examine_diff('2010-01-31', '2010-03-01', 'P-0Y1M1DT0H0M0S', 29);
            examine_diff('2010-01-31', '2010-03-27', 'P-0Y1M27DT0H0M0S', 55);
            examine_diff('2010-01-31', '2010-03-28', 'P-0Y1M28DT0H0M0S', 56);
            examine_diff('2010-01-31', '2010-03-29', 'P-0Y1M29DT0H0M0S', 57);
            examine_diff('2010-01-31', '2010-03-30', 'P-0Y1M30DT0H0M0S', 58);
            examine_diff('2010-01-31', '2010-03-31', 'P-0Y2M0DT0H0M0S', 59);
            examine_diff('2010-01-30', '2010-03-31', 'P-0Y2M1DT0H0M0S', 60);
            examine_diff('2009-01-01', '2009-01-31', 'P-0Y0M30DT0H0M0S', 30);
            examine_diff('2010-02-28', '2010-03-27', 'P-0Y0M27DT0H0M0S', 27);
            examine_diff('2010-02-28', '2010-03-28', 'P-0Y1M0DT0H0M0S', 28);
            examine_diff('2010-02-28', '2010-03-29', 'P-0Y1M1DT0H0M0S', 29);
            examine_diff('2010-02-27', '2010-03-27', 'P-0Y1M0DT0H0M0S', 28);
            examine_diff('2010-02-26', '2010-03-27', 'P-0Y1M1DT0H0M0S', 29);
        });
    });
});