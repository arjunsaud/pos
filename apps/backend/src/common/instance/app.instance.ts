import { INestApplication } from '@nestjs/common';

export class AppInstanceProvider {
  private static appInstance: INestApplication;

  static setAppInstance(app: INestApplication) {
    this.appInstance = app;
  }

  static getAppInstance(): INestApplication {
    return this.appInstance;
  }
}
