import axios, { RawAxiosRequestHeaders } from 'axios';
import { ApiResult, ApiResultSuccess, isSuccessResult } from '../models/ApiTypes';

type ApiMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiParams = {
    data?: any;
    token?: string;
    headers: RawAxiosRequestHeaders;
};

type ApiParamsWithMethod = ApiParams & {
    method: ApiMethod;
};

const defaultParams: ApiParamsWithMethod = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
    },
};

async function apiRaw<T = any>(url: string, params: ApiParamsWithMethod) {
    const [dataForSend, cType] =
        params.data instanceof FormData ? [params.data, undefined] : [JSON.stringify(params.data), 'application/json'];

    if (cType) {
        params.headers['Content-Type'] = cType;
    }

    let withCredentials: boolean;
    if (params.token) {
        params.headers.Authorization = `Bearer ${params.token}`;
        withCredentials = false;
    } else {
        withCredentials = true;
    }

    const instance = axios.create({
        timeout: 20000,
        headers: params.headers,
        withCredentials: withCredentials,
    });

    switch (params.method) {
        case 'GET':
            return instance.get<T>(url);
        case 'HEAD':
            return instance.head<T>(url);
        case 'POST':
            return instance.post<T>(url, dataForSend);
        case 'PUT':
            return instance.put<T>(url, dataForSend);
        case 'PATCH':
            return instance.patch<T>(url, dataForSend);
        case 'DELETE':
            return instance.delete<T>(url);
    }
}

async function api<T = any>(url: string, paramsIn: Partial<ApiParamsWithMethod> = {}) {
    const params = { ...defaultParams, headers: { ...defaultParams.headers }, ...paramsIn };

    if (!url.startsWith('http')) {
        const baseUrl = import.meta.env.VITE_API_URL ?? '';
        url = baseUrl + url;
    }

    return apiRaw(url, params)
        .then((value) => {
            if (value.status !== 200) {
                throw new Error('Ошибка запроса: ' + value.statusText);
            }

            if (['HEAD', 'DELETE'].includes(params.method)) {
                return <ApiResultSuccess<T>>{ success: true, data: undefined };
            }

            return value.data;
        })
        .then((data: ApiResult<T>) => {
            if (isSuccessResult(data)) {
                return <ApiResultSuccess<T>>data;
            }

            throw new Error(data.data?.message ?? 'Произошла ошибка');
        });
}

export function apiGet<T = any>(url: string, params: Partial<ApiParams>) {
    return api<T>(url, { ...params, method: 'GET' });
}

export function apiHead<T = any>(url: string, params: Partial<ApiParams>) {
    return api<T>(url, { ...params, method: 'HEAD' });
}

export function apiPost<T = any>(url: string, params: Partial<ApiParams>) {
    return api<T>(url, { ...params, method: 'POST' });
}

export function apiPut<T = any>(url: string, params: Partial<ApiParams>) {
    return api<T>(url, { ...params, method: 'PUT' });
}

export function apiPatch<T = any>(url: string, params: Partial<ApiParams>) {
    return api<T>(url, { ...params, method: 'PATCH' });
}

export function apiDelete<T = any>(url: string, params: Partial<ApiParams>) {
    return api<T>(url, { ...params, method: 'DELETE' });
}
