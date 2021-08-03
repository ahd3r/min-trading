import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

function delay(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, milliseconds);
  });
}

export class BaseTest {
  private static app: INestApplication;

  public static async getTestApp(): Promise<INestApplication> {
    if (!this.app) {
      await this.initTestApp();
    }
    return this.app;
  }

  private static async initTestApp(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    //await delay(60000);
  }
}

export const getRequest = async (url: string, params: any): Promise<request.Response> => {
  const app = await BaseTest.getTestApp();
  const req = request(app.getHttpServer()).get(url);
  return req;
};

export const postRequest = async (url: string, body: any): Promise<request.Response> => {
  const app = await BaseTest.getTestApp();
  const req = request(app.getHttpServer()).post(url).send(body);
  return req;
};
