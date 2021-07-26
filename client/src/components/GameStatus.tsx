import { Color, WHITE } from "../chessbrain/ChessBrain";

export enum GameStatus {
    checkmate = 0,
    stalemate = 1,
    draw = 2,
    live = 3,
}

export interface GameStatusProps {
    winner?: Color,
    gameStatus: GameStatus,
}

interface DisplayProps {
    winner?: Color,
}

function CheckmateDisplay(props: DisplayProps) {
    if (!props.winner) { return null; }
    const winnerStr = props.winner == WHITE ? "White" : "Black";

    return (
        <p>
            {winnerStr + ' wins by checkmate'}
        </p>
    );
}

function DrawDisplay() {
    return (
        <p>
            {'Draw.'}
        </p>
    );
}

function StalemateDisplay() {
    return (
        <p>
            {'Stalemate.'}
        </p>
    );
}

export function GameStatusDisplay(props: GameStatusProps) {
    let display = null;
    switch(props.gameStatus) {
        case GameStatus.checkmate:
            display = CheckmateDisplay({ winner: props.winner});
            break;
        case GameStatus.draw:
            display = DrawDisplay();
            break;
        case GameStatus.stalemate:
            display = StalemateDisplay();
            break;
    }

    return (
        <div>
            {display}
        </div>
    );
}