import { useEffect, useState } from "react";

export interface TimeSettings {
    timeInMinutes: number,
    bonusTimeInSeconds: number,
}

export interface TimerProps {
    timeSettings: TimeSettings
    active: boolean,
    numMoves: number,
    onTimeout: () => void,
}

export default function Timer(props: TimerProps) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [lastNumMoves, setLastNumMoves] = useState(0);

    useEffect(() => {
        const interval = 10
        if (!props.active) { return; }
        const timer = setInterval(() => {
            const elapsedTimeNew = elapsedTime + interval
            if (hasTimedOut(props.timeSettings.timeInMinutes, elapsedTimeNew)) {
                props.onTimeout();
                setElapsedTime(minutesToMs(props.timeSettings.timeInMinutes));
                return;
            }

            const bonusTime = props.numMoves > lastNumMoves ? props.timeSettings.bonusTimeInSeconds: 0;
            setLastNumMoves(props.numMoves);
            setElapsedTime(elapsedTime + interval - secondsToMs(bonusTime));
        }, 10);

        return () => clearInterval(timer);
        }
    );
      
    return (
        <div>{formatTime(minutesToMs(props.timeSettings.timeInMinutes) - elapsedTime)}</div>
    );
}

function hasTimedOut(startTimeMinutes: number, elapsedTime: number) {
    const startTimeMs = minutesToMs(startTimeMinutes);
    return elapsedTime >= startTimeMs;
}

function minutesToMs(minutes: number): number {
    return minutes * 60000;
}

function msToMinutes(ms: number): number {
    return ms / 60000;
}

function msToSeconds(ms: number): number {
    return ms * .001;
}

function secondsToMs(seconds: number): number {
    return seconds / .001;
}

function formatTime(ms: number): string {
    const minutes = Math.floor(msToMinutes(ms));
    const seconds = Math.floor(msToSeconds(ms % 60000));

    return "" + minutes + ":" + ((seconds < 10) ? ("0" + seconds) : seconds);
}