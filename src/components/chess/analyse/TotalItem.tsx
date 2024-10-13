import React, {useContext} from 'react';
import i18next from "i18next";

import Button from "@mui/material/Button";

import {IUserAnalysis, MistakeLevel} from "../../../chess/types/Interfaces";
import { BW } from '../../../chess/types/Colors';
import {GameContext} from "../../../providers/GameProvider";

type Props = {
    color: BW;
    item?: IUserAnalysis
};

const TotalItem: React.FC<Props> = (props) => {
    const { color, item } = props;

    const { navigateToNextMistake } = useContext(GameContext);

    const makeLink = (type: MistakeLevel) => {
        return () => {
            navigateToNextMistake(color, type);
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