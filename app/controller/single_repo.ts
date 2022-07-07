import { Controller } from 'egg';

export default class SingleRepoController extends Controller {

  private getName() {
    let name = this.ctx.query.r;
    if (!name || name === ':r') name = 'x-lab2017/open-digger';
    return name;
  }

  private async process(type: string) {
    const name = this.getName();
    const url = `${this.app.config.datav.ossUrl}single_repo_dashboard/${name.toLowerCase()}/${type}.json`;
    this.ctx.body = (await this.app.curl(url, { dataType: 'json' })).data;
  }

  public title() {
    const name = this.getName();
    this.ctx.body = [{ value: `${name} 项目数据大屏` }];
  }

  public async activity() {
    await this.process('activity');
  }

  public async attention() {
    await this.process('attention');
  }

  public async developers() {
    await this.process('developers');
  }

  public async issue() {
    await this.process('issue');
  }

  public async participants() {
    await this.process('participants');
  }

  public async pull() {
    await this.process('pull');
  }

}
