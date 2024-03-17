import React from 'react';

export interface IObject {
    [key: string]: any;
}

export type propertyOf<T> = keyof T & string;
export type ComponentProps<T extends React.FC<any>> = T extends React.FC<infer P> ? P : never;
