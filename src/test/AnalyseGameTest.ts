import { analyseGame } from '../js/ui/game/analyse/AnalyseGame';
import { GameProps } from '../js/chess/settings/GameProps';

var props: GameProps = {
    board: {
        size: 4,
        piece: "alpha",
        square: "cedar",
        coordinates: true,
    },
    game: {
        game: {
            id: 7782247,
            load: false,
            insite: true,
            variant: {
                key: "standard",
                name: "Standard",
                shortName: "Std"
            },
            speed: "correspondence",
            perf: "maina",
            rated: true,
            initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
            fen: "8/8/p7/6Rk/8/5p1r/3B1K2/8 b - - 0 64",
            player: "black",
            turns: 125,
            startedAtTurn: 0,
            status: {
                name: "draw",
                subtype: 4,
                result: 3,
                result_name: "ничья принята"
            },
            event: "Личный чемпионат сайта по адвансу - 2018, финал",
            tournamentId: 24184,
            createdAt: 1554204125948,
            createdBy: 4,
            private: false,
            advance: true,
            lastMove: "e5g5",
            check: "h5",
            moveCentis: [
                192602477,
                1068681,
                84011568,
                6250737,
                34051340,
                741769589,
                179926605,
                83242312,
                7672019,
                249791940,
                207407681,
                54075665,
                383499997,
                299070662,
                146885838,
                721837791,
                82122390,
                613324038,
                485553529,
                2704196334,
                948548650,
                699867445,
                283675361,
                636527924,
                102507741,
                415271515,
                295777499,
                309494816,
                711305044,
                359418166,
                321281085,
                183227347,
                130574501,
                131315169,
                234063816,
                377338337,
                154001487,
                320522673,
                509138207,
                130397340,
                48950584,
                15739757,
                82941611,
                28050884,
                149505556,
                267942807,
                61011128,
                386448728,
                129283302,
                193504899,
                240755604,
                47235773,
                99706105,
                296460702,
                342222863,
                196463708,
                365752370,
                123796672,
                88499184,
                92012751,
                80334006,
                180088851,
                513092150,
                100150006,
                160326379,
                295953364,
                347543403,
                129376898,
                348035139,
                33218964,
                259127541,
                329290350,
                276558055,
                263703460,
                79924789,
                57996513,
                299327494,
                214138284,
                37536999,
                134092558,
                41277975,
                987460,
                240755134,
                19641708,
                411164023,
                194467845,
                134869570,
                42677013,
                80332563,
                43720283,
                183653247,
                516756143,
                84481415,
                38431902,
                87132784,
                5229072,
                348996339,
                75557263,
                211417929,
                172030496,
                69149332,
                14926342,
                221989458,
                86148065,
                121985444,
                9648431,
                81295767,
                2305394,
                308448618,
                3199938,
                54737697,
                20575915,
                187687530,
                41231626,
                118617908,
                967884,
                267235126,
                34912072,
                40799081,
                4487264,
                304138622,
                5196465,
                208541430,
                36614027,
                5375631
            ],
            opening: {
                code: "A05",
                name: "Reti: KIA"
            }
        },
        tournament: {
            id: 24184,
            name: "Личный чемпионат сайта по адвансу - 2018, финал",
            running: false
        },
        correspondence: {
            limit: "Адванс 10+2/21",
            can_pause: true,
            parts: [
                {
                    per: "game",
                    initial: 864000000,
                    increment: 172800000,
                    min: 0,
                    interval: 1,
                    max: 1814400000
                }
            ],
            white: 0,
            black: 0,
            totalTime: 27122872000,
            lastMoveAt: 1581326997619,
            serverNow: 1608013743540
        },
        player: {
            color: "white",
            name: "AHDPEI",
            user: {
                id: 32141,
                name: "AHDPEI",
                display: "Андрей",
                online: "1d",
                perfs: {
                    maina: {
                        games: 257,
                        rating: 1600,
                        avg: 1617
                    }
                },
                language: "ru-RU",
                profile: {
                    country: "UA"
                },
                patron: "bronze",
                status: "bronze",
                title: ""
            },
            rating: 1653,
            ratingDiff: -1.63
        },
        opponent: {
            color: "black",
            name: "Sheldon",
            user: {
                id: 82031,
                name: "Sheldon",
                display: "Станислав",
                online: "12h",
                perfs: {
                    maina: {
                        games: 410,
                        rating: 1539,
                        avg: 1557
                    }
                },
                language: "ru-RU",
                profile: {
                    country: "KZ"
                },
                patron: "bronze",
                status: "bronze",
                title: ""
            },
            rating: 1598,
            ratingDiff: 1.63
        },
        orientation: "white",
        analysis: {
            state: "ready",
            white: {
                blunder: 0,
                inaccuracy: 0,
                mistake: 0,
                acpl: 6
            },
            black: {
                blunder: 0,
                inaccuracy: 2,
                mistake: 0,
                acpl: 9
            }
        },
        treeParts: [
            {
                ply: 0,
                fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                eval: {
                    cp: 13
                }
            },
            {
                ply: 1,
                fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
                id: "XOkNHzDY",
                uci: "g1f3",
                san: "Nf3",
                eval: {
                    cp: 13,
                    best: "c4",
                    variation: "c4 e6 Nc3 d5 d4 Nf6 Nf3 c6 cxd5 exd5 Bf4 Be7 Qc2 Nh5",
                    depth: 39,
                    time: 191840,
                    by: "deep"
                }
            },
            {
                ply: 2,
                fen: "rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2",
                id: "BCyCnDJ6",
                uci: "g8f6",
                san: "Nf6",
                eval: {
                    cp: 19,
                    depth: 39,
                    time: 209000,
                    by: "deep"
                }
            },
            {
                ply: 3,
                fen: "rnbqkb1r/pppppppp/5n2/8/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2",
                id: "6TvuT81o",
                uci: "g2g3",
                san: "g3",
                eval: {
                    cp: 22,
                    best: "d4",
                    variation: "d4 e6",
                    depth: 38,
                    time: 210573,
                    by: "deep"
                }
            },
            {
                ply: 4,
                fen: "rnbqkb1r/ppp1pppp/5n2/3p4/8/5NP1/PPPPPP1P/RNBQKB1R w KQkq - 0 3",
                id: "6bUo+Ws9",
                uci: "d7d5",
                san: "d5",
                eval: {
                    depth: 36,
                    time: 209260,
                    by: "deep"
                }
            },
            {
                ply: 5,
                fen: "rnbqkb1r/ppp1pppp/5n2/3p4/8/5NP1/PPPPPPBP/RNBQK2R b KQkq - 1 3",
                id: "NbDDVSC3",
                uci: "f1g2",
                san: "Bg2",
                eval: {
                    cp: -20,
                    depth: 25,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 6,
                fen: "rnbqkb1r/pp2pppp/5n2/2pp4/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 4",
                id: "9NDf84fe",
                uci: "c7c5",
                san: "c5",
                eval: {
                    cp: -15,
                    depth: 20,
                    time: 1522,
                    by: "deep"
                }
            },
            {
                ply: 7,
                fen: "rnbqkb1r/pp2pppp/5n2/2pp4/8/5NP1/PPPPPPBP/RNBQ1RK1 b kq - 1 4",
                id: "Fkr5TpgX",
                uci: "e1g1",
                san: "O-O",
                eval: {
                    cp: 10,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 8,
                fen: "rnbqkb1r/1p2pppp/p4n2/2pp4/8/5NP1/PPPPPPBP/RNBQ1RK1 w kq - 0 5",
                id: "JZNQPqkD",
                uci: "a7a6",
                san: "a6",
                eval: {
                    cp: 17,
                    best: "h6",
                    variation: "h6 c3 e6 d4 Be7 c4 Nc6 cxd5 exd5 dxc5 Bxc5 a3 a5 Nc3",
                    depth: 21,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 9,
                fen: "rnbqkb1r/1p2pppp/p4n2/2pp4/2P5/5NP1/PP1PPPBP/RNBQ1RK1 b kq - 0 5",
                id: "SCrGuJTi",
                uci: "c2c4",
                san: "c4",
                eval: {
                    cp: 28,
                    best: "d3",
                    variation: "d3 e6",
                    depth: 19,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 10,
                fen: "rnbqkb1r/1p2pppp/p4n2/2p5/2p5/5NP1/PP1PPPBP/RNBQ1RK1 w kq - 0 6",
                id: "NJglPA7V",
                uci: "d5c4",
                san: "dxc4",
                eval: {
                    cp: 33,
                    depth: 22,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 11,
                fen: "rnbqkb1r/1p2pppp/p4n2/2p1N3/2p5/6P1/PP1PPPBP/RNBQ1RK1 b kq - 1 6",
                id: "iIuiWQpK",
                uci: "f3e5",
                san: "Ne5",
                eval: {
                    cp: 42,
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 12,
                fen: "1nbqkb1r/rp2pppp/p4n2/2p1N3/2p5/6P1/PP1PPPBP/RNBQ1RK1 w k - 2 7",
                id: "4hdcsypd",
                uci: "a8a7",
                san: "Ra7",
                eval: {
                    best: "Qd4",
                    variation: "Qd4 Nf3 Qd8 Ne5",
                    depth: 23,
                    time: 4001,
                    by: "offline"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was Qd4"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 13,
                fen: "1nbqkb1r/rp2pppp/p4n2/2p1N3/P1p5/6P1/1P1PPPBP/RNBQ1RK1 b k - 0 7",
                id: "Xf1uHp7v",
                uci: "a2a4",
                san: "a4",
                eval: {
                    cp: 63,
                    depth: 23,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 14,
                fen: "1nb1kb1r/rp2pppp/p4n2/2p1N3/P1pq4/6P1/1P1PPPBP/RNBQ1RK1 w k - 1 8",
                id: "aysbu91i",
                uci: "d8d4",
                san: "Qd4",
                eval: {
                    cp: 60,
                    depth: 22,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 15,
                fen: "1nb1kb1r/rp2pppp/p4n2/2p5/P1pq4/5NP1/1P1PPPBP/RNBQ1RK1 b k - 2 8",
                id: "61/s/+OE",
                uci: "e5f3",
                san: "Nf3",
                eval: {
                    cp: 72,
                    depth: 24,
                    time: 4004,
                    by: "offline"
                }
            },
            {
                ply: 16,
                fen: "1nbqkb1r/rp2pppp/p4n2/2p5/P1p5/5NP1/1P1PPPBP/RNBQ1RK1 w k - 3 9",
                id: "ZocD3UCs",
                uci: "d4d8",
                san: "Qd8",
                eval: {
                    cp: 66,
                    best: "Qd5",
                    variation: "Qd5 Nc3 Qd8 Ne5 Qd4 d3 Qxe5 Bf4 Qd4 Bxb8 Ra8 Bf4 cxd3 exd3",
                    depth: 21,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 17,
                fen: "1nbqkb1r/rp2pppp/p4n2/2p5/P1p5/N4NP1/1P1PPPBP/R1BQ1RK1 b k - 4 9",
                id: "gUjPK6IS",
                uci: "b1a3",
                san: "Na3",
                eval: {
                    cp: 74,
                    depth: 23,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 18,
                fen: "1n1qkb1r/rp2pppp/p3bn2/2p5/P1p5/N4NP1/1P1PPPBP/R1BQ1RK1 w k - 5 10",
                id: "HMlLbz+4",
                uci: "c8e6",
                san: "Be6",
                eval: {
                    cp: 101,
                    depth: 22,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 19,
                fen: "1n1qkb1r/rp2pppp/p3bn2/2p1N3/P1p5/N5P1/1P1PPPBP/R1BQ1RK1 b k - 6 10",
                id: "kxcNMO8a",
                uci: "f3e5",
                san: "Ne5",
                eval: {
                    cp: 92,
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 20,
                fen: "1n2kb1r/rp2pppp/p3bn2/2p1N3/P1pq4/N5P1/1P1PPPBP/R1BQ1RK1 w k - 7 11",
                id: "s5+nmn6Z",
                uci: "d8d4",
                san: "Qd4",
                eval: {
                    cp: 90,
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 21,
                fen: "1n2kb1r/rp2pppp/p3bn2/2p5/P1pq4/N4NP1/1P1PPPBP/R1BQ1RK1 b k - 8 11",
                id: "WDtz+Edm",
                uci: "e5f3",
                san: "Nf3",
                eval: {
                    cp: 71,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 22,
                fen: "1n1qkb1r/rp2pppp/p3bn2/2p5/P1p5/N4NP1/1P1PPPBP/R1BQ1RK1 w k - 9 12",
                id: "4sMCeJKV",
                uci: "d4d8",
                san: "Qd8",
                eval: {
                    cp: 85,
                    depth: 22,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 23,
                fen: "1n1qkb1r/rp2pppp/p3bn2/P1p5/2p5/N4NP1/1P1PPPBP/R1BQ1RK1 b k - 0 12",
                id: "7EyYw8QX",
                uci: "a4a5",
                san: "a5",
                eval: {
                    cp: 92,
                    best: "Ne5",
                    variation: "Ne5 Qd4 Nf3 Qd8 Qc2 b5 d3 cxd3 exd3 Rb7 axb5 axb5 Be3 Bd5",
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 24,
                fen: "1n1qkb1r/rp2pppp/p4n2/P1pb4/2p5/N4NP1/1P1PPPBP/R1BQ1RK1 w k - 1 13",
                id: "Fng+uUi+",
                uci: "e6d5",
                san: "Bd5",
                eval: {
                    cp: 102,
                    best: "Qxa5",
                    variation: "Qxa5 d3 Nc6 Ng5 Bd7 Bf4 cxd3 Nc4 Qb4 exd3 h6 Bd2 Qb5 Bxc6",
                    depth: 21,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 25,
                fen: "1n1qkb1r/rp2pppp/p4n2/P1pb4/Q1p5/N4NP1/1P1PPPBP/R1B2RK1 b k - 2 13",
                id: "lMKzzAjE",
                uci: "d1a4",
                san: "Qa4+",
                eval: {
                    cp: 76,
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 26,
                fen: "1n1qkb1r/rp2pppp/p1b2n2/P1p5/Q1p5/N4NP1/1P1PPPBP/R1B2RK1 w k - 3 14",
                id: "FiqnKd1f",
                uci: "d5c6",
                san: "Bc6",
                eval: {
                    cp: 90,
                    depth: 24,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 27,
                fen: "1n1qkb1r/rp2pppp/p1b2n2/P1p5/2Q5/N4NP1/1P1PPPBP/R1B2RK1 b k - 0 14",
                id: "RPWkLbaO",
                uci: "a4c4",
                san: "Qxc4",
                eval: {
                    cp: 79,
                    depth: 25,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 28,
                fen: "1n1qkb1r/rp3ppp/p1b1pn2/P1p5/2Q5/N4NP1/1P1PPPBP/R1B2RK1 w k - 0 15",
                id: "TylXwpPH",
                uci: "e7e6",
                san: "e6",
                eval: {
                    cp: 98,
                    depth: 24,
                    time: 4012,
                    by: "offline"
                }
            },
            {
                ply: 29,
                fen: "1n1qkb1r/rp3ppp/p1b1pn2/P1p5/2QP4/N4NP1/1P2PPBP/R1B2RK1 b k - 0 15",
                id: "mxYD8/dq",
                uci: "d2d4",
                san: "d4",
                eval: {
                    cp: 81,
                    depth: 23,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 30,
                fen: "3qkb1r/rp1n1ppp/p1b1pn2/P1p5/2QP4/N4NP1/1P2PPBP/R1B2RK1 w k - 1 16",
                id: "sRTcOstJ",
                uci: "b8d7",
                san: "Nbd7",
                eval: {
                    cp: 82,
                    best: "Qxa5",
                    variation: "Qxa5 dxc5",
                    depth: 20,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 31,
                fen: "3qkb1r/rp1n1ppp/p1b1pn2/P1p1N3/2QP4/N5P1/1P2PPBP/R1B2RK1 b k - 2 16",
                id: "mERKSBXB",
                uci: "f3e5",
                san: "Ne5",
                eval: {
                    cp: 74,
                    depth: 20,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 32,
                fen: "3qkb1r/rp1n1ppp/p3pn2/P1p1N3/2QP4/N5P1/1P2PPbP/R1B2RK1 w k - 0 17",
                id: "SvF0rvhA",
                uci: "c6g2",
                san: "Bxg2",
                eval: {
                    cp: 95,
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 33,
                fen: "3qkb1r/rp1n1ppp/p3pn2/P1p1N3/2QP4/N5P1/1P2PPKP/R1B2R2 b k - 0 17",
                id: "F+GFSYVx",
                uci: "g1g2",
                san: "Kxg2",
                eval: {
                    cp: 80,
                    depth: 26,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 34,
                fen: "3qkb1r/rp1n1ppp/p3pn2/P3N3/2Qp4/N5P1/1P2PPKP/R1B2R2 w k - 0 18",
                id: "Is6xacut",
                uci: "c5d4",
                san: "cxd4",
                eval: {
                    cp: 85,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 35,
                fen: "3qkb1r/rp1n1ppp/p3pn2/P3N3/2Qp1B2/N5P1/1P2PPKP/R4R2 b k - 1 18",
                id: "5yW6Wm9o",
                uci: "c1f4",
                san: "Bf4",
                eval: {
                    cp: 85,
                    depth: 23,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 36,
                fen: "r2qkb1r/1p1n1ppp/p3pn2/P3N3/2Qp1B2/N5P1/1P2PPKP/R4R2 w k - 2 19",
                id: "jKle3NV3",
                uci: "a7a8",
                san: "Ra8",
                eval: {
                    cp: 91,
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 37,
                fen: "r2qkb1r/1p1n1ppp/p3pn2/P3N3/2Qp1B2/N5P1/1P2PPKP/R2R4 b k - 3 19",
                id: "ZmgaPN6v",
                uci: "f1d1",
                san: "Rfd1",
                eval: {
                    cp: 77,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 38,
                fen: "r2qk2r/1p1n1ppp/p3pn2/P1b1N3/2Qp1B2/N5P1/1P2PPKP/R2R4 w k - 4 20",
                id: "trwitwWV",
                uci: "f8c5",
                san: "Bc5",
                eval: {
                    cp: 68,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 39,
                fen: "r2qk2r/1p1n1ppp/p3pn2/P1b1N3/2Qp1B2/6P1/1PN1PPKP/R2R4 b k - 5 20",
                id: "oB9q4Z2N",
                uci: "a3c2",
                san: "Nc2",
                eval: {
                    cp: 84,
                    depth: 25,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 40,
                fen: "r2q1rk1/1p1n1ppp/p3pn2/P1b1N3/2Qp1B2/6P1/1PN1PPKP/R2R4 w - - 6 21",
                id: "w69RYsxW",
                uci: "e8g8",
                san: "O-O",
                eval: {
                    cp: 49,
                    best: "b5",
                    variation: "b5",
                    depth: 24,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 41,
                fen: "r2q1rk1/1p1N1ppp/p3pn2/P1b5/2Qp1B2/6P1/1PN1PPKP/R2R4 b - - 0 21",
                id: "qTHO5UuM",
                uci: "e5d7",
                san: "Nxd7",
                eval: {
                    cp: 84,
                    best: "Nxd4",
                    variation: "Nxd4 b5",
                    depth: 25,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 42,
                fen: "r4rk1/1p1q1ppp/p3pn2/P1b5/2Qp1B2/6P1/1PN1PPKP/R2R4 w - - 0 22",
                id: "MHSF1Jfy",
                uci: "d8d7",
                san: "Qxd7",
                eval: {
                    cp: 65,
                    best: "Nxd7",
                    variation: "Nxd7 Nxd4 b5 axb6 Qxb6 Nb3 Qb7+ f3 Bb6 Qb4 Nf6 e4 Rfc8 Na5",
                    depth: 23,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 43,
                fen: "r4rk1/1p1q1ppp/p3pn2/P1Q5/3p1B2/6P1/1PN1PPKP/R2R4 b - - 0 22",
                id: "83xC9u06",
                uci: "c4c5",
                san: "Qxc5",
                eval: {
                    cp: 84,
                    depth: 27,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 44,
                fen: "r1r3k1/1p1q1ppp/p3pn2/P1Q5/3p1B2/6P1/1PN1PPKP/R2R4 w - - 1 23",
                id: "TsyNSaGm",
                uci: "f8c8",
                san: "Rfc8",
                eval: {
                    cp: 81,
                    depth: 26,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 45,
                fen: "r1r3k1/1p1q1ppp/p3pn2/P7/3Q1B2/6P1/1PN1PPKP/R2R4 b - - 0 23",
                id: "EsLVQi9n",
                uci: "c5d4",
                san: "Qxd4",
                eval: {
                    cp: 92,
                    depth: 26,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 46,
                fen: "r1r3k1/1p3ppp/p1q1pn2/P7/3Q1B2/6P1/1PN1PPKP/R2R4 w - - 1 24",
                id: "e0SD89oG",
                uci: "d7c6",
                san: "Qc6+",
                eval: {
                    cp: 80,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 47,
                fen: "r1r3k1/1p3ppp/p1q1pn2/P7/3Q1B2/5PP1/1PN1P1KP/R2R4 b - - 0 24",
                id: "EWWiXDQ8",
                uci: "f2f3",
                san: "f3",
                eval: {
                    cp: 62,
                    depth: 25,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 48,
                fen: "r1r3k1/1p3ppp/p3pn2/P7/3Q1B2/5PP1/1Pq1P1KP/R2R4 w - - 0 25",
                id: "mdt/o9LC",
                uci: "c6c2",
                san: "Qxc2",
                eval: {
                    cp: 72,
                    depth: 26,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 49,
                fen: "r1r3k1/1p3ppp/p3pn2/P7/3Q1B2/5PP1/1PqRP1KP/R7 b - - 1 25",
                id: "NYWzVhoQ",
                uci: "d1d2",
                san: "Rd2",
                eval: {
                    cp: 87,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 50,
                fen: "r1r3k1/1p3ppp/p3pn2/P7/2qQ1B2/5PP1/1P1RP1KP/R7 w - - 2 26",
                id: "PyrbpkpC",
                uci: "c2c4",
                san: "Qc4",
                eval: {
                    cp: 75,
                    best: "Qc5",
                    variation: "Qc5 Be5",
                    depth: 22,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 51,
                fen: "r1r3k1/1p3ppp/p3pn2/P7/2Q2B2/5PP1/1P1RP1KP/R7 b - - 0 26",
                id: "eHO1qkw9",
                uci: "d4c4",
                san: "Qxc4",
                eval: {
                    cp: 82,
                    best: "Be5",
                    variation: "Be5 Qxd4 Bxd4 Rc7 Rad1 Rd8 Kf2 Rcd7 Ke1 Ne8 Bf2 Rxd2 Rxd2 Rxd2",
                    depth: 25,
                    time: 4005,
                    by: "offline"
                }
            },
            {
                ply: 52,
                fen: "r5k1/1p3ppp/p3pn2/P7/2r2B2/5PP1/1P1RP1KP/R7 w - - 0 27",
                id: "VS1kGQrY",
                uci: "c8c4",
                san: "Rxc4",
                eval: {
                    cp: 81,
                    depth: 28,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 53,
                fen: "r5k1/1p3ppp/p3pn2/P7/2r1PB2/5PP1/1P1R2KP/R7 b - - 0 27",
                id: "nP+Malkt",
                uci: "e2e4",
                san: "e4",
                eval: {
                    cp: 64,
                    depth: 27,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 54,
                fen: "2r3k1/1p3ppp/p3pn2/P7/2r1PB2/5PP1/1P1R2KP/R7 w - - 1 28",
                id: "THCsVXxd",
                uci: "a8c8",
                san: "Rac8",
                eval: {
                    cp: 79,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 55,
                fen: "2r3k1/1p3ppp/p3pn2/P3B3/2r1P3/5PP1/1P1R2KP/R7 b - - 2 28",
                id: "844no+Ov",
                uci: "f4e5",
                san: "Be5",
                eval: {
                    cp: 63,
                    best: "Kf2",
                    variation: "Kf2 Rc2 Rd1 Kf8 Ke3 Rxd2 Rxd2 Ke7 Bd6+ Ke8 Be5 Rc5 Bc3 Nd7",
                    depth: 21,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 56,
                fen: "2r2k2/1p3ppp/p3pn2/P3B3/2r1P3/5PP1/1P1R2KP/R7 w - - 3 29",
                id: "B2Gaq56h",
                uci: "g8f8",
                san: "Kf8",
                eval: {
                    cp: 63,
                    depth: 24,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 57,
                fen: "2r2k2/1p3ppp/p3pn2/P3B3/2r1P3/5PP1/1P1R2KP/3R4 b - - 4 29",
                id: "4GVWdWRX",
                uci: "a1d1",
                san: "Rad1",
                eval: {
                    cp: 77,
                    best: "Bc3",
                    variation: "Bc3 h5 Kf2 Ke7 Ra3 R8c5 Rb3 Rb5 Rxb5 axb5 Ke3 Ne8 Rd4 Rxd4",
                    depth: 23,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 58,
                fen: "2r1k3/1p3ppp/p3pn2/P3B3/2r1P3/5PP1/1P1R2KP/3R4 w - - 5 30",
                id: "qOH0jLno",
                uci: "f8e8",
                san: "Ke8",
                eval: {
                    cp: 64,
                    depth: 25,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 59,
                fen: "2r1k3/1p3ppp/p3pn2/P7/2r1P3/2B2PP1/1P1R2KP/3R4 b - - 6 30",
                id: "5Co2uze/",
                uci: "e5c3",
                san: "Bc3",
                eval: {
                    cp: 74,
                    depth: 28,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 60,
                fen: "2r1k3/1p3ppp/p3pn2/P1r5/4P3/2B2PP1/1P1R2KP/3R4 w - - 7 31",
                id: "A/7IqPlp",
                uci: "c4c5",
                san: "R4c5",
                eval: {
                    cp: 60,
                    depth: 28,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 61,
                fen: "2r1k3/1p3ppp/p3pn2/P1r5/4P3/2B2PP1/1P1R1K1P/3R4 b - - 8 31",
                id: "IJKgTEu/",
                uci: "g2f2",
                san: "Kf2",
                eval: {
                    cp: 60,
                    best: "h3",
                    variation: "h3 Rb5 Kf2 Ke7 Rd4 e5 Rb4 Rxb4 Bxb4+ Ke8 Bc3 Nd7 Ke3 f6",
                    depth: 26,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 62,
                fen: "2r1k3/1p3ppp/p3pn2/Pr6/4P3/2B2PP1/1P1R1K1P/3R4 w - - 9 32",
                id: "uoLuJsTi",
                uci: "c5b5",
                san: "Rb5",
                eval: {
                    cp: 65,
                    depth: 24,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 63,
                fen: "2r1k3/1p3ppp/p3pn2/Pr6/4P3/2B1KPP1/1P1R3P/3R4 b - - 10 32",
                id: "7P9r2XGP",
                uci: "f2e3",
                san: "Ke3",
                eval: {
                    cp: 68,
                    best: "h3",
                    variation: "h3 Ke7",
                    depth: 23,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 64,
                fen: "2r5/1p2kppp/p3pn2/Pr6/4P3/2B1KPP1/1P1R3P/3R4 w - - 11 33",
                id: "xJCYzQsV",
                uci: "e8e7",
                san: "Ke7",
                eval: {
                    cp: 50,
                    depth: 24,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 65,
                fen: "2r5/1p2kppp/p3pn2/Pr6/3RP3/2B1KPP1/1P5P/3R4 b - - 12 33",
                id: "OhsI1Cpi",
                uci: "d2d4",
                san: "Rd4",
                eval: {
                    cp: 61,
                    best: "h4",
                    variation: "h4 h5 Rd4 Ke8 R1d2 g6 Ke2 Ke7 Rd1 Ke8 R1d3 Ke7 Ke3 Ke8",
                    depth: 22,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 66,
                fen: "2r5/1p2kp1p/p3pnp1/Pr6/3RP3/2B1KPP1/1P5P/3R4 w - - 0 34",
                id: "gbNWLw5d",
                uci: "g7g6",
                san: "g6",
                eval: {
                    cp: 48,
                    best: "e5",
                    variation: "e5 Rb4 Rcc5 f4 Ng4+ Ke2 Ke8 Rxb5 Rxb5 h3 Nf6 Kf3 exf4 Kxf4",
                    depth: 21,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 67,
                fen: "2r5/1p2kp1p/p3pnp1/Pr6/3RP1P1/2B1KP2/1P5P/3R4 b - - 0 34",
                id: "b/EbDl9M",
                uci: "g3g4",
                san: "g4",
                eval: {
                    cp: 69,
                    depth: 21,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 68,
                fen: "2r5/1p2kp2/p3pnp1/Pr5p/3RP1P1/2B1KP2/1P5P/3R4 w - - 0 35",
                id: "hGvw+1ZN",
                uci: "h7h5",
                san: "h5",
                eval: {
                    cp: 75,
                    best: "e5",
                    variation: "e5",
                    depth: 23,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 69,
                fen: "2r5/1p2kp2/p3pnp1/Pr5P/3RP3/2B1KP2/1P5P/3R4 b - - 0 35",
                id: "3k3h6EeQ",
                uci: "g4h5",
                san: "gxh5",
                eval: {
                    cp: 81,
                    depth: 26,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 70,
                fen: "2r5/1p2kp2/p3pnp1/P6r/3RP3/2B1KP2/1P5P/3R4 w - - 0 36",
                id: "tpyvTWNr",
                uci: "b5h5",
                san: "Rxh5",
                eval: {
                    cp: 65,
                    depth: 27,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 71,
                fen: "2r5/1p2kp2/p3pnp1/P6r/1R2P3/2B1KP2/1P5P/3R4 b - - 1 36",
                id: "EUOfWfcX",
                uci: "d4b4",
                san: "Rb4",
                eval: {
                    cp: 64,
                    depth: 25,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 72,
                fen: "8/1pr1kp2/p3pnp1/P6r/1R2P3/2B1KP2/1P5P/3R4 w - - 2 37",
                id: "wdzvayGO",
                uci: "c8c7",
                san: "Rc7",
                eval: {
                    cp: 90,
                    depth: 26,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 73,
                fen: "8/1pr1kp2/p3pnp1/P6r/4P3/1RB1KP2/1P5P/3R4 b - - 3 37",
                id: "OAFCCxBU",
                uci: "b4b3",
                san: "Rb3",
                eval: {
                    cp: 64,
                    depth: 25,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 74,
                fen: "8/1pr1kp2/p3pnp1/P7/4P3/1RB1KP1r/1P5P/3R4 w - - 4 38",
                id: "OgXMGgfl",
                uci: "h5h3",
                san: "Rh3",
                eval: {
                    cp: 35,
                    depth: 24,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 75,
                fen: "8/1pr1kp2/p3pnp1/P7/4PK2/1RB2P1r/1P5P/3R4 b - - 5 38",
                id: "8TMiTKNc",
                uci: "e3f4",
                san: "Kf4",
                eval: {
                    cp: 75,
                    depth: 29,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 76,
                fen: "8/1prnkp2/p3p1p1/P7/4PK2/1RB2P1r/1P5P/3R4 w - - 6 39",
                id: "d9ejojF/",
                uci: "f6d7",
                san: "Nd7",
                eval: {
                    cp: 77,
                    depth: 27,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 77,
                fen: "8/1prnkp2/p3p1p1/P7/1B2PK2/1R3P1r/1P5P/3R4 b - - 7 39",
                id: "sIRfzzNe",
                uci: "c3b4",
                san: "Bb4+",
                eval: {
                    cp: 35,
                    depth: 30,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 78,
                fen: "8/1prn1p2/p3pkp1/P7/1B2PK2/1R3P1r/1P5P/3R4 w - - 8 40",
                id: "4WBc+vcB",
                uci: "e7f6",
                san: "Kf6",
                eval: {
                    cp: 36,
                    depth: 31,
                    time: 4007,
                    by: "offline"
                }
            },
            {
                ply: 79,
                fen: "8/1prn1p2/p2Bpkp1/P7/4PK2/1R3P1r/1P5P/3R4 b - - 9 40",
                id: "8CkF6gY3",
                uci: "b4d6",
                san: "Bd6",
                eval: {
                    cp: 35,
                    depth: 32,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 80,
                fen: "8/1prn1p2/p2Bpk2/P5p1/4PK2/1R3P1r/1P5P/3R4 w - - 0 41",
                id: "TzPyeiDM",
                uci: "g6g5",
                san: "g5+",
                eval: {
                    cp: 35,
                    depth: 29,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 81,
                fen: "8/1prn1p2/p2Bpk2/P5p1/4P1K1/1R3P1r/1P5P/3R4 b - - 1 41",
                id: "yXKmbScJ",
                uci: "f4g4",
                san: "Kg4",
                eval: {
                    cp: 51,
                    depth: 31,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 82,
                fen: "8/1prn1p2/p2Bpk2/P5p1/4P1Kr/1R3P2/1P5P/3R4 w - - 2 42",
                id: "Gsb/W+RC",
                uci: "h3h4",
                san: "Rh4+",
                eval: {
                    cp: 51,
                    depth: 30,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 83,
                fen: "8/1prn1p2/p2Bpk2/P5p1/4P2r/1R3PK1/1P5P/3R4 b - - 3 42",
                id: "MgfRxuiD",
                uci: "g4g3",
                san: "Kg3",
                eval: {
                    cp: 60,
                    depth: 31,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 84,
                fen: "8/1p1n1p2/p2Bpk2/P5p1/4P2r/1R3PK1/1Pr4P/3R4 w - - 4 43",
                id: "vcmi1pry",
                uci: "c7c2",
                san: "Rc2",
                eval: {
                    cp: 45,
                    depth: 30,
                    time: 4015,
                    by: "offline"
                }
            },
            {
                ply: 85,
                fen: "8/1p1n1p2/p2Bpk2/P5p1/4P2r/1R3PKP/1Pr5/3R4 b - - 0 43",
                id: "U8mzdx7X",
                uci: "h2h3",
                san: "h3",
                eval: {
                    cp: 76,
                    depth: 29,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 86,
                fen: "8/1p1n1p2/p2Bp1k1/P5p1/4P2r/1R3PKP/1Pr5/3R4 w - - 1 44",
                id: "c/0ctXE1",
                uci: "f6g6",
                san: "Kg6",
                eval: {
                    cp: 32,
                    depth: 32,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 87,
                fen: "8/1p1nBp2/p3p1k1/P5p1/4P2r/1R3PKP/1Pr5/3R4 b - - 2 44",
                id: "8gVA/PwJ",
                uci: "d6e7",
                san: "Be7",
                eval: {
                    cp: 32,
                    depth: 30,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 88,
                fen: "8/1p2Bp2/p3p1k1/P3n1p1/4P2r/1R3PKP/1Pr5/3R4 w - - 3 45",
                id: "ZJCfqpcy",
                uci: "d7e5",
                san: "Ne5",
                eval: {
                    cp: 30,
                    depth: 31,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 89,
                fen: "3R4/1p2Bp2/p3p1k1/P3n1p1/4P2r/1R3PKP/1Pr5/8 b - - 4 45",
                id: "5RmIlF97",
                uci: "d1d8",
                san: "Rd8",
                eval: {
                    cp: 29,
                    depth: 30,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 90,
                fen: "3R4/1p2B3/p3ppk1/P3n1p1/4P2r/1R3PKP/1Pr5/8 w - - 0 46",
                id: "zLep3ZFe",
                uci: "f7f6",
                san: "f6",
                eval: {
                    cp: 35,
                    depth: 29,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 91,
                fen: "3R4/1R2B3/p3ppk1/P3n1p1/4P2r/5PKP/1Pr5/8 b - - 0 46",
                id: "CMYmIbcW",
                uci: "b3b7",
                san: "Rxb7",
                eval: {
                    cp: 76,
                    best: "Bd6",
                    variation: "Bd6 Nc6 Rg8+ Kh7 Rf8 Nxa5 Rb6 Rc6 Rxc6 Nxc6 Rxf6 Kg7 Rf8 Rh7",
                    depth: 25,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 92,
                fen: "3R4/1R2B3/p3ppk1/P3n1p1/4Pr2/5PKP/1Pr5/8 w - - 1 47",
                id: "ctUcMPzb",
                uci: "h4f4",
                san: "Rf4",
                eval: {
                    cp: 29,
                    depth: 33,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 93,
                fen: "3R4/4B3/p3ppk1/P3n1p1/4Pr2/1R3PKP/1Pr5/8 b - - 2 47",
                id: "hR1X+FYl",
                uci: "b7b3",
                san: "Rb3",
                eval: {
                    cp: 29,
                    depth: 35,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 94,
                fen: "3R4/4B3/p1n1ppk1/P5p1/4Pr2/1R3PKP/1Pr5/8 w - - 3 48",
                id: "XCn4rPd4",
                uci: "e5c6",
                san: "Nc6",
                eval: {
                    cp: 30,
                    depth: 34,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 95,
                fen: "2R5/4B3/p1n1ppk1/P5p1/4Pr2/1R3PKP/1Pr5/8 b - - 4 48",
                id: "p1ywZ8",
                uci: "d8c8",
                san: "Rc8",
                eval: {
                    cp: 30,
                    depth: 34,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 96,
                fen: "2R5/4B3/p3ppk1/n5p1/4Pr2/1R3PKP/1Pr5/8 w - - 0 49",
                id: "njuzZwlB",
                uci: "c6a5",
                san: "Nxa5",
                eval: {
                    cp: 30,
                    depth: 35,
                    time: 4029,
                    by: "offline"
                }
            },
            {
                ply: 97,
                fen: "2R5/4B3/p3ppk1/n5p1/4Pr2/2R2PKP/1Pr5/8 b - - 1 49",
                id: "FjPY3ege",
                uci: "b3c3",
                san: "Rbc3",
                eval: {
                    cp: 29,
                    depth: 33,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 98,
                fen: "2R5/4B3/p3ppk1/n5p1/4Pr2/2R2PKP/1r6/8 w - - 0 50",
                id: "LqXq3Ijw",
                uci: "c2b2",
                san: "Rxb2",
                eval: {
                    cp: 29,
                    depth: 33,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 99,
                fen: "2R5/8/p2Bppk1/n5p1/4Pr2/2R2PKP/1r6/8 b - - 1 50",
                id: "7Yi+idKZ",
                uci: "e7d6",
                san: "Bd6",
                eval: {
                    cp: 29,
                    depth: 31,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 100,
                fen: "2R5/8/p2B1pk1/n3p1p1/4Pr2/2R2PKP/1r6/8 w - - 0 51",
                id: "mUKtl101",
                uci: "e6e5",
                san: "e5",
                eval: {
                    cp: 29,
                    depth: 31,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 101,
                fen: "2R5/2R5/p2B1pk1/n3p1p1/4Pr2/5PKP/1r6/8 b - - 1 51",
                id: "D+6c/H0j",
                uci: "c3c7",
                san: "R3c7",
                eval: {
                    cp: 46,
                    depth: 30,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 102,
                fen: "2R5/1rR5/p2B1pk1/n3p1p1/4Pr2/5PKP/8/8 w - - 2 52",
                id: "UIxKSSoZ",
                uci: "b2b7",
                san: "Rb7",
                eval: {
                    cp: 61,
                    depth: 31,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 103,
                fen: "2R5/1R6/p2B1pk1/n3p1p1/4Pr2/5PKP/8/8 b - - 0 52",
                id: "FOb3TYjW",
                uci: "c7b7",
                san: "Rxb7",
                eval: {
                    cp: 51,
                    depth: 30,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 104,
                fen: "2R5/1n6/p2B1pk1/4p1p1/4Pr2/5PKP/8/8 w - - 0 53",
                id: "FMUzzJVD",
                uci: "a5b7",
                san: "Nxb7",
                eval: {
                    cp: 63,
                    depth: 34,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 105,
                fen: "2R5/1n2B3/p4pk1/4p1p1/4Pr2/5PKP/8/8 b - - 1 53",
                id: "Bqlo7bk5",
                uci: "d6e7",
                san: "Be7",
                eval: {
                    cp: 29,
                    depth: 31,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 106,
                fen: "2R5/4B3/p4pk1/n3p1p1/4Pr2/5PKP/8/8 w - - 2 54",
                id: "uIkFUP6w",
                uci: "b7a5",
                san: "Na5",
                eval: {
                    cp: 29,
                    depth: 33,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 107,
                fen: "8/4B3/p4pk1/n3p1p1/4Pr2/2R2PKP/8/8 b - - 3 54",
                id: "imCh3LiW",
                uci: "c8c3",
                san: "Rc3",
                eval: {
                    cp: 29,
                    depth: 33,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 108,
                fen: "8/4B3/p4p2/n3p1pk/4Pr2/2R2PKP/8/8 w - - 4 55",
                id: "Gg1fIKF1",
                uci: "g6h5",
                san: "Kh5",
                eval: {
                    cp: 29,
                    depth: 32,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 109,
                fen: "8/4B3/p4p2/n3p1pk/4Pr2/2R2P1P/6K1/8 b - - 5 55",
                id: "dHwAasP6",
                uci: "g3g2",
                san: "Kg2",
                eval: {
                    cp: 29,
                    depth: 30,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 110,
                fen: "8/4B3/p7/n3pppk/4Pr2/2R2P1P/6K1/8 w - - 0 56",
                id: "S1E0awI2",
                uci: "f6f5",
                san: "f5",
                eval: {
                    cp: 29,
                    depth: 32,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 111,
                fen: "8/8/p7/n3pppk/1B2Pr2/2R2P1P/6K1/8 b - - 1 56",
                id: "qbMWhTsG",
                uci: "e7b4",
                san: "Bb4",
                eval: {
                    cp: 30,
                    depth: 35,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 112,
                fen: "8/1n6/p7/4pppk/1B2Pr2/2R2P1P/6K1/8 w - - 2 57",
                id: "XXenauF",
                uci: "a5b7",
                san: "Nb7",
                eval: {
                    cp: 30,
                    depth: 34,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 113,
                fen: "8/1nR5/p7/4pppk/1B2Pr2/5P1P/6K1/8 b - - 3 57",
                id: "W/INknXS",
                uci: "c3c7",
                san: "Rc7",
                eval: {
                    cp: 30,
                    depth: 34,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 114,
                fen: "3n4/2R5/p7/4pppk/1B2Pr2/5P1P/6K1/8 w - - 4 58",
                id: "j7cQDVaA",
                uci: "b7d8",
                san: "Nd8",
                eval: {
                    cp: 30,
                    depth: 32,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 115,
                fen: "3n4/2R5/p7/4pppk/4Pr2/5P1P/3B2K1/8 b - - 5 58",
                id: "pxYPKsV2",
                uci: "b4d2",
                san: "Bd2",
                eval: {
                    cp: 30,
                    depth: 31,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 116,
                fen: "8/2R5/p3n3/4pppk/4Pr2/5P1P/3B2K1/8 w - - 6 59",
                id: "hY1crNRK",
                uci: "d8e6",
                san: "Ne6",
                eval: {
                    cp: 30,
                    best: "fxe4",
                    variation: "fxe4 Bxf4 exf3+ Kxf3 exf4 Re7 Nc6 Rh7+ Kg6 Rc7 Ne5+ Ke4 Nf7 Rc6+",
                    depth: 29,
                    time: 4002,
                    by: "offline"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was fxe4"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 117,
                fen: "8/4R3/p3n3/4pppk/4Pr2/5P1P/3B2K1/8 b - - 7 59",
                id: "oKxeOzEc",
                uci: "c7e7",
                san: "Re7",
                eval: {
                    cp: 94,
                    depth: 36,
                    time: 4003,
                    by: "offline"
                }
            },
            {
                ply: 118,
                fen: "8/4R3/p3n3/4p1pk/4pr2/5P1P/3B2K1/8 w - - 0 60",
                id: "cXADW1qP",
                uci: "f5e4",
                san: "fxe4",
                eval: {
                    cp: 92,
                    depth: 40,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 119,
                fen: "8/8/p3R3/4p1pk/4pr2/5P1P/3B2K1/8 b - - 0 60",
                id: "FCLPm1Dx",
                uci: "e7e6",
                san: "Rxe6",
                eval: {
                    cp: 84,
                    depth: 41,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 120,
                fen: "8/8/p3R3/4p1pk/5r2/5p1P/3B2K1/8 w - - 0 61",
                id: "bcsqPs0X",
                uci: "e4f3",
                san: "exf3+",
                eval: {
                    cp: 84,
                    depth: 41,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 121,
                fen: "8/8/p3R3/4p1pk/5r2/5p1P/3B1K2/8 b - - 1 61",
                id: "v4bufyl2",
                uci: "g2f2",
                san: "Kf2",
                eval: {
                    cp: 84,
                    depth: 39,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 122,
                fen: "8/8/p3R3/4p1pk/7r/5p1P/3B1K2/8 w - - 2 62",
                id: "MsnMTHlz",
                uci: "f4h4",
                san: "Rh4",
                eval: {
                    cp: 84,
                    depth: 37,
                    time: 4002,
                    by: "offline"
                }
            },
            {
                ply: 123,
                fen: "8/8/p7/4R1pk/7r/5p1P/3B1K2/8 b - - 0 62",
                id: "/cMXTf/4",
                uci: "e6e5",
                san: "Rxe5",
                eval: {
                    cp: 84,
                    depth: 35,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 124,
                fen: "8/8/p7/4R1pk/8/5p1r/3B1K2/8 w - - 0 63",
                id: "t2gKIpVf",
                uci: "h4h3",
                san: "Rxh3",
                eval: {
                    cp: 84,
                    depth: 36,
                    time: 4001,
                    by: "offline"
                }
            },
            {
                ply: 125,
                fen: "8/8/p7/6Rk/8/5p1r/3B1K2/8 b - - 0 63",
                id: "aOX7Uqtv",
                uci: "e5g5",
                san: "Rxg5+",
                eval: {
                    cp: 91,
                    depth: 30,
                    time: 4002,
                    by: "offline"
                }
            }
        ],
        finalFen: "8/8/p7/6Rk/8/5p1r/3B1K2/8 b - - 0 64",
        pgn: "[Event \"'Личный чемпионат сайта по адвансу - 2018', финал\"]\n[Site \"https://www.chess-online.com/7782247\"]\n[Date \"2020.02.10\"]\n[Round \"?\"]\n[White \"AHDPEI\"]\n[Black \"Sheldon\"]\n[Result \"1/2-1/2\"]\n[WhiteUSCF \"1653\"]\n[BlackUSCF \"1598\"]\n[ECO \"A05\"]\n[EventDate \"2019.04.02\"]\n[Termination \"normal\"]\n\n1. Nf3 Nf6 2. g3 d5 3. Bg2 c5 4. O-O a6 5. c4 dxc4 6. Ne5 Ra7 7. a4 Qd4 8. Nf3\nQd8 9. Na3 Be6 10. Ne5 Qd4 11. Nf3 Qd8 12. a5 Bd5 13. Qa4+ Bc6 14. Qxc4 e6 15.\nd4 Nbd7 16. Ne5 Bxg2 17. Kxg2 cxd4 18. Bf4 Ra8 19. Rfd1 Bc5 20. Nc2 O-O 21. Nxd7\nQxd7 22. Qxc5 Rfc8 23. Qxd4 Qc6+ 24. f3 Qxc2 25. Rd2 Qc4 26. Qxc4 Rxc4 27. e4\nRac8 28. Be5 Kf8 29. Rad1 Ke8 30. Bc3 R4c5 31. Kf2 Rb5 32. Ke3 Ke7 33. Rd4 g6\n34. g4 h5 35. gxh5 Rxh5 36. Rb4 Rc7 37. Rb3 Rh3 38. Kf4 Nd7 39. Bb4+ Kf6 40. Bd6\ng5+ 41. Kg4 Rh4+ 42. Kg3 Rc2 43. h3 Kg6 44. Be7 Ne5 45. Rd8 f6 46. Rxb7 Rf4 47.\nRb3 Nc6 48. Rc8 Nxa5 49. Rbc3 Rxb2 50. Bd6 e5 51. R3c7 Rb7 52. Rxb7 Nxb7 53. Be7\nNa5 54. Rc3 Kh5 55. Kg2 f5 56. Bb4 Nb7 57. Rc7 Nd8 58. Bd2 Ne6 59. Re7 fxe4 60.\nRxe6 exf3+ 61. Kf2 Rh4 62. Rxe5 Rxh3 63. Rxg5+ 1/2-1/2\n"
    }
};

var props2: GameProps = {
    board: {
        size: 4,
        piece: "alpha",
        square: "cedar"
    },
    game: {
        game: {
            id: 7827390,
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
            initialFen: "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/P4N2/1P2PPPP/RNBQKB1R b KQkq - 0 5",
            fen: "r2n2k1/p5p1/1p2pp1r/4Nq1p/1PR2P2/P3PQ2/6PP/3R2K1 b - - 3 27",
            player: "black",
            turns: 42,
            startedAtTurn: 9,
            status: {
                name: "resign",
                subtype: 2,
                result: 1,
                result_name: "соперник сдался"
            },
            event: "Шахматные звёзды. Котов vs Шахматные звёзды. Морфи",
            tournamentId: 25259,
            createdAt: 1600671365728,
            createdBy: 4,
            private: false,
            advance: false,
            winner: "white",
            lastMove: "e2f3",
            moveCentis: [
                0,
                1004810,
                40897491,
                35134103,
                45435386,
                85751,
                198062,
                39157036,
                1594438,
                15221382,
                35079799,
                35532669,
                4941816,
                6027038,
                24952134,
                4146568,
                48847349,
                9354859,
                20227181,
                6747857,
                6202262,
                45496398,
                45962014,
                43149386,
                44048174,
                32703630,
                3184423,
                22906398,
                23771158,
                37687675,
                2744473,
                4533730,
                21883796,
                3646669,
                118563,
                125773,
                19011496,
                35381866,
                5824473,
                5397322,
                34380950,
                478834,
                226983
            ],
            opening: {
                code: "A00a",
                name: "Start position"
            }
        },
        tournament: {
            id: 25259,
            name: "Шахматные звёзды. Котов vs Шахматные звёзды. Морфи",
            running: false
        },
        correspondence: {
            limit: "24 дня/партия б/о",
            can_pause: false,
            parts: [
                {
                    per: "game",
                    initial: 1036800000,
                    increment: 0,
                    min: 0
                }
            ],
            white: 0,
            black: 0,
            totalTime: 862108000,
            lastMoveAt: 1601533473045,
            serverNow: 1609106735914
        },
        player: {
            color: "white",
            name: "ГреМ",
            user: {
                id: 6121,
                name: "ГреМ",
                display: "Грешных Михаил",
                online: "12h",
                perfs: {
                    main: {
                        games: 570,
                        rating: 1923,
                        avg: 1922
                    }
                },
                language: "ru-RU",
                profile: {
                    country: "RU"
                },
                patron: "bronze",
                status: "bronze",
                title: ""
            },
            rating: 1952,
            ratingDiff: 3.8
        },
        opponent: {
            color: "black",
            name: "GolovkoN",
            user: {
                id: 324955,
                name: "GolovkoN",
                display: "GolovkoN",
                online: "12h",
                perfs: {
                    main: {
                        games: 582,
                        rating: 1775,
                        avg: 1727
                    }
                },
                language: "ru-RU",
                patron: "base",
                status: "base",
                title: ""
            },
            rating: 1700,
            ratingDiff: -3.8
        },
        orientation: "white",
        analysis: {
            state: "ready",
            white: {
                blunder: 0,
                inaccuracy: 0,
                mistake: 0,
                acpl: 15
            },
            black: {
                blunder: 0,
                inaccuracy: 6,
                mistake: 4,
                acpl: 58
            }
        },
        treeParts: [
            {
                ply: 9,
                fen: "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/P4N2/1P2PPPP/RNBQKB1R b KQkq -",
                eval: {
                    cp: 14
                }
            },
            {
                ply: 10,
                fen: "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/P4N2/1P2PPPP/RNBQKB1R w KQkq - 1 6",
                id: "xdmtiwWS",
                uci: "c8b7",
                san: "Bb7",
                eval: {
                    cp: 14
                }
            },
            {
                ply: 11,
                fen: "rn1qkb1r/pbpp1ppp/1p2pn2/8/2PP4/P1N2N2/1P2PPPP/R1BQKB1R b KQkq - 2 6",
                id: "6dXReObH",
                uci: "b1c3",
                san: "Nc3",
                eval: {
                    cp: 21,
                    best: "Bf4",
                    variation: "Bf4 Ne4 Nbd2 Nxd2 Qxd2 d6 Qc2 Nd7 Rd1 h6 e4 g5 Be3 c5"
                }
            },
            {
                ply: 12,
                fen: "rn1qkb1r/pbp2ppp/1p2pn2/3p4/2PP4/P1N2N2/1P2PPPP/R1BQKB1R w KQkq - 0 7",
                id: "lgge+NjM",
                uci: "d7d5",
                san: "d5",
                eval: {
                    cp: 12
                }
            },
            {
                ply: 13,
                fen: "rn1qkb1r/pbp2ppp/1p2pn2/3p2B1/2PP4/P1N2N2/1P2PPPP/R2QKB1R b KQkq - 1 7",
                id: "QTA5XPo+",
                uci: "c1g5",
                san: "Bg5",
                eval: {
                    cp: 10
                }
            },
            {
                ply: 14,
                fen: "rn1qk2r/pbp1bppp/1p2pn2/3p2B1/2PP4/P1N2N2/1P2PPPP/R2QKB1R w KQkq - 2 8",
                id: "A2FsxU1d",
                uci: "f8e7",
                san: "Be7",
                eval: {
                    cp: 10
                }
            },
            {
                ply: 15,
                fen: "rn1qk2r/pbp1bppp/1p2pn2/3p2B1/2PP4/P1N1PN2/1P3PPP/R2QKB1R b KQkq - 0 8",
                id: "cIKm9bhY",
                uci: "e2e3",
                san: "e3",
                eval: {
                    cp: 12,
                    best: "cxd5",
                    variation: "cxd5 Nxd5 Bxe7 Qxe7 Nxd5 Bxd5 Qa4+ c6 Qc2 f5 e3 O-O Bc4 Be4"
                }
            },
            {
                ply: 16,
                fen: "r2qk2r/pbpnbppp/1p2pn2/3p2B1/2PP4/P1N1PN2/1P3PPP/R2QKB1R w KQkq - 1 9",
                id: "DvngvKWp",
                uci: "b8d7",
                san: "Nbd7",
                eval: {
                    cp: -1,
                    best: "O-O",
                    variation: "O-O cxd5 Nxd5 Bxe7 Qxe7 Nxd5 Bxd5 Rc1 c5 Bc4 Bb7 dxc5 bxc5 O-O"
                }
            },
            {
                ply: 17,
                fen: "r2qk2r/pbpnbppp/1p2pn2/3p2B1/2PP4/P1N1PN2/1P3PPP/2RQKB1R b Kkq - 2 9",
                id: "okh22iqL",
                uci: "a1c1",
                san: "Rc1",
                eval: {
                    cp: 22,
                    best: "Qc2",
                    variation: "Qc2 O-O"
                }
            },
            {
                ply: 18,
                fen: "r2qk2r/pb1nbppp/1p2pn2/2pp2B1/2PP4/P1N1PN2/1P3PPP/2RQKB1R w Kkq - 0 10",
                id: "K/LkJSQg",
                uci: "c7c5",
                san: "c5",
                eval: {
                    cp: 13
                }
            },
            {
                ply: 19,
                fen: "r2qk2r/pb1nbppp/1p2pn2/2pP2B1/3P4/P1N1PN2/1P3PPP/2RQKB1R b Kkq - 0 10",
                id: "X5EmbrcF",
                uci: "c4d5",
                san: "cxd5",
                eval: {
                    cp: 9
                }
            },
            {
                ply: 20,
                fen: "r2qk2r/pb1nbppp/1p2p3/2pn2B1/3P4/P1N1PN2/1P3PPP/2RQKB1R w Kkq - 0 11",
                id: "wgc4hhka",
                uci: "f6d5",
                san: "Nxd5",
                eval: {
                    cp: 16
                }
            },
            {
                ply: 21,
                fen: "r2qk2r/pb1nBppp/1p2p3/2pn4/3P4/P1N1PN2/1P3PPP/2RQKB1R b Kkq - 0 11",
                id: "rvIjjVpw",
                uci: "g5e7",
                san: "Bxe7",
                eval: {
                    cp: 17
                }
            },
            {
                ply: 22,
                fen: "r3k2r/pb1nqppp/1p2p3/2pn4/3P4/P1N1PN2/1P3PPP/2RQKB1R w Kkq - 0 12",
                id: "oQw/Frpb",
                uci: "d8e7",
                san: "Qxe7",
                eval: {
                    cp: 17
                }
            },
            {
                ply: 23,
                fen: "r3k2r/pb1nqppp/1p2p3/2Pn4/8/P1N1PN2/1P3PPP/2RQKB1R b Kkq - 0 12",
                id: "oQfAEfxi",
                uci: "d4c5",
                san: "dxc5",
                eval: {
                    cp: 36
                }
            },
            {
                ply: 24,
                fen: "r3k2r/pb2qppp/1p2p3/2nn4/8/P1N1PN2/1P3PPP/2RQKB1R w Kkq - 0 13",
                id: "IqNw6lOY",
                uci: "d7c5",
                san: "Nxc5",
                eval: {
                    cp: 29,
                    best: "bxc5",
                    variation: "bxc5 Bb5 Nb6 O-O O-O Qe2 Rfd8 Rfd1 a6 Bd3 c4 Bc2 Rac8 Rd4"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was bxc5"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 25,
                fen: "r3k2r/pb2qppp/1p2p3/1Bnn4/8/P1N1PN2/1P3PPP/2RQK2R b Kkq - 1 13",
                id: "MxK4bSU0",
                uci: "f1b5",
                san: "Bb5+",
                eval: {
                    cp: 111
                }
            },
            {
                ply: 26,
                fen: "r4k1r/pb2qppp/1p2p3/1Bnn4/8/P1N1PN2/1P3PPP/2RQK2R w K - 2 14",
                id: "+Zls156",
                uci: "e8f8",
                san: "Kf8",
                eval: {
                    cp: 92
                }
            },
            {
                ply: 27,
                fen: "r4k1r/pb2qppp/1p2p3/1BnN4/8/P3PN2/1P3PPP/2RQK2R b K - 0 14",
                id: "kfMGT6Ov",
                uci: "c3d5",
                san: "Nxd5",
                eval: {
                    cp: 100
                }
            },
            {
                ply: 28,
                fen: "r4k1r/p3qppp/1p2p3/1Bnb4/8/P3PN2/1P3PPP/2RQK2R w K - 0 15",
                id: "tP0MEx/d",
                uci: "b7d5",
                san: "Bxd5",
                eval: {
                    cp: 91
                }
            },
            {
                ply: 29,
                fen: "r4k1r/p3qppp/1p2p3/1Bnb4/1P6/P3PN2/5PPP/2RQK2R b K - 0 15",
                id: "WXSqG23d",
                uci: "b2b4",
                san: "b4",
                eval: {
                    cp: 100
                }
            },
            {
                ply: 30,
                fen: "r4k1r/pn2qppp/1p2p3/1B1b4/1P6/P3PN2/5PPP/2RQK2R w K - 1 16",
                id: "zfWSRsTo",
                uci: "c5b7",
                san: "Nb7",
                eval: {
                    cp: 81
                }
            },
            {
                ply: 31,
                fen: "r4k1r/pn2qppp/1pB1p3/3b4/1P6/P3PN2/5PPP/2RQK2R b K - 2 16",
                id: "cZFHg6On",
                uci: "b5c6",
                san: "Bc6",
                eval: {
                    cp: 95
                }
            },
            {
                ply: 32,
                fen: "r4k1r/pn2qppp/1pb1p3/8/1P6/P3PN2/5PPP/2RQK2R w K - 0 17",
                id: "y1WZsi7D",
                uci: "d5c6",
                san: "Bxc6",
                eval: {
                    cp: 116,
                    best: "Bxf3",
                    variation: "Bxf3"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was Bxf3"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 33,
                fen: "r4k1r/pn2qppp/1pR1p3/8/1P6/P3PN2/5PPP/3QK2R b K - 0 17",
                id: "5Hxl1GCI",
                uci: "c1c6",
                san: "Rxc6",
                eval: {
                    cp: 213
                }
            },
            {
                ply: 34,
                fen: "r2n1k1r/p3qppp/1pR1p3/8/1P6/P3PN2/5PPP/3QK2R w K - 1 18",
                id: "5EyDf3RH",
                uci: "b7d8",
                san: "Nd8",
                eval: {
                    cp: 186,
                    best: "Rd8",
                    variation: "Rd8"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was Rd8"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 35,
                fen: "r2n1k1r/p3qppp/1p2p3/8/1P6/P1R1PN2/5PPP/3QK2R b K - 2 18",
                id: "CQ0Y/SqY",
                uci: "c6c3",
                san: "Rc3",
                eval: {
                    cp: 246
                }
            },
            {
                ply: 36,
                fen: "r2n1k1r/p3qpp1/1p2p3/7p/1P6/P1R1PN2/5PPP/3QK2R w K - 0 19",
                id: "9U4KTx4",
                uci: "h7h5",
                san: "h5",
                eval: {
                    cp: 217,
                    best: "g6",
                    variation: "g6 h4"
                },
                comments: [
                    {
                        name: "Mistake",
                        comment: "Mistake. Best mowe was g6"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 37,
                fen: "r2n1k1r/p3qpp1/1p2p3/4N2p/1P6/P1R1P3/5PPP/3QK2R b K - 1 19",
                id: "oitUWYLX",
                uci: "f3e5",
                san: "Ne5",
                eval: {
                    cp: 333
                }
            },
            {
                ply: 38,
                fen: "r2n1k2/p3qpp1/1p2p2r/4N2p/1P6/P1R1P3/5PPP/3QK2R w K - 2 20",
                id: "oRxEdZXA",
                uci: "h8h6",
                san: "Rh6",
                eval: {
                    cp: 328,
                    best: "Kg8",
                    variation: "Kg8 O-O a5 b5 Nb7 Qf3 Rf8 Qc6 h4 Qxb6 h3 g3 Qd6 Nc6"
                },
                comments: [
                    {
                        name: "Mistake",
                        comment: "Mistake. Best mowe was Kg8"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 39,
                fen: "r2n1k2/p3qpp1/1p2p2r/4N2p/1P6/P1R1P3/2Q2PPP/4K2R b K - 3 20",
                id: "aZaAfW6R",
                uci: "d1c2",
                san: "Qc2",
                eval: {
                    cp: 463
                }
            },
            {
                ply: 40,
                fen: "r2n2k1/p3qpp1/1p2p2r/4N2p/1P6/P1R1P3/2Q2PPP/4K2R w K - 4 21",
                id: "BnsuthZ4",
                uci: "f8g8",
                san: "Kg8",
                eval: {
                    cp: 471,
                    best: "a5",
                    variation: "a5"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was a5"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 41,
                fen: "r2n2k1/p3qpp1/1p2p2r/4N2p/1P6/P1R1P3/2Q2PPP/5RK1 b - - 5 21",
                id: "ZULubDW/",
                uci: "e1g1",
                san: "O-O",
                eval: {
                    cp: 561
                }
            },
            {
                ply: 42,
                fen: "r2n2k1/p4pp1/1p2pq1r/4N2p/1P6/P1R1P3/2Q2PPP/5RK1 w - - 6 22",
                id: "EjAYyMKK",
                uci: "e7f6",
                san: "Qf6",
                eval: {
                    cp: 519,
                    best: "Qd6",
                    variation: "Qd6 f4"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was Qd6"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 43,
                fen: "r2n2k1/p4pp1/1p2pq1r/4N2p/1P3P2/P1R1P3/2Q3PP/5RK1 b - - 0 22",
                id: "AMlQWfz1",
                uci: "f2f4",
                san: "f4",
                eval: {
                    cp: 588
                }
            },
            {
                ply: 44,
                fen: "r2n2k1/p4pp1/1p2p2r/4Nq1p/1P3P2/P1R1P3/2Q3PP/5RK1 w - - 1 23",
                id: "lKljGJMF",
                uci: "f6f5",
                san: "Qf5",
                eval: {
                    cp: 592,
                    best: "h4",
                    variation: "h4 Ng4 Qg6 Nxh6+ gxh6 e4 Qf6 Rd1 Qxf4 Rc8 Rxc8 Qxc8 Kg7 Qxd8"
                }
            },
            {
                ply: 45,
                fen: "r2n2k1/p4pp1/1p2p2r/4Nq1p/1P3P2/P1R1P3/4Q1PP/5RK1 b - - 2 23",
                id: "vviymBR6",
                uci: "c2e2",
                san: "Qe2",
                eval: {
                    cp: 626
                }
            },
            {
                ply: 46,
                fen: "r2n2k1/p4pp1/1p2p2r/4N2p/1P2qP2/P1R1P3/4Q1PP/5RK1 w - - 3 24",
                id: "+fWFSImI",
                uci: "f5e4",
                san: "Qe4",
                eval: {
                    cp: 537,
                    best: "Rf6",
                    variation: "Rf6 Rd1"
                },
                comments: [
                    {
                        name: "Mistake",
                        comment: "Mistake. Best mowe was Rf6"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 47,
                fen: "r2n2k1/p4pp1/1p2p2r/4N2p/1P2qP2/P1R1P3/4Q1PP/3R2K1 b - - 4 24",
                id: "ksq0r0JU",
                uci: "f1d1",
                san: "Rd1",
                eval: {
                    cp: 681
                }
            },
            {
                ply: 48,
                fen: "r2n2k1/p5p1/1p2pp1r/4N2p/1P2qP2/P1R1P3/4Q1PP/3R2K1 w - - 0 25",
                id: "NSFh4xgG",
                uci: "f7f6",
                san: "f6",
                eval: {
                    cp: 656,
                    best: "b5",
                    variation: "b5 Qd3"
                },
                comments: [
                    {
                        name: "Mistake",
                        comment: "Mistake. Best mowe was b5"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 49,
                fen: "r2n2k1/p5p1/1p2pp1r/4N2p/1PR1qP2/P3P3/4Q1PP/3R2K1 b - - 1 25",
                id: "LMPHpT13",
                uci: "c3c4",
                san: "Rc4",
                eval: {
                    cp: 878
                }
            },
            {
                ply: 50,
                fen: "r2n2k1/p5p1/1p2pp1r/4Nq1p/1PR2P2/P3P3/4Q1PP/3R2K1 w - - 2 26",
                id: "YgkqmQ76",
                uci: "e4f5",
                san: "Qf5",
                eval: {
                    cp: 860,
                    best: "Qb7",
                    variation: "Qb7 Rd7 fxe5 Rxb7 Nxb7 Qf3 Rb8 fxe5 Kh7 Rc7 Nc5 Rxa7 Rd8 bxc5"
                },
                comments: [
                    {
                        name: "Inaccuracy",
                        comment: "Mistake. Best mowe was Qb7"
                    }
                ],
                glyphs: [
                    {
                        name: "Mistake",
                        symbol: "?"
                    }
                ]
            },
            {
                ply: 51,
                fen: "r2n2k1/p5p1/1p2pp1r/4Nq1p/1PR2P2/P3PQ2/6PP/3R2K1 b - - 3 26",
                id: "GNBZoTbW",
                uci: "e2f3",
                san: "Qf3",
                eval: {
                    cp: 942
                }
            }
        ],
        finalFen: "r2n2k1/p5p1/1p2pp1r/4Nq1p/1PR2P2/P3PQ2/6PP/3R2K1 b - - 3 27",
        pgn: "[Event \"Шахматные звёзды. Котов vs Шахматные звёзды. Морфи\"]\n[Site \"https://www.chess-online.com/7827390\"]\n[Date \"2020.10.01\"]\n[Round \"?\"]\n[White \"ГреМ\"]\n[Black \"GolovkoN\"]\n[Result \"1-0\"]\n[WhiteRating \"1952\"]\n[BlackRating \"1700\"]\n[ECO \"A00a\"]\n[EventDate \"2020.09.21\"]\n[Termination \"normal\"]\n[FEN \"rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/P4N2/1P2PPPP/RNBQKB1R b KQkq - 0 6\"]\n\n5... Bb7 6. Nc3 d5 7. Bg5 Be7 8. e3 Nbd7 9. Rc1 c5 10. cxd5 Nxd5 11. Bxe7 Qxe7\n12. dxc5 Nxc5 13. Bb5+ Kf8 14. Nxd5 Bxd5 15. b4 Nb7 16. Bc6 Bxc6 17. Rxc6 Nd8\n18. Rc3 h5 19. Ne5 Rh6 20. Qc2 Kg8 21. O-O Qf6 22. f4 Qf5 23. Qe2 Qe4 24. Rd1 f6\n25. Rc4 Qf5 26. Qf3 1-0\n"
    }
};



export const AnalyseGameTest = (element: string) => analyseGame(props, document.getElementById(element)!);