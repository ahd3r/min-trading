import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"
import { Document } from 'mongoose';

export type CandleDocument = Candle & Document;

@Schema()
export class Candle {

    @Prop({ required: true })
    kline_start: number;

    @Prop({ required: true })
    kline_close: number;

    @Prop({ required: true })
    symbol: string;

    @Prop({ required: true })
    interval: string;

    @Prop({ required: true })
    open_price: number;

    @Prop({ required: true })
    close_price: number;

    @Prop({ required: true })
    high_price: number;

    @Prop({ required: true })
    low_price: number;

    @Prop({ required: true })
    asset_volume: number;
}

export const CandleSchema = SchemaFactory.createForClass(Candle);
