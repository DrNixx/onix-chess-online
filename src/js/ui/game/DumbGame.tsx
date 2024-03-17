import React, {PropsWithChildren, useCallback, useContext} from 'react';

import {Api} from "chessground/api";
import {Config as CgConfig} from "chessground/config";
import BoardWithPlayer from "../components/BoardWithPlayer";
import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";

type DumbGameProps = {
    cgRef: React.RefCallback<Api>;
    onGenerateConfig?: () => CgConfig;
    controlsLeft: React.ReactNode;
    controlsTop?: React.ReactNode;
    controlsBottom?: React.ReactNode;
};

const DumbGame: React.FC<PropsWithChildren<DumbGameProps>> = (props) => {
    const {
        cgRef,
        onGenerateConfig,
        controlsTop,
        controlsBottom,
        controlsLeft,
        children
    } = props;

    const {
        orientation,
        coordinates,
    } = useContext(BoardContext);

    const {
        fen,
        lastMove,
        isCheck,
        turnColor
    } = useContext(GameContext);

    const generateConfig = useCallback(() => {
        return onGenerateConfig ? onGenerateConfig() : {
            fen: fen,
            lastMove: lastMove,
            check: isCheck,
            orientation: orientation,
            coordinates: coordinates,
            turnColor: turnColor,
            viewOnly: true,
            highlight: {
                lastMove: true,
                check: true
            },
        };
    }, [onGenerateConfig, fen, lastMove, isCheck, orientation, coordinates, turnColor]);

    return (
        <>
            <BoardWithPlayer
                onGenerateConfig={generateConfig}
                controlsTop={controlsTop}
                controlsBottom={controlsBottom}
                cgRef={cgRef}>{controlsLeft}</BoardWithPlayer>
            {children}
        </>
    );
};

export default DumbGame;