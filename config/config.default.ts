import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602596877903_6767';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.datav = {
    nacos: {
      title: '开源竞品大屏',
      activityTitle: '活跃度变化趋势',
      attentionTitle: '关注度变化趋势',
      issueTitle: 'Issue 情况',
      pullTitle: 'PR 情况',
      participantNumberTitle: '项目参与人数',
      participantRatioTitle: '开发者活跃比例',
      participantRankListTitle: '开发者活跃排行',

      projects: [
        {
          name: 'nacos',
          repos: [{ id: '137451403', name: 'alibaba/nacos' }],
        }, {
          name: 'zookeeper',
          repos: [{ id: '160999', name: 'apache/zookeeper' }],
        }, {
          name: 'consul',
          repos: [{ id: '14125254', name: 'hashicorp/consul' }],
        }, {
          name: 'apollo',
          repos: [{ id: '53127403', name: 'ctripcorp/apollo' }],
        },
      ],

      colors: [
        '#096dd9',
        '#91d5ff',
        '#1e5d23',
        '#69ba6d',
        '#faad14',
        '#b17a7d',
      ],

      activityRankListNumber: 50,
      participantRatioThreshold: 5,
      dataPartition: 5,
    },
  };

  config.clickhouse = {
    server: {
      host: 'localhost',
      protocol: 'http:',
      port: 8123,
      format: 'JSON',
    },
    queryUrl: 'http://localhost/query',
    db: 'github_log',
    tables: ['year2015', 'year2016', 'year2017', 'year2018', 'year2019', 'year2020'],
    // tables: ['year2020'],
    columns: ['actor_id', 'actor_login', 'created_at', 'repo_id', 'type', 'action', 'pull_merged', 'issue_number'],
    events: ['WatchEvent', 'ForkEvent', 'IssuesEvent', 'PullRequestEvent', 'IssueCommentEvent', 'PullRequestReviewCommentEvent'],
  };

  config.deploy = {
    baseUrl: '',
  };

  config.cluster = {
    listen: {
      port: 8672,
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
