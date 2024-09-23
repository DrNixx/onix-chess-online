import React, { useCallback, useEffect, useMemo } from 'react';
import { Descendant, NodeEntry } from 'slate';
import { RenderElementProps } from 'slate-react';

import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import MaterialEditable from './slate-react/MaterialEditable';
import MaterialSlate from './slate-react/MaterialSlate';
import createMaterialEditor from './slate/createMaterialEditor';

import defaultRenderMention from './plugins/mention/defaultRenderMention';
import defaultRenderElement from './slate-react/defaultRenderElement';
import { makeDescendantValue } from './utils';

type Props = {
    id?: string;
    label?: string;
    helperText?: string;
    value?: Descendant[] | string;
    userSelector?: boolean;
    container_type?: string;
    container_id?: number;
    sx?: SxProps<Theme>;
};

const SlateViewer: React.FC<Props> = (props) => {
    const { value, helperText, sx, label } = props;

    const editor = useMemo(() => createMaterialEditor(), []);
    const descendantValue = useMemo(() => makeDescendantValue(value), [value]);

    const handleRenderElement = useCallback(
        (props: RenderElementProps) => {
            const { element } = props;

            switch (element.type) {
                case 'mention':
                    return defaultRenderMention(props);
                default:
                    return defaultRenderElement(props);
            }
            /* eslint-disable react-hooks/exhaustive-deps */
        },
        [value],
    );

    type UrlsMap = [string, number];
    const findUrlsInText = (text: string): UrlsMap[] => {
        const urlRegex =
            /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gim;

        const matches = text.match(urlRegex);

        return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
    };

    const textDecorator = (node: NodeEntry) => {
        const nodeCandidate = node[0];
        const path = node[1];

        if ('text' in nodeCandidate && nodeCandidate.text) {
            const nodeText = nodeCandidate.text;
            const urls = findUrlsInText(nodeText.toString());
            return urls.map(([url, index]) => {
                return {
                    anchor: {
                        path,
                        offset: index,
                    },
                    focus: {
                        path,
                        offset: index + url.length,
                    },
                    decoration: 'link',
                };
            });
        }

        return [];
    };

    useEffect(() => {
        editor && (editor.children = descendantValue);
    }, [descendantValue, editor]);

    return (
        <MaterialSlate
            editor={editor}
            value={descendantValue}
            helperText={helperText}
            sx={{ ...sx, overflow: 'hidden' }}
        >
            <MaterialEditable
                label={label}
                readOnly={true}
                decorate={textDecorator}
                renderElement={(props) => handleRenderElement(props)}
            />
        </MaterialSlate>
    );
};

export default SlateViewer;
