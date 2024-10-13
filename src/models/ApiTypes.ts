export type AffixType = 'oldest' | 'newest';

export type ModelMetaNav = {
    affix: AffixType;
    id: string | number;
    time: number;
};

export type ModelMetaCurrent = {
    limit: number;
    count: number;
};

export type ModelMeta = {
    current: ModelMetaCurrent;
    next: ModelMetaNav | null;
    prev: ModelMetaNav | null;
};

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
