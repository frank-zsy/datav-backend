import { Controller } from 'egg';

export default class SingleRepoController extends Controller {

  private process(type: string) {
    const name = this.ctx.query.r;
    if (!name) return this.ctx.body = 'Repo not found';
    this.ctx.redirect(`${this.app.config.datav.ossUrl}single_repo_dashboard/${name.toLowerCase()}/${type}.json`);
  }

  public title() {
    const name = this.ctx.query.r;
    if (!name) return this.ctx.body = 'Repo not found';
    this.ctx.body = `${name} 项目数据大屏`;
  }

  public activity() {
    this.process('activity');
  }

  public attention() {
    this.process('attention');
  }

  public developers() {
    this.process('developers');
  }

  public issue() {
    this.process('issue');
  }

  public participants() {
    this.process('participants');
  }

  public pull() {
    this.process('pull');
  }

}
