import { Color, WHITE } from "../chessbrain/ChessBrain";

export enum GameStatus {
    checkmate = 0,
    stalemate = 1,
    draw = 2,
    live = 3,
    timeout = 4,
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

    return (
        <p>
            {winnerString(props.winner) + ' wins by checkmate.'}
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

function TimeoutDisplay(props: DisplayProps) {
    if (!props.winner) { return null; }
    return (
        <p>{winnerString(props.winner) + ' wins by timeout.'}</p>
    );
}

function winnerString(winner: Color): string {
    return winner == WHITE ? "White" : "Black";
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
        case GameStatus.timeout:
            display = TimeoutDisplay({ winner: props.winner });
            break;
    }

    return (
        <div>
            {display}
        </div>
    );
}