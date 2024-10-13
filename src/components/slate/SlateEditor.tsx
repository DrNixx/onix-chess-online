import React, { useMemo, useCallback, useState, forwardRef, Ref, useImperativeHandle } from 'react';
import { Range, Descendant, BaseEditor } from 'slate';
import { RenderElementProps } from 'slate-react';

import { keyframes, SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import MaterialSlate from './slate-react/MaterialSlate';
import Toolbar from './components/toolbars/Toolbar';
import MaterialEditable from './slate-react/MaterialEditable';
import createMaterialEditor from './slate/createMaterialEditor';
import defaultRenderMention from './plugins/mention/defaultRenderMention';
import defaultRenderElement from './slate-react/defaultRenderElement';
import HoveringToolbar from './components/toolbars/HoveringToolbar';
import ButtonSeparator from './components/buttons/ButtonSeparator';
import ToolbarButton from './components/buttons/ToolbarButton';

import { makeDescendantValue } from './utils';
import { defaultOf, applyDefaults } from '../../utils/propsUtils';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const pulse = keyframes`
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(230, 0, 134, 0.2);
  }  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(230, 0, 134, 0);
  }
  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(230, 0, 134, 0);
  }
`;

type Props = {
    id?: string;
    name?: string;
    required?: boolean;
    label?: string;
    error?: boolean;
    helperText?: string;
    value?: Descendant[] | string;
    toolbar?: React.JSX.Element | boolean;
    hoveringToolbar?: React.JSX.Element | boolean;
    //userSelector?: boolean;
    //container_type?: string;
    //container_id?: number;
    readOnly?: boolean;
    variant?: 'outlined' | 'filled' | 'standard';
    sx?: SxProps<Theme>;
    hideSaver?: boolean;
    onSave?: (text: string | false) => void;
    onChange?: (newValue: string) => void;
};

export type SlateEditorRef = {
    getEditor: () => BaseEditor;
    mentionStart: () => void;
};

type propsWithDefaults = 'readOnly' | 'hoveringToolbar' | 'variant' | 'onChange';
const defaultProps: defaultOf<Props, propsWithDefaults> = {
    readOnly: false,
    hoveringToolbar: false,
    variant: 'standard',
    onChange: () => {},
};

const SlateEditor = forwardRef(function (propsIn: Props, ref: Ref<SlateEditorRef>) {
    const props = applyDefaults(propsIn, defaultProps);
    const {
        value: initialValue,
        //userSelector,
        //container_type,
        //container_id,
        readOnly,
        label,
        error,
        helperText,
        toolbar,
        hoveringToolbar,
        variant,
        sx,
        hideSaver,
        onChange,
        onSave,
    } = props;

    const [value, setValue] = useState<Descendant[]>(makeDescendantValue(initialValue));
    const [isChanged, setIsChanged] = useState(false);
    const [target, setTarget] = useState<Range | undefined>();
    // const [, setIndex] = useState(0);
    // const [search, setSearch] = useState('');
    const editor = useMemo(() => createMaterialEditor(), []);
    // const [staff, setStaff] = useState<MentionItem[]>([]);
    // const { apiPost } = useApi();

    useImperativeHandle(ref, () => {
        return {
            getEditor() {
                return editor;
            },
            mentionStart() {
                editor.insertText('@');
            },
        };
    });

    /*
    useEffect(() => {
        if (userSelector && container_type && container_id) {
            apiPost(`/api/members/mentions`, { data: { container_type, container_id } })
                .then((data) => {
                    const users = (data.model.users as IUser[]).map((item) => {
                        const keys: string[] = [];
                        item.first_name && keys.push(item.first_name);
                        item.last_name && keys.push(item.last_name);
                        item.username && keys.push(item.username);

                        return {
                            keys: keys,
                            value: {
                                character: item.display_name,
                                image: item.avatar,
                                send: false,
                                id: item.id.toString(),
                            },
                            content: <MemberBadge staff={{ user: item }} />,
                        } as MentionItem;
                    });

                    const groups = (data.model.groups as IGroup[]).map((item) => {
                        const keys: string[] = [];
                        item.name && keys.push(item.name);
                        keys.push('группа');
                        return {
                            keys: keys,
                            value: {
                                character: item.name,
                                avatar: item.name?.substring(0, 1),
                                send: false,
                                id: '-' + item.id.toString(),
                            },
                            content: <MemberBadge staff={{ group: item }} />,
                        } as MentionItem;
                    });

                    setStaff(users.concat(groups));
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }, [container_type, container_id, userSelector, apiPost]);
     */

    /*
    const getMentionItems = useCallback(() => {
        const find = search ? search.toLowerCase() : '';
        if (search.length) {
            return staff.filter((s) => {
                for (let i = 0; i < s.keys.length; i++) {
                    if (s.keys[i]?.toLowerCase().startsWith(find)) {
                        return true;
                    }
                }

                return false;
            });
        }

        return [];
    }, [staff, search]);
     */

    /*
    const getContextCoords = useCallback(() => {
        if (target) {
            const domRange = ReactEditor.toDOMRange(editor, target);
            const rect = domRange.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY + 24,
                left: rect.left + window.scrollX,
            };
        }

        return {
            top: -9999,
            left: -9999,
        };
    }, [editor, target]);
     */

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (target) {
            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    setTarget(undefined);
                    break;
            }
        }
    };

    /**
     * Set target for mention
     */
    /*
    useEffect(() => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText = beforeRange && Editor.string(editor, beforeRange);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);

            const beforeMatch = beforeText && beforeText.match(/^@([\p{L}\p{N}_]+)$/u);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
                setTarget(beforeRange);
                setSearch(beforeMatch[1]);
                setIndex(0);
                return;
            }
        }

        setTarget(undefined);
    }, [editor, value]);
     */

    const changeValue = (newValue: Descendant[]) => {
        setValue(newValue);
        const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);

        if (isAstChange) {
            setIsChanged(true);
            onChange(JSON.stringify(newValue));
        }
    };

    const handleRenderElement = useCallback((props: RenderElementProps) => {
        const { element } = props;

        switch (element.type) {
            case 'mention':
                return defaultRenderMention(props);
            default:
                return defaultRenderElement(props);
        }
    }, []);

    return (
        <MaterialSlate
            editor={editor}
            value={value}
            error={error}
            helperText={helperText}
            variant={variant}
            sx={{ ...sx, overflow: readOnly ? 'hidden' : 'unset' }}
            onChange={changeValue}
        >
            {!readOnly && toolbar !== false && (
                <Toolbar>
                    {toolbar}
                    {!hideSaver && !!onSave && (
                        <>
                            <ButtonSeparator />
                            <ToolbarButton
                                tooltip="Сохранить"
                                icon={
                                    <SaveIcon
                                        sx={{
                                            borderRadius: 40,
                                            animation: isChanged ? `${pulse} 2s infinite ease` : 'none',
                                        }}
                                    />
                                }
                                color={isChanged ? 'warning' : 'default'}
                                type="custom"
                                onClick={() => {
                                    onSave(JSON.stringify(value));
                                }}
                            />
                            <ToolbarButton
                                tooltip="Отменить редактирование"
                                icon={<CancelIcon />}
                                type="custom"
                                onClick={() => {
                                    onSave(false);
                                }}
                            />
                        </>
                    )}
                </Toolbar>
            )}
            {!readOnly && hoveringToolbar && <HoveringToolbar />}

            <MaterialEditable
                label={label}
                readOnly={readOnly}
                renderElement={(props) => handleRenderElement(props)}
                onKeyDown={onKeyDown}
            />
        </MaterialSlate>
    );
});

/*
{!readOnly && userSelector && target && (
                <MentionDropdown
                    items={getMentionItems()}
                    onClick={(selectedIndex) => {
                        Transforms.select(editor, target);
                        editor.insertMention(getMentionItems()[selectedIndex].value);
                        setTarget(undefined);
                    }}
                    {...getContextCoords()}
                />
            )}
 */

export default SlateEditor;
