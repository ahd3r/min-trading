import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCandleDto {
  @IsInt()
  @Min(0)
  kline_start: number;

  @IsInt()
  @Min(0)
  kline_close: number;

  @IsString()
  @IsIn(['BNBUSDT', 'BTCUSDT'])
  symbol: string;

  @IsString()
  interval: string;

  @IsInt()
  @Min(0)
  open_price: number;

  @IsInt()
  @Min(0)
  close_price: number;

  @IsInt()
  @Min(0)
  high_price: number;

  @IsInt()
  @Min(0)
  low_price: number;

  @IsInt()
  @Min(0)
  asset_volume: number;
}
