import React from 'react';
import { InstanceOptions, create as createModal, InstanceProps } from 'react-modal-promise';
import { ConfirmationDialogProps } from '../components/ConfirmationDialogProps';
import ConfirmationDialog from '../components/ConfirmationDialog';

export function executeDialog<T extends React.ComponentType<T>, P extends InstanceProps<any>>(
    Component: React.FC<P>,
    options?: InstanceOptions,
) {
    type DialogParams = NonNullable<Parameters<typeof Component>[0]>;
    type RejectFn = Pick<DialogParams, 'onReject'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let x: RejectFn;
    type RejectType = NonNullable<Parameters<typeof x.onReject>[0]>;

    type ResolveFn = Pick<DialogParams, 'onResolve'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let y: ResolveFn;
    type ResolveType = NonNullable<Parameters<typeof y.onResolve>[0]>;

    return createModal<DialogParams, ResolveType, RejectType>(Component, options);
}

export function confirmDialog(
    props: Omit<ConfirmationDialogProps, keyof InstanceProps<boolean, boolean>> &
        Partial<InstanceProps<boolean, boolean>>,
) {
    return executeDialog(ConfirmationDialog)(props);
}

export function confirmDialogChain(
    props: Omit<ConfirmationDialogProps, keyof InstanceProps<boolean, boolean>>[] &
        Partial<InstanceProps<boolean, boolean>>,
) {
    let promise = Promise.resolve(true);
    props.forEach((prop) => {
        promise = promise.then(() => {
            return executeDialog(ConfirmationDialog)(prop);
        });
    });

    return promise;
}
