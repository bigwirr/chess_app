import { MoveSelector } from "./ChessBrain";
import { Chess as ChessClass, ShortMove } from "chess.js";
const Chess: typeof ChessClass = require("chess.js");

export default class RandomMoveSelector implements MoveSelector {

    public RandomMoveSelector() {

    }

    async getNextMove(fen: string): Promise<ShortMove | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const chess = new Chess(fen);
                const moves = chess.moves({verbose: true});

                if (moves.length > 0) {
                    const randomMove = moves[Math.floor(Math.random() * (moves.length))];
                    resolve(randomMove);
                }
            }, 300);
        });
    }
}