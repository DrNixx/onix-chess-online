import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import StrikethroughIcon from '@mui/icons-material/StrikethroughS';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const StrikethroughButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('strikethrough')}
            icon={<StrikethroughIcon />}
            type="mark"
            format="strikethrough"
            {...props}
        />
    );
};

export default StrikethroughButton;
