import { Config as CgConfig } from 'chessground/config';
import { BoardSize } from 'onix-board-assets';
import { Color } from 'chessground/types';

export interface BoardSettings extends CgConfig {
    is3d?: boolean,
    size: BoardSize,
    piece?: string,
    square?: string,
    orientation?: Color,
    coordinates?: boolean,
    csrfTokenName?: string,
    csrfTokenValue?: string,
    configUrl?: string,
    returnUrl?: string,
}

export const defaultSettings: BoardSettings = {
    is3d: false,
    size: BoardSize.Largest,
    piece: "alpha",
    square: "cedar",
    orientation: "white",
    coordinates: true
}