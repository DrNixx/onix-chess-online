import isString from 'lodash/isString';

export class UIElement {
    protected body: JQuery;
    public element: JQuery;

    /**
     * @constructor
     */
    constructor(element: string | JQuery) {
        this.element = (isString(element)) ? $(element) : element;
        this.body = $("body");
    }

    public rebuild() {
        return;
    }

    /**
     * Отобразить элемент
     */
    public show() {
        this.element.show();
    }

    /**
     * Скрыть элемент
     */
    public hide() {
        this.element.hide();
    }

    /**
     * Добавить CSS класс к элементу
     */
    public addClass(cls: string): void {
        this.element.addClass(cls);
    }

    /**
     * Удалить CSS класс у элемента
     */
    public removeClass(cls: string): void {
        this.element.removeClass(cls);
    }
}