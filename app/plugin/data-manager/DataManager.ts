import { Application } from 'egg';
import ClickHouse = require('@apla/clickhouse');
import { IssueData, PullData, QueryResult, RepoData } from './types';
import requestretry from 'requestretry';
import { appendFileSync, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { EOL } from 'os';
import { readline } from '../../util/file-util';

export class DataManager {

  public app: Application;
  private repoData: Map<string, RepoData>;
  private repoIdNameMap: Map<string, string>;
  private userData: Map<string, string>;
  private clickhouse: any;
  private basePath = '_data';

  constructor(app: Application) {
    this.app = app;
    this.repoData = new Map<string, any>();
    this.repoIdNameMap = new Map<string, string>();
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

  public async loadData() {
    if (!existsSync(this.basePath)) {
      return;
    }

    const repoPath = this.getRepoDataPath();
    if (existsSync(repoPath)) {
      await readline(repoPath, async line => {
        const r: RepoData = this.stringToRepoData(line);
        this.repoData.set(r.name, r);
      });
    }

    const userPath = this.getUserDataPath();
    if (existsSync(userPath)) {
      await readline(userPath, async line => {
        const u: { login: string; id: string } = JSON.parse(line);
        this.userData.set(u.id, u.login);
      });
    }

    this.app.logger.info('Read from file done.');
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
    this.initRepoData(repos);

    this.app.logger.info(`Gonna update data for ${repos.map(r => r.name).join(',')}`);

    const columns: string[] = this.app.config.clickhouse.columns;
    const events: string[] = this.app.config.clickhouse.events;
    for (const table of this.app.config.clickhouse.tables) {
      const query = `SELECT ${columns.join(',')} FROM ${this.app.config.clickhouse.db}.${table} ` +
        `WHERE repo_id IN [${repos.map(r => r.id).join(',')}] AND type IN [${events.map(e => `\'${e}\'`).join(',')}]`;
      await this.query<{ data: QueryResult[] }>(query, row => {
        this.processData(row);
      });
    }

    this.app.logger.info('Process data done.');

    this.writeData();
  }

  private initRepoData(repos: RepoIdAndName[]) {
    repos.forEach(r => {
      this.repoIdNameMap.set(r.id, r.name);
      if (this.repoData.has(r.name)) return;
      this.repoData.set(r.name, {
        ...r,
        stars: [],
        forks: [],
        issues: new Map<number, IssueData>(),
        pulls: new Map<number, PullData>(),
      });
    });
  }

  private processData(row: QueryResult) {
    this.userData.set(row.actor_id, row.actor_login);
    const repo = this.repoData.get(this.repoIdNameMap.get(row.repo_id)!)!;
    if (!repo) {
      this.app.logger.error(`Repo ${row.repo_id} not found.`);
      return;
    }
    const num = parseInt(row.issue_number);
    switch (row.type) {
      case 'WatchEvent':
        repo.stars.push({
          id: row.actor_id,
          time: new Date(row.created_at),
        });
        break;
      case 'ForkEvent':
        repo.forks.push({
          id: row.actor_id,
          time: new Date(row.created_at),
        });
        break;
      case 'IssuesEvent':
        if (row.action === 'opened') {
          if (!repo.issues.has(num)) {
            repo.issues.set(num, {
              num,
              id: row.actor_id,
              openTime: new Date(row.created_at),
              closeTime: undefined,
              comments: [],
            });
          }
        } else if (row.action === 'closed') {
          if (repo.issues.has(num)) {
            repo.issues.get(num)!.closeTime = new Date(row.created_at);
          }
        }
        break;
      case 'IssueCommentEvent':
        if (row.action === 'created') {
          if (repo.issues.has(num)) {
            repo.issues.get(num)!.comments.push({
              id: row.actor_id,
              time: new Date(row.created_at),
            });
          } else if (repo.pulls.has(num)) {
            repo.pulls.get(num)!.comments.push({
              id: row.actor_id,
              time: new Date(row.created_at),
            });
          }
        }
        break;
      case 'PullRequestEvent':
        if (row.action === 'opened') {
          if (!repo.pulls.has(num)) {
            repo.pulls.set(num, {
              num,
              id: row.actor_id,
              openTime: new Date(row.created_at),
              closeTime: undefined,
              merged: false,
              comments: [],
              reviewComments: [],
            });
          }
        } else if (row.action === 'closed') {
          if (repo.pulls.has(num)) {
            repo.pulls.get(num)!.closeTime = new Date(row.created_at);
            repo.pulls.get(num)!.merged = row.pull_merged !== '0';
          }
        }
        break;
      case 'PullRequestReviewCommentEvent':
        if (row.action === 'created') {
          if (repo.pulls.has(num)) {
            repo.pulls.get(num)!.reviewComments.push({
              id: row.actor_id,
              time: new Date(row.created_at),
            });
          }
        }
        break;
      default:
        break;
    }
  }

  private writeData() {
    if (!existsSync(this.basePath)) {
      mkdirSync(this.basePath);
    }

    const repoPath = this.getRepoDataPath();
    if (existsSync(repoPath)) {
      unlinkSync(repoPath);
    }
    this.repoData.forEach(repo => {
      appendFileSync(repoPath, this.repoDataToString(repo) + EOL);
    });

    const userPath = this.getUserDataPath();
    if (existsSync(userPath)) {
      unlinkSync(userPath);
    }
    this.userData.forEach((login, id) => {
      appendFileSync(userPath, JSON.stringify({ login, id }) + EOL);
    });

    this.app.logger.info('Write file done.');
  }

  private getRepoDataPath() {
    return join(this.basePath, 'repo.json');
  }

  private getUserDataPath() {
    return join(this.basePath, 'user.json');
  }

  private repoDataToString(r: RepoData): string {
    return JSON.stringify({
      ...r,
      issues: Array.from(r.issues.values()),
      pulls: Array.from(r.pulls.values()),
    });
  }

  private stringToRepoData(s: string): RepoData {
    const r = JSON.parse(s);
    const issues = new Map<Number, IssueData>();
    const pulls = new Map<number, PullData>();
    r.issues.forEach((i: IssueData) => {
      issues.set(i.num, {
        ...i,
        openTime: new Date(i.openTime),
        closeTime: i.closeTime ? new Date(i.closeTime) : undefined,
        comments: i.comments.map(c => {
          return {
            id: c.id,
            time: new Date(c.time),
          };
        }),
      });
    });
    r.pulls.forEach((p: PullData) => {
      pulls.set(p.num, {
        ...p,
        openTime: new Date(p.openTime),
        closeTime: p.closeTime ? new Date(p.closeTime) : undefined,
        comments: p.comments.map(c => {
          return {
            id: c.id,
            time: new Date(c.time),
          };
        }),
        reviewComments: p.reviewComments.map(c => {
          return {
            id: c.id,
            time: new Date(c.time),
          };
        }),
      });
    });
    return {
      ...r,
      issues,
      pulls,
    }
  }

  private async query<T = any>(q: string, onRow: (row: any) => void): Promise<T | undefined> {
    if (!this.app.config.clickhouse.queryUrl) {
      this.app.logger.info(`Query ${q} from clickhouse`);
      return new Promise(resolve => {
        const stream = this.clickhouse.query(q);
        stream.on('data', (row: any) => onRow(row));
        stream.on('end', () => {
          this.app.logger.info(`Query for ${q} done.`);
          resolve();
        });
        stream.on('error', (err: any) => this.app.logger.error(`Query for ${q} error: ${err}`));
      });
    } else {
      this.app.logger.info(`Query ${q} from api`);
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
