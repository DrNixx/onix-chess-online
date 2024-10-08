/// <reference types="../../src/js/vite-env" />
import { ChessApplicationProps } from '../../src/js/app/ChessApplicationProps';
import {chessApp, configureGame} from "../../src/js/configure";

const app_props: ChessApplicationProps = {
    locale: 'ru-RU',
    uid: import.meta.env.VITE_USER_ID,
    wsHost: import.meta.env.VITE_WS_HOST,
    token: import.meta.env.VITE_WS_TOKEN,
    modules: [],
};

const module = {
    init: function() {
        const props = {
            size: 4,
            piece: "alpha",
            square: "cedar",
            coordinates: true,
        };

        configureGame(document.getElementById("config-view")!, props);
    }
};

app_props.modules?.push(module);
chessApp(document.getElementById('app-root')!, app_props);
