import {ChessInstance, Piece, ShortMove, Square} from 'chess.js';

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

export default class ChessBrain {
    private __chess: ChessInstance;
    private __nextMoveSelector: MoveSelector;

    public constructor(moveSelector: MoveSelector) {
        this.__chess = new Chess(startingPosition);
        this.__nextMoveSelector = moveSelector;
    }

    public getFen(): string {
        return this.__chess.fen();
    }

    public makeNextMove() {
        const nextMove = this.__nextMoveSelector.getNextMove(this.getFen());
        if (nextMove) {
            this.__makeMove(nextMove);
        }
    }

    private __makeMove(move: string) {
        this.__chess.move(move);
    }

    public isValidMove(move: Move): boolean {
        return this.__isValidMove(            
            {
                from: move.sourceSquare,
                to: move.targetSquare,
                promotion: "q"
            });
    }

    private __isValidMove(move: ShortMove): boolean {
        return !!this.__chess.move(move);
    }
}