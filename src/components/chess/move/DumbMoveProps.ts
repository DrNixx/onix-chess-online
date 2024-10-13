import React from "react";

import {NavigatorMode} from "../Constants";

export interface DumbMoveProps {
    nav: NavigatorMode,
    hasComments?: boolean,
    toolbars?: React.ReactNode,
}