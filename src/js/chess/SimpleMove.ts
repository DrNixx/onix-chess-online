import { IGlyph, IJudgment } from './types/Interfaces';
import * as Colors from './types/Colors';
import * as Pieces from './types/Pieces';
import * as Squares from './types/Squares';
import { EvalItem } from './EvalItem'
import * as Color from './Color';
import * as Piece from './Piece';
import * as Square from './Square';

const ns = Square.NullSquare;
const np = Piece.None;

/**
 * Move data.
 */
export class SimpleMove {
    public pieceNum = 0;
    public movingPiece?: Pieces.Piece = np;
    public from?: Squares.Square = ns;
    public to?: Squares.Square = ns;
    public color?: Colors.BW = Color.None;
    public capturedNum = 0;
    public capturedPiece?: Pieces.Piece = np;
    public promote?: Pieces.PieceType = np;
    public capturedSquare?: Squares.Square = ns; // only different to "to" field if this capture is an en passant capture.
    public castleFlags = 0;
    public epSquare?: Squares.Square = ns;
    public oldHalfMoveClock = 0;

    public ply = 0;
    public san?: string;
    public time = 0;
    public comments?: string;
    public eval?: EvalItem;
    public judgments?: IJudgment[];
    public glyphs?: IGlyph[];
    
    public permanent = true;

    public toString(): string {
        return this.san || "";
    }
}