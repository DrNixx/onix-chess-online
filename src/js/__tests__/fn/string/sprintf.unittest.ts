import {describe, expect, it} from '@jest/globals';
import sprintf from "../../../fn/string/Sprintf";

describe('fn/array/Sprintf', function() {
    describe('#sprintf()', function() {
        it('test string format', function() {
            const fmt = "val %s and %s";
            const a = "val1";
            const b = "val2";
            
            const res = sprintf(fmt, a, b);
            expect(res).toBe("val val1 and val2");
        });

        it('test mix format', function() {
            const fmt = "There are %d monkeys in the %s";
            const a = 5;
            const b = "tree";
            
            const res = sprintf(fmt, a, b);
            expect(res).toBe("There are 5 monkeys in the tree");
        });

        it('test mix format with orders', function() {
            const fmt = "The %2$s contains %1$d monkeys";
            const a = 5;
            const b = "tree";
            
            const res = sprintf(fmt, a, b);
            expect(res).toBe("The tree contains 5 monkeys");
        });
        
        it('test format numbers with lead zero', function() {
            const fmt = "%04d-%02d-%02d";
            const res = sprintf(fmt, 1971, 5, 12);
            expect(res).toBe("1971-05-12");
        });


    });
});