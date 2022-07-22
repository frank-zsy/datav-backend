import { Controller } from 'egg';

export default class SingleRepoController extends Controller {

  public async data() {
    const type = this.ctx.query.t;
    if (type === 'title') {
      const name = this.getName();
      this.ctx.body = [{ value: `${name} 项目数据大屏` }];
    } else {
      try {
        await this.process(type);
      } catch {
        this.ctx.body = 'Error';
      }
    }
  }

  private getName() {
    let name = this.ctx.query.r;
    if (!name || name === ':r') name = 'x-lab2017/open-digger';
    return name;
  }

  private async process(type: string) {
    const name = this.getName();
    const url = `${this.app.config.datav.ossUrl}open_source_data/${name.toLowerCase()}/${type}.json`;
    this.ctx.body = (await this.app.curl(url, { dataType: 'json' })).data;
  }

  public startTime() {
    this.ctx.body = [{ date: '2022-01-01' }];
  }

  public endTime() {
    this.ctx.body = [{ date: '2022-06-01' }];
  }

}
