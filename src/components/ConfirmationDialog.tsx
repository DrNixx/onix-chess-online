import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { ConfirmationDialogProps } from './ConfirmationDialogProps';
import {applyDefaults, defaultOf} from "../utils/propsUtils";

type propsWithDefaults = 'title' | 'yesText' | 'noText';
const defaultProps: defaultOf<ConfirmationDialogProps, propsWithDefaults> = {
    title: false,
    yesText: 'Ok',
    noText: 'Отмена',
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (propsIn) => {
    const props = applyDefaults(propsIn, defaultProps);
    const { title, bodyText } = props;

    const handleCancel = () => {
        props.onReject(false);
    };

    const handleOk = () => {
        props.onResolve(true);
    };

    return (
        <Dialog maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={props.isOpen}>
            {!!title && <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>}
            <DialogContent dividers>{bodyText}</DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    {props.noText}
                </Button>
                <Button onClick={handleOk} color="primary" variant="contained">
                    {props.yesText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
