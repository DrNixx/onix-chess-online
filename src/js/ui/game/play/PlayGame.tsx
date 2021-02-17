






var boot = {
    "data": {
        "game": {
            "id": "oqdhIEUj",
            "variant": {
                "key": "standard",
                "name": "Standard",
                "short": "Std"
            },
            "speed": "correspondence",
            "perf": "correspondence",
            "rated": false,
            "initialFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "fen": "rnbqkbnr/ppp1pppp/3p4/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
            "player": "white",
            "turns": 2,
            "startedAtTurn": 0,
            "source": "ai",
            "status": {
                "id": 20,
                "name": "started"
            },
            "createdAt": 1585435344779,
            "lastMove": "d7d6"
        },
        "player": {
            "color": "white",
            "user": {
                "id": "2",
                "username": "DrNix",
                "online": true,
                "perfs": {
                    "correspondence": {
                        "games": 0,
                        "rating": 1500,
                        "rd": 350,
                        "prog": 0,
                        "prov": true
                    }
                },
                "language": "ru-RU",
                "profile": {
                    "country": "RU"
                },
                "patron": true
            },
            "rating": 1500,
            "provisional": true,
            "blurs": {
                "nb": 1,
                "bits": "1",
                "percent": 0
            },
            "id": "6tjM",
            "version": 2,
            "onGame": true
        },
        "opponent": {
            "color": "black",
            "ai": 1,
            "onGame": true
        },
        "url": {
            "socket": "/play/oqdhIEUj6tjM/v4",
            "round": "/oqdhIEUj6tjM"
        },
        "pref": {
            "animationDuration": 300,
            "coords": 2,
            "resizeHandle": 1,
            "replay": 2,
            "autoQueen": 2,
            "clockTenths": 1,
            "moveEvent": 2,
            "clockBar": true,
            "clockSound": true,
            "confirmResign": true,
            "rookCastle": true,
            "highlight": true,
            "destination": true,
            "enablePremove": true,
            "showCaptured": true
        },
        "correspondence": {
            "daysPerTurn": 3,
            "increment": 259200,
            "white": 259184.0,
            "black": 259200.0
        },
        "takebackable": true,
        "moretimeable": true,
        "possibleMoves": "c2c3c4 g2g3g4 b1a3c3d2 g1f3h3 b2b3b4 f2f3f4 c1d2e3f4g5h6 d4d5 e2e3e4 d1d2d3 a2a3a4 e1d2 h2h3h4",
        "steps": [
            { "ply": 0, "uci": null, "san": null, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" },
            { "ply": 1, "uci": "d2d4", "san": "d4", "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1" },
            { "ply": 2, "uci": "d7d6", "san": "d6", "fen": "rnbqkbnr/ppp1pppp/3p4/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2" }
        ]
    },
    "i18n": {
        "flipBoard": "\u041f\u0435\u0440\u0435\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0434\u043e\u0441\u043a\u0443",
        "aiNameLevelAiLevel": "%1$s \u0443\u0440\u043e\u0432\u043d\u044f %2$s",
        "yourTurn": "\u0412\u0430\u0448 \u0445\u043e\u0434",
        "abortGame": "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0438\u0433\u0440\u0443",
        "proposeATakeback": "\u041f\u043e\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u0430 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0445\u043e\u0434",
        "offerDraw": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0438\u0442\u044c \u043d\u0438\u0447\u044c\u044e",
        "resign": "\u0421\u0434\u0430\u0442\u044c\u0441\u044f",
        "opponentLeftChoices": "\u0412\u0435\u0440\u043e\u044f\u0442\u043d\u043e, \u0432\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u043e\u043a\u0438\u043d\u0443\u043b \u0438\u0433\u0440\u0443. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443 \u0438\u043b\u0438 \u043d\u0438\u0447\u044c\u044e, \u0438\u043b\u0438 \u0435\u0449\u0451 \u043f\u043e\u0434\u043e\u0436\u0434\u0430\u0442\u044c.",
        "forceResignation": "\u041e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443",
        "forceDraw": "\u041e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043d\u0438\u0447\u044c\u044e",
        "threefoldRepetition": "\u0422\u0440\u043e\u0435\u043a\u0440\u0430\u0442\u043d\u043e\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435 \u043f\u043e\u0437\u0438\u0446\u0438\u0438",
        "claimADraw": "\u041f\u043e\u0442\u0440\u0435\u0431\u043e\u0432\u0430\u0442\u044c \u043d\u0438\u0447\u044c\u044e",
        "drawOfferSent": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043d\u0438\u0447\u044c\u0435\u0439 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e",
        "cancel": "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
        "yourOpponentOffersADraw": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u0442 \u0432\u0430\u043c \u043d\u0438\u0447\u044c\u044e",
        "accept": "\u041f\u0440\u0438\u043d\u044f\u0442\u044c",
        "decline": "\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c",
        "takebackPropositionSent": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0445\u043e\u0434 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e",
        "yourOpponentProposesATakeback": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u0440\u043e\u0441\u0438\u0442 \u0432\u0430\u0441 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0445\u043e\u0434",
        "thisPlayerUsesChessComputerAssistance": "\u042d\u0442\u043e\u0442 \u0438\u0433\u0440\u043e\u043a \u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430\u043c\u0438 \u0448\u0430\u0445\u043c\u0430\u0442\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c",
        "gameAborted": "\u0418\u0433\u0440\u0430 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430",
        "checkmate": "\u041c\u0430\u0442",
        "whiteResigned": "\u0411\u0435\u043b\u044b\u0435 \u0441\u0434\u0430\u043b\u0438\u0441\u044c",
        "blackResigned": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0441\u0434\u0430\u043b\u0438\u0441\u044c",
        "stalemate": "\u041f\u0430\u0442",
        "whiteLeftTheGame": "\u0411\u0435\u043b\u044b\u0435 \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b",
        "blackLeftTheGame": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b",
        "draw": "\u041d\u0438\u0447\u044c\u044f",
        "timeOut": "\u0412\u0440\u0435\u043c\u044f \u0438\u0441\u0442\u0435\u043a\u043b\u043e",
        "whiteIsVictorious": "\u041f\u043e\u0431\u0435\u0434\u0430 \u0431\u0435\u043b\u044b\u0445",
        "blackIsVictorious": "\u041f\u043e\u0431\u0435\u0434\u0430 \u0447\u0451\u0440\u043d\u044b\u0445",
        "withdraw": "\u041f\u043e\u043a\u0438\u043d\u0443\u0442\u044c",
        "rematch": "\u0420\u0435\u0432\u0430\u043d\u0448",
        "rematchOfferSent": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0440\u0435\u0432\u0430\u043d\u0448\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e", "rematchOfferAccepted": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0440\u0435\u0432\u0430\u043d\u0448\u0430 \u043f\u0440\u0438\u043d\u044f\u0442\u043e", "waitingForOpponent": "\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u0430", "cancelRematchOffer": "\u041e\u0442\u043a\u0430\u0437\u0430\u0442\u044c\u0441\u044f \u043e\u0442 \u0440\u0435\u0432\u0430\u043d\u0448\u0430", "newOpponent": "\u041d\u0430\u0439\u0442\u0438 \u0434\u0440\u0443\u0433\u043e\u0433\u043e \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u0430", "moveConfirmation": "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0445\u043e\u0434", "viewRematch": "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043c\u0430\u0442\u0447-\u0440\u0435\u0432\u0430\u043d\u0448", "whitePlays": "\u0425\u043e\u0434 \u0431\u0435\u043b\u044b\u0445", "blackPlays": "\u0425\u043e\u0434 \u0447\u0451\u0440\u043d\u044b\u0445", "giveNbSeconds:one": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434\u0443", "giveNbSeconds:few": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434\u044b", "giveNbSeconds:many": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434", "giveNbSeconds": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434", "giveMoreTime": "\u0414\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435 \u0432\u0440\u0435\u043c\u0435\u043d\u0438", "gameOver": "\u041f\u0430\u0440\u0442\u0438\u044f \u043e\u043a\u043e\u043d\u0447\u0435\u043d\u0430", "analysis": "\u0410\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u0430\u0440\u0442\u0438\u044e", "yourOpponentWantsToPlayANewGameWithYou": "\u0421\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u0442 \u0432\u0430\u043c \u0441\u044b\u0433\u0440\u0430\u0442\u044c \u0435\u0449\u0451 \u0440\u0430\u0437", "oneDay": "\u041e\u0434\u0438\u043d \u0434\u0435\u043d\u044c", "nbDays:one": "%s \u0434\u0435\u043d\u044c", "nbDays:few": "%s \u0434\u043d\u044f", "nbDays:many": "%s \u0434\u043d\u0435\u0439", "nbDays": "%s \u0434\u043d\u0435\u0439", "nbHours:one": "%s \u0447\u0430\u0441",
        "nbHours:few": "%s \u0447\u0430\u0441\u0430",
        "nbHours:many": "%s \u0447\u0430\u0441\u043e\u0432",
        "nbHours": "%s \u0447\u0430\u0441\u043e\u0432"
    },
    "userId": "2",
    "chat": null
};


var boot2 = {
    "data": {
        "game": {
            "id": "wqatrxnf",
            "variant": {
                "key": "standard",
                "name": "Standard",
                "short": "Std"
            },
            "speed": "bullet",
            "perf": "bullet",
            "rated": true,
            "initialFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "fen": "r3k2r/2p2pp1/p3N2p/1pbnP1B1/2q5/2P4Q/P1P2PPP/3R1RK1 b kq - 0 18",
            "player": "black",
            "turns": 35,
            "startedAtTurn": 0,
            "source": "pool",
            "status": {
                "id": 20,
                "name": "started"
            },
            "createdAt": 1586126458857,
            "lastMove": "d4e6",
            "opening": {
                "eco": "B00",
                "name": "St. George Defense: Polish Variation",
                "ply": 8
            }
        },
        "clock": {
            "running": true,
            "initial": 60,
            "increment": 0,
            "white": 40.14,
            "black": 47.12,
            "emerg": 10,
            "moretime": 15
        },
        "correspondence": null,
        "player": {
            "color": "black",
            "name": null,
            "user": {
                "id": "valera_b5",
                "username": "Valera_B5",
                "online": true,
                "perfs": {
                    "bullet": {
                        "games": 7743,
                        "rating": 2826,
                        "rd": 45,
                        "prog": 24
                    }
                },
                "title": "NM",
                "language": "ru-RU",
                "profile": {
                    "country": "RU"
                }
            },
            "rating": 2826,
            "version": 35,
            "spectator": true,
            "onGame": true
        },
        "opponent": {
            "color": "white",
            "name": null,
            "user": {
                "id": "jurgensanchez97",
                "username": "JurgenSanchez97",
                "online": true,
                "perfs": {
                    "bullet": {
                        "games": 5940,
                        "rating": 2764,
                        "rd": 45,
                        "prog": -24
                    }
                },
                "title": "NM",
                "language": "pl-PL",
                "profile": {
                    "country": "PL"
                }
            },
            "rating": 2764,
            "onGame": true
        },
        "orientation": "black",
        "url": {
            "socket": "/watch/wqatrxnf/black/v5",
            "round": "/wqatrxnf/black"
        },
        "pref": {
            "animationDuration": 0,
            "coords": 1,
            "resizeHandle": 1,
            "replay": 2,
            "clockTenths": 1,
            "clockBar": true,
            "highlight": true,
            "destination": true,
            "rookCastle": true,
            "showCaptured": true
        },
        "evalPut": false,
        "steps": [
            { "ply": 0, "uci": null, "san": null, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" },
            { "ply": 1, "uci": "e2e4", "san": "e4", "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1" },
            { "ply": 2, "uci": "a7a6", "san": "a6", "fen": "rnbqkbnr/1ppppppp/p7/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2" },
            { "ply": 3, "uci": "d2d4", "san": "d4", "fen": "rnbqkbnr/1ppppppp/p7/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2" },
            { "ply": 4, "uci": "b7b5", "san": "b5", "fen": "rnbqkbnr/2pppppp/p7/1p6/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3" },
            { "ply": 5, "uci": "f1d3", "san": "Bd3", "fen": "rnbqkbnr/2pppppp/p7/1p6/3PP3/3B4/PPP2PPP/RNBQK1NR b KQkq - 1 3" },
            { "ply": 6, "uci": "c8b7", "san": "Bb7", "fen": "rn1qkbnr/1bpppppp/p7/1p6/3PP3/3B4/PPP2PPP/RNBQK1NR w KQkq - 2 4" },
            { "ply": 7, "uci": "g1f3", "san": "Nf3", "fen": "rn1qkbnr/1bpppppp/p7/1p6/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 4" },
            { "ply": 8, "uci": "e7e6", "san": "e6", "fen": "rn1qkbnr/1bpp1ppp/p3p3/1p6/3PP3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 0 5" },
            { "ply": 9, "uci": "e1h1", "san": "O-O", "fen": "rn1qkbnr/1bpp1ppp/p3p3/1p6/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5" },
            { "ply": 10, "uci": "g8f6", "san": "Nf6", "fen": "rn1qkb1r/1bpp1ppp/p3pn2/1p6/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 w kq - 2 6" },
            { "ply": 11, "uci": "d1e2", "san": "Qe2", "fen": "rn1qkb1r/1bpp1ppp/p3pn2/1p6/3PP3/3B1N2/PPP1QPPP/RNB2RK1 b kq - 3 6" },
            { "ply": 12, "uci": "d7d6", "san": "d6", "fen": "rn1qkb1r/1bp2ppp/p2ppn2/1p6/3PP3/3B1N2/PPP1QPPP/RNB2RK1 w kq - 0 7" },
            { "ply": 13, "uci": "e4e5", "san": "e5", "fen": "rn1qkb1r/1bp2ppp/p2ppn2/1p2P3/3P4/3B1N2/PPP1QPPP/RNB2RK1 b kq - 0 7" },
            { "ply": 14, "uci": "d6e5", "san": "dxe5", "fen": "rn1qkb1r/1bp2ppp/p3pn2/1p2p3/3P4/3B1N2/PPP1QPPP/RNB2RK1 w kq - 0 8" },
            { "ply": 15, "uci": "d4e5", "san": "dxe5", "fen": "rn1qkb1r/1bp2ppp/p3pn2/1p2P3/8/3B1N2/PPP1QPPP/RNB2RK1 b kq - 0 8" },
            { "ply": 16, "uci": "f6d5", "san": "Nd5", "fen": "rn1qkb1r/1bp2ppp/p3p3/1p1nP3/8/3B1N2/PPP1QPPP/RNB2RK1 w kq - 1 9" },
            { "ply": 17, "uci": "d3e4", "san": "Be4", "fen": "rn1qkb1r/1bp2ppp/p3p3/1p1nP3/4B3/5N2/PPP1QPPP/RNB2RK1 b kq - 2 9" },
            { "ply": 18, "uci": "b8d7", "san": "Nd7", "fen": "r2qkb1r/1bpn1ppp/p3p3/1p1nP3/4B3/5N2/PPP1QPPP/RNB2RK1 w kq - 3 10" },
            { "ply": 19, "uci": "b1c3", "san": "Nc3", "fen": "r2qkb1r/1bpn1ppp/p3p3/1p1nP3/4B3/2N2N2/PPP1QPPP/R1B2RK1 b kq - 4 10" },
            { "ply": 20, "uci": "d5c3", "san": "Nxc3", "fen": "r2qkb1r/1bpn1ppp/p3p3/1p2P3/4B3/2n2N2/PPP1QPPP/R1B2RK1 w kq - 0 11" },
            { "ply": 21, "uci": "b2c3", "san": "bxc3", "fen": "r2qkb1r/1bpn1ppp/p3p3/1p2P3/4B3/2P2N2/P1P1QPPP/R1B2RK1 b kq - 0 11" },
            { "ply": 22, "uci": "b7e4", "san": "Bxe4", "fen": "r2qkb1r/2pn1ppp/p3p3/1p2P3/4b3/2P2N2/P1P1QPPP/R1B2RK1 w kq - 0 12" },
            { "ply": 23, "uci": "e2e4", "san": "Qxe4", "fen": "r2qkb1r/2pn1ppp/p3p3/1p2P3/4Q3/2P2N2/P1P2PPP/R1B2RK1 b kq - 0 12" },
            { "ply": 24, "uci": "d7b6", "san": "Nb6", "fen": "r2qkb1r/2p2ppp/pn2p3/1p2P3/4Q3/2P2N2/P1P2PPP/R1B2RK1 w kq - 1 13" },
            { "ply": 25, "uci": "c1g5", "san": "Bg5", "fen": "r2qkb1r/2p2ppp/pn2p3/1p2P1B1/4Q3/2P2N2/P1P2PPP/R4RK1 b kq - 2 13" },
            { "ply": 26, "uci": "d8d5", "san": "Qd5", "fen": "r3kb1r/2p2ppp/pn2p3/1p1qP1B1/4Q3/2P2N2/P1P2PPP/R4RK1 w kq - 3 14" },
            { "ply": 27, "uci": "e4h4", "san": "Qh4", "fen": "r3kb1r/2p2ppp/pn2p3/1p1qP1B1/7Q/2P2N2/P1P2PPP/R4RK1 b kq - 4 14" },
            { "ply": 28, "uci": "h7h6", "san": "h6", "fen": "r3kb1r/2p2pp1/pn2p2p/1p1qP1B1/7Q/2P2N2/P1P2PPP/R4RK1 w kq - 0 15" },
            { "ply": 29, "uci": "a1d1", "san": "Rad1", "fen": "r3kb1r/2p2pp1/pn2p2p/1p1qP1B1/7Q/2P2N2/P1P2PPP/3R1RK1 b kq - 1 15" },
            { "ply": 30, "uci": "d5c4", "san": "Qc4", "fen": "r3kb1r/2p2pp1/pn2p2p/1p2P1B1/2q4Q/2P2N2/P1P2PPP/3R1RK1 w kq - 2 16" },
            { "ply": 31, "uci": "h4h3", "san": "Qh3", "fen": "r3kb1r/2p2pp1/pn2p2p/1p2P1B1/2q5/2P2N1Q/P1P2PPP/3R1RK1 b kq - 3 16" },
            { "ply": 32, "uci": "b6d5", "san": "Nd5", "fen": "r3kb1r/2p2pp1/p3p2p/1p1nP1B1/2q5/2P2N1Q/P1P2PPP/3R1RK1 w kq - 4 17" },
            { "ply": 33, "uci": "f3d4", "san": "Nd4", "fen": "r3kb1r/2p2pp1/p3p2p/1p1nP1B1/2qN4/2P4Q/P1P2PPP/3R1RK1 b kq - 5 17" },
            { "ply": 34, "uci": "f8c5", "san": "Bc5", "fen": "r3k2r/2p2pp1/p3p2p/1pbnP1B1/2qN4/2P4Q/P1P2PPP/3R1RK1 w kq - 6 18" },
            { "ply": 35, "uci": "d4e6", "san": "Nxe6", "fen": "r3k2r/2p2pp1/p3N2p/1pbnP1B1/2q5/2P4Q/P1P2PPP/3R1RK1 b kq - 0 18" }
        ]
    },
    "i18n": {
        "flipBoard": "\u041f\u0435\u0440\u0435\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0434\u043e\u0441\u043a\u0443",
        "aiNameLevelAiLevel": "%1$s \u0443\u0440\u043e\u0432\u043d\u044f %2$s",
        "yourTurn": "\u0412\u0430\u0448 \u0445\u043e\u0434",
        "abortGame": "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0438\u0433\u0440\u0443",
        "proposeATakeback": "\u041f\u043e\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u0430 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0445\u043e\u0434",
        "offerDraw": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0438\u0442\u044c \u043d\u0438\u0447\u044c\u044e",
        "resign": "\u0421\u0434\u0430\u0442\u044c\u0441\u044f",
        "opponentLeftCounter:one": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u043e\u043a\u0438\u043d\u0443\u043b \u0438\u0433\u0440\u0443. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443 \u0447\u0435\u0440\u0435\u0437 %s \u0441\u0435\u043a\u0443\u043d\u0434\u0443.",
        "opponentLeftCounter:few": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u043e\u043a\u0438\u043d\u0443\u043b \u0438\u0433\u0440\u0443. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443 \u0447\u0435\u0440\u0435\u0437 %s \u0441\u0435\u043a\u0443\u043d\u0434\u044b.",
        "opponentLeftCounter:many": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u043e\u043a\u0438\u043d\u0443\u043b \u0438\u0433\u0440\u0443. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443 \u0447\u0435\u0440\u0435\u0437 %s \u0441\u0435\u043a\u0443\u043d\u0434.",
        "opponentLeftCounter": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u043e\u043a\u0438\u043d\u0443\u043b \u0438\u0433\u0440\u0443. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443 \u0447\u0435\u0440\u0435\u0437 %s \u0441\u0435\u043a\u0443\u043d\u0434.",
        "opponentLeftChoices": "\u0412\u0435\u0440\u043e\u044f\u0442\u043d\u043e, \u0432\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u043e\u043a\u0438\u043d\u0443\u043b \u0438\u0433\u0440\u0443. \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443 \u0438\u043b\u0438 \u043d\u0438\u0447\u044c\u044e, \u0438\u043b\u0438 \u0435\u0449\u0451 \u043f\u043e\u0434\u043e\u0436\u0434\u0430\u0442\u044c.",
        "forceResignation": "\u041e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0431\u0435\u0434\u0443",
        "forceDraw": "\u041e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043d\u0438\u0447\u044c\u044e",
        "threefoldRepetition": "\u0422\u0440\u043e\u0435\u043a\u0440\u0430\u0442\u043d\u043e\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435 \u043f\u043e\u0437\u0438\u0446\u0438\u0438",
        "claimADraw": "\u041f\u043e\u0442\u0440\u0435\u0431\u043e\u0432\u0430\u0442\u044c \u043d\u0438\u0447\u044c\u044e",
        "drawOfferSent": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u043d\u0438\u0447\u044c\u0435\u0439 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e",
        "cancel": "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
        "yourOpponentOffersADraw": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u0442 \u0432\u0430\u043c \u043d\u0438\u0447\u044c\u044e",
        "accept": "\u041f\u0440\u0438\u043d\u044f\u0442\u044c",
        "decline": "\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c",
        "takebackPropositionSent": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0445\u043e\u0434 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e",
        "yourOpponentProposesATakeback": "\u0412\u0430\u0448 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u0440\u043e\u0441\u0438\u0442 \u0432\u0430\u0441 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0445\u043e\u0434",
        "thisPlayerUsesChessComputerAssistance": "\u042d\u0442\u043e\u0442 \u0438\u0433\u0440\u043e\u043a \u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430\u043c\u0438 \u0448\u0430\u0445\u043c\u0430\u0442\u043d\u044b\u0445 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c",
        "gameAborted": "\u0418\u0433\u0440\u0430 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430",
        "checkmate": "\u041c\u0430\u0442",
        "whiteResigned": "\u0411\u0435\u043b\u044b\u0435 \u0441\u0434\u0430\u043b\u0438\u0441\u044c",
        "blackResigned": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0441\u0434\u0430\u043b\u0438\u0441\u044c",
        "stalemate": "\u041f\u0430\u0442",
        "whiteLeftTheGame": "\u0411\u0435\u043b\u044b\u0435 \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b",
        "blackLeftTheGame": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b",
        "draw": "\u041d\u0438\u0447\u044c\u044f",
        "timeOut": "\u0412\u0440\u0435\u043c\u044f \u0438\u0441\u0442\u0435\u043a\u043b\u043e",
        "whiteIsVictorious": "\u041f\u043e\u0431\u0435\u0434\u0430 \u0431\u0435\u043b\u044b\u0445",
        "blackIsVictorious": "\u041f\u043e\u0431\u0435\u0434\u0430 \u0447\u0451\u0440\u043d\u044b\u0445",
        "withdraw": "\u041f\u043e\u043a\u0438\u043d\u0443\u0442\u044c",
        "rematch": "\u0420\u0435\u0432\u0430\u043d\u0448",
        "rematchOfferSent": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0440\u0435\u0432\u0430\u043d\u0448\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e",
        "rematchOfferAccepted": "\u041f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0440\u0435\u0432\u0430\u043d\u0448\u0430 \u043f\u0440\u0438\u043d\u044f\u0442\u043e",
        "waitingForOpponent": "\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u0430",
        "cancelRematchOffer": "\u041e\u0442\u043a\u0430\u0437\u0430\u0442\u044c\u0441\u044f \u043e\u0442 \u0440\u0435\u0432\u0430\u043d\u0448\u0430",
        "newOpponent": "\u041d\u0430\u0439\u0442\u0438 \u0434\u0440\u0443\u0433\u043e\u0433\u043e \u0441\u043e\u043f\u0435\u0440\u043d\u0438\u043a\u0430",
        "confirmMove": "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0445\u043e\u0434",
        "viewRematch": "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043c\u0430\u0442\u0447-\u0440\u0435\u0432\u0430\u043d\u0448",
        "whitePlays": "\u0425\u043e\u0434 \u0431\u0435\u043b\u044b\u0445",
        "blackPlays": "\u0425\u043e\u0434 \u0447\u0451\u0440\u043d\u044b\u0445",
        "giveNbSeconds:one": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434\u0443",
        "giveNbSeconds:few": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434\u044b",
        "giveNbSeconds:many": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434",
        "giveNbSeconds": "\u0414\u0430\u0442\u044c %s \u0441\u0435\u043a\u0443\u043d\u0434",
        "giveMoreTime": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432\u0440\u0435\u043c\u0435\u043d\u0438",
        "gameOver": "\u041f\u0430\u0440\u0442\u0438\u044f \u043e\u043a\u043e\u043d\u0447\u0435\u043d\u0430",
        "analysis": "\u0410\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u0430\u0440\u0442\u0438\u044e",
        "yourOpponentWantsToPlayANewGameWithYou": "\u0421\u043e\u043f\u0435\u0440\u043d\u0438\u043a \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u0442 \u0432\u0430\u043c \u0441\u044b\u0433\u0440\u0430\u0442\u044c \u0435\u0449\u0451 \u0440\u0430\u0437",
        "youPlayTheWhitePieces": "\u0412\u044b \u0438\u0433\u0440\u0430\u0435\u0442\u0435 \u0431\u0435\u043b\u044b\u043c\u0438 \u0444\u0438\u0433\u0443\u0440\u0430\u043c\u0438",
        "youPlayTheBlackPieces": "\u0412\u044b \u0438\u0433\u0440\u0430\u0435\u0442\u0435 \u0447\u0451\u0440\u043d\u044b\u043c\u0438 \u0444\u0438\u0433\u0443\u0440\u0430\u043c\u0438",
        "itsYourTurn": "\u0412\u0430\u0448 \u0445\u043e\u0434!",
        "nbSecondsToPlayTheFirstMove:one": "%s \u0441\u0435\u043a\u0443\u043d\u0434\u0430 \u043d\u0430 \u043f\u0435\u0440\u0432\u044b\u0439 \u0445\u043e\u0434",
        "nbSecondsToPlayTheFirstMove:few": "%s \u0441\u0435\u043a\u0443\u043d\u0434\u044b \u043d\u0430 \u043f\u0435\u0440\u0432\u044b\u0439 \u0445\u043e\u0434",
        "nbSecondsToPlayTheFirstMove:many": "%s \u0441\u0435\u043a\u0443\u043d\u0434 \u043d\u0430 \u043f\u0435\u0440\u0432\u044b\u0439 \u0445\u043e\u0434",
        "nbSecondsToPlayTheFirstMove": "%s \u0441\u0435\u043a\u0443\u043d\u0434 \u043d\u0430 \u043f\u0435\u0440\u0432\u044b\u0439 \u0445\u043e\u0434"
    },
    "chat": {
        "data": {
            "id": "wqatrxnf/w",
            "name": "\u0427\u0430\u0442 \u0434\u043b\u044f \u0437\u0440\u0438\u0442\u0435\u043b\u0435\u0439",
            "lines": [],
            "userId": null,
            "resourceId": "game/wqatrxnf/w",
            "loginRequired": true
        },
        "i18n": {
            "talkInChat": "\u0411\u0443\u0434\u044c\u0442\u0435 \u0432\u0435\u0436\u043b\u0438\u0432\u044b \u0432 \u0447\u0430\u0442\u0435!",
            "toggleTheChat": "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043e\u043a\u043d\u043e \u0447\u0430\u0442\u0430",
            "loginToChat": "\u0412\u043e\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0431\u0449\u0430\u0442\u044c\u0441\u044f \u0432 \u0447\u0430\u0442\u0435",
            "youHaveBeenTimedOut": "\u0427\u0430\u0442 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0434\u043b\u044f \u0432\u0430\u0441."
        },
        "writeable": true,
        "public": true,
        "permissions": {
            "local": false
        }
    }
}


var analyse = {
    "data": {
        "game": {
            "id": "wqatrxnf",
            "variant": {
                "key": "standard",
                "name": "Standard",
                "short": "Std"
            },
            "speed": "bullet",
            "perf": "bullet",
            "rated": true,
            "initialFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "fen": "r6r/2p1b1pk/p6p/1pq1PQ2/5R2/2P5/P1P2PPP/5RK1 b - - 15 29",
            "player": "black",
            "turns": 57,
            "startedAtTurn": 0,
            "source": "pool",
            "status": { "id": 34, "name": "draw" },
            "createdAt": 1586126458857,
            "threefold": true,
            "lastMove": "f7f5",
            "check": "h7",
            "moveCentis": [0, 0, 0, 16, 32, 16, 24, 16, 40, 32, 16, 128, 0, 32, 32, 0, 168, 64, 40, 112, 32, 104, 0, 32, 184, 104, 200, 56, 128, 32, 520, 296, 296, 144, 280, 560, 80, 0, 128, 40, 280, 0, 224, 552, 144, 40, 136, 48, 120, 40, 88, 64, 112, 40, 96, 40, 38, 1],
            "division": { "middle": 23, "end": null },
            "opening": { "eco": "B00", "name": "St. George Defense: Polish Variation", "ply": 8 }
        }, "clock": {
            "running": false,
            "initial": 60,
            "increment": 0,
            "white": 25.65,
            "black": 33.94,
            "emerg": 10,
            "moretime": 15
        },
        "correspondence": null,
        "player": {
            "color": "black",
            "name": null,
            "user": {
                "id": "valera_b5",
                "username": "Valera_B5",
                "online": false,
                "perfs": {
                    "bullet": {
                        "games": 7789,
                        "rating": 2852,
                        "rd": 45,
                        "prog": 14
                    }
                },
                "title": "NM",
                "language": "ru-RU",
                "profile": { "country": "RU" }
            },
            "rating": 2826,
            "ratingDiff": -1,
            "version": 0,
            "spectator": true
        },
        "opponent": {
            "color": "white",
            "name": null,
            "user": {
                "id": "jurgensanchez97",
                "username": "JurgenSanchez97",
                "online": true,
                "perfs": {
                    "bullet": {
                        "games": 6015,
                        "rating": 2785,
                        "rd": 45,
                        "prog": 30
                    }
                },
                "title": "NM",
                "language": "pl-PL",
                "profile": { "country": "PL" }
            },
            "rating": 2764,
            "ratingDiff": 1
        },
        "orientation": "black",
        "url": { "socket": "/watch/wqatrxnf/black/v5", "round": "/wqatrxnf/black" },
        "pref": { "animationDuration": 250, "coords": 1, "resizeHandle": 1, "replay": 2, "clockTenths": 1, "clockBar": true, "highlight": true, "destination": true, "rookCastle": true, "showCaptured": true },
        "evalPut": false,
        "treeParts": [
            { "ply": 0, "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "clock": 6003 },
            { "ply": 1, "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", "id": "/?", "uci": "e2e4", "san": "e4", "opening": { "eco": "B00", "name": "King\u0027s Pawn" }, "clock": 6003 },
            { "ply": 2, "fen": "rnbqkbnr/1ppppppp/p7/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", "id": "SK", "uci": "a7a6", "san": "a6", "opening": { "eco": "B00", "name": "St. George Defense" }, "clock": 6003 },
            { "ply": 3, "fen": "rnbqkbnr/1ppppppp/p7/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2", "id": ".\u003e", "uci": "d2d4", "san": "d4", "clock": 6003 },
            { "ply": 4, "fen": "rnbqkbnr/2pppppp/p7/1p6/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3", "id": "TD", "uci": "b7b5", "san": "b5", "clock": 5987 },
            { "ply": 5, "fen": "rnbqkbnr/2pppppp/p7/1p6/3PP3/3B4/PPP2PPP/RNBQK1NR b KQkq - 1 3", "id": "(6", "uci": "f1d3", "san": "Bd3", "clock": 5971 },
            { "ply": 6, "fen": "rn1qkbnr/1bpppppp/p7/1p6/3PP3/3B4/PPP2PPP/RNBQK1NR w KQkq - 2 4", "id": "]T", "uci": "c8b7", "san": "Bb7", "clock": 5971 },
            { "ply": 7, "fen": "rn1qkbnr/1bpppppp/p7/1p6/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 3 4", "id": ")8", "uci": "g1f3", "san": "Nf3", "clock": 5947 },
            { "ply": 8, "fen": "rn1qkbnr/1bpp1ppp/p3p3/1p6/3PP3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 0 5", "id": "WO", "uci": "e7e6", "san": "e6", "opening": { "eco": "B00", "name": "St. George Defense: Polish Variation" }, "clock": 5955 },
            { "ply": 9, "fen": "rn1qkbnr/1bpp1ppp/p3p3/1p6/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 1 5", "id": "\u0027*", "uci": "e1h1", "san": "O-O", "clock": 5907 },
            { "ply": 10, "fen": "rn1qkb1r/1bpp1ppp/p3pn2/1p6/3PP3/3B1N2/PPP2PPP/RNBQ1RK1 w kq - 2 6", "id": "aP", "uci": "g8f6", "san": "Nf6", "clock": 5923 },
            { "ply": 11, "fen": "rn1qkb1r/1bpp1ppp/p3pn2/1p6/3PP3/3B1N2/PPP1QPPP/RNB2RK1 b kq - 3 6", "id": "\u0026/", "uci": "d1e2", "san": "Qe2", "clock": 5891 },
            { "ply": 12, "fen": "rn1qkb1r/1bp2ppp/p2ppn2/1p6/3PP3/3B1N2/PPP1QPPP/RNB2RK1 w kq - 0 7", "id": "VN", "uci": "d7d6", "san": "d6", "clock": 5795 },
            { "ply": 13, "fen": "rn1qkb1r/1bp2ppp/p2ppn2/1p2P3/3P4/3B1N2/PPP1QPPP/RNB2RK1 b kq - 0 7", "id": "?G", "uci": "e4e5", "san": "e5", "clock": 5891 },
            { "ply": 14, "fen": "rn1qkb1r/1bp2ppp/p3pn2/1p2p3/3P4/3B1N2/PPP1QPPP/RNB2RK1 w kq - 0 8", "id": "NG", "uci": "d6e5", "san": "dxe5", "clock": 5763 },
            { "ply": 15, "fen": "rn1qkb1r/1bp2ppp/p3pn2/1p2P3/8/3B1N2/PPP1QPPP/RNB2RK1 b kq - 0 8", "id": "\u003eG", "uci": "d4e5", "san": "dxe5", "clock": 5859 },
            { "ply": 16, "fen": "rn1qkb1r/1bp2ppp/p3p3/1p1nP3/8/3B1N2/PPP1QPPP/RNB2RK1 w kq - 1 9", "id": "PF", "uci": "f6d5", "san": "Nd5", "clock": 5763 },
            { "ply": 17, "fen": "rn1qkb1r/1bp2ppp/p3p3/1p1nP3/4B3/5N2/PPP1QPPP/RNB2RK1 b kq - 2 9", "id": "6?", "uci": "d3e4", "san": "Be4", "clock": 5691 },
            { "ply": 18, "fen": "r2qkb1r/1bpn1ppp/p3p3/1p1nP3/4B3/5N2/PPP1QPPP/RNB2RK1 w kq - 3 10", "id": "\u005cV", "uci": "b8d7", "san": "Nd7", "clock": 5699 },
            { "ply": 19, "fen": "r2qkb1r/1bpn1ppp/p3p3/1p1nP3/4B3/2N2N2/PPP1QPPP/R1B2RK1 b kq - 4 10", "id": "$5", "uci": "b1c3", "san": "Nc3", "clock": 5651 },
            { "ply": 20, "fen": "r2qkb1r/1bpn1ppp/p3p3/1p2P3/4B3/2n2N2/PPP1QPPP/R1B2RK1 w kq - 0 11", "id": "F5", "uci": "d5c3", "san": "Nxc3", "clock": 5587 },
            { "ply": 21, "fen": "r2qkb1r/1bpn1ppp/p3p3/1p2P3/4B3/2P2N2/P1P1QPPP/R1B2RK1 b kq - 0 11", "id": ",5", "uci": "b2c3", "san": "bxc3", "clock": 5619 },
            { "ply": 22, "fen": "r2qkb1r/2pn1ppp/p3p3/1p2P3/4b3/2P2N2/P1P1QPPP/R1B2RK1 w kq - 0 12", "id": "T?", "uci": "b7e4", "san": "Bxe4", "clock": 5483 },
            { "ply": 23, "fen": "r2qkb1r/2pn1ppp/p3p3/1p2P3/4Q3/2P2N2/P1P2PPP/R1B2RK1 b kq - 0 12", "id": "/?", "uci": "e2e4", "san": "Qxe4", "clock": 5619 },
            { "ply": 24, "fen": "r2qkb1r/2p2ppp/pn2p3/1p2P3/4Q3/2P2N2/P1P2PPP/R1B2RK1 w kq - 1 13", "id": "VL", "uci": "d7b6", "san": "Nb6", "clock": 5451 },
            { "ply": 25, "fen": "r2qkb1r/2p2ppp/pn2p3/1p2P1B1/4Q3/2P2N2/P1P2PPP/R4RK1 b kq - 2 13", "id": "%I", "uci": "c1g5", "san": "Bg5", "clock": 5435 },
            { "ply": 26, "fen": "r3kb1r/2p2ppp/pn2p3/1p1qP1B1/4Q3/2P2N2/P1P2PPP/R4RK1 w kq - 3 14", "id": "^F", "uci": "d8d5", "san": "Qd5", "clock": 5347 },
            { "ply": 27, "fen": "r3kb1r/2p2ppp/pn2p3/1p1qP1B1/7Q/2P2N2/P1P2PPP/R4RK1 b kq - 4 14", "id": "?B", "uci": "e4h4", "san": "Qh4", "clock": 5235 },
            { "ply": 28, "fen": "r3kb1r/2p2pp1/pn2p2p/1p1qP1B1/7Q/2P2N2/P1P2PPP/R4RK1 w kq - 0 15", "id": "ZR", "uci": "h7h6", "san": "h6", "clock": 5291 },
            { "ply": 29, "fen": "r3kb1r/2p2pp1/pn2p2p/1p1qP1B1/7Q/2P2N2/P1P2PPP/3R1RK1 b kq - 1 15", "id": "#\u0026", "uci": "a1d1", "san": "Rad1", "clock": 5107 },
            { "ply": 30, "fen": "r3kb1r/2p2pp1/pn2p2p/1p2P1B1/2q4Q/2P2N2/P1P2PPP/3R1RK1 w kq - 2 16", "id": "F=", "uci": "d5c4", "san": "Qc4", "clock": 5259 },
            { "ply": 31, "fen": "r3kb1r/2p2pp1/pn2p2p/1p2P1B1/2q5/2P2N1Q/P1P2PPP/3R1RK1 b kq - 3 16", "id": "B:", "uci": "h4h3", "san": "Qh3", "clock": 4587 },
            { "ply": 32, "fen": "r3kb1r/2p2pp1/p3p2p/1p1nP1B1/2q5/2P2N1Q/P1P2PPP/3R1RK1 w kq - 4 17", "id": "LF", "uci": "b6d5", "san": "Nd5", "clock": 4963 },
            { "ply": 33, "fen": "r3kb1r/2p2pp1/p3p2p/1p1nP1B1/2qN4/2P4Q/P1P2PPP/3R1RK1 b kq - 5 17", "id": "8\u003e", "uci": "f3d4", "san": "Nd4", "clock": 4291 },
            { "ply": 34, "fen": "r3k2r/2p2pp1/p3p2p/1pbnP1B1/2qN4/2P4Q/P1P2PPP/3R1RK1 w kq - 6 18", "id": "\u0060E", "uci": "f8c5", "san": "Bc5", "clock": 4819 },
            { "ply": 35, "fen": "r3k2r/2p2pp1/p3N2p/1pbnP1B1/2q5/2P4Q/P1P2PPP/3R1RK1 b kq - 0 18", "id": "\u003eO", "uci": "d4e6", "san": "Nxe6", "clock": 4011 },
            { "ply": 36, "fen": "r3k2r/2p3p1/p3p2p/1pbnP1B1/2q5/2P4Q/P1P2PPP/3R1RK1 w kq - 0 19", "id": "XO", "uci": "f7e6", "san": "fxe6", "clock": 4259 },
            { "ply": 37, "fen": "r3k2r/2p3p1/p3Q2p/1pbnP1B1/2q5/2P5/P1P2PPP/3R1RK1 b kq - 0 19", "id": ":O", "uci": "h3e6", "san": "Qxe6+", "check": true, "clock": 3931 },
            { "ply": 38, "fen": "r3k2r/2p1n1p1/p3Q2p/1pb1P1B1/2q5/2P5/P1P2PPP/3R1RK1 w kq - 1 20", "id": "FW", "uci": "d5e7", "san": "Ne7", "clock": 4259 },
            { "ply": 39, "fen": "r3k2r/2pQn1p1/p6p/1pb1P1B1/2q5/2P5/P1P2PPP/3R1RK1 b kq - 2 20", "id": "OV", "uci": "e6d7", "san": "Qd7+", "check": true, "clock": 3803 },
            { "ply": 40, "fen": "r6r/2pQnkp1/p6p/1pb1P1B1/2q5/2P5/P1P2PPP/3R1RK1 w - - 3 21", "id": "_X", "uci": "e8f7", "san": "Kf7", "clock": 4219 },
            { "ply": 41, "fen": "r6r/2pQBkp1/p6p/1pb1P3/2q5/2P5/P1P2PPP/3R1RK1 b - - 0 21", "id": "IW", "uci": "g5e7", "san": "Bxe7", "clock": 3523 },
            { "ply": 42, "fen": "r6r/2pQbkp1/p6p/1p2P3/2q5/2P5/P1P2PPP/3R1RK1 w - - 0 22", "id": "EW", "uci": "c5e7", "san": "Bxe7", "clock": 4219 },
            { "ply": 43, "fen": "r6r/2pQbkp1/p6p/1p2P3/2qR4/2P5/P1P2PPP/5RK1 b - - 1 22", "id": "\u0026\u003e", "uci": "d1d4", "san": "Rd4", "clock": 3299 },
            { "ply": 44, "fen": "r6r/2pQbkp1/p6p/1pq1P3/3R4/2P5/P1P2PPP/5RK1 w - - 2 23", "id": "=E", "uci": "c4c5", "san": "Qc5", "clock": 3667 },
            { "ply": 45, "fen": "r6r/2pQbkp1/p6p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 b - - 3 23", "id": "\u003e@", "uci": "d4f4", "san": "Rf4+", "check": true, "clock": 3155 },
            { "ply": 46, "fen": "r5kr/2pQb1p1/p6p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 w - - 4 24", "id": "Xa", "uci": "f7g8", "san": "Kg8", "clock": 3627 },
            { "ply": 47, "fen": "r5kr/2p1b1p1/p3Q2p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 b - - 5 24", "id": "VO", "uci": "d7e6", "san": "Qe6+", "check": true, "clock": 3019 },
            { "ply": 48, "fen": "r6r/2p1b1pk/p3Q2p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 w - - 6 25", "id": "aZ", "uci": "g8h7", "san": "Kh7", "clock": 3579 },
            { "ply": 49, "fen": "r6r/2p1b1pk/p6p/1pq1PQ2/5R2/2P5/P1P2PPP/5RK1 b - - 7 25", "id": "OH", "uci": "e6f5", "san": "Qf5+", "check": true, "clock": 2899 },
            { "ply": 50, "fen": "r5kr/2p1b1p1/p6p/1pq1PQ2/5R2/2P5/P1P2PPP/5RK1 w - - 8 26", "id": "Za", "uci": "h7g8", "san": "Kg8", "clock": 3539 },
            { "ply": 51, "fen": "r5kr/2p1bQp1/p6p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 b - - 9 26", "id": "HX", "uci": "f5f7", "san": "Qf7+", "check": true, "clock": 2811 },
            { "ply": 52, "fen": "r6r/2p1bQpk/p6p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 w - - 10 27", "id": "aZ", "uci": "g8h7", "san": "Kh7", "clock": 3475 },
            { "ply": 53, "fen": "r6r/2p1b1pk/p6p/1pq1PQ2/5R2/2P5/P1P2PPP/5RK1 b - - 11 27", "id": "XH", "uci": "f7f5", "san": "Qf5+", "check": true, "clock": 2699 },
            { "ply": 54, "fen": "r5kr/2p1b1p1/p6p/1pq1PQ2/5R2/2P5/P1P2PPP/5RK1 w - - 12 28", "id": "Za", "uci": "h7g8", "san": "Kg8", "clock": 3435 },
            { "ply": 55, "fen": "r5kr/2p1bQp1/p6p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 b - - 13 28", "id": "HX", "uci": "f5f7", "san": "Qf7+", "check": true, "clock": 2603 },
            { "ply": 56, "fen": "r6r/2p1bQpk/p6p/1pq1P3/5R2/2P5/P1P2PPP/5RK1 w - - 14 29", "id": "aZ", "uci": "g8h7", "san": "Kh7", "clock": 3395 },
            { "ply": 57, "fen": "r6r/2p1b1pk/p6p/1pq1PQ2/5R2/2P5/P1P2PPP/5RK1 b - - 15 29", "id": "XH", "uci": "f7f5", "san": "Qf5+", "check": true, "clock": 2565 }
        ]
    }, "i18n": {
        "flipBoard": "\u041f\u0435\u0440\u0435\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0434\u043e\u0441\u043a\u0443", "gameAborted": "\u0418\u0433\u0440\u0430 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u0430", "checkmate": "\u041c\u0430\u0442", "whiteResigned": "\u0411\u0435\u043b\u044b\u0435 \u0441\u0434\u0430\u043b\u0438\u0441\u044c", "blackResigned": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0441\u0434\u0430\u043b\u0438\u0441\u044c", "stalemate": "\u041f\u0430\u0442", "whiteLeftTheGame": "\u0411\u0435\u043b\u044b\u0435 \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b", "blackLeftTheGame": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0438\u0433\u0440\u044b", "draw": "\u041d\u0438\u0447\u044c\u044f", "timeOut": "\u0412\u0440\u0435\u043c\u044f \u0438\u0441\u0442\u0435\u043a\u043b\u043e", "playingRightNow": "\u0418\u0434\u0451\u0442 \u0438\u0433\u0440\u0430", "whiteIsVictorious": "\u041f\u043e\u0431\u0435\u0434\u0430 \u0431\u0435\u043b\u044b\u0445", "blackIsVictorious": "\u041f\u043e\u0431\u0435\u0434\u0430 \u0447\u0451\u0440\u043d\u044b\u0445", "kingInTheCenter": "\u041a\u043e\u0440\u043e\u043b\u044c \u0432 \u0446\u0435\u043d\u0442\u0440\u0435", "threeChecks": "\u0422\u0440\u0438 \u0448\u0430\u0445\u0430", "variantEnding": "\u041f\u0430\u0440\u0442\u0438\u044f \u043e\u043a\u043e\u043d\u0447\u0435\u043d\u0430", "analysis": "\u0410\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u0430\u0440\u0442\u0438\u044e", "boardEditor": "\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u0434\u043e\u0441\u043a\u0438", "continueFromHere": "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c \u0441 \u044d\u0442\u043e\u0439 \u043f\u043e\u0437\u0438\u0446\u0438\u0438", "playWithTheMachine": "\u0421\u044b\u0433\u0440\u0430\u0442\u044c \u0441 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u043e\u043c", "playWithAFriend": "\u0421\u044b\u0433\u0440\u0430\u0442\u044c \u0441 \u0434\u0440\u0443\u0433\u043e\u043c", "openingExplorer": "\u0411\u0430\u0437\u0430 \u0434\u0435\u0431\u044e\u0442\u043e\u0432", "inaccuracies": "\u041d\u0435\u0442\u043e\u0447\u043d\u043e\u0441\u0442\u0438", "mistakes": "\u041e\u0448\u0438\u0431\u043a\u0438", "blunders": "\u0417\u0435\u0432\u043a\u0438", "averageCentipawnLoss": "\u041f\u043e\u0442\u0435\u0440\u0438 \u0441\u0430\u043d\u0442\u0438\u043f\u0435\u0448\u0435\u043a \u0432 \u0441\u0440\u0435\u0434\u043d\u0435\u043c", "goodMove": "\u0425\u043e\u0440\u043e\u0448\u0438\u0439 \u0445\u043e\u0434", "viewTheSolution": "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0440\u0435\u0448\u0435\u043d\u0438\u0435", "youNeedAnAccountToDoThat": "\u0412\u0430\u043c \u043d\u0443\u0436\u043d\u043e \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f, \u0447\u0442\u043e\u0431\u044b \u0441\u0434\u0435\u043b\u0430\u0442\u044c \u044d\u0442\u043e", "depthX": "\u0413\u043b\u0443\u0431\u0438\u043d\u0430 %s", "usingServerAnalysis": "\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u0441\u0435\u0440\u0432\u0435\u0440\u043d\u044b\u0439 \u0430\u043d\u0430\u043b\u0438\u0437", "loadingEngine": "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0434\u0432\u0438\u0436\u043a\u0430...", "cloudAnalysis": "\u041e\u0431\u043b\u0430\u0447\u043d\u044b\u0439 \u0430\u043d\u0430\u043b\u0438\u0437", "goDeeper": "\u0410\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0433\u043b\u0443\u0431\u0436\u0435", "showThreat": "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043e\u0442\u0432\u0435\u0442\u043d\u0443\u044e \u0443\u0433\u0440\u043e\u0437\u0443", "gameOver": "\u041f\u0430\u0440\u0442\u0438\u044f \u043e\u043a\u043e\u043d\u0447\u0435\u043d\u0430", "inLocalBrowser": "\u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435", "toggleLocalEvaluation": "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u043d\u0430\u043b\u0438\u0437", "menu": "\u041c\u0435\u043d\u044e", "toStudy": "\u0421\u0442\u0443\u0434\u0438\u044f", "inlineNotation": "\u0421\u0442\u0440\u043e\u0447\u043d\u0430\u044f \u043d\u043e\u0442\u0430\u0446\u0438\u044f", "computerAnalysis": "\u041a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u043d\u044b\u0439 \u0430\u043d\u0430\u043b\u0438\u0437", "enable": "\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c", "bestMoveArrow": "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043b\u0443\u0447\u0448\u0438\u0435 \u0445\u043e\u0434\u044b \u0441\u0442\u0440\u0435\u043b\u043a\u0430\u043c\u0438", "evaluationGauge": "\u0428\u043a\u0430\u043b\u0430 \u043e\u0446\u0435\u043d\u043a\u0438", "infiniteAnalysis": "\u0411\u0435\u0441\u043a\u043e\u043d\u0435\u0447\u043d\u044b\u0439 \u0430\u043d\u0430\u043b\u0438\u0437", "removesTheDepthLimit": "\u0421\u043d\u0438\u043c\u0430\u0435\u0442 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0435 \u043d\u0430 \u0433\u043b\u0443\u0431\u0438\u043d\u0443 \u0430\u043d\u0430\u043b\u0438\u0437\u0430, \u043d\u043e \u0437\u0430\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u043f\u043e\u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0432\u0430\u0448 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440", "multipleLines": "\u041c\u043d\u043e\u0436\u0435\u0441\u0442\u0432\u043e \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432", "cpus": "\u041f\u043e\u0442\u043e\u043a\u0438", "memory": "\u041f\u0430\u043c\u044f\u0442\u044c", "delete": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c", "deleteThisImportedGame": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u044d\u0442\u0443 \u0438\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0443\u044e \u0438\u0433\u0440\u0443?", "replayMode": "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432 \u043f\u043e\u0432\u0442\u043e\u0440\u0435", "slow": "\u041c\u0435\u0434\u043b\u0435\u043d\u043d\u043e", "fast": "\u0411\u044b\u0441\u0442\u0440\u043e", "realtimeReplay": "\u041a\u0430\u043a \u0432 \u043f\u0430\u0440\u0442\u0438\u0438", "byCPL": "\u041f\u043e \u043e\u0448\u0438\u0431\u043a\u0430\u043c", "promoteVariation": "\u041f\u043e\u0432\u044b\u0441\u0438\u0442\u044c \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u0430", "makeMainLine": "\u0421\u0434\u0435\u043b\u0430\u0442\u044c \u044d\u0442\u043e\u0442 \u0432\u0430\u0440\u0438\u0430\u043d\u0442 \u0433\u043b\u0430\u0432\u043d\u044b\u043c", "deleteFromHere": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441 \u044d\u0442\u043e\u0433\u043e \u043c\u0435\u0441\u0442\u0430", "forceVariation": "\u0421\u0434\u0435\u043b\u0430\u0442\u044c \u0432\u0430\u0440\u0438\u0430\u043d\u0442 \u0433\u043b\u0430\u0432\u043d\u044b\u043c", "practiceWithComputer": "\u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0430 \u0441 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u043e\u043c", "inaccuracy": "\u041d\u0435\u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c", "mistake": "\u041e\u0448\u0438\u0431\u043a\u0430", "blunder": "\u0417\u0435\u0432\u043e\u043a", "threefoldRepetition": "\u0422\u0440\u043e\u0435\u043a\u0440\u0430\u0442\u043d\u043e\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435 \u043f\u043e\u0437\u0438\u0446\u0438\u0438", "anotherWasX": "\u041c\u043e\u0436\u043d\u043e \u0431\u044b\u043b\u043e %s", "bestWasX": "\u041b\u0443\u0447\u0448\u0435 \u0431\u044b\u043b\u043e %s", "youBrowsedAway": "\u0412\u044b \u0432\u044b\u0448\u043b\u0438 \u0438\u0437 \u0440\u0435\u0436\u0438\u043c\u0430 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0438", "resumePractice": "\u0412\u043e\u0437\u043e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0443", "whiteWinsGame": "\u0411\u0435\u043b\u044b\u0435 \u0432\u044b\u0438\u0433\u0440\u0430\u043b\u0438", "blackWinsGame": "\u0427\u0451\u0440\u043d\u044b\u0435 \u0432\u044b\u0438\u0433\u0440\u0430\u043b\u0438", "theGameIsADraw": "\u0418\u0433\u0440\u0430 \u043e\u043a\u043e\u043d\u0447\u0438\u043b\u0430\u0441\u044c \u0432\u043d\u0438\u0447\u044c\u044e.", "yourTurn": "\u0412\u0430\u0448 \u0445\u043e\u0434", "computerThinking": "\u041a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440 \u0434\u0443\u043c\u0430\u0435\u0442...", "seeBestMove": "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043b\u0443\u0447\u0448\u0438\u0439 \u0445\u043e\u0434", "hideBestMove": "\u0421\u043a\u0440\u044b\u0442\u044c \u043b\u0443\u0447\u0448\u0438\u0439 \u0445\u043e\u0434", "getAHint": "\u0412\u0437\u044f\u0442\u044c \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0443", "evaluatingYourMove": "\u041e\u0446\u0435\u043d\u043a\u0430 \u0432\u0430\u0448\u0435\u0433\u043e \u0445\u043e\u0434\u0430...", "learnFromYourMistakes": "\u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u0441\u0432\u043e\u0438 \u043e\u0448\u0438\u0431\u043a\u0438", "learnFromThisMistake": "\u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u044d\u0442\u0443 \u043e\u0448\u0438\u0431\u043a\u0443", "skipThisMove": "\u041f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u044d\u0442\u043e\u0442 \u0445\u043e\u0434", "next": "\u0414\u0430\u043b\u0435\u0435", "xWasPlayed": "\u0411\u044b\u043b\u043e \u0441\u044b\u0433\u0440\u0430\u043d\u043e %s", "findBetterMoveForWhite": "\u041d\u0430\u0439\u0434\u0438\u0442\u0435 \u0431\u043e\u043b\u0435\u0435 \u0441\u0438\u043b\u044c\u043d\u044b\u0439 \u0445\u043e\u0434 \u0437\u0430 \u0431\u0435\u043b\u044b\u0445", "findBetterMoveForBlack": "\u041d\u0430\u0439\u0434\u0438\u0442\u0435 \u0431\u043e\u043b\u0435\u0435 \u0441\u0438\u043b\u044c\u043d\u044b\u0439 \u0445\u043e\u0434 \u0437\u0430 \u0447\u0451\u0440\u043d\u044b\u0445", "resumeLearning": "\u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044e", "youCanDoBetter": "\u0415\u0441\u0442\u044c \u0431\u043e\u043b\u0435\u0435 \u0441\u0438\u043b\u044c\u043d\u044b\u0439 \u0445\u043e\u0434", "tryAnotherMoveForWhite": "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439 \u0445\u043e\u0434 \u0437\u0430 \u0431\u0435\u043b\u044b\u0445", "tryAnotherMoveForBlack": "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439 \u0445\u043e\u0434 \u0437\u0430 \u0447\u0451\u0440\u043d\u044b\u0445", "solution": "\u041e\u0442\u0432\u0435\u0442", "waitingForAnalysis": "\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u0430\u043d\u0430\u043b\u0438\u0437\u0430", "noMistakesFoundForWhite": "\u041e\u0448\u0438\u0431\u043e\u043a \u0431\u0435\u043b\u044b\u0445 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e", "noMistakesFoundForBlack": "\u041e\u0448\u0438\u0431\u043e\u043a \u0447\u0451\u0440\u043d\u044b\u0445 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e", "doneReviewingWhiteMistakes": "\u041e\u0448\u0438\u0431\u043a\u0438 \u0431\u0435\u043b\u044b\u0445 \u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u044b", "doneReviewingBlackMistakes": "\u041e\u0448\u0438\u0431\u043a\u0438 \u0447\u0451\u0440\u043d\u044b\u0445 \u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u044b", "doItAgain": "\u0412\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0435\u0449\u0451 \u0440\u0430\u0437", "reviewWhiteMistakes": "\u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u043e\u0448\u0438\u0431\u043a\u0438 \u0431\u0435\u043b\u044b\u0445", "reviewBlackMistakes": "\u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u043e\u0448\u0438\u0431\u043a\u0438 \u0447\u0451\u0440\u043d\u044b\u0445", "openingExplorerAndTablebase": "\u0411\u0430\u0437\u0430 \u0434\u0435\u0431\u044e\u0442\u043e\u0432 \u0438 \u044d\u043d\u0434\u0448\u043f\u0438\u043b\u0435\u0439", "xOpeningExplorer": "\u0411\u0430\u0437\u0430 \u0434\u0435\u0431\u044e\u0442\u043e\u0432 \u0434\u043b\u044f %s", "move": "\u0425\u043e\u0434", "games": "\u0418\u0433\u0440\u044b", "variantLoss": "\u041f\u0440\u043e\u0438\u0433\u0440\u044b\u0448\u043d\u044b\u0439 \u0445\u043e\u0434", "variantWin": "\u041f\u043e\u0431\u0435\u0434\u043d\u044b\u0439 \u0445\u043e\u0434", "insufficientMaterial": "\u041d\u0435\u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430 \u0434\u043b\u044f \u043c\u0430\u0442\u0430", "capture": "\u0412\u0437\u044f\u0442\u0438\u0435", "pawnMove": "\u0425\u043e\u0434 \u043f\u0435\u0448\u043a\u0438", "close": "\u0417\u0430\u043a\u0440\u044b\u0442\u044c", "winning": "\u0412\u044b\u0438\u0433\u0440\u044b\u0432\u0430\u044e\u0442", "unknown": "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e", "losing": "\u041f\u0440\u043e\u0438\u0433\u0440\u044b\u0432\u0430\u044e\u0442", "drawn": "\u0412\u043d\u0438\u0447\u044c\u044e", "timeControl": "\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0432\u0440\u0435\u043c\u0435\u043d\u0438", "averageElo": "\u0421\u0440\u0435\u0434\u043d\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u043e\u0432", "database": "\u0410\u0440\u0445\u0438\u0432 \u043f\u0430\u0440\u0442\u0438\u0439", "recentGames": "\u041d\u0435\u0434\u0430\u0432\u043d\u0438\u0435 \u0438\u0433\u0440\u044b", "topGames": "\u041b\u0443\u0447\u0448\u0438\u0435 \u0438\u0433\u0440\u044b", "whiteDrawBlack": "\u0411\u0435\u043b\u044b\u0435 / \u041d\u0438\u0447\u044c\u044f / \u0427\u0451\u0440\u043d\u044b\u0435", "averageRatingX": "\u0421\u0440\u0435\u0434\u043d\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433: %s", "masterDbExplanation": "\u0414\u0432\u0430 \u043c\u0438\u043b\u043b\u0438\u043e\u043d\u0430 \u0438\u0433\u0440, \u043f\u0440\u043e\u0432\u0435\u0434\u0451\u043d\u043d\u044b\u0445 \u0437\u0430 \u0434\u043e\u0441\u043a\u043e\u0439 \u0438\u0433\u0440\u043e\u043a\u0430\u043c\u0438 FIDE \u0441 \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u043e\u043c %1$s+ \u0441 %2$s \u043f\u043e %3$s", "mateInXHalfMoves:one": "\u041c\u0430\u0442 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434", "mateInXHalfMoves:few": "\u041c\u0430\u0442 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434\u0430", "mateInXHalfMoves:many": "\u041c\u0430\u0442 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434\u043e\u0432", "mateInXHalfMoves": "\u041c\u0430\u0442 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434\u043e\u0432", "nextCaptureOrPawnMoveInXHalfMoves:one": "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435 \u0432\u0437\u044f\u0442\u0438\u0435 \u0438\u043b\u0438 \u0445\u043e\u0434 \u043f\u0435\u0448\u043a\u043e\u0439 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434 (\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0434\u043e \u043e\u0431\u043d\u0443\u043b\u0435\u043d\u0438\u044f \u0441\u0447\u0451\u0442\u0447\u0438\u043a\u0430 50 \u0445\u043e\u0434\u043e\u0432)", "nextCaptureOrPawnMoveInXHalfMoves:few": "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435 \u0432\u0437\u044f\u0442\u0438\u0435 \u0438\u043b\u0438 \u0445\u043e\u0434 \u043f\u0435\u0448\u043a\u043e\u0439 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434\u0430 (\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0434\u043e \u043e\u0431\u043d\u0443\u043b\u0435\u043d\u0438\u044f \u0441\u0447\u0451\u0442\u0447\u0438\u043a\u0430 50 \u0445\u043e\u0434\u043e\u0432)", "nextCaptureOrPawnMoveInXHalfMoves:many": "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435 \u0432\u0437\u044f\u0442\u0438\u0435 \u0438\u043b\u0438 \u0445\u043e\u0434 \u043f\u0435\u0448\u043a\u043e\u0439 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434\u043e\u0432 (\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0434\u043e \u043e\u0431\u043d\u0443\u043b\u0435\u043d\u0438\u044f \u0441\u0447\u0451\u0442\u0447\u0438\u043a\u0430 50 \u0445\u043e\u0434\u043e\u0432)", "nextCaptureOrPawnMoveInXHalfMoves": "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u0435 \u0432\u0437\u044f\u0442\u0438\u0435 \u0438\u043b\u0438 \u0445\u043e\u0434 \u043f\u0435\u0448\u043a\u043e\u0439 \u0432 %s \u043f\u043e\u043b\u0443\u0445\u043e\u0434\u043e\u0432 (\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0434\u043e \u043e\u0431\u043d\u0443\u043b\u0435\u043d\u0438\u044f \u0441\u0447\u0451\u0442\u0447\u0438\u043a\u0430 50 \u0445\u043e\u0434\u043e\u0432)", "noGameFound": "\u041f\u0430\u0440\u0442\u0438\u0439 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e", "maybeIncludeMoreGamesFromThePreferencesMenu": "\u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e, \u0441\u0442\u043e\u0438\u0442 \u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435 \u0438\u0433\u0440 \u0432 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430\u0445?", "winPreventedBy50MoveRule": "\u041d\u0435 \u0443\u0434\u0430\u0451\u0442\u0441\u044f \u043f\u043e\u0431\u0435\u0434\u0438\u0442\u044c \u0438\u0437-\u0437\u0430 \u043f\u0440\u0430\u0432\u0438\u043b\u0430 50 \u0445\u043e\u0434\u043e\u0432", "lossSavedBy50MoveRule": "\u0423\u0434\u0430\u0451\u0442\u0441\u044f \u0438\u0437\u0431\u0435\u0436\u0430\u0442\u044c \u043f\u043e\u0440\u0430\u0436\u0435\u043d\u0438\u044f \u0438\u0437-\u0437\u0430 \u043f\u0440\u0430\u0432\u0438\u043b\u0430 50 \u0445\u043e\u0434\u043e\u0432", "allSet": "\u0413\u043e\u0442\u043e\u0432\u043e!", "advantage": "\u041f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u043e", "nbSeconds:one": "%s \u0441\u0435\u043a\u0443\u043d\u0434\u0430", "nbSeconds:few": "%s \u0441\u0435\u043a\u0443\u043d\u0434\u044b", "nbSeconds:many": "%s \u0441\u0435\u043a\u0443\u043d\u0434", "nbSeconds": "%s \u0441\u0435\u043a\u0443\u043d\u0434", "opening": "\u0414\u0435\u0431\u044e\u0442", "middlegame": "\u041c\u0438\u0442\u0442\u0435\u043b\u044c\u0448\u043f\u0438\u043b\u044c", "endgame": "\u042d\u043d\u0434\u0448\u043f\u0438\u043b\u044c"
    },
    "userId": null,
    "chat": { 
        "data": { 
            "id": "wqatrxnf/w", 
            "name": "\u0427\u0430\u0442 \u0434\u043b\u044f \u0437\u0440\u0438\u0442\u0435\u043b\u0435\u0439", 
            "lines": [
                { "u": "lichess", "t": "Rematch offer sent" }, 
                { "u": "lichess", "t": "Rematch offer accepted" }
            ], 
            "userId": null, 
            "resourceId": "game/wqatrxnf/w", 
            "loginRequired": true 
        }, 
        "i18n": { 
            "talkInChat": "\u0411\u0443\u0434\u044c\u0442\u0435 \u0432\u0435\u0436\u043b\u0438\u0432\u044b \u0432 \u0447\u0430\u0442\u0435!", 
            "toggleTheChat": "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043e\u043a\u043d\u043e \u0447\u0430\u0442\u0430", 
            "loginToChat": "\u0412\u043e\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u043e\u0431\u0449\u0430\u0442\u044c\u0441\u044f \u0432 \u0447\u0430\u0442\u0435", 
            "youHaveBeenTimedOut": "\u0427\u0430\u0442 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0434\u043b\u044f \u0432\u0430\u0441." 
        }, 
        "writeable": true, 
        "public": true, 
        "permissions": { 
            "local": false 
        } 
    }, 
    "explorer": { 
        "endpoint": "https://explorer.lichess.ovh", 
        "tablebaseEndpoint": "https://tablebase.lichess.ovh" 
    }
}
