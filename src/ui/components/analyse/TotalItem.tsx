import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import i18next from "i18next";

import Button from "@mui/material/Button";

import {Colors} from "../../../chess/types/Types";
import {IUserAnalysis} from "../../../chess/types/Interfaces";
import {GameActions} from "../../../actions/GameActions";
import {CombinedGameState} from "../../../actions/CombinedGameState";
import {Chess as ChessEngine} from "../../../chess/Chess";


type Props = {
    color: Colors.BW;
    item?: IUserAnalysis
};

const TotalItem: React.FC<Props> = (props) => {
    const { color, item } = props;

    const engine = useSelector<CombinedGameState, ChessEngine>((state) => state.game.engine );
    const dispatch = useDispatch();

    const moveToPly = (ply?: number) => {
        if (ply !== undefined) {
            dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: ply } as GameActions.GameAction);
        }
    };

    const makeLink = (type: "blunder" | "mistake" | "inaccuracy") => {
        return () => {
            moveToPly(engine?.findNextMistake(color, engine.CurrentPlyCount, type));
        };
    }

    return (
        <ul className="list-unstyled h-100 px-2 d-flex flex-column justify-content-center text-right">
            <li>
                <Button variant="text" color="info" onClick={makeLink("inaccuracy")}>
                    { i18next.t("inaccuracies", { ns: "analyse" }).toString()}:<label>{item?.inaccuracy ?? 0}</label>
                </Button>
            </li>
            <li>
                <Button variant="text" color="info" onClick={makeLink("mistake")}>
                    { i18next.t("mistakes", { ns: "analyse" }).toString()}:<label>{item?.mistake ?? 0}</label>
                </Button>
            </li>
            <li>
                <Button variant="text" color="info" onClick={makeLink("blunder")}>
                    { i18next.t("blunders", { ns: "analyse" }).toString()}:<label>{item?.blunder ?? 0}</label>
                </Button>
            </li>
            <li>
                { i18next.t("averageCentipawnLoss", { ns: "analyse" }).toString()}:<label title={i18next.t("averageCentipawnLossTitle", { ns: "analyse" })}>{item?.acpl ?? 0}</label>
            </li>
        </ul>
    );
};

export default TotalItem;