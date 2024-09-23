import { BaseEditor, Element, Transforms } from 'slate';
import { MentionEditor } from './MentionEditor';
import { MentionElement } from '../../types/blocks';
import { MentionData } from './types';

const withMentions = <T extends BaseEditor>(editor: T): T & MentionEditor => {
    const e = editor as T & MentionEditor;
    const { isInline, isVoid } = editor;

    e.isInline = (element: Element) => {
        return element.type === 'mention' ? true : isInline(element);
    };

    e.isVoid = (element: Element) => {
        return element.type === 'mention' ? true : isVoid(element);
    };

    e.insertMention = (data: MentionData) => {
        const mention: MentionElement = {
            type: 'mention',
            children: [{ text: '' }],
            ...data,
        };

        Transforms.insertNodes(editor, mention);
        Transforms.move(editor);
    };

    return e;
};

export default withMentions;
