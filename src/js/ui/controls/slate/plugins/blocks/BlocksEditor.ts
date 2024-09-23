import { BaseEditor } from 'slate';

export type BlockType = 'type' | 'align';

export interface BlocksEditor extends BaseEditor {
    LIST_TYPES: string[];

    /**
     * checks if a block is active
     */
    isBlockActive: (format: string, blockType?: BlockType) => boolean;

    /**
     * Toggles the block in the current selection
     */
    toggleBlock: (format: string) => void;
}

export const BlocksEditor = {
    /**
     * checks if a block is active
     */
    isBlockActive: (editor: BlocksEditor, format: string, blockType: BlockType = 'type') => {
        return editor.isBlockActive(format, blockType);
    },

    /**
     * Toggles the block in the current selection
     */
    toggleBlock: (editor: BlocksEditor, format: string) => {
        editor.toggleBlock(format);
    },
};
