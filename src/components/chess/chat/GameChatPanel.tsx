import React, {useContext, useMemo} from 'react';
import TabPanel from "@mui/lab/TabPanel";

import {AuthContext} from "../../../providers/AuthProvider";
import {GameContext} from "../../../providers/GameProvider";
import Chat from "../../../chat/Chat";

const GameChatPanel: React.FC = () => {
    const { getUserId } = useContext(AuthContext);
    const observerId = useMemo(() => getUserId(), [getUserId]);
    
    const {
        gameId,
        isMyGame
    } = useContext(GameContext);
    
    const chatChannel = useMemo(() => {
        let chatChannel = `gamechat:${gameId}`;
        if (isMyGame) {
            chatChannel = "$" + chatChannel;
        }
        
        return chatChannel;
    }, [gameId, isMyGame]);

    return (gameId && observerId) ? (
        <TabPanel sx={{p: 0}} value="chat">
            <Chat channel={chatChannel} apiUrl="/api/chat" messages={[]} userid={observerId} />
        </TabPanel>
    ) : null;
};

export default GameChatPanel;