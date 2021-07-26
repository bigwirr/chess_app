import { Piece } from "chessboardjsx";
import { isPropertySignature } from "typescript";

export type PromoteToPiece = "q" | "n" | "r" | "b";

interface PromotionSelectorProps {
    onPieceSelected(piece: PromoteToPiece): void;
}

interface SelectButtonProps {
    onClicked: (piece: PromoteToPiece) => void,
    piece: PromoteToPiece,
    text: string,
}
function SelectButton(props: SelectButtonProps) {
    return (
        <button onClick={() => props.onClicked(props.piece)}>{props.text}</button>
    );
}

export default function PromotionSelector(props: PromotionSelectorProps) {
    return (
        <div>
            <p>Select promotion: </p>
            <SelectButton 
                onClicked={props.onPieceSelected}
                piece={"q"}
                text="Queen"
            />
            <SelectButton 
                onClicked={props.onPieceSelected}
                piece={"r"}
                text="Rook"
            />
            <SelectButton 
                onClicked={props.onPieceSelected}
                piece={"b"}
                text="Bishop"
            />
            <SelectButton 
                onClicked={props.onPieceSelected}
                piece={"n"}
                text="Knight"
            />
        </div>
    );
}