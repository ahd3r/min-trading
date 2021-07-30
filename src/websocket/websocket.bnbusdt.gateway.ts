import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ namespace: 'bnbusdt' })
export class WebSocketBnb {
    @WebSocketServer()
    private readonly server: Server;

    sendBinanceMessage(message) {
        this.server.emit("foo", message);
    }
}
