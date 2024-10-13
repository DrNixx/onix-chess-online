import { BaseEditor, Editor, Node, Selection } from 'slate';
import { CustomElement } from '../types/blocks';

export type NodeWithIdentifier = Node & {
    id: string;
};

export function nodeHasIdent(node: Node): node is NodeWithIdentifier {
    return 'id' in node;
}

export interface MaterialEditor extends BaseEditor {
    /**
     * Is the current editor selection a range, that is the focus and the anchor are different?
     */
    isSelectionExpanded: () => boolean;

    /**
     * Returns true if current selection is collapsed, that is there is no selection at all
     * (the focus and the anchor are the same).
     *
     * @returns {boolean} true if the selection is collapsed
     */
    isSelectionCollapsed: () => boolean;

    /**
     * Is the editor focused?
     * @returns {boolean} true if the editor has focus. */
    isFocused: () => boolean;

    /**
     * Unwraps any node of `type` within the current selection.
     */
    unwrapNode: (type: string) => void;

    /**
     *
     * @param {string} type type of node to be checked. Example: `comment`, `numbered-list`
     *
     * @returns {bool} true if within current selection there is a node of type `type`
     */
    isNodeTypeActive: (type: string) => boolean;

    /**
     * Variable for holding a selection may be forgotten.
     */
    rememberedSelection: any;

    /**
     * Gets current selection and stores it in rememberedSelection.
     *
     * This may be useful when you need to open a dialog box and the editor loses the focus
     */
    rememberCurrentSelection: () => void;

    /**
     * Is the current selection collapsed?
     */
    isCollapsed: () => boolean;

    /**
     * Wraps a selection with an argument. If `wrapSelection` is not passed
     * uses current selection
     *
     * Upon wrapping moves the cursor to the end.
     *
     * @param {Node} node the node to be added
     * @param {Selection} wrapSelection selection of the text that will be wrapped with the node.
     *
     */
    wrapNode: (node: CustomElement, wrapSelection?: Selection | null) => void;

    /**
     * Unwraps or removes the nodes that are not in the list.
     *
     * It will search for all the nodes of `type` in the editor and will keep only
     * the ones in the nodesToKeep.
     *
     * It assumes each item of nodesToKeep has an attribute `id`. This attribute will be the discriminator.
     *
     */
    syncExternalNodes: (type: string, nodesToKeep: NodeWithIdentifier[], unwrap?: boolean) => void;

    /**
     * Removes the nodes that are not in the list of Ids
     *
     * Nodes of type `type` shall have the attribute/property `id`
     *
     * Example:
     * ```
     * {
     *    type: `comment`
     *    id: 30
     *    data: { ... }
     *  }
     * ```
     */
    removeNotInList: (type: string, listOfIds: string[]) => void;

    /**
     *
     * Unwraps the nodes of `type` whose ids are not in the provided list
     *
     * It assumes the nodes of `type` have an attribute `id`. The `id` may be a number or string.
     *
     * @param {string} type node type to be searched. Example: `comment`
     * @param {Array} listOfIds Array with the list of ids. Example: [1, 2, 3].
     */
    unwrapNotInList: (type: string, listOfIds: string[]) => void;

    /**
     * Gets from current editor content the list of items of a particular type
     */
    findNodesByType: (type: string) => Node[];

    /**
     * Returns the serialized value (plain text)
     */
    serialize: (nodes: Node[]) => string;

    /**
     * Functions similar to syncExternalNodes,and also updates the node temporaryId with original id and data
     *
     * First, It will search for match in temporaryId's in nodesToKeep with id's of nodes and updates it with latest data
     * Then, updates data in node id's matching with nodesToKeep id's
     *
     * Unwraps or removes the nodes that are not in the list.
     */
    syncExternalNodesWithTemporaryId: (type: string, nodesToKeep: NodeWithIdentifier[], unwrap?: boolean) => void;

    /**
     * Is to get the selected plain text from the editor.selection
     *
     * @returns {string} selected text
     */
    getSelectedText: () => string;
}

