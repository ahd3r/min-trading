import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candle } from './schemas/candle.schema';
import { WebSocketBnb } from '../websocket/websocket.bnbusdt.gateway';
import { WebSocketBtc } from '../websocket/websocket.btcusdt.gateway';
import { CreateCandleDto } from './dto/create-candle-dto';
import * as webSocket from 'ws';
import * as moment from 'moment';

@Injectable()
export class CandlesService implements OnModuleInit {
  private readonly logger = new Logger(CandlesService.name);
  public static readonly FORMAT: string = 'DD-MM-YYYY';

  constructor(
    @InjectModel('Candle') private readonly candleRepository: Model<Candle>,
    private readonly webSocketServerBnb: WebSocketBnb,
    private readonly webSocketServerBtc: WebSocketBtc
  ) {}

  onModuleInit() {
    this.logger.log(`The module has been initialized.`);

    const first: webSocket = new webSocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_1m');
    const second: webSocket = new webSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    first.on('message', async (event) => {
      const {
        k: {
          t: kline_start,
          T: kline_close,
          s: symbol,
          i: interval,
          o: open_price,
          c: close_price,
          h: high_price,
          l: low_price,
          x: closed,
          q: asset_volume
        }
      } = JSON.parse(event.toString());

      if (closed) {
        const candle: Candle = {
          kline_start,
          kline_close,
          symbol,
          interval,
          open_price,
          close_price,
          high_price,
          low_price,
          asset_volume
        };

        await this.create(candle);

        this.webSocketServerBnb.sendBinanceMessage(candle);
      }
    });

    second.on('message', async (event) => {
      const {
        k: {
          t: kline_start,
          T: kline_close,
          s: symbol,
          i: interval,
          o: open_price,
          c: close_price,
          h: high_price,
          l: low_price,
          x: closed,
          q: asset_volume
        }
      } = JSON.parse(event.toString());

      if (closed) {
        const candle: Candle = {
          kline_start,
          kline_close,
          symbol,
          interval,
          open_price,
          close_price,
          high_price,
          low_price,
          asset_volume
        };

        await this.create(candle);

        this.webSocketServerBtc.sendBinanceMessage(candle);
      }
    });
  }

  getCandles(from: string, to: string, pair: string) {
    const options: any = {};

    if (!(from || to)) {
      throw new BadRequestException('both fields of date are required!');
    }

    this.logger.log(`${from} - is valid: ${moment(from, CandlesService.FORMAT).isValid()}`);
    this.logger.log(`${to} - is valid: ${moment(to, CandlesService.FORMAT).isValid()}`);

    if (
      !(
        moment(from, CandlesService.FORMAT).isValid() || moment(to, CandlesService.FORMAT).isValid()
      )
    ) {
      throw new BadRequestException(`date non valid or used format no ${CandlesService.FORMAT}`);
    }

    const filterFrom = moment.utc(from, CandlesService.FORMAT).toDate().getTime();
    const filterTo = moment.utc(to, CandlesService.FORMAT).toDate().getTime();

    if (filterFrom > filterTo) {
      throw new BadRequestException(
        `use the range from smaller to larger. from (${from}) must be less than to (${to})`
      );
    }

    if (filterFrom > Date.now() || filterTo > Date.now()) {
      throw new BadRequestException('entered date in the future!');
    }

    options.kline_start = { $gte: filterFrom, $lte: filterTo };

    if (pair) {
      pair = pair.toUpperCase();

      if (!(pair === 'BNBUSDT' || pair === 'BTCUSDT')) {
        throw new BadRequestException('name must be bnbusdt or btcusdt!');
      }
      options.symbol = pair;
    }

    return this.candleRepository.find(options);
  }

  async create(createdCandleDto: CreateCandleDto): Promise<Candle> {
    const createdCandle = new this.candleRepository(createdCandleDto);
    return createdCandle.save();
  }
}
