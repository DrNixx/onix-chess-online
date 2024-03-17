import { IUser } from './User';
import { IContainerLink } from './ContainerObject';
import { AffixType, ModelMetaCurrent, ModelMetaNav } from './ApiTypes';

type NOTIFY = 'notify';
type CHAT = 'chat';

export const NOTIFY: NOTIFY = 'notify';
export const CHAT: CHAT = 'chat';

export interface INotifyContext {
    command: string;
    payload?: any;
}

export interface INotifyPacket {
    type: NOTIFY;
    ctx: INotifyContext;
}

type MessageCategory = 'message' | 'action' | 'call' | 'custom';
type MessageType = 'text' | 'media' | 'image' | 'video' | 'audio' | 'file' | 'custom';
type ActionType =
    | 'memberAdded'
    | 'memberJoined'
    | 'memberLeft'
    | 'memberKicked'
    | 'memberBanned'
    | 'memberUnbanned'
    | 'memberInvited'
    | 'memberScopeChanged'
    | 'messageSeen'
    | 'messageEdited'
    | 'messsageDeleted'
    | 'typeUser'
    | 'typeGroup'
    | 'typeGroupMember';

//TODO: type CallMode = 'default' | 'spotlight' | 'single' | 'tile' | 'grid';
type CallType = 'audio' | 'video';
//TODO: type CallStatus = 'initiated' | 'ongoing' | 'unanswered' | 'rejected' | 'busy' | 'cancelled' | 'ended';

interface IBaseMessage {
    category: MessageCategory;
    type?: MessageType | ActionType | CallType;
    id?: string;
    roomId?: string;
    parentMessageId?: string;
    sender?: IUser;
    receiverId?: number;
    sentAt?: number;
    deliveredAt?: number;
    readAt?: number;
    deliveredToMeAt?: number;
    readByMe?: number;
    status?: string;
    readReceipts?: number[];
    editedAt?: number;
    editedBy?: IUser;
    deletedAt?: number;
    deletedBy?: IUser;
    replyCount?: number;
}

interface ITextMessage extends IBaseMessage {
    id: string;
    category: 'message';
    type: 'text';
    text: string;
}

interface IMediaMessage extends IBaseMessage {
    id: string;
    category: 'message';
    type: 'media' | 'image' | 'video' | 'audio' | 'file';
}

interface ICustomMessage extends IBaseMessage {
    id: string;
    category: 'custom';
}

interface IActionBase extends IBaseMessage {
    category: 'action';
    type: ActionType;
}

interface IActionMessageSeen extends IActionBase {
    id: string;
    category: 'action';
    type: 'messageSeen';
    receipts: number[];
}

interface IActionMessageEdited extends IActionBase {
    id: string;
    category: 'action';
    type: 'messageSeen';
    editedAt: number;
    editedBy: IUser;
}

interface IActionMessageDeleted extends IActionBase {
    id: string;
    category: 'action';
    type: 'messageSeen';
    deletedAt: number;
    deletedBy: IUser;
}

type IAction = IActionMessageSeen | IActionMessageEdited | IActionMessageDeleted;

interface ICall extends IBaseMessage {
    category: 'call';
    type: CallType;
}

export type IChatMessage = ITextMessage | IMediaMessage;

export type IChatContext = ITextMessage | IMediaMessage | ICustomMessage | IAction | ICall;

export type MessagesRequest = {
    affix?: AffixType;
    limit?: number;
    uid?: string;
    guid?: string;
    parentMessageId?: number;
    sentAt?: number;
    id?: string;
    fromId?: string;
    unread?: boolean;
    HideMessagesFromBlockedUsers?: boolean;
    searchKey?: string;
    updatedAt?: string;
    onlyUpdate?: number;
    category?: string;
    categories?: string[];
    type?: string;
    types?: string[];
    HideReplies?: boolean;
    HideDeletedMessages?: boolean;
    tags?: string[];
    WithTags?: boolean;
};

export interface IChatResponse {
    messages: IChatMessage[];
    meta: {
        current: ModelMetaCurrent;
        next: ModelMetaNav | null;
        prev: ModelMetaNav | null;
    };
}

export interface IChatPacket {
    type: CHAT;
    ctx: IChatContext;
}

export type IStreamPacket = INotifyPacket | IChatPacket;

export function isNotify(p?: IStreamPacket): p is INotifyPacket {
    return !!p && p.type == NOTIFY;
}

export function isChat(p?: IStreamPacket): p is IChatPacket {
    return !!p && p.type == CHAT;
}

export function isChatMessage(c?: IChatContext): c is IChatMessage {
    return !!c && c.category == 'message';
}

export function isChatAction(c?: IChatContext): c is IAction {
    return !!c && c.category == 'message';
}

export interface IChatSection {
    sender?: IUser;
    messages: IChatMessage[];
}

export type ConversationType = 'user' | 'group';

interface IBaseChatRoom {
    id: string;
    type: ConversationType;
    unreadMessageCount: number;
    createdAt: number;
    updatedAt: number;
    lastMessage?: ITextMessage | IMediaMessage;
    conversationWith: IUser | IContainerLink;
    fold?: boolean;
}

interface IPrivateChatRoom extends IBaseChatRoom {
    type: 'user';
    conversationWith: IUser;
}

interface IGroupChatRoom extends IBaseChatRoom {
    type: 'group';
    conversationWith: IContainerLink;
}

export type IChatRoom = IPrivateChatRoom | IGroupChatRoom;

export function isPrivateRoom(r?: IChatRoom): r is IPrivateChatRoom {
    return !!r && r.type == 'user';
}
