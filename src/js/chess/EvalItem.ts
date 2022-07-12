import i18next from 'i18next';
import sprintf from '../fn/string/Sprintf';
import { IEval } from './types/Interfaces';

export class EvalItem {

    /**
     * Position eval before move (centipawn)
     */
    public cp?: number;

    /**
     * Ceiled position eval before move (centipawn)
     */
    public ceil: number = 0;

    /**
     * Ceiled position eval before move (pawn)
     */
    public ceilPawn: number = 0;

    /**
     * Position eval after move
     */
    public advantage: number = 0;

    public mate?: number = undefined;
    
    public best?: string;

    public variation?: string;

    public depth?: number;

    public time?: number;

    public desc?: string;

    public constructor(data?: IEval) {
        if (data) {
            this.cp = data.cp;
            if (!this.cp && (this.cp !== 0)) {
                this.cp = undefined;
            }

            this.mate = data.mate;
            if (!this.mate && (this.mate !== 0)) {
                this.mate = undefined;
            }

            this.best = data.best;
            this.variation = data.variation;
            this.depth = data.depth;
            this.time = data.time;
        }
    }

    public normalize(prev: EvalItem) {
        if (this.cp === undefined) {
            if (this.mate !== undefined) {
                this.cp = Math.sign(this.mate) * 1000;
            } else {
                this.cp = prev.cp ?? 0;
            }
            
        }

        this.ceil = this.cp;
        if (this.ceil > 1000) {
            this.ceil = 1000;
        }

        if (this.ceil < -1000) {
            this.ceil = -1000;
        }
        

        this.ceilPawn = this.ceil / 100;
        this.advantage = this.ceilPawn;
    }

    public extend(next: EvalItem) {
        this.advantage = next.ceilPawn; 

        this.desc = "";

        if (this.mate !== undefined) {
            if (this.mate !== 0) {
                const fmt = i18next.t("mateIn", { ns: "chess"});
                this.desc = sprintf(fmt, this.mate);
            }
        } else {
            this.desc = (this.advantage > 0) ? "+" : "";
            this.desc += this.advantage;
        }
    }
}