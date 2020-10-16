import { Application } from 'egg';
import { DataManager } from './DataManager';

declare module 'egg' {
  interface Application {
    dataMgr: DataManager;
  }
}

module.exports = (app: Application) => {
  app.addSingleton('dataMgr', (_: any, app: Application) => {
    return new DataManager(app);
  });
};
