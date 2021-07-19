import { Module } from '@nestjs/common';
import { CandlesModule } from './candles/candles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CandlesModule,
    ConfigModule.forRoot({
      envFilePath: './config/.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [
        ConfigService],
      useFactory: (configService: ConfigService) => {
        return { uri: configService.get('MONGO_URI') }
      }
    })],
})
export class AppModule { }
