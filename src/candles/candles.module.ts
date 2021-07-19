import { Module } from '@nestjs/common';
import { CandlesController } from './candles.controller';
import { CandlesService } from './candles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CandleSchema } from './schemas/candle.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Candle', schema: CandleSchema }])],
  controllers: [CandlesController],
  providers: [CandlesService],
})
export class CandlesModule { }
