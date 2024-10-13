import { Range, Transforms, Node, Editor, Element as SlateElement, BaseEditor, BaseSelection } from 'slate';
import { ReactEditor } from 'slate-react';
import { MaterialEditor, nodeHasIdent, NodeWithIdentifier } from './MaterialEditor';

/**
 *
 * Base plugin for Material Slate.
 *
 * All other plugins assume this plugin exists and has been included.
 *
 * @param {ReactEditor} editor
 */
const withMaterial = <T extends BaseEditor & ReactEditor>(editor: T): T & MaterialEditor => {
    const e = editor as T & MaterialEditor;

    /**
     * Is the current editor selection a range, that is the focus and the anchor are different?
     *
     * @returns {boolean} true if the current selection is a range.
     */
    e.isSelectionExpanded = (): boolean => {
        return editor.selection ? Range.isExpanded(editor.selection) : false;
    };

    /**
     * Returns true if current selection is collapsed, that is there is no selection at all
     * (the focus and the anchor are the same).
     *
     * @returns {boolean} true if the selection is collapsed
     */
    e.isSelectionCollapsed = (): boolean => {
        return !e.isSelectionExpanded();
    };

    /**
     * Is the editor focused?
     * @returns {boolean} true if the editor has focus. */
    e.isFocused = (): boolean => {
        return ReactEditor.isFocused(editor);
    };

    /**
     * Unwraps any node of `type` within the current selection.
     */
    e.unwrapNode = (type) => {
        Transforms.unwrapNodes(editor, { match: (n) => SlateElement.isElement(n) && n.type === type });
    };

    /**
     *
     * @param {string} type type of node to be checked. Example: `comment`, `numbered-list`
     *
     * @returns {boolean} true if within current selection there is a node of type `type`
     */
    e.isNodeTypeActive = (type: string): boolean => {
        const [node] = Editor.nodes(editor, { match: (n) => SlateElement.isElement(n) && n.type === type });
        return !!node;
    };

    /**
     * Variable for holding a selection may be forgotten.
     */
    e.rememberedSelection = {};

    /**
     * Gets current selection and stores it in rememberedSelection.
     *
     * This may be useful when you need to open a dialog box and the editor loses the focus
     */
    e.rememberCurrentSelection = () => {
        e.rememberedSelection = editor.selection;
    };

    /**
     * Is the current selection collapsed?
     */
    e.isCollapsed = () => {
        const { selection } = editor;
        return !!(selection && Range.isCollapsed(selection));
    };

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
    e.wrapNode = (node: Node, wrapSelection?: BaseSelection) => {
        //if wrapSelection is passed => we use it. Use editor selection in other case
        editor.selection = wrapSelection ? wrapSelection : editor.selection;

        // if the node is already wrapped with current node we unwrap it first.
        if (e.isNodeTypeActive(node.type)) {
            e.unwrapNode(node.type);
        }
        // if there is no text selected => insert the node.
        if (e.isCollapsed()) {
            Transforms.insertNodes(editor, node);
        } else {
            //text is selected => add the node
            Transforms.wrapNodes(editor, node, { split: true });
            Transforms.collapse(editor, { edge: 'end' });
        }

        // Add {isLast} property to the last fragment of the comment.
        const path = [...Editor.last(editor, editor.selection!)[1]];
        //The last Node is a text whose parent is a comment.
        path.pop(); // Removes last item of the path, to point the parent

        Transforms.setNodes(editor, { isLast: true } as any, { at: path }); // add isLast
    };

    /**
     * Unwraps or removes the nodes that are not in the list.
     *
     * It will search for all the nodes of `type` in the editor and will keep only
     * the ones in the nodesToKeep.
     *
     * It assumes each item of nodesToKeep has an attribute `id`. This attribute will be the discriminator.
     *
     */
    /*
    e.syncExternalNodes = (type, nodesToKeep, unwrap = true) => {
        //extracts the id from the nodes and removes those that are not in the list
        const listOfIds = nodesToKeep.map(node => node.id);

        if (unwrap) {
            editor.unwrapNotInList(type, listOfIds);
        } else {
            editor.removeNotInList(type, listOfIds);
        }
        const nodesToKeepObj = new Map<string, Node>();

        //Update values of nodes.data
        //Create a map by id of the nodes to keep
        nodesToKeep.forEach(node => nodesToKeepObj.set(node.id, node))
        //Find nodes of this type remaining in the editor
        const editorNodes = editor.findNodesByType(type)
        //Update them
        editorNodes.map(node => {
            Transforms.setNodes(
                editor,
                { data: nodesToKeepObj[node.id] },
                { match: n => nodeHasIdent(n) && nodeHasIdent(node) && n.id == node.id, at: [] }
            )
        })
    }
    */

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
    e.removeNotInList = (type, listOfIds) => {
        Transforms.removeNodes(editor, {
            match: (n) => SlateElement.isElement(n) && n.type === type && nodeHasIdent(n) && !listOfIds.includes((n as NodeWithIdentifier).id),
            at: [], //Search the whole editor content
        });
    };

    /**
     *
     * Unwraps the nodes of `type` whose ids are not in the provided list
     *
     * It assumes the nodes of `type` have an attribute `id`. The `id` may be a number or string.
     *
     * @param {string} type node type to be searched. Example: `comment`
     * @param {Array} listOfIds Array with the list of ids. Example: [1, 2, 3].
     */
    e.unwrapNotInList = (type: string, listOfIds: Array<any>) => {
        Transforms.unwrapNodes(editor, {
            match: (n) => SlateElement.isElement(n) && n.type === type && nodeHasIdent(n) && !listOfIds.includes((n as NodeWithIdentifier).id),
            at: [], //Search the whole editor content
        });
    };

    /**
     * Gets from current editor content the list of items of a particular type
     */
    e.findNodesByType = (type) => {
        const list = Editor.nodes(editor, {
            match: (n) => SlateElement.isElement(n) && n.type === type,
            at: [],
        });
        // List in editor with path and node
        const listWithNodesAndPath = Array.from(list);
        // List with node (element)
        const listWithNodes = listWithNodesAndPath.map((item) => {
            return item[0];
        });

        return listWithNodes;
    };

    /**
     * Returns the serialized value (plain text)
     */
    e.serialize = (nodes) => {
        return nodes.map((n) => Node.string(n)).join('\n');
    };

    /**
     * Functions similar to syncExternalNodes,and also updates the node temporaryId with original id and data
     *
     * First, It will search for match in temporaryId's in nodesToKeep with id's of nodes and updates it with latest data
     * Then, updates data in node id's matching with nodesToKeep id's
     *
     * Unwraps or removes the nodes that are not in the list.
     */
    /*
    e.syncExternalNodesWithTemporaryId = (
        type,
        nodesToKeep,
        unwrap = true
    ) => {
        //extracts the id from the nodes and removes those that are not in the list
        const listOfIds = nodesToKeep.map(node => node.id);

        const nodesToKeepObj = new Map<string, Node>();
        //Update values of nodes.data
        //Create a map by id of the nodes to keep
        nodesToKeep.forEach(node => nodesToKeepObj.set(node.id, node));
        //Find nodes of this type remaining in the editor
        const editorNodes = editor.findNodesByType(type);
        //Update them
        editorNodes.map(node => {
            // Find the key of node to update
            const key = Object.keys(nodesToKeepObj).find(
                key => nodesToKeepObj[key].temporaryId === node.id
            );

            // node to Update with original Id and data
            const nodeToUpdate = nodesToKeepObj[key];
            // If node.id exists
            if (nodesToKeepObj[node.id] && !nodeToUpdate) {
                Transforms.setNodes(
                    editor,
                    { data: nodesToKeepObj[node.id] },
                    { match: n => n.id == node.id, at: [0] }
                );
                // TemporaryId and data will be replaced with new id and data
            } else if (key && nodeToUpdate) {
                Transforms.setNodes(
                    editor,
                    { id: nodeToUpdate.id, data: nodeToUpdate },
                    { match: n => n.id == nodeToUpdate.temporaryId, at: [] }
                );
            } else if (unwrap) {
                // unwraps the nodes in not list
                editor.unwrapNotInList(type, listOfIds)
            } else {
                // removes the nodes in not list
                editor.removeNotInList(type, listOfIds)
            }
        })
    }
    */

    /**
     * Is to get the selected plain text from the editor.selection
     *
     * @returns {string} selected text
     */
    e.getSelectedText = () => {
        return Editor.string(editor, e.rememberedSelection);
    };

    return e;
};

export default withMaterial;
