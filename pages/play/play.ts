/// <reference types="../../src/vite-env" />
import { ChessApplicationProps } from '../../src/app/ChessApplicationProps';
import {chessApp, playGame} from "../../src/play";
import {GameProps} from "../../src/chess/settings/GameProps";

const app_props: ChessApplicationProps = {
    locale: 'ru-RU',
    uid: import.meta.env.VITE_USER_ID,
    wsHost: import.meta.env.VITE_WS_HOST,
    token: import.meta.env.VITE_WS_TOKEN,
    modules: [],
};

const module = {
    init: function() {
        const props: GameProps = {
            board: {
                size: 4
            },
            game: {
                game: {
                    id: import.meta.env.VITE_PLAY_GAME_ID,
                    load: true,
                    insite: true
                }
            }
        };

        playGame(document.getElementById("game-view")!, props);
    }
};

app_props.modules?.push(module);
chessApp(document.getElementById("app-root")!, app_props);
