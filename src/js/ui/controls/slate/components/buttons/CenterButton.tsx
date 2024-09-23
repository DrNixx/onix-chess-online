import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import AlignCenterIcon from '@mui/icons-material/AlignHorizontalCenter';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const CenterButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('alignCenter')}
            icon={<AlignCenterIcon />}
            type="block"
            format="center"
            {...props}
        />
    );
};

export default CenterButton;
