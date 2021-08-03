import { getRequest, postRequest } from './base-testing.test';
import { Response } from 'supertest';

//jest.setTimeout(100000);

describe('initial testing', () => {
  // create a valid entity and post it then save to database
  it('should create new candle and save it to database', async (done) => {
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

    const expectedStatusCode = 201;

    const res: Response = await postRequest('/candles', expectedResult);

    expect(res.statusCode).toEqual(expectedStatusCode);

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

    done();
  });

  // create empty entity of candle and do post request with it. Expect status bad request
  it('create not valid candle and try to do post request', async (done) => {
    const candle = {};
    const res: Response = await postRequest('/candles', candle);
    expect(res.statusCode).toEqual(400);
    done();
  });

  it('should return candles in period A & B', async (done) => {
    const params = {
      from: '1970-01-01',
      to: '2021-08-03'
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
    done();
  });

  it('should return all candles with symbol bnbusdt', async (done) => {
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
    done();
  });

  it('should return validation error when post parametres from & to aren`t date', async (done) => {
    const params = {
      from: 'blah',
      to: 'blah'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);
    done();
  });

  it('should return validation error when post parametres only one date', async (done) => {
    const params = {
      from: '1970-01-01'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);

    done();
  });

  it('should return validation error when date in future', async (done) => {
    const params = {
      from: '1970-01-01',
      to: '2022-01-01'
    };

    const res: Response = await getRequest('/', params);

    expect(res.statusCode).toEqual(400);

    done();
  });

  it('should return validation error when pair not exist', async (done) => {
    const pair = 'blah';

    const res: Response = await getRequest('/', pair);
    expect(res.statusCode).toEqual(400);
    done();
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
