import { IUserProfile } from './IUserProfile';

export interface IUser {
    id?: number|string,
    name: string,
    display?: string,
    online?: string|boolean,
    language?: string,
    patron?: string,
    status?: string,
    profile?: IUserProfile,
}