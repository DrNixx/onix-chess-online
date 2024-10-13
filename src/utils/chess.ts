import * as cg from "chessground/types";
import {Chess} from "../chess/Chess";
//import {Square} from "../chess/types/Squares";


export function getLegalMovesMap(engine: Chess) {
    /*
    const mlist = engine.CurrentPos.generateMoves();

    const dests: cg.Dests = mlist.reduce((map, m) => {
        const from = Square.name(m.from) as cg.Key;
        const to = Square.name(m.to) as cg.Key;

        const toa: cg.Key[] = map.get(from) ?? [];
        toa.push(to);
        map.set(from, toa);

        return map;
    }, new Map());

    return dests;
     */
}