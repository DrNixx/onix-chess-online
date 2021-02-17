import { ConfigureGame } from '../js/ui/game/configure/ConfigureGame';
import { BoardSettings } from '../js/chess/settings/BoardSettings';

var props: BoardSettings = {
    size: 4,
    piece: "alpha",
    square: "cedar",
    coordinates: true,
};

export const ConfigureGameTest = (element: string) => ConfigureGame(props, document.getElementById(element)!);