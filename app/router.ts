import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/activity', controller.singleRepo.activity);
  router.get('/attention', controller.singleRepo.attention);
  router.get('/developers', controller.singleRepo.developers);
  router.get('/issue', controller.singleRepo.issue);
  router.get('/participants', controller.singleRepo.participants);
  router.get('/pull', controller.singleRepo.pull);
  router.get('/title', controller.singleRepo.title);
  router.get('/start', controller.singleRepo.startTime);
  router.get('/end', controller.singleRepo.endTime);

};
