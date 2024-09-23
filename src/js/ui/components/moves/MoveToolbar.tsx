import React, {PropsWithChildren, useContext} from "react";
import MoveNavigator from "./MoveNavigator";
import {GameContext} from "../../../providers/GameProvider";
import ToggleButton from "@mui/material/ToggleButton";
import Icon from "@mui/material/Icon";

type Props = {
    hasComments?: boolean;
    toolbars?: React.ReactNode;
}

const MoveToolbar: React.FC<PropsWithChildren<Props>> = ({ hasComments, toolbars, children}) => {
    const {
        showComments,
        toggleComments
    } = useContext(GameContext);

    const renderToggleEval = () => {
        if (hasComments) {
            return (
                <ToggleButton
                    sx={{p: 0.25}}
                    size="small"
                    value="check"
                    selected={showComments}
                    onChange={() => toggleComments()}><Icon className="xi-info-c" /></ToggleButton>
            );
        } else {
            return null;
        }
    };

    return (
        <React.Fragment>
            <MoveNavigator>
                { renderToggleEval() }
                { children }
            </MoveNavigator>
            { toolbars }
        </React.Fragment>
    );
};

export default MoveToolbar;