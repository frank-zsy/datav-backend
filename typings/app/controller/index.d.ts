// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdvanceDashboard from '../../../app/controller/advance_dashboard';
import ExportSingleRepo from '../../../app/controller/single_repo';

declare module 'egg' {
  interface IController {
    advanceDashboard: ExportAdvanceDashboard;
    singleRepo: ExportSingleRepo;
  }
}
