import { Application } from 'egg';

export default class AppBootHook {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  async serverDidReady() {
    this.app.dataMgr.loadData();
    this.app.dataMgr.run();
  }
}
