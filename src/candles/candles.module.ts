import { Module } from '@nestjs/common';
import { CandlesController } from './candles.controller';
import { CandlesService } from './candles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CandleSchema } from './schemas/candle.schema';
import { WebSocketBnb } from '../websocket/websocket.bnbusdt.gateway';
import { WebSocketBtc } from '../websocket/websocket.btcusdt.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Candle', schema: CandleSchema }])],
  controllers: [CandlesController],
  providers: [CandlesService, WebSocketBnb, WebSocketBtc],
})
export class CandlesModule { }
