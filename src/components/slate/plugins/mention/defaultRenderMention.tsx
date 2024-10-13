import React from 'react';
import { RenderElementProps } from 'slate-react';
import Mention from './Mention';

export default function defaultRenderMention(props: RenderElementProps) {
    const { element, children } = props;

    switch (element.type) {
        case 'mention':
            return <Mention element={element} children={children} />;
        default:
            return children;
    }
}
