import { Module } from '@nestjs/common';
import { CandlesController } from './candles.controller';
import { CandlesService } from './candles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WebSocketBnb } from '../websocket/websocket.bnbusdt.gateway';
import { WebSocketBtc } from '../websocket/websocket.btcusdt.gateway';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CandleSchema } from '../database/schemas/candle.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().uri()
      })
    }),
    MongooseModule.forFeature([{ name: 'Candle', schema: CandleSchema }])
  ],
  controllers: [CandlesController],
  providers: [CandlesService, WebSocketBnb, WebSocketBtc]
})
export class CandlesModule {}
