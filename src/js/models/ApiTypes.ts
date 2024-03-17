export type ApiResultSuccess<T = any> = {
    success: boolean;
    total?: number;
    model?: T;

    [key: string]: any;
};

export type ApiErrorDetail = {
    code?: number | string;
    name?: string;
    message?: string;
};

export type ApiResultError = {
    success: boolean;
    data?: ApiErrorDetail;
    errors?: any;
};

export type ApiResult<T = any> = ApiResultSuccess<T> | ApiResultError;

export function isSuccessResult(object?: ApiResult): object is ApiResultSuccess {
    return !!object && object.success;
}

export function isErrorResult(object?: ApiResult): object is ApiResultError {
    return !object || !object.success;
}
