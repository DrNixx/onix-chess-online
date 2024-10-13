import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const BulletedListButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('bulletList')}
            icon={<FormatListBulletedIcon />}
            type="block"
            format="bulleted-list"
            {...props}
        />
    );
};

export default BulletedListButton;
