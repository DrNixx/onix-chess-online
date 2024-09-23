import { BaseEditor, Element } from 'slate';
import { CustomEditor } from '../../types/editors';
import { LinkElement } from '../../types/blocks';
import { LinksEditor } from './LinksEditor';

const withLinks = <T extends BaseEditor>(editor: T): T & LinksEditor => {
    const e = editor as T & CustomEditor;
    const { isInline } = editor;

    e.LINK_TYPE = 'link';

    /**
     * Set link type not to be an inline element
     */
    e.isInline = (element: Element) => {
        return element.type === e.LINK_TYPE ? true : isInline(element);
    };

    /**
     * If the editor loses focus upon pressing the `LinkButton`, you need to call
     * editor.rememberCurrentSelection() before the editor loses the focus
     */
    e.insertLink = (url) => {
        if (e.isNodeTypeActive(e.LINK_TYPE)) {
            e.unwrapNode(e.LINK_TYPE);
        }
        // editor selection on link button click
        const wrapSelection = editor.selection || e.rememberedSelection;
        editor.selection = wrapSelection ? wrapSelection : editor.selection;
        const node: LinkElement = {
            type: e.LINK_TYPE as any,
            url,
            children: e.isCollapsed() ? [{ text: url }] : [],
        };

        e.wrapNode(node, wrapSelection);
    };

    return e;
};

export default withLinks;
