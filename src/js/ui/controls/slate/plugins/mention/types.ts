import { MentionElement } from '../../types/blocks';

export type MentionData = Omit<MentionElement, 'type' | 'children'>;

export type MentionItem = {
    keys: string[];
    value: MentionData;
    content: string | JSX.Element;
};
