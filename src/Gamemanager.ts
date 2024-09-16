import { WebSocket } from "ws"
import { INIT_GAME } from "./messages";
import { Game } from "./Game";

export class Gamemanager {
    private games: Game[] // global array to store all the games running
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = []
        this.pendingUser = null
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.handleMessage(socket)
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket)
    }

    private handleMessage(socket: WebSocket) {
        socket.on("message",(data) => {
            const message = JSON.parse(data.toString());

            if(message.type == INIT_GAME) {
                if(this.pendingUser) {
                    // start the game
                    const game = new Game(this.pendingUser, socket);
                    this.pendingUser = null;
                    this.games.push(game);
                } else {
                    this.pendingUser = socket;
                }
            }
        })
    }


}