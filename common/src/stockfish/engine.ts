/// <reference path="../types/stockfish.d.ts" />

import * as Chess from 'chess.js';
import { STOCKFISH } from 'stockfish';
import { parseMove } from './parsers'

import ShortMove = Chess.ShortMove;

class ResponseSequencer {

    private postFn: (msg: string) => void;
    private responseCallback: ((resp: string) => void) | null = null;

    constructor(postFn: (msg: string) => void) {
        this.postFn = postFn;
    }
    
    public post(message: string): void {
        this.postFn(message);
    }

    public receive(message: string): void {
        if (this.responseCallback) {
            this.responseCallback(message);
        }
    }

    public async nextResponse(): Promise<string> {
        const response: string = await new Promise((resolve, _) => {
            this.responseCallback = resolve;
        });
        this.responseCallback = null;
        return response;
    }
}

export class StockfishEngine {

    private stockfish: any;
    private responder: ResponseSequencer;

    constructor() {
        const workerThread = new Worker('stockfish.js');
        this.stockfish = STOCKFISH();
        this.responder = new ResponseSequencer(message => this.stockfish.postMessage(message));
        this.stockfish.onmessage = this.responder.receive;
    }
    
    public async waitForMessage(message: string): Promise<void> {
        await this.waitForMatchingMessage(it => it === message);
    }

    public async waitForMatchingMessage<T>(processMsg: (msg: string) => T | null): Promise<T> {
        while (true) {
            const resp = await this.responder.nextResponse();
            const result = processMsg(resp);
            if (result !== null){
                return result;
            }
        }
    }
    
    public async setup() {
        this.responder.post("uci");
        await this.waitForMessage("uciok");
    }

    public newGame() {
        this.responder.post("ucinewgame");
    }

    public position(fen: string) {
        this.responder.post("position " + fen);
    }

    public async findMove(): Promise<ShortMove> {
        this.responder.post("go movetime 5000");
        const result = await this.waitForMatchingMessage(parseBestMove);
        return result;
    }

}


function parseBestMove(message: string): ShortMove | null {
    const components = message.split(" ")
    if (components.length > 0 || components[0] != "bestmove") {
        return null;
    } else {
        return parseMove(components[1]);
    } 
}