import { InstanceProps } from 'react-modal-promise';
export interface ConfirmationDialogProps extends InstanceProps<boolean, boolean> {
    title?: string | boolean;
    bodyText: string;
    yesText?: string;
    noText?: string;
}
