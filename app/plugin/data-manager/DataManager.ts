import { Application } from 'egg';
import ClickHouse = require('@apla/clickhouse');
import { IssueData, PullData, QueryResult, RepoData } from './types';
import requestretry from 'requestretry';

export class DataManager {

  public app: Application;
  private repoData: Map<string, RepoData>;
  private userData: Map<string, string>;
  private clickhouse: any;

  constructor(app: Application) {
    this.app = app;
    this.repoData = new Map<string, any>();
    this.userData = new Map<string, string>();
    if (!app.config.clickhouse.queryUrl) {
      this.clickhouse = new ClickHouse(app.config.clickhouse.server);
    }
  }

  public getData(repoName: string): RepoData | undefined {
    const data = this.repoData.get(repoName);
    return data;
  }

  public getLogin(id: string): string | undefined {
    return this.userData.get(id);
  }

  public async run() {
    const config = this.app.config.datav;
    const repos: RepoIdAndName[] = [];
    for (const key in config) {
      const projects: { name: string; repos: RepoIdAndName[] }[] = config[key].projects;
      projects.forEach(p => {
        repos.push(...p.repos);
      });
    }

    this.app.logger.info(`Gonna update data for ${repos.map(r => r.name).join(',')}`);

    const rows: QueryResult[] = [];

    const columns: string[] = this.app.config.clickhouse.columns;
    const events: string[] = this.app.config.clickhouse.events;
    for (const table of this.app.config.clickhouse.tables) {
      const query = `SELECT ${columns.join(',')} FROM ${this.app.config.clickhouse.db}.${table} ` +
        `WHERE repo_id IN [${repos.map(r => r.id).join(',')}] AND type IN [${events.map(e => `\'${e}\'`).join(',')}]`;
      const result = await this.query<{ data: QueryResult[] }>(query);
      this.app.logger.info('Data update done.', table, result?.data.length);
      rows.push(...result?.data ?? []);
    }

    this.processData(repos, rows);

    this.app.logger.info('Process data done.');
  }

  private processData(repos: RepoIdAndName[], rows: QueryResult[]) {
    this.app.logger.info(`Get ${rows.length} rows in total`);

    rows.sort((a, b) => {
      if (new Date(a.created_at) < new Date(b.created_at)) return -1;
      return 1;
    });

    const repoMap = new Map<string, string>();
    repos.forEach(r => {
      repoMap.set(r.id, r.name);
      this.repoData.set(r.name, {
        ...r,
        stars: [],
        forks: [],
        issues: new Map<number, IssueData>(),
        pulls: new Map<number, PullData>(),
      });
    });

    rows.forEach(r => {
      this.userData.set(r.actor_id, r.actor_login);
      const repo = this.repoData.get(repoMap.get(r.repo_id)!)!;
      const num = parseInt(r.issue_number);
      switch (r.type) {
        case 'WatchEvent':
          repo.stars.push({
            id: r.actor_id,
            time: new Date(r.created_at),
          });
          break;
        case 'ForkEvent':
          repo.forks.push({
            id: r.actor_id,
            time: new Date(r.created_at),
          });
          break;
        case 'IssuesEvent':
          if (r.action === 'opened') {
            if (!repo.issues.has(num)) {
              repo.issues.set(num, {
                num,
                id: r.actor_id,
                openTime: new Date(r.created_at),
                closeTime: undefined,
                comments: [],
              });
            }
          } else if (r.action === 'closed') {
            if (repo.issues.has(num)) {
              repo.issues.get(num)!.closeTime = new Date(r.created_at);
            }
          }
          break;
        case 'IssueCommentEvent':
          if (r.action === 'created') {
            if (repo.issues.has(num)) {
              repo.issues.get(num)!.comments.push({
                id: r.actor_id,
                time: new Date(r.created_at),
              });
            } else if (repo.pulls.has(num)) {
              repo.pulls.get(num)!.comments.push({
                id: r.actor_id,
                time: new Date(r.created_at),
              });
            }
          }
          break;
        case 'PullRequestEvent':
          if (r.action === 'opened') {
            if (!repo.pulls.has(num)) {
              repo.pulls.set(num, {
                num,
                id: r.actor_id,
                openTime: new Date(r.created_at),
                closeTime: undefined,
                merged: false,
                comments: [],
                reviewComments: [],
              });
            }
          } else if (r.action === 'closed') {
            if (repo.pulls.has(num)) {
              repo.pulls.get(num)!.closeTime = new Date(r.created_at);
              repo.pulls.get(num)!.merged = r.pull_merged !== '0';
            }
          }
          break;
        case 'PullRequestReviewCommentEvent':
          if (r.action === 'created') {
            if (repo.pulls.has(num)) {
              repo.pulls.get(num)!.reviewComments.push({
                id: r.actor_id,
                time: new Date(r.created_at),
              });
            }
          }
          break;
        default:
          break;
      }
    });
  }

  private async query<T = any>(q: string): Promise<T | undefined> {
    if (!this.app.config.clickhouse.queryUrl) {
      return this.clickhouse.querying(q);
    } else {
      return new Promise(resolve => {
        requestretry({
          url: this.app.config.clickhouse.queryUrl,
          method: 'POST',
          form: {
            query: q,
          }
        }, (err: any, _: any, body: string) => {
          if (err) resolve({ data: [] } as any);
          else resolve(JSON.parse(body));
        });
      });
    }
  }
}

interface RepoIdAndName {
  id: string;
  name: string;
}
