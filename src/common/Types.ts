export interface IDisposable {
    /**
     * Ликвидировать объект.
     */
    dispose(): void;
}

export interface ITyped {
    _type: string;
}

export interface IError {
    type: string,
    message?: string
}