import { UIElement } from './UIElement';

const condensedClassName = "condensed";

export class Content extends UIElement {
    public container: JQuery;

    /**
     * @constructor
     */
    constructor(content: string | JQuery) {
        super(content);
        this.container = this.element.find(".content");
    }

    public condensed(flag?: boolean): boolean {
        if (flag === undefined) {
            return this.element.hasClass(condensedClassName);
        } else {
            if (flag) {
                this.element.addClass(condensedClassName);
            } else {
                this.element.removeClass(condensedClassName);
            }

            return flag;
        }
    }

    public calculateHeight(): number|undefined {
        return this.element.height();
    }
}