import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/single_data', controller.singleRepo.data);

  router.get('/advance_data', controller.advanceDashboard.data);
  router.get('/advance_legend', controller.advanceDashboard.legend);

  router.get('/start', controller.singleRepo.startTime);
  router.get('/end', controller.singleRepo.endTime);

};
