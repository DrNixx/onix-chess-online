import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import FormatBold from '@mui/icons-material/FormatBold';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const BoldButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return <ToolbarButton tooltip={t('bold')} icon={<FormatBold />} type="mark" format="bold" {...props} />;
};

export default BoldButton;
