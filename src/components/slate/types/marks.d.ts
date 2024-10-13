import { propertyOf } from '../../../../utils/types';

export type CustomMarks = {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    highlight?: boolean;
};

export type CustomText = CustomMarks & {
    text: string;
};

export type EmptyText = {
    text: string;
};

export type MarkTypes = propertyOf<Omit<CustomText, 'text'>>;
