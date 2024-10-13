import React from 'react';
import { RenderElementProps } from 'slate-react';
import { AlignedElement, TypedElement } from '../types/blocks';

function isAligned(element: TypedElement): element is AlignedElement {
    return 'align' in element;
}

export default function defaultRenderElement(props: RenderElementProps) {
    const { element, children } = props;
    const styles =
        isAligned(element) && !!element.align ? { style: { textAlign: element.align } as React.CSSProperties } : {};
    const attributes = { ...props.attributes, ...styles };

    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>;
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>;
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>;
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>;
        case 'link':
            return (
                <a {...attributes} href={element.url}>
                    {children}
                </a>
            );
        default:
            return <p {...attributes}>{children}</p>;
    }
}
