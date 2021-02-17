import { Reducer } from "redux";
import { i18n } from './i18n';

export interface IntlState {
    locale: string
}

export type IntlAction = {
    type: 'SET_LOCALE',
    locale: string
}

export const intlReducer: Reducer<IntlState, IntlAction> = (
    state: IntlState = {
        locale: 'en-us'
    },
    action: IntlAction
) => {
    switch (action.type) {
        case 'SET_LOCALE':
            let loc = i18n.setLocale(action.locale);
            return { locale: loc };
        default:
            return state;
    }
}