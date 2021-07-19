import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import webSocket from 'ws';
import * as webSocket from 'ws';
import { Candle } from './schemas/candle.schema';

// Todo выбор пары / запись каждого месседжа в базу?
@Injectable()
export class CandlesService implements OnModuleInit {

    constructor(@InjectModel('Candle') private readonly candleRepository: Model<Candle>) { }

    onModuleInit() {
        console.log(`The module has been initialized.`);
        //wss://stream.binance.com:9443/ws/bnbusdt@kline_1m
        //wss://stream.binance.com:9443/ws/btcusdt@kline_1m
        const socket: webSocket = new webSocket('wss://stream.binance.com:9443/ws/bnbusdt@kline_1m');
        socket.on('message', function (event) {
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

            console.log(candle);
        });

    }

    // один объект range или два числа?
    getCandles(first:number, last:number) {
        // return this.candleRepository.find({ kline_start: from });
        return this.candleRepository.find({ kline_start: { $gte: first, $lte: last } });
    }

    async create(candle: Candle): Promise<Candle> {
        const createdCandle = new this.candleRepository(candle);
        console.log(createdCandle);
        return createdCandle.save();
    }

    timeStampEncoder(year, month, day, hour, minute, second): number {
        var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
        return datum.getTime() / 1000;
    }

    timeStampDecoder(unix_timestamp: number): string {

        if (!unix_timestamp)
            return;

        var date = new Date(unix_timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();

        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        console.log(formattedTime);
        return formattedTime;
    }
}
