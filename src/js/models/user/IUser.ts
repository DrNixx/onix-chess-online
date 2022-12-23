import { IUserProfile } from './IUserProfile';
import { IUserTitle } from './IUserTitle';

export interface IUser {
    id?: number|string,
    name: string,
    display?: string,
    online?: string|boolean,
    language?: string,
    patron?: string,
    status?: string,
    profile?: IUserProfile,
    aurl?: string | string[];
    icon?: string,
    title?: IUserTitle |string;
}