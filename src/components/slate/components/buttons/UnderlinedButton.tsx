import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const UnderlinedButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('underline')}
            icon={<FormatUnderlined />}
            type="mark"
            format="underline"
            {...props}
        />
    );
};

export default UnderlinedButton;
