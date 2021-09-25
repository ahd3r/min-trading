import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import WebSocket from 'ws';

@WebSocketGateway({ namespace: 'btcusdt' })
export class WebSocketBtc {
  @WebSocketServer()
  private readonly server: WebSocket;

  sendBinanceMessage(message) {
    this.server.emit('foo', message);
  }
}
