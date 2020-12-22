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
      title: 'Nacos 开源影响力大屏',
      activityTitle: '< 活跃度趋势 >',
      attentionTitle: '< 关注度趋势 >',
      issueTitle: '< Issue 情况 >',
      pullTitle: '< PR 情况 >',
      relationTitle: '< 协作网络图 >',
      participantNumberTitle: '< 项目参与人数 >',
      participantRatioTitle: '< 开发者活跃比例 >',
      participantRankListTitle: '< 开发者活跃排行 >',

      projects: [
        {
          name: 'nacos',
          repos: [{ id: '137451403', name: 'alibaba/nacos' },
          { id: '280443247', name: 'nacos-group/nacos-sdk-csharp' },
          { id: '158166592', name: 'nacos-group/nacos-sync' },
          { id: '280442616', name: 'nacos-group/nacos-sdk-cpp' },
          { id: '158486200', name: 'nacos-group/nacos-k8s' },
          { id: '142377858', name: 'nacos-group/nacos-spring-project' },
          { id: '158361616', name: 'nacos-group/nacos-docker' },
          { id: '144712336', name: 'nacos-group/nacos-spring-boot-project' },
          { id: '150405077', name: 'nacos-group/nacos-sdk-go' },
          { id: '149785457', name: 'nacos-group/nacos-examples' },
          { id: '169826987', name: 'nacos-group/nacos-sdk-python' },
          { id: '158152779', name: 'nacos-group/nacos-coredns-plugin' },
          { id: '199638620', name: 'nacos-group/grpc-java-registry-nacos' },
          { id: '156148798', name: 'nacos-group/nacos-sdk-nodejs' },
          { id: '181809738', name: 'nacos-group/nacos-activity' },
          { id: '203106877', name: 'nacos-group/nacos-istio' },
          { id: '164858713', name: 'nacos-group/nacos-template' },
          { id: '195785759', name: 'nacos-group/nacos-confd' },
          { id: '155140255', name: 'nacos-group/dubbo-registry-nacos' },
          ],
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
        '#03ffff',
        '#33b4ff',
        '#8b73ff',
        '#cc529b',
        '#eb6b63',
        '#d6c25e',
      ],

      activityRankListNumber: 50,
      participantRatioThreshold: 5,
      participantRatioMin: 4,
      participantRatioMax: 9,
      dataPartition: 5,
    },
    dubbo: {
      title: 'Dubbo 开源影响力大屏',
      activityTitle: '< 活跃度趋势 >',
      attentionTitle: '< 关注度趋势 >',
      issueTitle: '< Issue 情况 >',
      pullTitle: '< PR 情况 >',
      relationTitle: '< 协作网络图 >',
      participantNumberTitle: '< 项目参与人数 >',
      participantRatioTitle: '< 开发者活跃比例 >',
      participantRankListTitle: '< 开发者活跃排行 >',

      projects: [
        {
          name: 'dubbo',
          repos: [{ id: '4710920', name: 'apache/dubbo' }],
        }, {
          name: 'SOFA',
          repos: [{ id: '128709824', name: 'sofastack/sofa-rpc' }],
        }, {
          name: 'gRPC',
          repos: [{ id: '27729880', name: 'grpc/grpc' }],
        }, {
          name: 'bRPC',
          repos: [{ id: '102343794', name: 'apache/incubator-brpc' }],
        }, {
          name: 'Tars',
          repos: [{ id: '79316451', name: 'TarsCloud/Tars' }],
        }, {
          name: 'ServiceComb',
          repos: [{ id: '91674936', name: 'apache/servicecomb-java-chassis' }],
        },
      ],

      colors: [
        '#03ffff',
        '#33b4ff',
        '#8b73ff',
        '#cc529b',
        '#eb6b63',
        '#d6c25e',
      ],

      activityRankListNumber: 50,
      participantRatioThreshold: 5,
      participantRatioMin: 4,
      participantRatioMax: 9,
      dataPartition: 5,
    },
    ai: {
      title: '< AI 项目大屏 >',
      activityTitle: '< 活跃度趋势 >',
      attentionTitle: '< 关注度趋势 >',
      issueTitle: '< Issue 情况 >',
      pullTitle: '< PR 情况 >',
      relationTitle: '< 协作网络图 >',
      participantNumberTitle: '< 项目参与人数 >',
      participantRatioTitle: '< 开发者活跃比例 >',
      participantRankListTitle: '< 开发者活跃排行 >',

      projects: [
        {
          name: 'tensorflow',
          repos: [{ id: '45717250', name: 'tensorflow/tensorflow' }],
        }, {
          name: 'pytorch',
          repos: [{ id: '65600975', name: 'pytorch/pytorch' }],
        }, {
          name: 'Paddle',
          repos: [{ id: '65711522', name: 'PaddlePaddle/Paddle' }],
        }, {
          name: 'mxnet',
          repos: [{ id: '34864402', name: 'apache/incubator-mxnet' }],
        }, {
          name: 'mmf',
          repos: [{ id: '138831170', name: 'facebookresearch/mmf' }],
        }, {
          name: 'singa',
          repos: [{ id: '33294317', name: 'apache/singa' }],
        },
      ],

      colors: [
        '#03ffff',
        '#33b4ff',
        '#8b73ff',
        '#cc529b',
        '#eb6b63',
        '#d6c25e',
      ],

      activityRankListNumber: 50,
      participantRatioThreshold: 5,
      participantRatioMin: 4,
      participantRatioMax: 9,
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
