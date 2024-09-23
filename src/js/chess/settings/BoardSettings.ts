import { Config as CgConfig } from 'chessground/config';
import { BoardSize } from 'onix-board-assets';
import { Color } from 'chessground/types';
import {defaultOf} from "../../utils/propsUtils";

export interface BoardSettings extends CgConfig {
    is3d?: boolean,
    size: BoardSize,
    piece?: string,
    square?: string,
    orientation?: Color,
    coordinates?: boolean,
    learnMode?: boolean,
    confirmMove?: boolean,
    moveTable?: boolean,
    csrfTokenName?: string,
    csrfTokenValue?: string,
    configUrl?: string,
    returnUrl?: string,
}

type propsBoardWithDefault = 'is3d' | 'size' | 'piece' | 'square' | 'orientation' | 'coordinates' | 'learnMode' | 'confirmMove' | 'moveTable';
export const defaultSettings: defaultOf<BoardSettings, propsBoardWithDefault> = {
    is3d: false,
    size: BoardSize.Largest,
    piece: "alpha",
    square: "color-brown",
    orientation: "white",
    coordinates: true,
    learnMode: false,
    confirmMove: false,
    moveTable: false,
}
