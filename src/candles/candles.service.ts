import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as webSocket from 'ws';
import { Candle } from './schemas/candle.schema';
import * as moment from 'moment';


// Todo выбор пары / запись каждого месседжа в базу?
@Injectable()
export class CandlesService implements OnModuleInit {

    constructor(@InjectModel('Candle') private readonly candleRepository: Model<Candle>) { }

    onModuleInit() {
        console.log(`The module has been initialized.`);
        //wss://stream.binance.com:9443/ws/bnbusdt@kline_1m
        //wss://stream.binance.com:9443/ws/btcusdt@kline_1m

        const socket: webSocket = new webSocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_1m');

        socket.on('message', async (event) => {
            //console.log('Message from server ', event);
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

            let candle: Candle = {
                kline_start,
                kline_close,
                symbol,
                interval,
                open_price,
                close_price,
                high_price,
                low_price,
                closed,
                asset_volume
            }

            await this.create(candle);
            //console.log(candle);
        });

    }

    getCandles(from: string, to: string) {

        const first = moment.utc(from).toDate().getTime();
        const last = moment.utc(to).toDate().getTime();

        // console.log(`first: ${first} last: ${last}`);

        return this.candleRepository.find({ kline_start: { $gte: first, $lte: last } });
    }

    async create(candle: Candle): Promise<Candle> {
        const createdCandle = new this.candleRepository(candle);
        //console.log(createdCandle);
        return createdCandle.save();
    }   
}
