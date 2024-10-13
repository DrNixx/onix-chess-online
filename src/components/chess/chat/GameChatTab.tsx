import React, {useContext, useMemo} from 'react';
import {useTranslation} from "react-i18next";
import Tab from "@mui/material/Tab";
import {AuthContext} from "../../../providers/AuthProvider";

const GameChatTab: React.FC = () => {
    const { t } = useTranslation(['game']);
    const { getUserId } = useContext(AuthContext);
    const observerId = useMemo(() => getUserId(), [getUserId]);

    return observerId ? (
        <Tab label={t("chatTab")} value="chat" />
    ) : null;
};

export default GameChatTab;