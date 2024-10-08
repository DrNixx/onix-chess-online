import { configureGame } from '../src/ui/game/ConfigureGame';
import { BoardSettings } from '../src/chess/settings/BoardSettings';

var props: BoardSettings = {
    size: 4,
    piece: "alpha",
    square: "cedar",
    coordinates: true,
};

export const ConfigureGameTest = (element: string) => configureGame(props, document.getElementById(element)!);