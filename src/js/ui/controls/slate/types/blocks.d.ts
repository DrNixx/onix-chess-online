import { Descendant } from 'slate';
import { CustomText, EmptyText } from './marks';

export type TypedElement = {
    type: BlockElementType;
};

export type AlignedElement = TypedElement & {
    align?: AlignElementType;
};

export interface BlockQuoteElement extends TypedElement, AlignedElement {
    type: 'block-quote';
    children: Descendant[];
}

export interface BulletedListElement extends TypedElement, AlignedElement {
    type: 'bulleted-list';
    children: Descendant[];
}

export interface NumberedListElement extends TypedElement, AlignedElement {
    type: 'numbered-list';
    children: Descendant[];
}

export interface CheckListItemElement extends TypedElement {
    type: 'check-list-item';
    checked: boolean;
    children: Descendant[];
}

export interface EditableVoidElement extends TypedElement {
    type: 'editable-void';
    children: EmptyText[];
}

export interface HeadingElement extends TypedElement, AlignedElement {
    type: 'heading-one';
    children: Descendant[];
}

export interface HeadingTwoElement extends TypedElement, AlignedElement {
    type: 'heading-two';
    children: Descendant[];
}

export interface HeadingThreeElement extends TypedElement, AlignedElement {
    type: 'heading-three';
    children: Descendant[];
}

export interface HeadingFourElement extends TypedElement, AlignedElement {
    type: 'heading-four';
    children: Descendant[];
}

export interface HeadingFiveElement extends TypedElement, AlignedElement {
    type: 'heading-five';
    children: Descendant[];
}

export interface HeadingSixElement extends TypedElement, AlignedElement {
    type: 'heading-six';
    children: Descendant[];
}

export interface ImageElement extends TypedElement {
    type: 'image';
    url: string;
    children: EmptyText[];
}

export interface LinkElement extends TypedElement {
    type: 'link';
    url: string;
    children: Descendant[];
}

export interface ButtonElement extends TypedElement {
    type: 'button';
    children: Descendant[];
}

export interface ListItemElement extends TypedElement {
    type: 'list-item';
    children: Descendant[];
}

export interface MentionElement extends TypedElement {
    type: 'mention';
    character: string;
    id?: string;
    image?: string;
    avatar?: string;
    send?: boolean;
    children: CustomText[];
}

export interface ParagraphElement extends TypedElement, AlignedElement {
    type: 'paragraph';
    children: Descendant[];
}

export interface TableElement extends TypedElement {
    type: 'table';
    children: CustomText[];
}

export interface TableCellElement extends TypedElement {
    type: 'table-cell';
    children: CustomText[];
}

export interface TableRowElement extends TypedElement {
    type: 'table-row';
    children: CustomText[];
}

export interface TitleElement extends TypedElement {
    type: 'title';
    children: Descendant[];
}

export interface VideoElement extends TypedElement {
    type: 'video';
    url: string;
    children: EmptyText[];
}

type CustomElement =
    | BlockQuoteElement
    | BulletedListElement
    | NumberedListElement
    | CheckListItemElement
    | EditableVoidElement
    | HeadingElement
    | HeadingTwoElement
    | HeadingThreeElement
    | HeadingFourElement
    | HeadingFiveElement
    | HeadingSixElement
    | ImageElement
    | LinkElement
    | ButtonElement
    | ListItemElement
    | MentionElement
    | ParagraphElement
    | TableElement
    | TableRowElement
    | TableCellElement
    | TitleElement
    | VideoElement;

export type BlockElementType = CustomElement['type'];
export type AlignElementType = 'left' | 'center' | 'right' | 'justify';
export type FormatElementType = BlockElementType | AlignElementType;
