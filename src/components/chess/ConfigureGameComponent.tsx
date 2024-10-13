import React, {useContext, useRef} from 'react';
import {useTranslation} from "react-i18next";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {BoardSize} from 'onix-board-assets';

import { Api } from 'chessground/api';
import { Config as CgConfig } from 'chessground/config';
import * as cg from 'chessground/types';

import {GameProps} from '../../chess/settings/GameProps';

import SizeSelector from './controls/SizeSelector';
import PieceSelector from './controls/PieceSelector';
import SquareSelector from './controls/SquareSelector';
import { parse as squareParse } from '../../chess/Square';
import DumbGame from "./DumbGame";
import IOSSwitch from "../../ui/IOSSwitch";

import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";

const ConfigureGameComponent: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;
    const { t } = useTranslation(['game', 'chess']);
    const {
        size,
        piece,
        square,
        orientation,
        coordinates,
        learnMode,
        toggleConfirm,
        toggleLearn,
        toggleCoords,
        toggleMoves,
        setSize,
        setSquare,
        setPiece
    } = useContext(BoardContext);

    const {
        fen,
        makeProvisional,
        getLegalMovesMap,
    } = useContext(GameContext);

    const cgRef = useRef<Api>();

    const onMove = (orig: cg.Key, dest: cg.Key) => {
        makeProvisional(squareParse(orig), squareParse(dest));
    };

    const generateConfig = (): CgConfig => {
        const dests = getLegalMovesMap();

        return {
            fen: fen,
            orientation: orientation,
            coordinates: coordinates,
            viewOnly: false,
            movable: {
                free: false,
                color: 'both',
                dests: dests,
                showDests: learnMode
            },
            highlight: {
                lastMove: true,
                check: true
            },
            events: {
                move: onMove
            },
        };
    };

    const onConfirmChange = () => {
        toggleConfirm();
    };

    const onLearnChange = () => {
        toggleLearn();
    };

    const onCoordsChange = () => {
        toggleCoords();
    };

    const onSizeChange = (size: BoardSize) => {
        setSize(size);
    };

    const onPieceChange = (piece: string) => {
        setPiece(piece);
    };

    const onSquareChange = (square: string) => {
        setSquare(square);
    };

    const onMoveTableChange = () => {
        toggleMoves();
    };

    const renderControls = () => {
        return (
            <Card className="ms-md-4 flex-md-grow-1" sx={{ flexBasis: "min-content"}}>
                <CardContent>
                    <form method="post">
                        { (boardCfg?.csrfTokenName && boardCfg?.csrfTokenValue) ? (<input type="hidden" name={boardCfg.csrfTokenName} value={boardCfg.csrfTokenValue} />) : "" }
                        { (boardCfg?.returnUrl) ? (<input type="hidden" name="returnUrl" value={boardCfg.returnUrl} />) : "" }
                        <h3>{t("board_and_pieces")}</h3>
                        <Box sx={{marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{t("board_size")}</InputLabel>
                                <SizeSelector
                                    fullWidth
                                    label={t("board_size")}
                                    name="size"
                                    value={size}
                                    onChangeSize={onSizeChange} />
                            </FormControl>
                        </Box>
                        <Box sx={{marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{t("pieces", { ns: 'chess'})}</InputLabel>
                                <PieceSelector
                                    fullWidth
                                    label={t("pieces", { ns: 'chess'})}
                                    name="piece"
                                    value={piece}
                                    onChangePiece={onPieceChange} />
                            </FormControl>
                        </Box>
                        <Box sx={{marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{t("squares", { ns: 'chess'})}</InputLabel>
                                <SquareSelector
                                    fullWidth
                                    label={t("squares", { ns: 'chess'})}
                                    name="square" value={square}
                                    onChangeSquare={onSquareChange} />
                            </FormControl>
                        </Box>
                        <Box sx={{marginBottom: 2}}>
                            <FormControlLabel
                                control={
                                    <IOSSwitch
                                        id="coords"
                                        name="coords"
                                        sx={{m: 1}}
                                        color="primary"
                                        value="1"
                                        defaultChecked={boardCfg?.coordinates}
                                        onChange={onCoordsChange}
                                    />
                                }
                                label={t("display_coord")}
                            />
                        </Box>

                        <h3>{t("other_settings")}</h3>
                        <Grid container spacing={2}>
                            <Grid size={{md: 6}}>
                                <FormControlLabel
                                    control={
                                        <IOSSwitch
                                            id="hints"
                                            sx={{m: 1}}
                                            name="hints"
                                            color="primary"
                                            value="1"
                                            defaultChecked={boardCfg?.learnMode}
                                            onChange={onLearnChange}
                                        />
                                    }
                                    label={t("display_move_hints")}
                                />
                            </Grid>
                            <Grid size={{md: 6}}>
                                <FormControlLabel
                                    control={
                                        <IOSSwitch
                                            id="confirm"
                                            name="confirm"
                                            sx={{m: 1}}
                                            color="primary"
                                            value="1"
                                            defaultChecked={boardCfg?.confirmMove}
                                            onChange={onConfirmChange}
                                        />
                                    }
                                    label={t("confirm_move_form")}
                                />
                            </Grid>
                            <Grid size={{md: 12}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography>{t("moves_mode")}:</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>{t("moves_mode_list")}</Typography>
                                        <IOSSwitch
                                            id="movetable"
                                            name="movetable"
                                            sx={{m: 1}}
                                            color="primary"
                                            value="1"
                                            defaultChecked={boardCfg?.moveTable}
                                            onChange={onMoveTableChange}
                                        />
                                        <Typography>{t("moves_mode_table")}</Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <CardActions sx={{justifyContent: "flex-end"}}>
                    <Button variant="contained" color="primary" type="submit">{t("save", { ns: 'core'})}</Button>
                </CardActions>
            </Card>
        );
    };


    return (
        <DumbGame
            cgRef={(api) => cgRef.current = api ?? undefined}
            onGenerateConfig={generateConfig}
            controlsLeft={renderControls()}
        />
    );
};

export default ConfigureGameComponent;