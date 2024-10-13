import { BaseEditor } from 'slate';
import { Element } from 'slate/dist/interfaces/element';

export interface LinksEditor extends BaseEditor {
    LINK_TYPE: string;

    /**
     * Set link type not to be an inline element
     */
    isInline: (element: Element) => boolean;

    /**
     * If the editor loses focus upon pressing the `LinkButton`, you need to call
     * editor.rememberCurrentSelection() before the editor loses the focus
     */
    insertLink: (url: string) => void;
}

export const LinksEditor = {
    isInline: (editor: LinksEditor, element: Element) => {
        return editor.isInline(element);
    },

    /**
     * If the editor loses focus upon pressing the `LinkButton`, you need to call
     * editor.rememberCurrentSelection() before the editor loses the focus
     */
    insertLink: (editor: LinksEditor, url: string) => {
        editor.insertLink(url);
    },
};
