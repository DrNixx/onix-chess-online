import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import FormatItalic from '@mui/icons-material/FormatItalicOutlined';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const ItalicButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('italic')}
            icon={<FormatItalic />}
            type="mark"
            format="italic" {...props}
        />
    );
};

export default ItalicButton;
