import {IUser} from "./IUser";
import {MemCache} from "./MemCache";

const cache = new MemCache<number, IUser>();

export default cache;