const MaterialEditor = {
    ...Editor,

    /**
     * Is the current editor selection a range, that is the focus and the anchor are different?
     *
     * @param {MaterialEditor} editor
     */
    isSelectionExpanded: (editor: MaterialEditor) => {
        return editor.isSelectionExpanded();
    },

    /**
     * Returns true if current selection is collapsed, that is there is no selection at all
     * (the focus and the anchor are the same).
     *
     * @param {MaterialEditor} editor
     *
     * @returns {boolean} true if the selection is collapsed
     */
    isSelectionCollapsed: (editor: MaterialEditor): boolean => {
        return editor.isSelectionCollapsed();
    },

    /**
     * Is the editor focused?
     *
     * @param {MaterialEditor} editor
     *
     * @returns {boolean} true if the editor has focus. */
    isFocused: (editor: MaterialEditor): boolean => {
        return editor.isFocused();
    },

    /**
     * Unwraps any node of `type` within the current selection.
     *
     * @param {MaterialEditor} editor
     * @param {string} type
     */
    unwrapNode: (editor: MaterialEditor, type: string) => {
        editor.unwrapNode(type);
    },

    /**
     *
     * @param {MaterialEditor} editor
     * @param {string} type type of node to be checked. Example: `comment`, `numbered-list`
     *
     * @returns {boolean} true if within current selection there is a node of type `type`
     */
    isNodeTypeActive: (editor: MaterialEditor, type: string): boolean => {
        return editor.isNodeTypeActive(type);
    },

    /**
     * Gets current selection and stores it in rememberedSelection.
     *
     * This may be useful when you need to open a dialog box and the editor loses the focus
     *
     * @param {MaterialEditor} editor
     */
    rememberCurrentSelection: (editor: MaterialEditor) => {
        editor.rememberCurrentSelection();
    },

    /**
     * Is the current selection collapsed?
     *
     * @param {MaterialEditor} editor
     */
    isCollapsed: (editor: MaterialEditor) => {
        return editor.isCollapsed();
    },

    /**
     * Wraps a selection with an argument. If `wrapSelection` is not passed
     * uses current selection
     *
     * Upon wrapping moves the cursor to the end.
     *
     * @param {MaterialEditor} editor
     * @param {Node} node the node to be added
     * @param {Selection} wrapSelection selection of the text that will be wrapped with the node.
     *
     */
    wrapNode: (editor: MaterialEditor, node: CustomElement, wrapSelection?: Selection | null) => {
        editor.wrapNode(node, wrapSelection);
    },

    /**
     * Unwraps or removes the nodes that are not in the list.
     *
     * It will search for all the nodes of `type` in the editor and will keep only
     * the ones in the nodesToKeep.
     *
     * It assumes each item of nodesToKeep has an attribute `id`. This attribute will be the discriminator.
     *
     */
    syncExternalNodes: (editor: MaterialEditor, type: string, nodesToKeep: NodeWithIdentifier[], unwrap?: boolean) => {
        editor.syncExternalNodes(type, nodesToKeep, unwrap);
    },

    /**
     * Removes the nodes that are not in the list of Ids
     *
     * Nodes of type `type` shall have the attribute/property `id`
     *
     * Example:
     * ```
     * {
     *    type: `comment`
     *    id: 30
     *    data: { ... }
     *  }
     * ```
     */
    removeNotInList: (editor: MaterialEditor, type: string, listOfIds: string[]) => {
        editor.removeNotInList(type, listOfIds);
    },

    /**
     *
     * Unwraps the nodes of `type` whose ids are not in the provided list
     *
     * It assumes the nodes of `type` have an attribute `id`. The `id` may be a number or string.
     *
     * @param {MaterialEditor} editor
     * @param {string} type node type to be searched. Example: `comment`
     * @param {Array} listOfIds Array with the list of ids. Example: [1, 2, 3].
     */
    unwrapNotInList: (editor: MaterialEditor, type: string, listOfIds: string[]) => {
        editor.unwrapNotInList(type, listOfIds);
    },

    /**
     * Gets from current editor content the list of items of a particular type
     */
    findNodesByType: (editor: MaterialEditor, type: string) => {
        return editor.findNodesByType(type);
    },

    /**
     * Returns the serialized value (plain text)
     */
    serialize: (editor: MaterialEditor, nodes: Node[]) => {
        return editor.serialize(nodes);
    },

    /**
     * Functions similar to syncExternalNodes,and also updates the node temporaryId with original id and data
     *
     * First, It will search for match in temporaryId's in nodesToKeep with id's of nodes and updates it with latest data
     * Then, updates data in node id's matching with nodesToKeep id's
     *
     * Unwraps or removes the nodes that are not in the list.
     */
    syncExternalNodesWithTemporaryId: (
        editor: MaterialEditor,
        type: string,
        nodesToKeep: NodeWithIdentifier[],
        unwrap?: boolean,
    ) => {
        editor.syncExternalNodesWithTemporaryId(type, nodesToKeep, unwrap);
    },

    /**
     * Is to get the selected plain text from the editor.selection
     *
     * @returns {string} selected text
     */
    getSelectedText: (editor: MaterialEditor): string => {
        return editor.getSelectedText();
    },
};

export default MaterialEditor;
