import { createEditor } from 'slate';

// slate module declaration
import { CustomEditor } from '../types/editors';

// slate plugins
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';

// aplan plugins
import withMaterial from './withMaterial';
import withMarks from '../plugins/marks/withMarks';
import withBlock from '../plugins/blocks/withBlocks';
import withLinks from '../plugins/links/withLinks';
import withMentions from '../plugins/mention/withMentions';

export default function createMaterialEditor() {
    return withMentions(withLinks(withBlock(withMarks(withMaterial(withHistory(withReact(createEditor()))))))) as CustomEditor;
}
