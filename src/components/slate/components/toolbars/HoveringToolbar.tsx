import React, { PropsWithChildren, useEffect, useRef } from 'react';

import { Editor, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';

import BoldButton from '../buttons/BoldButton';
import UnderlinedButton from '../buttons/UnderlinedButton';
import StrikethroughButton from '../buttons/StrikethroughButton';
import CodeButton from '../buttons/CodeButton';
import ItalicButton from '../buttons/ItalicButton';

type Props = {
    custom?: boolean;
};

const HoveringToolbar: React.FC<PropsWithChildren<Props>> = (props) => {
    const { custom, children } = props;
    const ref = useRef<HTMLElement>();
    const editor = useSlate();

    useEffect(() => {
        const el = ref.current;
        const { selection } = editor;

        if (!el) {
            return;
        }

        if (
            !selection ||
            !ReactEditor.isFocused(editor) ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ''
        ) {
            el.removeAttribute('style');
            return;
        }

        const domSelection = window.getSelection();
        if (domSelection) {
            const domRange = domSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            el.style.opacity = '1';
            el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 4}px`;
            el.style.left = `${rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2}px`;
        }
    });

    return (
        <Portal>
            <Box
                borderRadius="borderRadius"
                ref={ref}
                sx={{
                    position: 'absolute',
                    padding: 0.25,
                    zIndex: 14000,
                    top: '-10000px',
                    left: '-10000px',
                    opacity: 0,
                    backgroundColor: 'grey.200',
                    transition: 'opacity 0.75s',
                }}
            >
                {!custom && (
                    <React.Fragment>
                        <BoldButton />
                        <ItalicButton />
                        <UnderlinedButton />
                        <StrikethroughButton />
                        <CodeButton />
                    </React.Fragment>
                )}
                {children}
            </Box>
        </Portal>
    );
};

export default HoveringToolbar;
