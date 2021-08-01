import { useState } from "react";
import RandomMoveSelector from "../chessbrain/RandomMoveSelector";
import { ChessGame, randomColor } from "./ChessGame";
import { TimeSettings } from "./Timer";

export const RandomComputerGame: React.FC = () => {
    const [playerColor] = useState(randomColor());
    const [moveSelector] = useState(new RandomMoveSelector());

    const timeSettings: TimeSettings = {
        timeInMinutes: 10,
        bonusTimeInSeconds: 5,
      }
      
    return (
        <ChessGame 
            playerColor={playerColor}
            moveSelector={moveSelector}
            timeSettings={timeSettings}
        />
    );
}