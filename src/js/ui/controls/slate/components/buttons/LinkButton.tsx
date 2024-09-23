import React from 'react';
import {useTranslation} from "react-i18next";
import { useSlate } from 'slate-react';

import LinkIcon from '@mui/icons-material/Link';

import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import { CustomEditor } from '../../types/editors';
import linkDlg from '../LinkDialog';
import { executeDialog } from '../../../../../utils/dialogUtils';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const LinkButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);
    const { onMouseDown } = props;
    const editor: CustomEditor = useSlate();
    typeof editor.insertLink !== 'function' && console.error('withLinks() is not initialized');

    return (
        <ToolbarButton
            tooltip={t('insertLink')}
            {...props}
            format="link"
            onMouseDown={(editor) => {
                if (onMouseDown) {
                    onMouseDown(editor, 'link', 'link');
                } else {
                    editor.rememberCurrentSelection();
                    executeDialog(linkDlg)({ title: t('addLink') })
                        .then((url) => {
                            url && editor.insertLink(url);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            }}
            icon={<LinkIcon />}
            type="link"
        />
    );
};

export default LinkButton;
