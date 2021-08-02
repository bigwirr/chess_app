import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';
import ChessBrain, { BLACK, Color, MoveSelector, WHITE } from '../chessbrain/ChessBrain';
import { GameStatus, GameStatusDisplay } from './GameStatus';
import PromotionSelector, { PromoteToPiece } from './PromotionSelector';
import Timer, { TimeSettings } from './Timer';
import Modal from './Modal';

export function randomColor(): Color {
    return Math.floor(Math.random() * (2)) == 0 ? WHITE : BLACK;
}

export interface ChessGameProps {
    playerColor: Color,
    timeSettings: TimeSettings,
    moveSelector: MoveSelector,
}

export const ChessGame: React.FC<ChessGameProps> = (props: ChessGameProps) => {
    const [color] = useState<Color>(props.playerColor);
    const [chess] = useState<ChessBrain>(new ChessBrain(props.moveSelector, color));
    const [fen, setFen] = useState(chess.getFen());
    const [canMove, setCanMove] = useState(color == WHITE);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.live);
    const [winner, setWinner] = useState<Color | null>(null);
    const [needToPromote, setNeedToPromote] = useState(false);
    const [moveAfterPromotion, setMoveAfterPromotion] = useState<any>(null);
    const [p1MoveCount, setP1MoveCount] = useState(0);
    const [p2MoveCount, setP2MoveCount] = useState(0);
    const [showGameStatus, setShowGameStatus] = useState(false);

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
        setShowGameStatus(chess.getStatus() !== GameStatus.live)
    }

    const updateMoveCounts = (playerMoved: boolean) => {
        if (playerMoved) {
            setP1MoveCount(p1MoveCount + 1);
        }
        else {
            setP2MoveCount(p2MoveCount + 1);
        }
    }

    const makeComputerMove = async () => {
        await chess.makeNextMove();
        updateGameState(true);
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

    const onGameStatusClosed = () => {
        setShowGameStatus(false);
    }

    const isPlayerTurn = canMove || needToPromote;
    const chessBoard = false ? null : 
        <Chessboard 
            position={fen}
            onDrop={(move) => handleMove(move)}
            orientation={color == WHITE ? "white" : "black"}
        />;

    return (
        <div>
            <Timer 
                active={!isPlayerTurn && !winner}
                numMoves={p2MoveCount}
                onTimeout={onP2Timeout}
                timeSettings={props.timeSettings}
            />
            <div>
            {chessBoard}
            </div>
            <Modal isOpen={showGameStatus} onClose={onGameStatusClosed}>
                <GameStatusDisplay 
                    winner={winner ?? undefined}
                    gameStatus={gameStatus}
                />
            </Modal>
            <Timer 
                active={isPlayerTurn && !winner}
                numMoves={p1MoveCount}
                onTimeout={onP1Timeout}
                timeSettings={props.timeSettings}
            />
            {promotionSelector}
        </div>
    );
}

