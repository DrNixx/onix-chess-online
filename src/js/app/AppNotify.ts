import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';

type notifyFunction = (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
export let notify: notifyFunction = () => 0;

export function setNotify(value: notifyFunction) {
    notify = value;
}
