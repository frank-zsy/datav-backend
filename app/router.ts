import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/title', controller.data.title);
  router.get('/activity_title', controller.data.activityTitle);
  router.get('/attention_title', controller.data.attentionTitle);
  router.get('/issue_title', controller.data.issueTitle);
  router.get('/pull_title', controller.data.pullTitle);
  router.get('/participant_number_title', controller.data.participantNumberTitle);
  router.get('/participant_ratio_title', controller.data.participantRatioTitle);
  router.get('/participant_rank_list_title', controller.data.participantRankListTitle);

  router.get('/start_time', controller.data.startTime);
  router.get('/end_time', controller.data.endTime);

  router.get('/activity_data', controller.data.activityData);
  router.get('/attention_data', controller.data.attentionData);
  router.get('/issue_data', controller.data.issueData);
  router.get('/pull_data', controller.data.pullData);
  router.get('/participant_number_data', controller.data.participantNumberData);
  router.get('/participant_ratio_data', controller.data.participantRatioData);
  router.get('/project_name', controller.data.projectName);
  router.get('/participant_rank_list_data', controller.data.participantRankListData);

  router.get('/relation_title', controller.data.relationTitle);
  router.get('/relation_data', controller.data.relationData);

  router.get('/legend', controller.data.legend);
  router.get('/legend_request', controller.data.legendRequest);
};
