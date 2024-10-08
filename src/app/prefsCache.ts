import {MemCache} from "./MemCache";
import {IChessPerfs} from "../chess/types/Interfaces";

const cache = new MemCache<number, IChessPerfs>();

export default cache;