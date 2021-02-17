import * as React from 'react';
import { Chess } from '../../chess/Chess';
import { Move } from '../../chess/Move';
import { IChessOpening } from '../../chess/types/Interfaces';

import { NavigatorMode } from './Constants';


export interface DumbMoveTableProps {
    nav: NavigatorMode,
    game: Chess,
    opeinig?: IChessOpening,
    startPly: number,
    currentMove: Move,
    onChangePos: (move: Move) => void,
    onChangeKey: (move: string) => void,
}

export class DumbMoveTable extends React.Component<DumbMoveTableProps, {}> {
    /**
     * constructor
     */
    constructor(props: DumbMoveTableProps) {
        super(props);
        // <div className="ui-movetable-element">
    }
}