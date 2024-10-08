/// <reference types="../../src/js/vite-env" />
import { ChessApplicationProps } from '../../src/js/app/ChessApplicationProps';
import {chessApp, pgnGame} from "../../src/js/pgn";
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
                size: 4,
                orientation: 'black',
                csrfTokenName: undefined,
                csrfTokenValue: undefined,
                configUrl: '/ru-ru/settings/board',
                returnUrl: '/ru-ru/pgn/frame?fb=1&tabs=1',
            },
            game:{
                "game": {
                    "id": 0,
                    "load": false,
                    "insite": false,
                    "variant": {"key": "standard", "name": "Standard", "shortName": "Std"},
                    "speed": "correspondence",
                    "perf": "main",
                    "rated": true,
                    "initialFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
                    "fen": "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 4",
                    "player": "black",
                    "mover": "black",
                    "turns": 5,
                    "startedAtTurn": 0,
                    "status": {"name": "started"},
                    "event": "1 WCCSTC",
                    "createdAt": 1360886400000,
                    "lastMove": "f1b5",
                    "opening": {"code": "A00", "name": "Start position"}
                },
                "player": {
                    "color": "black",
                    "name": "Naumenko, Alexander",
                    "user": {"name": "Naumenko, Alexander", "display": "?"},
                    "rating": 2181
                },
                "opponent": {
                    "color": "white",
                    "name": "IM Van tricht, Marcel",
                    "user": {"name": "IM Van tricht, Marcel", "display": "?"},
                    "rating": 2347
                },
                "orientation": "black",
                "steps": [{"ply": 0, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}, {
                    "ply": 1,
                    "uci": "e2e4",
                    "san": "e4",
                    "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
                    "id": "+YjwFOqE"
                }, {
                    "ply": 2,
                    "uci": "c7c5",
                    "san": "c5",
                    "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
                    "id": "UdMyRkjd"
                }, {
                    "ply": 3,
                    "uci": "g1f3",
                    "san": "Nf3",
                    "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
                    "id": "R8FW9CSu"
                }, {
                    "ply": 4,
                    "uci": "b8c6",
                    "san": "Nc6",
                    "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
                    "id": "V0M9H8ph"
                }, {
                    "ply": 5,
                    "uci": "f1b5",
                    "san": "Bb5",
                    "fen": "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
                    "id": "kOax0j87"
                }],
                "finalFen": "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 4",
                "pgn": "[Event \"1 WCCSTC\"]\n[Site \"ICCF\"]\n[Date \"2013.02.15\"]\n[Round \"?\"]\n[White \"IM Van tricht, Marcel\"]\n[Black \"Naumenko, Alexander\"]\n[Result \"*\"]\n[WhiteElo \"2347\"]\n[BlackElo \"2181\"]\n[ECO \"\"]\n\n1. e4 c5 2. Nf3 Nc6 3. Bb5 *\n"
            }
        };

        pgnGame(document.getElementById("game-view")!, props);
    }
};

app_props.modules?.push(module);
chessApp(document.getElementById("app-root")!, app_props);
