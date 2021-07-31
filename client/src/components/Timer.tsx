import { useEffect, useState } from "react";

export interface TimerProps {
    startTimeMinutes: number,
    active: boolean,
}

export default function Timer(props: TimerProps) {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (!props.active) { return; }
        const timer = setInterval(() => {
          setElapsedTime(elapsedTime + 10);
        }, 10);

        return () => clearInterval(timer);
        }
    );
      
    return (
        <div>{formatTime(minutesToMs(props.startTimeMinutes) - elapsedTime)}</div>
    );
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

function formatTime(ms: number): string {
    const minutes = Math.floor(msToMinutes(ms));
    const seconds = Math.floor(msToSeconds(ms % 60000));

    return "" + minutes + ":" + ((seconds < 10) ? ("0" + seconds) : seconds);
}