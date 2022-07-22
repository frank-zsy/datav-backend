import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/single_repo', controller.singleRepo.data);

  router.get('/advance_dashboard', controller.advanceDashboard.data);

  router.get('/start', controller.singleRepo.startTime);
  router.get('/end', controller.singleRepo.endTime);

};
