import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { MarksEditor } from '../plugins/marks/MarksEditor';
import { BlocksEditor } from '../plugins/blocks/BlocksEditor';
import { LinksEditor } from '../plugins/links/LinksEditor';

import { CustomElement } from './blocks';
import { CustomText, EmptyText } from './marks';
import { MentionEditor } from '../plugins/mention/MentionEditor';
import { MaterialEditor } from '../slate/MaterialEditor';

export type CustomEditor = BaseEditor &
    ReactEditor &
    HistoryEditor &
    MaterialEditor &
    MarksEditor &
    BlocksEditor &
    LinksEditor &
    MentionEditor;

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor;
        Element: CustomElement;
        Text: CustomText | EmptyText;
    }
}
