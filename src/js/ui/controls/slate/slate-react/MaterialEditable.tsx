import React from 'react';
import { Transforms } from 'slate';
import { Editable, RenderElementProps, useSlate } from 'slate-react';
import isHotkey from 'is-hotkey';
import { EditableProps, RenderLeafProps } from 'slate-react/dist/components/editable';
import { CustomEditor } from '../types/editors';
import defaultRenderElement from './defaultRenderElement';
import defaultRenderLeaf from './defaultRenderLeaf';
import defaultHotkeys from './defaultHotkeys';
import {applyDefaults, defaultOf} from "../../../../utils/propsUtils";

type Props = Omit<EditableProps, 'placeholder'> & {
    label?: string;
    hotkeys?: object;
    onHotkey?: (
        event: React.KeyboardEvent,
        editor: CustomEditor,
        hotkey: string,
        pressedKeys: string,
        hotkeys: object,
    ) => void;
};

type propsWithDefaults = 'label' | 'hotkeys';
const defaultProps: defaultOf<Props, propsWithDefaults> = {
    label: 'Начните печатать...',
    hotkeys: defaultHotkeys,
};

const MaterialEditable: React.FC<Props> = (propsIn) => {
    const props = applyDefaults(propsIn, defaultProps);
    const { renderElement, renderLeaf, label, hotkeys, onHotkey, onKeyDown, children, readOnly, ...other } = props;

    const editor = useSlate();

    const handleRenderElement = (props: RenderElementProps) => {
        if (renderElement) {
            return renderElement(props);
        }

        return defaultRenderElement(props);
    };

    const handleRenderLeaf = (props: RenderLeafProps) => {
        if (renderLeaf) {
            props.children = renderLeaf(props);
        }

        return defaultRenderLeaf(props);
    };

    const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown && onKeyDown(event);

        if (event.defaultPrevented) {
            return;
        }

        for (const pressedKeys in hotkeys) {
            if (isHotkey(pressedKeys, event)) {
                const hotkey = (hotkeys as any)[pressedKeys];
                event.preventDefault();

                if (hotkey.type === 'mark') {
                    editor.toggleMark(hotkey.value);
                }

                if (hotkey.type === 'block') {
                    editor.toggleBlock(hotkey.value);
                }

                if (hotkey.type === 'newline') {
                    editor.insertText('\n');
                    //The following line updates the cursor
                    Transforms.move(editor, { distance: 0, unit: 'offset' });
                }

                return onHotkey && onHotkey(event, editor, hotkey, pressedKeys, hotkeys);
            }
        }
    };

    return (
        <Editable
            renderElement={handleRenderElement}
            renderLeaf={handleRenderLeaf}
            onKeyDown={(event) => handleOnKeyDown(event)}
            placeholder={label}
            readOnly={readOnly}
            style={{ padding: readOnly ? 0 : '1em' }}
            {...other}
        >
            {children}
        </Editable>
    );
};

export default MaterialEditable;
