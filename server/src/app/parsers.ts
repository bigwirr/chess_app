import { strictEqual } from 'assert';
import * as ChessJs from 'chess.js';
import { ShortMove, Square } from 'chess.js';


type Promotion = "n" | "b" | "r" | "q";

export function parseMove(str: string): ShortMove {
    const parseError = new Error(`Unable to parse move string \"${str}\"`);
    const components = str.split(" ");
    if (components.length != 2) {
        throw parseError;
    }

    const fromSquare = parseSquare(components[1].slice(0,2));
    const toSquare = parseSquare(components[1].slice(2,4));
    const promotion = components[1].length === 4 ? undefined : parsePromotion(components[1].charAt(4));

    return {
        from: fromSquare,
        to: toSquare,
        promotion: promotion, 
    }
}

function parseSquare(str: string): Square {
    return str as any as Square; // unsafe hack that could be improved later
}

function parsePromotion(str: string): Promotion {
    return str as any as Promotion; // unsafe hack that could be improved later
}
