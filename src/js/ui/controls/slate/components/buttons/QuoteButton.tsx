import React from 'react';
import {useTranslation} from "react-i18next";
import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

type Props = Omit<ToolbarButtonProps, 'format' | 'type' | 'icon'>;

const QuoteButton: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate']);

    return (
        <ToolbarButton
            tooltip={t('quote')}
            icon={<FormatQuoteIcon />}
            type="block"
            format="block-quote"
            {...props}
        />
    );
};

export default QuoteButton;
