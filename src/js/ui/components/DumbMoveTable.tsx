import * as React from 'react';
import { Chess } from '../../chess/Chess';
import { Move } from '../../chess/Move';
import { IChessOpening } from '../../chess/types/Interfaces';

import { NavigatorMode } from './Constants';


export interface DumbMoveTableProps {
    nav: NavigatorMode,
    game: Chess,
    opeinig?: IChessOpening,
    hasEvals?: boolean,
    startPly: number,
    currentMove: Move,
    onChangePos: (move: Move) => void,
    onChangeKey: (move: string) => void,
}

interface DumbMoveTableState {
    evals: boolean
}

export class DumbMoveTable extends React.Component<DumbMoveTableProps, DumbMoveTableState> {
    /**
     * constructor
     */
    constructor(props: DumbMoveTableProps) {
        super(props);
        
        this.state = {
            evals: !!props.hasEvals
        };
    }
}