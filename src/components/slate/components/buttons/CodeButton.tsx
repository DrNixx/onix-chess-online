import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import CodeIcon from '@mui/icons-material/Code';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const CodeButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('code')}
            icon={<CodeIcon />}
            type="mark"
            format="code" {...props}
        />
    );
};

export default CodeButton;
