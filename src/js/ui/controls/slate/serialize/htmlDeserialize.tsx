import { jsx } from 'slate-hyperscript';
import { propertyOf } from '../../../../utils/types';

const ELEMENT_TAGS = {
    A: (el: HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
    BLOCKQUOTE: () => ({ type: 'block-quote' }),
    H1: () => ({ type: 'heading-one' }),
    H2: () => ({ type: 'heading-two' }),
    H3: () => ({ type: 'heading-three' }),
    H4: () => ({ type: 'heading-four' }),
    H5: () => ({ type: 'heading-five' }),
    H6: () => ({ type: 'heading-six' }),
    IMG: (el: HTMLElement) => ({ type: 'image', url: el.getAttribute('src') }),
    LI: () => ({ type: 'list-item' }),
    OL: () => ({ type: 'numbered-list' }),
    P: () => ({ type: 'paragraph' }),
    PRE: () => ({ type: 'code' }),
    UL: () => ({ type: 'bulleted-list' }),
};

type ElementTagNames = propertyOf<typeof ELEMENT_TAGS>;

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    U: () => ({ underline: true }),
};

type TextTagNames = propertyOf<typeof TEXT_TAGS>;

export const htmlDeserialize = (el: HTMLElement): any => {
    if (el.nodeType === 3) {
        return el.textContent;
    } else if (el.nodeType !== 1) {
        return null;
    } else if (el.nodeName === 'BR') {
        return '\n';
    }

    const { nodeName } = el;
    let parent = el;

    if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
        parent = el.childNodes[0] as HTMLElement;
    }

    let children = Array.from(parent.childNodes)
        .map((el) => htmlDeserialize(el as HTMLElement))
        .flat();

    if (children.length === 0) {
        children = [{ text: '' }];
    }

    if (el.nodeName === 'BODY') {
        return jsx('fragment', {}, children);
    }

    if (ELEMENT_TAGS[nodeName as ElementTagNames]) {
        const attrs = ELEMENT_TAGS[nodeName as ElementTagNames](el);
        return jsx('element', attrs, children);
    }

    if (TEXT_TAGS[nodeName as TextTagNames]) {
        const attrs = TEXT_TAGS[nodeName as TextTagNames]();
        return children.map((child: any) => jsx('text', attrs, child));
    }

    return children;
};
