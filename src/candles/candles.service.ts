import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as webSocket from 'ws';
import { Candle } from './schemas/candle.schema';
import * as moment from 'moment';
import { WebSocketBnb } from "../websocket/websocket.bnbusdt.gateway";
import { WebSocketBtc } from "../websocket/websocket.btcusdt.gateway";


@Injectable()
export class CandlesService implements OnModuleInit {

    private readonly logger = new Logger(CandlesService.name);

    constructor(@InjectModel('Candle') private readonly candleRepository: Model<Candle>, 
    private readonly webSocketServerBnb: WebSocketBnb, 
    private readonly webSocketServerBtc: WebSocketBtc) { }

    onModuleInit() {
        this.logger.log(`The module has been initialized.`)
        //wss://stream.binance.com:9443/ws/bnbusdt@kline_1m
        //wss://stream.binance.com:9443/ws/btcusdt@kline_1m

        const first: webSocket = new webSocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_1m');
        const second: webSocket = new webSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

        first.on('message', async (event) => {

            let {
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
                let candle: Candle = {
                    kline_start,
                    kline_close,
                    symbol,
                    interval,
                    open_price,
                    close_price,
                    high_price,
                    low_price,
                    asset_volume
                }

                await this.create(candle);

                this.webSocketServerBnb.sendBinanceMessage(candle);
            }
        });

        second.on('message', async (event) => {
            let {
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
                let candle: Candle = {
                    kline_start,
                    kline_close,
                    symbol,
                    interval,
                    open_price,
                    close_price,
                    high_price,
                    low_price,
                    asset_volume
                }
                await this.create(candle);

                this.webSocketServerBtc.sendBinanceMessage(candle);
            }
        });
    }

    getCandles(from: string, to: string) {
        const first = moment.utc(from).toDate().getTime();
        const last = moment.utc(to).toDate().getTime();
        return this.candleRepository.find({ kline_start: { $gte: first, $lte: last } });
    }

    async create(candle: Candle): Promise<Candle> {
        const createdCandle = new this.candleRepository(candle);
        return createdCandle.save();
    }
}
