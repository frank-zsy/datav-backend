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
    ossUrl: 'http://oss.com/',
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
    sca: {
      title: 'SCA 开源影响力大屏',
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
          name: 'alibaba',
          repos: [{ id: '112785414', name: 'alibaba/spring-cloud-alibaba' }],
        }, {
          name: 'gcp',
          repos: [{ id: '86105877', name: 'spring-cloud/spring-cloud-gcp' }],
        }, {
          name: 'netflix',
          repos: [{ id: '21741891', name: 'spring-cloud/spring-cloud-netflix' }],
        }, {
          name: 'aws',
          repos: [{ id: '25823015', name: 'spring-cloud/spring-cloud-aws' }],
        }, {
          name: 'azure',
          repos: [{ id: '130007651', name: 'microsoft/spring-cloud-azure' }],
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
    rocketmq: {
      title: 'RocketMQ 影响力大屏',
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
          name: 'RocketMQ',
          repos: [{ id: '75164823', name: 'apache/rocketmq' }],
        }, {
          name: 'RabbitMQ',
          repos: [{ id: '924551', name: 'rabbitmq/rabbitmq-server' }],
        }, {
          name: 'ActiveMQ',
          repos: [{ id: '206387', name: 'apache/activemq' }],
        }, {
          name: 'Pulsar',
          repos: [{ id: '62117812', name: 'apache/pulsar' }],
        }, {
          name: 'Kafka',
          repos: [{ id: '2211243', name: 'apache/kafka' }],
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
    seata: {
      title: 'Seata 影响力大屏',
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
          name: 'Seata',
          repos: [{ id: '163387337', name: 'seata/seata' }],
        }, {
          name: 'Servicecomb',
          repos: [{ id: '161138654', name: 'apache/servicecomb-saga-actuator' }],
        }, {
          name: 'hmily',
          repos: [{ id: '105110479', name: 'dromara/hmily' }],
        }, {
          name: 'lcn',
          repos: [{ id: '110315174', name: 'codingapi/tx-lcn' }],
        }, {
          name: 'tcc',
          repos: [{ id: '47442228', name: 'changmingxie/tcc-transaction' }],
        }, {
          name: 'EasyTrasaction',
          repos: [{ id: '86445553', name: 'QNJR-GROUP/EasyTransaction' }],
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
    kubesphere: {
      title: '< KubeSphere 项目大屏 >',
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
          name: 'kubesphere',
          repos: [{ id: '130430977', name: 'kubesphere/kubesphere' },
          { id: '168629414', name: 'kubesphere/openelb' },
          { id: '224581351', name: 'kubesphere/console' },
          { id: '248386471', name: 'kubesphere/kubekey' },
          { id: '196956614', name: 'kubesphere/ks-installer' }],
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
