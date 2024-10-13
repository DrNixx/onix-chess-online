import React from 'react';
import { RenderLeafProps } from 'slate-react/dist/components/editable';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type CustomEditor } from '../types/editors';

/**
 * Default renderer of leafs.
 *
 */

export default function defaultRenderLeaf(props: RenderLeafProps) {
    const { leaf, attributes, children } = props;

    let result = children;

    if ('bold' in leaf && leaf.bold) {
        result = <strong>{result}</strong>;
    }

    if ('code' in leaf && leaf.code) {
        result = <code>{result}</code>;
    }

    if ('italic' in leaf && leaf.italic) {
        result = <em>{result}</em>;
    }

    if ('underline' in leaf && leaf.underline) {
        result = <u>{result}</u>;
    }

    if ('strikethrough' in leaf && leaf.strikethrough) {
        result = <del>{result}</del>;
    }

    if ('highlight' in leaf && leaf.highlight) {
        result = <span style={{ backgroundColor: '#ffff00', color: '#000' }}>{result}</span>;
    }

    result = <span {...attributes}>{result}</span>;

    if ('decoration' in leaf && leaf.decoration === 'link') {
        result = (
            <a
                style={{ cursor: 'pointer', wordBreak: 'break-all' }}
                href={leaf.text}
                target="_blank"
                rel="noopener noreferrer"
            >
                {result}
            </a>
        );
    }

    return result;
}
