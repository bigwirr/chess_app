import { MoveSelector } from "./ChessBrain"
const Chess = require("chess.js");

export default class RandomMoveSelector implements MoveSelector{
    public RandomMoveSelector() {
    }

    getNextMove(fen: string): string | null {
        const chess = new Chess(fen);
        const moves = chess.moves();

        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * (moves.length))];
            return randomMove;
        }
        
        return null;
    }
}