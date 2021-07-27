import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CandlesController } from 'src/candles/candles.controller';
import { CandlesService } from 'src/candles/candles.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let controller: CandlesController;
  let service: CandlesService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service: CandlesService;
    controller = new CandlesController(service);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/');

    expect(response.statusCode).toBe(404);

    done();
  });

  // describe('findAll', () => {
  //   it('should return an array of cats', async () => {
  //     const result = ['test'];
  //     jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

  //     expect(await catsController.findAll()).toBe(result);
  //   });
  // });

});
