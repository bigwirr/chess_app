import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import ChessBrain, { BLACK, Color, WHITE } from '../chessbrain/ChessBrain';
import RandomMoveSelector from '../chessbrain/RandomMoveSelector';
import { GameStatus, GameStatusDisplay } from './GameStatus';

function randomColor(): Color {
    return Math.floor(Math.random() * (2)) == 0 ? WHITE : BLACK;
}

export const ChessGame: React.FC = () => {
    const [color] = useState<Color>(randomColor());
    const [chess] = useState<ChessBrain>(new ChessBrain(new RandomMoveSelector(), color));
    const [fen, setFen] = useState(chess.getFen());
    const [canMove, setCanMove] = useState(color == WHITE);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.live);
    const [winner, setWinner] = useState<Color | null>(null);

    const handleMove = (move: any) => {
        if (!canMove) { return; }
        if (chess.isValidMove(move)) {
            updateGameState(false);
            makeComputerMove();
        }
    }   

    const updateGameState = (canMove: boolean) => {
        setFen(chess.getFen())
        setGameStatus(chess.getStatus());
        setWinner(chess.getWinner());
        setCanMove(canMove);
    }

    const makeComputerMove = () => {
        chess.makeNextMove();
        setTimeout(() => {
            updateGameState(true);
        },
        300);
    }

    if (chess.waitingOnFirstMove()) {
        makeComputerMove();
    }

    return (
        <div>
            <Chessboard 
                position={fen}
                onDrop={(move) => handleMove(move)}
                orientation={color == WHITE ? "white" : "black"}
            />
            <GameStatusDisplay 
                winner={winner ?? undefined}
                gameStatus={gameStatus}
            />
        </div>
    );
}

