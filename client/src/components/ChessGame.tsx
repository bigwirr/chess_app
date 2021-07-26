import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import ChessBrain, { Color } from '../chessbrain/ChessBrain';
import RandomMoveSelector from '../chessbrain/RandomMoveSelector';
import { GameStatus, GameStatusDisplay } from './GameStatus';

export const ChessGame: React.FC = () => {
    const [chess] = useState<ChessBrain>(new ChessBrain(new RandomMoveSelector()));
    const [fen, setFen] = useState(chess.getFen());
    const [canMove, setCanMove] = useState(true);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.live);
    const [winner, setWinner] = useState<Color | null>(null);

    const handleMove = (move: any) => {
        if (!canMove) { return; }
        if (chess.isValidMove(move)) {
            updateGameState(false);
            chess.makeNextMove();
            setTimeout(() => {
                updateGameState(true);
            },
            300);
        }
    }   

    const updateGameState = (canMove: boolean) => {
        setFen(chess.getFen())
        setGameStatus(chess.getStatus());
        setWinner(chess.getWinner());
        setCanMove(canMove);
    }

    return (
        <div>
            <Chessboard 
                position={fen}
                onDrop={(move) => handleMove(move)}
            />
            <GameStatusDisplay 
                winner={winner ?? undefined}
                gameStatus={gameStatus}
            />
        </div>
    );
}

