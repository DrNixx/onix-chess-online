export default async function api<T = any>(url: string, data: any, method = 'POST') {
    return fetch(url, {
        method: method,
        credentials: 'same-origin',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(data => {
            if (!data.ok) {
                throw new Error('Ошибка запроса: ' + data.statusText);
            }

            return data.json();
        });
}

let apiRoot = 'http://localhost';

export function setApiRoot(url: string) {
    apiRoot = url;
}

const getApiUrl = (urlPart: string): string => {
    return apiRoot + urlPart;
}

export function apiGet<T = any>(url: string, data?: any) {
    return api<T>(getApiUrl(url), data, 'GET');
}

export function apiPost<T = any>(url: string, data?: any) {
    return api<T>(getApiUrl(url), data, 'POST');
}

export function apiPut<T = any>(url: string, data?: any) {
    return api<T>(getApiUrl(url), data, 'PUT');
}

export function apiPatch<T = any>(url: string, data?: any) {
    return api<T>(getApiUrl(url), data, 'PATCH');
}

export function apiHead<T = any>(url: string, data?: any) {
    return api<T>(getApiUrl(url), data, 'HEAD');
}
export function apiDelete<T = any>(url: string, data?: any) {
    return api<T>(getApiUrl(url), data, 'DELETE');
}