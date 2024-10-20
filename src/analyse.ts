import {renderPortal} from "./utils/renderUtils";
import { ComponentProps } from './utils/types';
import AnalyseGame from "./components/chess/AnalyseGame";

export const analyseGame = (container: HTMLElement, props: ComponentProps<typeof AnalyseGame>) =>
    renderPortal(container, AnalyseGame, props, true);