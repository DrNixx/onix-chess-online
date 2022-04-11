import React, {useState} from 'react';
import clsx from "clsx";
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import Input, { InputProps } from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import CopyIcon from '@mui/icons-material/CopyAll';

import { copy } from '../CopyToClipboard';
import {useTranslation} from "react-i18next";

type TextWithCopyProps = InputProps & {
    icon?: React.ReactNode;
}

const TextWithCopy: React.FC<TextWithCopyProps> = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(['chess-ctrls', 'core']);

    const {icon, className, readOnly, endAdornment, ...other} = props;

    const [elementClass, setElementClass] = useState("");

    const onCopy = () => {
        const value = typeof props.value === 'string' ? props.value : undefined;
        if (copy(value)) {
            enqueueSnackbar(t("copied", {ns: 'core'}), {autoHideDuration: 1000});
            setElementClass('text-success');
            setTimeout(() => setElementClass(""), 3000);
        }
    };

    return (
        <Input
            className={clsx(elementClass, className)}
            readOnly={true}
            {...other}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label={t('copy_to_clipboard')}
                        onClick={onCopy}>{icon}</IconButton>
                </InputAdornment>
            }
        />
    );
};

TextWithCopy.defaultProps = {
    icon: <CopyIcon />
}

export default TextWithCopy;
