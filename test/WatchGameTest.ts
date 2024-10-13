import watchGame from '../src/components/chess/WatchGame';
import { GameProps } from '../src/chess/settings/GameProps';

var props: GameProps = {
    board: {
        orientation: "white",
        coordinates: true,
        size: 5,
        piece: "alpha",
        square: "cedar",
        configUrl: "https://www.chess-online.com/settings/board"
    },
    game: {

        game: {
            id: 7830568,
            load: false,
            insite: true,
            variant: {
                key: "standard",
                name: "Standard",
                shortName: "Std"
            },
            speed: "correspondence",
            perf: "main",
            rated: true,
            initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
            fen: "8/2b5/2k5/pr1N2p1/3K2P1/2P4P/8/R7 w - - 7 47",
            player: "white",
            turns: 92,
            startedAtTurn: 0,
            status: {
                name: "started"
            },
            event: "Простая партия",
            createdAt: 1604647899453,
            createdBy: 336243,
            private: false,
            advance: false,
            lastMove: "b6c6",
            opening: {
                code: "A00",
                name: "Start position"
            }
        },
        correspondence: {
            limit: "7 дней/ход",
            can_pause: true,
            parts: [
                {
                    per: "move",
                    initial: 604800000,
                    increment: 0,
                    min: 604800000
                }
            ],
            white: 543485000,
            black: 604800000,
            totalTime: 2336991000,
            lastMoveAt: 1606984890190,
            serverNow: 1607275499590
        },
        player: {
            color: "white",
            name: "wb04",
            user: {
                id: 336243,
                name: "wb04",
                display: "wb04",
                online: "3d",
                perfs: {
                    main: {
                        games: 348,
                        rating: 1185,
                        avg: 1130
                    }
                },
                language: "ru-RU",
                patron: "base",
                status: "base",
                title: ""
            }
        },
        opponent: {
            color: "black",
            name: "Борюшка",
            user: {
                id: 246574,
                name: "Борюшка",
                display: "Борюшка",
                online: "12h",
                perfs: {
                    main: {
                        games: 430,
                        rating: 1004,
                        avg: 978
                    }
                },
                language: "ru-RU",
                patron: "base",
                status: "base",
                title: ""
            }
        },
        orientation: "white",
        steps: [
            {
                ply: 0,
                fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            },
            {
                ply: 1,
                uci: "e2e4",
                san: "e4",
                fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
                id: "JDs/UyzN"
            },
            {
                ply: 2,
                uci: "e7e5",
                san: "e5",
                fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
                id: "RBN7Xk8W"
            },
            {
                ply: 3,
                uci: "g1f3",
                san: "Nf3",
                fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
                id: "/g9wPk5+"
            },
            {
                ply: 4,
                uci: "d7d6",
                san: "d6",
                fen: "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
                id: "6pSJqUSk"
            },
            {
                ply: 5,
                uci: "d2d4",
                san: "d4",
                fen: "rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
                id: "2iEYbktR"
            },
            {
                ply: 6,
                uci: "b8d7",
                san: "Nd7",
                fen: "r1bqkbnr/pppn1ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 1 4",
                id: "cA1Iosjb"
            },
            {
                ply: 7,
                uci: "d4d5",
                san: "d5",
                fen: "r1bqkbnr/pppn1ppp/3p4/3Pp3/4P3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 4",
                id: "rggGgsG0"
            },
            {
                ply: 8,
                uci: "g8f6",
                san: "Ngf6",
                fen: "r1bqkb1r/pppn1ppp/3p1n2/3Pp3/4P3/5N2/PPP2PPP/RNBQKB1R w KQkq - 1 5",
                id: "8dXyN5Ke"
            },
            {
                ply: 9,
                uci: "b1c3",
                san: "Nc3",
                fen: "r1bqkb1r/pppn1ppp/3p1n2/3Pp3/4P3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 2 5",
                id: "11qLGIr8"
            },
            {
                ply: 10,
                uci: "c7c6",
                san: "c6",
                fen: "r1bqkb1r/pp1n1ppp/2pp1n2/3Pp3/4P3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6",
                id: "1G5h8p0/"
            },
            {
                ply: 11,
                uci: "c1g5",
                san: "Bg5",
                fen: "r1bqkb1r/pp1n1ppp/2pp1n2/3Pp1B1/4P3/2N2N2/PPP2PPP/R2QKB1R b KQkq - 1 6",
                id: "rqmJ9kUi"
            },
            {
                ply: 12,
                uci: "h7h6",
                san: "h6",
                fen: "r1bqkb1r/pp1n1pp1/2pp1n1p/3Pp1B1/4P3/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 7",
                id: "AhdDY+Gw"
            },
            {
                ply: 13,
                uci: "g5f6",
                san: "Bxf6",
                fen: "r1bqkb1r/pp1n1pp1/2pp1B1p/3Pp3/4P3/2N2N2/PPP2PPP/R2QKB1R b KQkq - 0 7",
                id: "++5Aae7N"
            },
            {
                ply: 14,
                uci: "d7f6",
                san: "Nxf6",
                fen: "r1bqkb1r/pp3pp1/2pp1n1p/3Pp3/4P3/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 8",
                id: "Yh8jN75/"
            },
            {
                ply: 15,
                uci: "d5c6",
                san: "dxc6",
                fen: "r1bqkb1r/pp3pp1/2Pp1n1p/4p3/4P3/2N2N2/PPP2PPP/R2QKB1R b KQkq - 0 8",
                id: "YHSW+ZDC"
            },
            {
                ply: 16,
                uci: "b7c6",
                san: "bxc6",
                fen: "r1bqkb1r/p4pp1/2pp1n1p/4p3/4P3/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 9",
                id: "/RTAIWsU"
            },
            {
                ply: 17,
                uci: "f1c4",
                san: "Bc4",
                fen: "r1bqkb1r/p4pp1/2pp1n1p/4p3/2B1P3/2N2N2/PPP2PPP/R2QK2R b KQkq - 1 9",
                id: "+JjiijB0"
            },
            {
                ply: 18,
                uci: "d8e7",
                san: "Qe7",
                fen: "r1b1kb1r/p3qpp1/2pp1n1p/4p3/2B1P3/2N2N2/PPP2PPP/R2QK2R w KQkq - 2 10",
                id: "W2SF8Wcg"
            },
            {
                ply: 19,
                uci: "e1g1",
                san: "O-O",
                fen: "r1b1kb1r/p3qpp1/2pp1n1p/4p3/2B1P3/2N2N2/PPP2PPP/R2Q1RK1 b kq - 3 10",
                id: "teoxPn3X"
            },
            {
                ply: 20,
                uci: "c8e6",
                san: "Be6",
                fen: "r3kb1r/p3qpp1/2ppbn1p/4p3/2B1P3/2N2N2/PPP2PPP/R2Q1RK1 w kq - 4 11",
                id: "mR7p1dbb"
            },
            {
                ply: 21,
                uci: "c4e6",
                san: "Bxe6",
                fen: "r3kb1r/p3qpp1/2ppBn1p/4p3/4P3/2N2N2/PPP2PPP/R2Q1RK1 b kq - 0 11",
                id: "EpgaTAw8"
            },
            {
                ply: 22,
                uci: "e7e6",
                san: "Qxe6",
                fen: "r3kb1r/p4pp1/2ppqn1p/4p3/4P3/2N2N2/PPP2PPP/R2Q1RK1 w kq - 0 12",
                id: "r4fTW2tU"
            },
            {
                ply: 23,
                uci: "h2h3",
                san: "h3",
                fen: "r3kb1r/p4pp1/2ppqn1p/4p3/4P3/2N2N1P/PPP2PP1/R2Q1RK1 b kq - 0 12",
                id: "crV+p7Kf"
            },
            {
                ply: 24,
                uci: "f8e7",
                san: "Be7",
                fen: "r3k2r/p3bpp1/2ppqn1p/4p3/4P3/2N2N1P/PPP2PP1/R2Q1RK1 w kq - 1 13",
                id: "OLbpLBls"
            },
            {
                ply: 25,
                uci: "a2a3",
                san: "a3",
                fen: "r3k2r/p3bpp1/2ppqn1p/4p3/4P3/P1N2N1P/1PP2PP1/R2Q1RK1 b kq - 0 13",
                id: "eZjTGx2e"
            },
            {
                ply: 26,
                uci: "e8g8",
                san: "O-O",
                fen: "r4rk1/p3bpp1/2ppqn1p/4p3/4P3/P1N2N1P/1PP2PP1/R2Q1RK1 w - - 1 14",
                id: "PVI0FaSj"
            },
            {
                ply: 27,
                uci: "d1d3",
                san: "Qd3",
                fen: "r4rk1/p3bpp1/2ppqn1p/4p3/4P3/P1NQ1N1P/1PP2PP1/R4RK1 b - - 2 14",
                id: "ji0wAJ9e"
            },
            {
                ply: 28,
                uci: "c6c5",
                san: "c5",
                fen: "r4rk1/p3bpp1/3pqn1p/2p1p3/4P3/P1NQ1N1P/1PP2PP1/R4RK1 w - - 0 15",
                id: "/DYHGcIy"
            },
            {
                ply: 29,
                uci: "c3d5",
                san: "Nd5",
                fen: "r4rk1/p3bpp1/3pqn1p/2pNp3/4P3/P2Q1N1P/1PP2PP1/R4RK1 b - - 1 15",
                id: "MJ4AHe7Y"
            },
            {
                ply: 30,
                uci: "f8c8",
                san: "Rfc8",
                fen: "r1r3k1/p3bpp1/3pqn1p/2pNp3/4P3/P2Q1N1P/1PP2PP1/R4RK1 w - - 2 16",
                id: "9GUJsPWE"
            },
            {
                ply: 31,
                uci: "a1d1",
                san: "Rad1",
                fen: "r1r3k1/p3bpp1/3pqn1p/2pNp3/4P3/P2Q1N1P/1PP2PP1/3R1RK1 b - - 3 16",
                id: "SVdn3ehf"
            },
            {
                ply: 32,
                uci: "e7d8",
                san: "Bd8",
                fen: "r1rb2k1/p4pp1/3pqn1p/2pNp3/4P3/P2Q1N1P/1PP2PP1/3R1RK1 w - - 4 17",
                id: "Ii90RMCT"
            },
            {
                ply: 33,
                uci: "d5f6",
                san: "Nxf6+",
                fen: "r1rb2k1/p4pp1/3pqN1p/2p1p3/4P3/P2Q1N1P/1PP2PP1/3R1RK1 b - - 0 17",
                id: "Zf2MT5M0"
            },
            {
                ply: 34,
                uci: "e6f6",
                san: "Qxf6",
                fen: "r1rb2k1/p4pp1/3p1q1p/2p1p3/4P3/P2Q1N1P/1PP2PP1/3R1RK1 w - - 0 18",
                id: "kuHbgNkE"
            },
            {
                ply: 35,
                uci: "d3d6",
                san: "Qxd6",
                fen: "r1rb2k1/p4pp1/3Q1q1p/2p1p3/4P3/P4N1P/1PP2PP1/3R1RK1 b - - 0 18",
                id: "wuvPCmEv"
            },
            {
                ply: 36,
                uci: "f6d6",
                san: "Qxd6",
                fen: "r1rb2k1/p4pp1/3q3p/2p1p3/4P3/P4N1P/1PP2PP1/3R1RK1 w - - 0 19",
                id: "Rn9Vs7HK"
            },
            {
                ply: 37,
                uci: "d1d6",
                san: "Rxd6",
                fen: "r1rb2k1/p4pp1/3R3p/2p1p3/4P3/P4N1P/1PP2PP1/5RK1 b - - 0 19",
                id: "J4z/i6li"
            },
            {
                ply: 38,
                uci: "d8e7",
                san: "Be7",
                fen: "r1r3k1/p3bpp1/3R3p/2p1p3/4P3/P4N1P/1PP2PP1/5RK1 w - - 1 20",
                id: "B9uzQo51"
            },
            {
                ply: 39,
                uci: "d6d5",
                san: "Rd5",
                fen: "r1r3k1/p3bpp1/7p/2pRp3/4P3/P4N1P/1PP2PP1/5RK1 b - - 2 20",
                id: "8Eal8AmP"
            },
            {
                ply: 40,
                uci: "e7f6",
                san: "Bf6",
                fen: "r1r3k1/p4pp1/5b1p/2pRp3/4P3/P4N1P/1PP2PP1/5RK1 w - - 3 21",
                id: "4zF+iiXc"
            },
            {
                ply: 41,
                uci: "f3e5",
                san: "Nxe5",
                fen: "r1r3k1/p4pp1/5b1p/2pRN3/4P3/P6P/1PP2PP1/5RK1 b - - 0 21",
                id: "9W0+CgFr"
            },
            {
                ply: 42,
                uci: "c5c4",
                san: "c4",
                fen: "r1r3k1/p4pp1/5b1p/3RN3/2p1P3/P6P/1PP2PP1/5RK1 w - - 0 22",
                id: "m79ilAJC"
            },
            {
                ply: 43,
                uci: "c2c3",
                san: "c3",
                fen: "r1r3k1/p4pp1/5b1p/3RN3/2p1P3/P1P4P/1P3PP1/5RK1 b - - 0 22",
                id: "dwkFNOkb"
            },
            {
                ply: 44,
                uci: "a7a5",
                san: "a5",
                fen: "r1r3k1/5pp1/5b1p/p2RN3/2p1P3/P1P4P/1P3PP1/5RK1 w - - 0 23",
                id: "sHoc1HFk"
            },
            {
                ply: 45,
                uci: "e5g4",
                san: "Ng4",
                fen: "r1r3k1/5pp1/5b1p/p2R4/2p1P1N1/P1P4P/1P3PP1/5RK1 b - - 1 23",
                id: "LlfsJVx+"
            },
            {
                ply: 46,
                uci: "f6e7",
                san: "Be7",
                fen: "r1r3k1/4bpp1/7p/p2R4/2p1P1N1/P1P4P/1P3PP1/5RK1 w - - 2 24",
                id: "A7oTLo9f"
            },
            {
                ply: 47,
                uci: "f1d1",
                san: "Rfd1",
                fen: "r1r3k1/4bpp1/7p/p2R4/2p1P1N1/P1P4P/1P3PP1/3R2K1 b - - 3 24",
                id: "wkI9SC1r"
            },
            {
                ply: 48,
                uci: "e7g5",
                san: "Bg5",
                fen: "r1r3k1/5pp1/7p/p2R2b1/2p1P1N1/P1P4P/1P3PP1/3R2K1 w - - 4 25",
                id: "7anDrNWx"
            },
            {
                ply: 49,
                uci: "g2g3",
                san: "g3",
                fen: "r1r3k1/5pp1/7p/p2R2b1/2p1P1N1/P1P3PP/1P3P2/3R2K1 b - - 0 25",
                id: "rvP1Iq+P"
            },
            {
                ply: 50,
                uci: "c8b8",
                san: "Rcb8",
                fen: "rr4k1/5pp1/7p/p2R2b1/2p1P1N1/P1P3PP/1P3P2/3R2K1 w - - 1 26",
                id: "Xbefmiuf"
            },
            {
                ply: 51,
                uci: "d1b1",
                san: "Rb1",
                fen: "rr4k1/5pp1/7p/p2R2b1/2p1P1N1/P1P3PP/1P3P2/1R4K1 b - - 2 26",
                id: "eWHznoM/"
            },
            {
                ply: 52,
                uci: "g5e7",
                san: "Be7",
                fen: "rr4k1/4bpp1/7p/p2R4/2p1P1N1/P1P3PP/1P3P2/1R4K1 w - - 3 27",
                id: "zChLZcHC"
            },
            {
                ply: 53,
                uci: "d5d1",
                san: "Rdd1",
                fen: "rr4k1/4bpp1/7p/p7/2p1P1N1/P1P3PP/1P3P2/1R1R2K1 b - - 4 27",
                id: "nGfhe3be"
            },
            {
                ply: 54,
                uci: "b8b7",
                san: "Rb7",
                fen: "r5k1/1r2bpp1/7p/p7/2p1P1N1/P1P3PP/1P3P2/1R1R2K1 w - - 5 28",
                id: "lpuzB1lk"
            },
            {
                ply: 55,
                uci: "f2f4",
                san: "f4",
                fen: "r5k1/1r2bpp1/7p/p7/2p1PPN1/P1P3PP/1P6/1R1R2K1 b - - 0 28",
                id: "7svHemqi"
            },
            {
                ply: 56,
                uci: "a8b8",
                san: "Rab8",
                fen: "1r4k1/1r2bpp1/7p/p7/2p1PPN1/P1P3PP/1P6/1R1R2K1 w - - 1 29",
                id: "LqlICMth"
            },
            {
                ply: 57,
                uci: "d1d2",
                san: "Rd2",
                fen: "1r4k1/1r2bpp1/7p/p7/2p1PPN1/P1P3PP/1P1R4/1R4K1 b - - 2 29",
                id: "L5UN3Mxq"
            },
            {
                ply: 58,
                uci: "e7a3",
                san: "Bxa3",
                fen: "1r4k1/1r3pp1/7p/p7/2p1PPN1/b1P3PP/1P1R4/1R4K1 w - - 0 30",
                id: "2xS2iolX"
            },
            {
                ply: 59,
                uci: "d2c2",
                san: "Rc2",
                fen: "1r4k1/1r3pp1/7p/p7/2p1PPN1/b1P3PP/1PR5/1R4K1 b - - 1 30",
                id: "DpnkxNK7"
            },
            {
                ply: 60,
                uci: "b7b2",
                san: "Rxb2",
                fen: "1r4k1/5pp1/7p/p7/2p1PPN1/b1P3PP/1rR5/1R4K1 w - - 0 31",
                id: "WvxB4S1T"
            },
            {
                ply: 61,
                uci: "c2b2",
                san: "Rcxb2",
                fen: "1r4k1/5pp1/7p/p7/2p1PPN1/b1P3PP/1R6/1R4K1 b - - 0 31",
                id: "se1mXzEC"
            },
            {
                ply: 62,
                uci: "b8b2",
                san: "Rxb2",
                fen: "6k1/5pp1/7p/p7/2p1PPN1/b1P3PP/1r6/1R4K1 w - - 0 32",
                id: "Eov1C3nS"
            },
            {
                ply: 63,
                uci: "b1a1",
                san: "Ra1",
                fen: "6k1/5pp1/7p/p7/2p1PPN1/b1P3PP/1r6/R5K1 b - - 1 32",
                id: "My1HxX8G"
            },
            {
                ply: 64,
                uci: "a3c5",
                san: "Bc5+",
                fen: "6k1/5pp1/7p/p1b5/2p1PPN1/2P3PP/1r6/R5K1 w - - 2 33",
                id: "XmmcDaLf"
            },
            {
                ply: 65,
                uci: "g1f1",
                san: "Kf1",
                fen: "6k1/5pp1/7p/p1b5/2p1PPN1/2P3PP/1r6/R4K2 b - - 3 33",
                id: "M7t0gEo0"
            },
            {
                ply: 66,
                uci: "b2b5",
                san: "Rb5",
                fen: "6k1/5pp1/7p/prb5/2p1PPN1/2P3PP/8/R4K2 w - - 4 34",
                id: "Mc6PKNWU"
            },
            {
                ply: 67,
                uci: "g4e5",
                san: "Ne5",
                fen: "6k1/5pp1/7p/prb1N3/2p1PP2/2P3PP/8/R4K2 b - - 5 34",
                id: "DQuQzoTS"
            },
            {
                ply: 68,
                uci: "c5b6",
                san: "Bb6",
                fen: "6k1/5pp1/1b5p/pr2N3/2p1PP2/2P3PP/8/R4K2 w - - 6 35",
                id: "ueL37FYF"
            },
            {
                ply: 69,
                uci: "e5c4",
                san: "Nxc4",
                fen: "6k1/5pp1/1b5p/pr6/2N1PP2/2P3PP/8/R4K2 b - - 0 35",
                id: "WSuF8ook"
            },
            {
                ply: 70,
                uci: "b6c7",
                san: "Bc7",
                fen: "6k1/2b2pp1/7p/pr6/2N1PP2/2P3PP/8/R4K2 w - - 1 36",
                id: "Ono1MfuU"
            },
            {
                ply: 71,
                uci: "f1e2",
                san: "Ke2",
                fen: "6k1/2b2pp1/7p/pr6/2N1PP2/2P3PP/4K3/R7 b - - 2 36",
                id: "iBKfgpJ4"
            },
            {
                ply: 72,
                uci: "g8f8",
                san: "Kf8",
                fen: "5k2/2b2pp1/7p/pr6/2N1PP2/2P3PP/4K3/R7 w - - 3 37",
                id: "4ytY5+LJ"
            },
            {
                ply: 73,
                uci: "e2d3",
                san: "Kd3",
                fen: "5k2/2b2pp1/7p/pr6/2N1PP2/2PK2PP/8/R7 b - - 4 37",
                id: "mLtZiMtF"
            },
            {
                ply: 74,
                uci: "f8e7",
                san: "Ke7",
                fen: "8/2b1kpp1/7p/pr6/2N1PP2/2PK2PP/8/R7 w - - 5 38",
                id: "5PSPxJba"
            },
            {
                ply: 75,
                uci: "e4e5",
                san: "e5",
                fen: "8/2b1kpp1/7p/pr2P3/2N2P2/2PK2PP/8/R7 b - - 0 38",
                id: "iWHaDUwZ"
            },
            {
                ply: 76,
                uci: "f7f6",
                san: "f6",
                fen: "8/2b1k1p1/5p1p/pr2P3/2N2P2/2PK2PP/8/R7 w - - 0 39",
                id: "1P+XCs6i"
            },
            {
                ply: 77,
                uci: "e5f6",
                san: "exf6+",
                fen: "8/2b1k1p1/5P1p/pr6/2N2P2/2PK2PP/8/R7 b - - 0 39",
                id: "WGWQVvrO"
            },
            {
                ply: 78,
                uci: "e7f6",
                san: "Kxf6",
                fen: "8/2b3p1/5k1p/pr6/2N2P2/2PK2PP/8/R7 w - - 0 40",
                id: "hoY++7Gw"
            },
            {
                ply: 79,
                uci: "d3d4",
                san: "Kd4",
                fen: "8/2b3p1/5k1p/pr6/2NK1P2/2P3PP/8/R7 b - - 1 40",
                id: "IKDbeQsA"
            },
            {
                ply: 80,
                uci: "g7g5",
                san: "g5",
                fen: "8/2b5/5k1p/pr4p1/2NK1P2/2P3PP/8/R7 w - - 0 41",
                id: "qIRfALQa"
            },
            {
                ply: 81,
                uci: "d4e4",
                san: "Ke4",
                fen: "8/2b5/5k1p/pr4p1/2N1KP2/2P3PP/8/R7 b - - 1 41",
                id: "uTInox66"
            },
            {
                ply: 82,
                uci: "f6e6",
                san: "Ke6",
                fen: "8/2b5/4k2p/pr4p1/2N1KP2/2P3PP/8/R7 w - - 2 42",
                id: "ZRsu9nRS"
            },
            {
                ply: 83,
                uci: "f4g5",
                san: "fxg5",
                fen: "8/2b5/4k2p/pr4P1/2N1K3/2P3PP/8/R7 b - - 0 42",
                id: "VPe/pIlW"
            },
            {
                ply: 84,
                uci: "h6g5",
                san: "hxg5",
                fen: "8/2b5/4k3/pr4p1/2N1K3/2P3PP/8/R7 w - - 0 43",
                id: "8HnCQcgq"
            },
            {
                ply: 85,
                uci: "g3g4",
                san: "g4",
                fen: "8/2b5/4k3/pr4p1/2N1K1P1/2P4P/8/R7 b - - 0 43",
                id: "3nxeaY6m"
            },
            {
                ply: 86,
                uci: "e6d7",
                san: "Kd7",
                fen: "8/2bk4/8/pr4p1/2N1K1P1/2P4P/8/R7 w - - 1 44",
                id: "pbjRoWX9"
            },
            {
                ply: 87,
                uci: "e4d4",
                san: "Kd4",
                fen: "8/2bk4/8/pr4p1/2NK2P1/2P4P/8/R7 b - - 2 44",
                id: "LifQscwB"
            },
            {
                ply: 88,
                uci: "d7c6",
                san: "Kc6",
                fen: "8/2b5/2k5/pr4p1/2NK2P1/2P4P/8/R7 w - - 3 45",
                id: "oTejzprG"
            },
            {
                ply: 89,
                uci: "c4e3",
                san: "Ne3",
                fen: "8/2b5/2k5/pr4p1/3K2P1/2P1N2P/8/R7 b - - 4 45",
                id: "7ekmj4i7"
            },
            {
                ply: 90,
                uci: "c6b6",
                san: "Kb6",
                fen: "8/2b5/1k6/pr4p1/3K2P1/2P1N2P/8/R7 w - - 5 46",
                id: "x+R0mxdv"
            },
            {
                ply: 91,
                uci: "e3d5",
                san: "Nd5+",
                fen: "8/2b5/1k6/pr1N2p1/3K2P1/2P4P/8/R7 b - - 6 46",
                id: "50xgLB9L"
            },
            {
                ply: 92,
                uci: "b6c6",
                san: "Kc6",
                fen: "8/2b5/2k5/pr1N2p1/3K2P1/2P4P/8/R7 w - - 7 47",
                id: "/GYL/PqK"
            }
        ]
    }
};

export const WatchGameTest = (element: string) => watchGame(props, document.getElementById(element)!);