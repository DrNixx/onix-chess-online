/// <reference types="../../src/js/vite-env" />
import { ChessApplicationProps } from '../../src/js/app/ChessApplicationProps';
import {chessApp, analyseGame} from "../../src/js/analyse";
import {GameProps} from "../../src/js/chess/settings/GameProps";

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
                    id: import.meta.env.VITE_ANALYSE_GAME_ID,
                    load: true,
                    insite: true
                }
            }
        };

        analyseGame(document.getElementById("game-view")!, props);
    }
};

app_props.modules?.push(module);
chessApp(document.getElementById("app-root")!, app_props);
