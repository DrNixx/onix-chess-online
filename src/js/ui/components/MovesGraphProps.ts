import { GameRelatedStore } from "../../actions/GameStore";

export interface MovesGraphProps {
    height?: number | string,
    isLive?: boolean,
    store: GameRelatedStore
}
