import React from "react";

import {NavigatorMode} from "../Constants";
import {IChessOpening} from "../../../chess/types/Interfaces";

export interface DumbMoveProps {
    nav: NavigatorMode,
    opeinig?: IChessOpening,
    hasComments?: boolean,
    toolbars?: React.ReactNode,
}