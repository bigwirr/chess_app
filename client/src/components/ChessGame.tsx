import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import ChessBrain from '../chessbrain/ChessBrain';
import RandomMoveSelector from '../chessbrain/RandomMoveSelector';

export const ChessGame: React.FC = () => {
    const [chess] = useState<ChessBrain>(new ChessBrain(new RandomMoveSelector()));
    const [fen, setFen] = useState(chess.getFen());
    const [canMove, setCanMove] = useState(true);

    const handleMove = (move: any) => {
        if (!canMove) { return; }
        if (chess.isValidMove(move)) {
            setCanMove(false);
            setFen(chess.getFen())
            chess.makeNextMove();
            setTimeout(() => {
                setFen(chess.getFen());
                setCanMove(true)
            },
            300);
        }
    }   

    return (
        <div>
            <Chessboard 
                position={fen}
                onDrop={(move) => handleMove(move)}
            />
        </div>
    );
}

