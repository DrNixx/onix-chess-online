import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import AlignLeftIcon from '@mui/icons-material/AlignHorizontalLeft';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const LeftButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('alignLeft')}
            icon={<AlignLeftIcon />}
            type="block"
            format="left" {...props}
        />
    );
};

export default LeftButton;
