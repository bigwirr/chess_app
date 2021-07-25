import { Router } from 'express';
import { Chess, ShortMove } from 'chess.js';
export const router: Router = Router();


const game = new Chess()

interface MoveRequest {
    move: ShortMove,
    board: string // FEN string
}

router.get("move/", (req, res) => {
    res.status(200).send({
        "status": "server is running"
    });
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
