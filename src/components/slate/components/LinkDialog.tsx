import React, { useState } from 'react';
import { InstanceProps } from 'react-modal-promise';
import {useTranslation} from "react-i18next";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';


interface Props extends InstanceProps<string, string> {
    title?: string;
}

const LinkDialog: React.FC<Props> = (props) => {
    const { t } = useTranslation(['slate', 'core']);
    const [url, setUrl] = useState('');

    const saveClick = () => {
        props.onResolve(url);
    };

    const cancelClick = () => {
        handleDialogClose();
    };

    const handleDialogClose = () => {
        props.onReject();
    };

    return (
        <Dialog open={props.isOpen} onClose={() => handleDialogClose()} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.title ?? t('createLink')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    value={url}
                    onChange={(e) => {
                        const { value } = e.target;
                        setUrl(value);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelClick}>{t('cancel')}</Button>
                <Button onClick={saveClick} color="primary">{t('Добавить')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LinkDialog;
