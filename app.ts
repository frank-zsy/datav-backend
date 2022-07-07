import { Application } from 'egg';

export default class AppBootHook {
  public app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  async serverDidReady() {
  }
}
