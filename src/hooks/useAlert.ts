import { useCallback } from 'react';
import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar, VariantType } from 'notistack';

type AlertResult = {
    showError: (message?: string | Error) => void;
    showNotify: (message?: string, variant?: VariantType) => void;
    show: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
};

export function useAlert(): AlertResult {
    const { enqueueSnackbar } = useSnackbar();

    const showError = useCallback(
        (message?: string | Error) => {
            if (message) {
                const str = message instanceof Error ? message.message : message;
                enqueueSnackbar(str ?? 'Произошла ошибка', { variant: 'error' });
            }
        },
        [enqueueSnackbar],
    );

    const showNotify = useCallback(
        (message?: string, variant?: VariantType) => {
            !!message && enqueueSnackbar(message, { variant: variant ?? 'info' });
        },
        [enqueueSnackbar],
    );

    const show = useCallback(
        (message: SnackbarMessage, options?: OptionsObject) => {
            return enqueueSnackbar(message, options);
        },
        [enqueueSnackbar],
    );

    return {
        showError,
        showNotify,
        show,
    };
}
