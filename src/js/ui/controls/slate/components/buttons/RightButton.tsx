import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import AlignRightIcon from '@mui/icons-material/AlignHorizontalRight';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const RightButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('alignRight')}
            icon={<AlignRightIcon />}
            type="block"
            format="right" {...props}
        />
    );
};

export default RightButton;
