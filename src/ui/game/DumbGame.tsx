import React, {PropsWithChildren, useCallback} from 'react';
import {shallowEqual, useSelector} from "react-redux";
import clsx from "clsx";

import Container from "@mui/material/Container";

import {CombinedGameState} from "../../actions/CombinedGameState";
import {Api} from "chessground/api";
import {GameState} from "../../actions/GameState";
import {BoardState} from "../../actions/BoardState";
import {Config as CgConfig} from "chessground/config";
import BoardWithPlayer from "../components/BoardWithPlayer";
import {BoardSizeClasses} from "onix-board-assets";
import {Color} from "../../chess/Color";

type DumbGameProps = {
    cgRef: React.RefCallback<Api>;
    onGenerateConfig?: () => CgConfig;
    controlsLeft: React.ReactNode;
    controlsTop?: React.ReactNode;
    controlsBottom?: React.ReactNode;
};

const DumbGame: React.FC<PropsWithChildren<DumbGameProps>> = (props) => {
    const {cgRef, onGenerateConfig, controlsTop, controlsBottom, controlsLeft, children} = props;

    const game = useSelector<CombinedGameState, GameState>((state) => state.game, shallowEqual );
    const board = useSelector<CombinedGameState, BoardState>((state) => state.board, shallowEqual );

    const generateConfig = useCallback(() => {
        return onGenerateConfig ? onGenerateConfig() : {
            fen: game.fen,
            lastMove: game.lastMove,
            check: game.isCheck,
            orientation: board.orientation,
            coordinates: board.coordinates,
            turnColor: Color.toName(game.engine.ToMove),
            viewOnly: true,
            highlight: {
                lastMove: true,
                check: true
            },
        };
    }, [board.coordinates, board.orientation, game.engine.ToMove, game.fen, game.isCheck, game.lastMove, onGenerateConfig]);

    const { square, piece, size, coordinates, is3d } = board;

    const containerClass = [
        square,
        BoardSizeClasses[size],
        {
            "coords-no": !coordinates,
            "is2d": !is3d,
            "is3d": is3d
        }
    ];

    return (
        <Container maxWidth={false} className={clsx(containerClass)}>
            <BoardWithPlayer
                piece={piece}
                engine={game.engine}
                config={generateConfig()}
                controlsTop={controlsTop}
                controlsBottom={controlsBottom}
                cgRef={cgRef}>{controlsLeft}</BoardWithPlayer>
            {children}
        </Container>
    );
};

export default DumbGame;