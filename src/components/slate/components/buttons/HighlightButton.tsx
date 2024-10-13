import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import HighlightIcon from '@mui/icons-material/Highlight';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const HighlightButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('highlightText')}
            icon={<HighlightIcon />}
            type="mark"
            format="highlight" {...props}
        />
    );
};

export default HighlightButton;
