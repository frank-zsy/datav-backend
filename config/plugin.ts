import { EggPlugin } from 'egg';
import { join } from 'path';

const plugin: EggPlugin = {
  dataMgr: {
    enable: true,
    path: join(__dirname, '../app/plugin/data-manager'),
  },
};

export default plugin;
