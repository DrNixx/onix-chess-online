import { useCallback, useContext } from 'react';
import { ApiResultSuccess } from '../models/ApiTypes';
import { ApiParams, apiDelete, apiGet, apiHead, apiPatch, apiPost, apiPut } from '../services/ApiService';
import { AuthContext } from '../providers/AuthProvider';

export type ApiMethod = <T = any>(url: string, params?: Partial<ApiParams>) => Promise<ApiResultSuccess<T>>;

type ApiResult = {
    apiGet: ApiMethod;
    apiHead: ApiMethod;
    apiPost: ApiMethod;
    apiPut: ApiMethod;
    apiPatch: ApiMethod;
    apiDelete: ApiMethod;
};

export function useApi(): ApiResult {
    const { isAuthenticated, token } = useContext(AuthContext);

    const apiGetImpl = useCallback(
        <T = any>(url: string, params: Partial<ApiParams> = {}) => {
            if (isAuthenticated && token) {
                params.token = token;
            }

            return apiGet<T>(url, params);
        },
        [isAuthenticated, token],
    );

    const apiHeadImpl = useCallback(
        <T = any>(url: string, params: Partial<ApiParams> = {}) => {
            if (isAuthenticated && token) {
                params.token = token;
            }

            return apiHead<T>(url, params);
        },
        [isAuthenticated, token],
    );

    const apiPostImpl = useCallback(
        <T = any>(url: string, params: Partial<ApiParams> = {}) => {
            if (isAuthenticated && token) {
                params.token = token;
            }

            return apiPost<T>(url, params);
        },
        [isAuthenticated, token],
    );

    const apiPutImpl = useCallback(
        <T = any>(url: string, params: Partial<ApiParams> = {}) => {
            if (isAuthenticated && token) {
                params.token = token;
            }

            return apiPut<T>(url, params);
        },
        [isAuthenticated, token],
    );

    const apiPatchImpl = useCallback(
        <T = any>(url: string, params: Partial<ApiParams> = {}) => {
            if (isAuthenticated && token) {
                params.token = token;
            }

            return apiPatch<T>(url, params);
        },
        [isAuthenticated, token],
    );

    const apiDeleteImpl = useCallback(
        <T = any>(url: string, params: Partial<ApiParams> = {}) => {
            if (isAuthenticated && token) {
                params.token = token;
            }

            return apiDelete<T>(url, params);
        },
        [isAuthenticated, token],
    );

    return {
        apiGet: apiGetImpl,
        apiHead: apiHeadImpl,
        apiPost: apiPostImpl,
        apiPut: apiPutImpl,
        apiPatch: apiPatchImpl,
        apiDelete: apiDeleteImpl,
    };
}
