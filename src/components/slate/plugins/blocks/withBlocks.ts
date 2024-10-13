import { Editor, BaseEditor, Transforms, Element as SlateElement } from 'slate';
import { BlocksEditor } from './BlocksEditor';
import { AlignElementType, BlockElementType } from '../../types/blocks';
import { CustomEditor } from '../../types/editors';

export function isFormatIsAlignment(format: string): format is AlignElementType {
    return ['left', 'center', 'right', 'justify'].includes(format);
}

/**
 * Helper functions for managing inline marks
 *
 * @param {Editor} editor
 */
const withBlock = <T extends BaseEditor>(editor: T): T & BlocksEditor => {
    const e = editor as T & CustomEditor;

    e.LIST_TYPES = ['numbered-list', 'bulleted-list'];

    /**
     * checks if a block is active
     */
    e.isBlockActive = (format, blockType = 'type') => {
        const { selection } = editor;
        if (!selection) return false;

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any)[blockType] === format,
            }),
        );

        return !!match;
    };

    /**
     * Toggles the block in the current selection
     */
    e.toggleBlock = (format) => {
        const isActive = e.isBlockActive(format, isFormatIsAlignment(format) ? 'align' : 'type');
        const isList = e.LIST_TYPES.includes(format);

        Transforms.unwrapNodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                e.LIST_TYPES.includes((n as any).type) &&
                !isFormatIsAlignment(format),
            split: true,
        });
        let newProperties: Partial<SlateElement>;
        if (isFormatIsAlignment(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            };
        } else {
            newProperties = {
                type: isActive ? 'paragraph' : isList ? 'list-item' : <BlockElementType>format,
            };
        }
        Transforms.setNodes<SlateElement>(editor, newProperties);

        if (!isActive && isList) {
            const block = { type: format, children: [] };
            Transforms.wrapNodes(editor, <any>block);
        }
    };

    return e;
};

export default withBlock;
