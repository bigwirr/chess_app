import {ChessInstance, Piece, ShortMove, Square} from 'chess.js';
import { GameStatus } from '../components/GameStatus';
import { PromoteToPiece } from '../components/PromotionSelector';

const startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const Chess = require("chess.js");

export interface MoveSelector {
    getNextMove(fen: string): string | null;
}

export interface Move {
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece,
}

export const BLACK = "b";
export const WHITE = "w";
export type Color = "b" | "w";


export default class ChessBrain {
    private __chess: ChessInstance;
    private __nextMoveSelector: MoveSelector;
    private __gameStatus: GameStatus;
    private __winner: Color | null;
    private __playerColor: Color;
    private __waitingOnFirstMove = false;

    public constructor(moveSelector: MoveSelector, playerColor: Color) {
        this.__chess = new Chess(startingPosition);
        this.__nextMoveSelector = moveSelector;
        this.__gameStatus = GameStatus.live;
        this.__winner = null;
        this.__playerColor = playerColor;
        this.__waitingOnFirstMove = playerColor == BLACK;
    }

    public waitingOnFirstMove(): boolean {
        return this.__waitingOnFirstMove;
    }
    public getFen(): string {
        return this.__chess.fen();
    }

    public getStatus(): GameStatus {
        return this.__gameStatus;
    }

    public getWinner(): Color | null {
        return this.__winner;
    }

    public makeNextMove() {
        if (this.__winner) { return; }
        this.__waitingOnFirstMove = false;
        const nextMove = this.__nextMoveSelector.getNextMove(this.getFen());
        if (nextMove) {
            this.__makeMove(nextMove);
        }
    }

    private __makeMove(move: string) {
        this.__chess.move(move);
        this.__updateGameState(this.__computerColor());
    }

    public isValidMove(move: Move, promotion?: PromoteToPiece): boolean {
        return this.__isValidMove(this.__moveToShortMove(move, promotion));
    }

    private __isValidMove(move: ShortMove): boolean {
        const isValid = !!this.__chess.move(move);
        this.__updateGameState(this.__playerColor);
        return isValid;
    }

    private __validateMoveButDontUpdateState(move: ShortMove): boolean
    {
        const tempChess: ChessInstance = new Chess(this.getFen());
        move.promotion = "q"; // won't be valid move without a promotion.
        return !!tempChess.move(move);
    }

    private __moveToShortMove(move: Move, promotion?: PromoteToPiece): ShortMove {
        return {
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: promotion,
        };
    }

    public isPromotion(move: Move): boolean {
        return this.___isPromotion(this.__moveToShortMove(move));
    }

    private ___isPromotion(move: ShortMove): boolean {
        const piece = this.__chess.get(move.from);
        if (!ChessBrain.__isPawn(piece)) {
            return false;
        }

        let isPromotion = false;
        if (piece?.color === BLACK) {
            isPromotion = move.to.charAt(1) === '1';
            return isPromotion && this.__validateMoveButDontUpdateState(move);
        }
        else if (piece?.color === WHITE) {
            isPromotion = move.to.charAt(1) === '8';
            return isPromotion && this.__validateMoveButDontUpdateState(move);
        }

        return false;
    }

    private static __isPawn(piece: Piece | null) {
        if (!piece) { return false; }
        return piece.type === "p";
    }

    private __updateGameState(toMove: Color) {
        if (this.__chess.in_checkmate()) {
            this.__winner = toMove;
            this.__gameStatus = GameStatus.checkmate;
            return;
        }

        if (this.__chess.in_stalemate()) {
            this.__gameStatus = GameStatus.stalemate;
            return;
        }

        if (this.__chess.in_draw() || this.__chess.in_threefold_repetition()) {
            this.__gameStatus = GameStatus.draw;
            return;
        }
    }

    private __computerColor(): Color{
        return this.__playerColor == WHITE ? BLACK : WHITE;
    } 

    public winByTimeout() {
        this.__winner = this.__playerColor;
        this.__gameStatus = GameStatus.timeout;
    }

    public loseByTimeout() {
        this.__winner = this.__computerColor();
        this.__gameStatus = GameStatus.timeout;
    }
}