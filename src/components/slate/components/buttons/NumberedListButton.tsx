import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const NumberedListButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('orderedList')}
            icon={<FormatListNumberedIcon />}
            type="block"
            format="numbered-list"
            {...props}
        />
    );
};

export default NumberedListButton;
