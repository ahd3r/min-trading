import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CandlesService } from './candles.service';
import { Candle, CandleDocument } from './schemas/candle.schema';

@Controller('candles')
export class CandlesController {

    constructor(private readonly candlesService: CandlesService) { }

    // формат даты? 2021-07-19-00-00 / 
    @Get()
    getCandles(@Param() first:number, @Param() last:number) {
        return this.candlesService.getCandles(first, last);
    }

    @Post()
    create(@Body() candleDocument: CandleDocument): Promise<Candle> {
        return this.candlesService.create(candleDocument);
    }
}
