// noinspection ES6UnusedImports

import { Descendant, Element } from 'slate';

import { htmlDeserialize } from './serialize/htmlDeserialize';

// slate module declaration
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CustomEditor } from './types/editors';

export function makeDescendantValue(initialValue?: Descendant[] | string): Descendant[] {
    const emptyValue: Descendant[] = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ];

    if (!initialValue) {
        return emptyValue;
    } else {
        if (typeof initialValue === 'string') {
            if (initialValue.startsWith('<')) {
                const html = '<' + 'body>' + initialValue + '<' + '/body>';
                const parsed = new DOMParser().parseFromString(html, 'text/html');
                return htmlDeserialize(parsed.body);
            } else {
                try {
                    const val = JSON.parse(initialValue);
                    if (Array.isArray(val)) {
                        return val;
                    } else {
                        return [
                            {
                                type: 'paragraph',
                                children: [{ text: initialValue }],
                            },
                        ];
                    }
                } catch {
                    return [
                        {
                            type: 'paragraph',
                            children: [{ text: initialValue }],
                        },
                    ];
                }
            }
        } else {
            return initialValue;
        }
    }
}

function descendantToString(value: Descendant) {
    const result: string[] = [];
    if (Element.isElement(value)) {
        value.children.forEach((v) => result.push(descendantToString(v)));
    } else {
        if (value.text) {
            result.push(value.text);
        }
    }

    return result.join(' ');
}

// noinspection JSUnusedGlobalSymbols
export function descendantsToString(initialValue?: Descendant[] | string): string {
    const value = makeDescendantValue(initialValue);
    const parts: string[] = [];

    value.forEach((v) => {
        parts.push(descendantToString(v));
    });

    return parts.join(' ').trim();
}
