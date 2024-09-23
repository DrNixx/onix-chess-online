import { Editor, BaseEditor } from 'slate';
import { MarksEditor } from './MarksEditor';

/**
 * Helper functions for managing inline marks
 *
 * @param {Editor} editor
 */
const withMarks = <T extends BaseEditor>(editor: T): T & MarksEditor => {
    const e = editor as T & MarksEditor;

    /**
     * Checks if the mark is active
     */
    e.isMarkActive = (mark) => {
        const marks: any = Editor.marks(editor);
        return marks ? marks[mark] === true : false;
    };

    /**
     * Toggles on/off the mark. If the mark exists it is removed and vice versa.
     */
    e.toggleMark = (mark) => {
        e.isMarkActive(mark) ? Editor.removeMark(editor, mark) : Editor.addMark(editor, mark, true);
    };

    return e;
};

export default withMarks;
