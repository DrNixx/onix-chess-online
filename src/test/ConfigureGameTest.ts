import { configureGame } from '../js/ui/game/configure/ConfigureGame';
import { BoardSettings } from '../js/chess/settings/BoardSettings';

var props: BoardSettings = {
    size: 4,
    piece: "alpha",
    square: "cedar",
    coordinates: true,
};

export const ConfigureGameTest = (element: string) => configureGame(props, document.getElementById(element)!);