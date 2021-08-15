import { getRequest, postRequest } from './base-testing';
import { Response } from 'supertest';

// проверять больше информации (поля, массивы)

describe('initial testing', () => {
  it('should create new candle and save it to database', async () => {
    const expectedResult = {
      kline_start: 16293651180000,
      kline_close: 1626651239999,
      symbol: 'BNBUSDT',
      interval: '1m',
      open_price: 301.37,
      close_price: 301.61,
      high_price: 301.69,
      low_price: 301.32,
      asset_volume: 232304.642428
    };

    const res: Response = await postRequest('/candles', expectedResult);

    expect(res.statusCode).toEqual(201);

    expect(res.body).toHaveProperty('kline_start', 16293651180000);
    expect(res.body).toHaveProperty('kline_close', 1626651239999);
    expect(res.body).toHaveProperty('symbol', 'BNBUSDT');
    expect(res.body).toHaveProperty('interval', '1m');
    expect(res.body).toHaveProperty('open_price', 301.37);
    expect(res.body).toHaveProperty('close_price', 301.61);
    expect(res.body).toHaveProperty('high_price', 301.69);
    expect(res.body).toHaveProperty('low_price', 301.32);
    expect(res.body).toHaveProperty('asset_volume', 232304.642428);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('__v');
  });

  it('create not valid candle and try to do post request. Expect status bad request', async () => {
    const candle = {};
    const res: Response = await postRequest('/candles', candle);
    expect(res.statusCode).toEqual(400);
  });

  it('should return candles in period A & B', async () => {
    const params = {
      from: '01-01-1970',
      to: '03-08-2021'
    };

    const res: Response = await getRequest('/', params);

    const result = res.body;

    expect(result).toBe(Array);

    //all object fields must satisfy the criterion > from and < to
    expect(result).toEqual(
      expect.arrayContaining([
        // сравнить поля объекта
        expect.objectContaining({
          //
          //kline_start:
          //const filterFrom = moment.utc(from).toDate().getTime();
        })
      ])
    );
  });

  it('should return all candles with symbol bnbusdt', async () => {
    const pair = 'BNBUSDT';

    const res: Response = await getRequest('/', pair);

    const result = res.body;

    // result must be an array
    expect(result).toBe(Array);

    // all items in the array must be of type Candle

    // check for all items in array have symbol 'bnbusdt'
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          symbol: pair
        })
      ])
    );
  });

  it('should return candles for pair BNBUSDT in period 03-03-2021 and 04-03-2021', async () => {
    const params = { from: '03-03-2021', to: '04-03-2021', pair: 'BNBUSDT' };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(200);
  });

  it('should return validation error when post parametres from & to aren`t date', async () => {
    const params = {
      from: 'blah',
      to: 'blah'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
    //expect(res.body).toBe()
    // expect status message
  });

  it('should return validation error when post parametres only one date', async () => {
    const params = {
      from: '1970-01-01'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
  });

  it('should return validation error when date in future', async () => {
    const params = {
      from: '1970-01-01',
      to: '2022-01-01'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
  });

  it('should return validation error when pair not exist', async () => {
    const pair = 'blah';

    const res: Response = await getRequest('/', pair);
    expect(res.statusCode).toEqual(400);
  });

  it('should return BadRequestException when date is invalid', async () => {
    const params = { from: '02-03-2021', to: '33-03-2021' };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
  });

  it('should return bad request when from > to', async () => {
    const params = {
      from: '03-03-2021',
      to: '02-03-2021'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
  });

  it('should return bad requset when date format is invalid', async () => {
    const params = {
      from: '2021-03-03',
      to: '2021-03-10'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
  });
});
//       schema of candle

//       kline_start: 1626641340000,
//       kline_close: 1626641399999,
//       symbol: 'BNBUSDT',
//       interval: '1m',
//       open_price: 304.17,
//       close_price: 304.34,
//       high_price: 304.34,
//       low_price: 304.14,
//       asset_volume: 76858.488228
