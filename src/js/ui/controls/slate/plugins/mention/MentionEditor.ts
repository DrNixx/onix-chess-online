import { BaseEditor } from 'slate';
import { Element } from 'slate/dist/interfaces/element';
import { MentionData } from './types';

export interface MentionEditor extends BaseEditor {
    isInline: (element: Element) => boolean;
    isVoid: (element: Element) => boolean;
    insertMention: (data: MentionData) => void;
}

export const MentionEditor = {
    isInline: (editor: MentionEditor, element: Element) => {
        return editor.isInline(element);
    },

    isVoid: (editor: MentionEditor, element: Element) => {
        return editor.isVoid(element);
    },

    insertMention: (editor: MentionEditor, data: MentionData) => {
        editor.insertMention(data);
    },
};
