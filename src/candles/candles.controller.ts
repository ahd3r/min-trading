import { Body, Controller, Get, Post, Query} from '@nestjs/common';
import { CandlesService } from './candles.service';
import { Candle, CandleDocument } from './schemas/candle.schema';

@Controller('candles')
export class CandlesController {

    constructor(private readonly candlesService: CandlesService) { }

    @Get()
    getCandles(@Query('from') from:string, @Query('to') to:string) {
        return this.candlesService.getCandles(from, to);
    }

    @Post()
    create(@Body() candleDocument: CandleDocument): Promise<Candle> {
        return this.candlesService.create(candleDocument);
    }
}
