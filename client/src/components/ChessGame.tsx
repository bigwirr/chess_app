import React, { Component, useState } from 'react';
import Chessboard from 'chessboardjsx';
import ChessBrain, { BLACK, Color, MoveSelector, WHITE } from '../chessbrain/ChessBrain';
import { GameStatus, GameStatusDisplay } from './GameStatus';
import PromotionSelector, { PromoteToPiece } from './PromotionSelector';
import Timer, { TimeSettings } from './Timer';
import Modal from './Modal';
import { ForwardBackwardArrows } from './ForwardBackwardArrows';
import { Chess } from 'chess.js';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export function randomColor(): Color {
    return Math.floor(Math.random() * (2)) == 0 ? WHITE : BLACK;
}

export interface ChessGameProps {
    playerColor: Color,
    timeSettings: TimeSettings,
    moveSelector: MoveSelector,
}

interface ChessGameState {
    color: Color,
    chess: ChessBrain,
    fen: string,
    canMove: boolean,
    gameStatus: GameStatus,
    winner: Color | null,
    needToPromote: boolean,
    moveAfterPromotion: any,
    p1MoveCount: number,
    p2MoveCount: number,
    showGameStatus: boolean,
    gameHistory: string[],
    gameIndex: number,
}

export class ChessGame extends React.Component<ChessGameProps, ChessGameState> {
    constructor(props: ChessGameProps) {
        super(props);

        const chess = new ChessBrain(props.moveSelector, props.playerColor);
        this.state = {
            color: props.playerColor,
            chess: chess,
            fen: chess.getFen(),
            canMove: props.playerColor == WHITE,
            gameStatus: GameStatus.live,
            winner: null,
            needToPromote: false,
            moveAfterPromotion: null,
            p1MoveCount: 0,
            p2MoveCount: 0,
            showGameStatus: false,
            gameHistory: [],
            gameIndex: -1,
        }
    }

    handleMove = (move: any) => {
        if (!this.state.canMove || this.state.needToPromote) { return; }
        if (this.state.chess.isPromotion(move)) {
            this.setState({
                canMove: false,
                moveAfterPromotion: move,
                needToPromote: true,
            })
            return;
        }
        this.handleMoveInner(move);
    }  

    handleMoveInner = (move: any, promotion?: PromoteToPiece) => {
        if (this.state.chess.isValidMove(move, promotion)) {
            this.updateGameState(false);
            this.makeComputerMove();
        }
    }

    updateGameState = (canMove: boolean) => {
        const newHistory = this.state.gameHistory.slice();
        newHistory.push(this.state.fen);

        const [p1MoveCount, p2MoveCount] = this.getNewMoveCounts(!canMove);

        this.setState({
            gameHistory: newHistory,
            gameIndex: newHistory.length-1,
            fen: this.state.chess.getFen(),
            gameStatus: this.state.chess.getStatus(),
            winner: this.state.winner,
            canMove: canMove,
            p1MoveCount: p1MoveCount,
            p2MoveCount: p2MoveCount,
            showGameStatus: this.state.chess.getStatus() !== GameStatus.live,
        });
    }

    getNewMoveCounts = (playerMoved: boolean) => {
        return [
            playerMoved ? this.state.p1MoveCount+1 : this.state.p1MoveCount,
            playerMoved ? this.state.p2MoveCount : this.state.p2MoveCount+1
        ];
    }
    
    updateMoveCounts = (playerMoved: boolean) => {
        if (playerMoved) {
            this.setState({
                p1MoveCount: this.state.p1MoveCount+1,
            })
        }
        else {
            this.setState({
                p2MoveCount: this.state.p2MoveCount+1,
            })
        }
    }

    makeComputerMove = async () => {
        await this.state.chess.makeNextMove();
        this.updateGameState(true);
    }

    onPromotionSelected = (piece: PromoteToPiece) => {
        this.setState({ needToPromote: true });
        this.handleMoveInner(this.state.moveAfterPromotion, piece);
    }

    onP1Timeout = () => { 
        this.state.chess.loseByTimeout(); 
        this.updateGameState(false);
    };

    onP2Timeout = () => { 
        this.state.chess.winByTimeout(); 
        this.updateGameState(false);
    };

    onGameStatusClosed = () => {
        this.setState({ showGameStatus: false });
    }

    onForward = () => {
        this.updateGameIndex(1);
    }

    onBackward = () => {
        this.updateGameIndex(-1);
    }

    updateGameIndex(step: number) {
        let newGameIndex = this.state.gameIndex + step;
        if (newGameIndex < -1) {
            newGameIndex = -1;
        }
        if (newGameIndex >= this.state.gameHistory.length) {
            newGameIndex = this.state.gameHistory.length-1;
        }

        this.setState({ gameIndex: newGameIndex });
    }

    isPlayerTurn = () => {
        return this.state.canMove || this.state.needToPromote;
    }

    renderPromotionSelector = () => {
        return !this.state.needToPromote ? null :
            <PromotionSelector
                onPieceSelected={this.onPromotionSelected}
            />;
    }

    render() {
        if (this.state.chess.waitingOnFirstMove()) {
            this.makeComputerMove();
        }

        const onDrop = this.state.gameIndex == -1 ? (move: any) => this.handleMove(move) : undefined;
        const displayFen = this.state.gameIndex == -1 ? this.state.fen : this.state.gameHistory[this.state.gameIndex];

        return (
            <div>
                <Timer 
                    active={!this.isPlayerTurn() && !this.state.winner}
                    numMoves={this.state.p2MoveCount}
                    onTimeout={this.onP2Timeout}
                    timeSettings={this.props.timeSettings}
                />
                <Chessboard 
                    position={displayFen}
                    onDrop={onDrop}
                    orientation={this.state.color == WHITE ? "white" : "black"}
                />
                <Modal isOpen={this.state.showGameStatus} onClose={this.onGameStatusClosed}>
                    <GameStatusDisplay 
                        winner={this.state.winner ?? undefined}
                        gameStatus={this.state.gameStatus}
                    />
                </Modal>
                <Timer 
                    active={this.isPlayerTurn() && !this.state.winner}
                    numMoves={this.state.p1MoveCount}
                    onTimeout={this.onP1Timeout}
                    timeSettings={this.props.timeSettings}
                />
                <ForwardBackwardArrows 
                    onForward={this.onForward} 
                    onBackward={this.onBackward}
                    forwardCaption={"Next move"}
                    backwardCaption={"Previous move"}
                />
                {this.renderPromotionSelector()}
            </div>
        );
    }
}