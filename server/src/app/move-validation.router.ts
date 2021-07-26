import { Router } from 'express';
import { Chess, ShortMove } from 'chess.js';
import { StockfishEngine } from './engine';

export const router: Router = Router();

interface MoveRequest {
    move: ShortMove,
    board: string // FEN string
}
interface MoveResponse {
    newBoard: string | null // FEN string, or null if invalid
    myMove: ShortMove | null
}

router.get("move/", async (rawReq, res) => {
    const req: MoveRequest = rawReq.body;
    const game = new Chess(req.board);
    const moveResult = game.move(req.move);

    let bestMove: ShortMove | null = null;
    if (moveResult != null) {
        const engine = new StockfishEngine();
        engine.newGame();
        engine.position(game.fen());
        bestMove = await engine.findMove();
    }

    const response: MoveResponse = {
        newBoard: moveResult && game.fen(),
        myMove: bestMove
    }
    res.status(200).send(response)
});

// getRoutes
/*
router.get(SERVER_STATUS_ENDPOINT + "/routes", (req, res) => {
    const routes = getRoutes();
    res.status(200).send({
        numberOfRoutes: routes.length,
        routes: routes
    });
});


// Define your routes here
router.get("/", (req, res) => {
    res.status(200).send({
        message: "GET request from sample router"
    });
});

router.post("/", (req, res) => {
    res.status(200).send({
        message: "POST request from sample router"
    });
});

router.put("/", (req, res) => {
    res.status(200).send({
        message: "PUT request from sample router"
    });
});

router.delete("/", (req, res) => {
    res.status(200).send({
        message: "DELETE request from sample router"
    });
});
*/
