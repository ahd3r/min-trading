import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import WebSocket from 'ws';

@WebSocketGateway({ namespace: 'bnbusdt' })
export class WebSocketBnb {
  @WebSocketServer()
  private readonly server: WebSocket;

  sendBinanceMessage(message) {
    this.server.emit('foo', message);
  }
}
