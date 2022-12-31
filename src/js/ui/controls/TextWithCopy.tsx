import React, {useState} from 'react';
import clsx from "clsx";
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import Input, { InputProps } from '@mui/material/Input';
import OutlinedInput, {OutlinedInputProps} from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps} from '@mui/material/TextField';
import CopyIcon from '@mui/icons-material/CopyAll';

import { copy } from '../CopyToClipboard';
import {useTranslation} from "react-i18next";

type TextWithCopyProps = TextFieldProps & {
    icon?: React.ReactNode;
    label?: React.ReactNode;
}

const defaultProps = {
    icon: <CopyIcon />
};

const TextWithCopy: React.FC<TextWithCopyProps> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};

    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(['chess-ctrls', 'core']);

    const {label, icon, className, contentEditable, ...other} = props;

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
        <TextField 
            className={clsx(elementClass, className)} 
            contentEditable={false}
            label={label}
            {...other}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton
                        aria-label={t('copy_to_clipboard')}
                        onClick={onCopy}>{icon}</IconButton>
                </InputAdornment>,
            }}
        />
    );
};

export default TextWithCopy;
