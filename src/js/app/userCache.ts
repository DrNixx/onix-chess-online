import {MemCache} from "./MemCache";
import {IUser} from "../models/user/IUser";

const cache = new MemCache<number, IUser>();

export default cache;