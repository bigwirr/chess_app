import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import ChessBrain, { BLACK, Color, WHITE } from '../chessbrain/ChessBrain';
import RandomMoveSelector from '../chessbrain/RandomMoveSelector';
import { GameStatus, GameStatusDisplay } from './GameStatus';
import PromotionSelector, { PromoteToPiece } from './PromotionSelector';
import Timer, { TimeSettings } from './Timer';

function randomColor(): Color {
    return Math.floor(Math.random() * (2)) == 0 ? WHITE : BLACK;
}

export interface ChessGameProps {
    timeSettings: TimeSettings,
}

export const ChessGame: React.FC<ChessGameProps> = (props: ChessGameProps) => {
    const [color] = useState<Color>(randomColor());
    const [chess] = useState<ChessBrain>(new ChessBrain(new RandomMoveSelector(), color));
    const [fen, setFen] = useState(chess.getFen());
    const [canMove, setCanMove] = useState(color == WHITE);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.live);
    const [winner, setWinner] = useState<Color | null>(null);
    const [needToPromote, setNeedToPromote] = useState(false);
    const [moveAfterPromotion, setMoveAfterPromotion] = useState<any>(null);
    const [p1MoveCount, setP1MoveCount] = useState(0);
    const [p2MoveCount, setP2MoveCount] = useState(0);

    const handleMove = (move: any) => {
        if (!canMove || needToPromote) { return; }
        if (chess.isPromotion(move)) {
            setCanMove(false);
            setMoveAfterPromotion(move);
            setNeedToPromote(true);
            return;
        }
        handleMoveInner(move);
    }  

    const handleMoveInner = (move: any, promotion?: PromoteToPiece) => {
        if (chess.isValidMove(move, promotion)) {
            updateGameState(false);
            makeComputerMove();
        }
    }

    const updateGameState = (canMove: boolean) => {
        setFen(chess.getFen());
        setGameStatus(chess.getStatus());
        setWinner(chess.getWinner());
        setCanMove(canMove);
        updateMoveCounts(!canMove)
    }

    const updateMoveCounts = (playerMoved: boolean) => {
        if (playerMoved) {
            setP1MoveCount(p1MoveCount + 1);
        }
        else {
            setP2MoveCount(p2MoveCount + 1);
        }
    }

    const makeComputerMove = () => {
        chess.makeNextMove();
        setTimeout(() => {
            updateGameState(true);
        },
        300);
    }

    const onPromotionSelected = (piece: PromoteToPiece) => {
        setNeedToPromote(false);
        handleMoveInner(moveAfterPromotion, piece);
    }

    const onP1Timeout = () => { 
        chess.loseByTimeout(); 
        updateGameState(false);
    };
    const onP2Timeout = () => { 
        chess.winByTimeout(); 
        updateGameState(false);
    };

    const promotionSelector = !needToPromote ? null :
        <PromotionSelector
            onPieceSelected={onPromotionSelected}
        />;

    if (chess.waitingOnFirstMove()) {
        makeComputerMove();
    }

    const isPlayerTurn = canMove || needToPromote;

    return (
        <div>
            <Timer 
                active={!isPlayerTurn && !winner}
                onTimeout={onP2Timeout}
                timeSettings={props.timeSettings}
            />
            <Chessboard 
                position={fen}
                onDrop={(move) => handleMove(move)}
                orientation={color == WHITE ? "white" : "black"}
            />
            <GameStatusDisplay 
                winner={winner ?? undefined}
                gameStatus={gameStatus}
            />
            <Timer 
                active={isPlayerTurn && !winner}
                onTimeout={onP1Timeout}
                timeSettings={props.timeSettings}
            />
            {promotionSelector}
        </div>
    );
}

