import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/activity', controller.singleRepo.activity);
  router.get('/attention', controller.singleRepo.attention);
  router.get('/developers', controller.singleRepo.developers);
  router.get('/issueClosed', controller.singleRepo.issueClosed);
  router.get('/issueOpened', controller.singleRepo.issueOpened);
  router.get('/participants', controller.singleRepo.participants);
  router.get('/pullOpened', controller.singleRepo.pullOpened);
  router.get('/pullMerged', controller.singleRepo.pullMerged);

};
