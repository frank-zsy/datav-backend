import { Controller } from 'egg';

export default class AdvanceDashboard extends Controller {

  public async data() {
    const type = this.ctx.query.t;
    try {
      await this.process(type);
    } catch {
      this.ctx.body = 'Error';
    }
  }

  private getName() {
    let name = this.ctx.query.r;
    if (!name || name === ':r') name = 'nacos';
    return name;
  }

  private async process(type: string) {
    const name = this.getName();
    const url = `${this.app.config.datav.ossUrl}label_dashboard/${name.toLowerCase()}/${type}.json`;
    this.ctx.body = (await this.app.curl(url, { dataType: 'json' })).data;
  }

}
