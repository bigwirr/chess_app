import { isPropertySignature } from "typescript";

interface ForwardBackwardArrowProps {
    onForward: () => void;
    onBackward: () => void;
    forwardCaption: string;
    backwardCaption: string;
}

export function ForwardBackwardArrows(props: ForwardBackwardArrowProps) {
    return (
        <div>
            <button onClick={props.onForward}>{props.forwardCaption}</button>
            <button onClick={props.onBackward}>{props.backwardCaption}</button>
        </div>
    );
}