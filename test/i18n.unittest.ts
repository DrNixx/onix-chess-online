import { expect } from 'chai';
import { i18n, _ } from "../src/js/i18n/i18n";

describe('Intl', function() {
    describe('#t()', function() {
        it('test function with default locale', function() {
            i18n.setLocale('en-us');
            const s = _("timer", "lessone");
            expect(s).to.equal("less 1");
        });

        it('test function with change locale', function() {
            i18n.setLocale('en-us');
            let s = _("timer", "lessone");
            expect(s).to.equal("less 1");

            i18n.setLocale('ru-ru');
            s = _("timer", "lessone");
            expect(s).to.equal("менее 1");

            i18n.setLocale('ru');
            s = _("timer", "lessone");
            expect(s).to.equal("менее 1");
        });

        it('test function with nonexistent locale', function() {
            i18n.setLocale('fr-fr');
            const s = _("timer", "lessone");
            expect(s).to.equal("less 1");
        });

        it('test function with custom strings', function() {
            i18n.register({core: { lessone: "my string"}});
            const s = _("core", "lessone");
            expect(s).to.equal("my string");
        });
    });
});