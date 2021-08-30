import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { CreateCandleDto } from './dto/create-candle-dto';
import { Candle } from '../database/schemas/candle.schema';

@Controller('candles')
export class CandlesController {
  constructor(private readonly candlesService: CandlesService) {}

  @Get()
  getCandles(@Query('from') from: string, @Query('to') to: string, @Query('pair') pair: string) {
    return this.candlesService.getCandles(from, to, pair);
  }

  @Post()
  create(@Body() createdCandleDto: CreateCandleDto): Promise<Candle> {
    return this.candlesService.create(createdCandleDto);
  }
}
