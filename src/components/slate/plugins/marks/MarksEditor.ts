import { BaseEditor } from 'slate';
import { MarkTypes } from '../../types/marks';

export interface MarksEditor extends BaseEditor {
    isMarkActive: (mark: MarkTypes) => boolean;
    toggleMark: (mark: MarkTypes) => void;
}

export const MarksEditor = {
    isMarkActive(editor: MarksEditor, mark: MarkTypes) {
        return editor.isMarkActive(mark);
    },

    toggleMark(editor: MarksEditor, mark: MarkTypes) {
        return editor.toggleMark(mark);
    },
};
