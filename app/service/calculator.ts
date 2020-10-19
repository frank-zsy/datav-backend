import { Service } from 'egg';
import { RepoData } from '../plugin/data-manager/types';

export default class CalculatorService extends Service {
  public activity(repos: RepoData[], startTime: Date, endTime: Date): RepoActivity {
    const result: RepoActivity = {
      activityMap: new Map<string, number>(),
      totalActivity: 0,
    };
    const idActivityMap = new Map<string, number>();
    const addActivity = (id: string, n: number) => {
      idActivityMap.set(id, (idActivityMap.get(id) ?? 0) + n);
    };
    repos.forEach(repo => {
      repo.issues.forEach(issue => {
        if (this.timeRangeFilter(issue.openTime, startTime, endTime)) {
          // open issue
          addActivity(issue.id, 2);
        }
        issue.comments.forEach(c => {
          if (this.timeRangeFilter(c.time, startTime, endTime)) {
            // issue comment
            addActivity(c.id, 1);
          }
        });
      });
      repo.pulls.forEach(pull => {
        if (this.timeRangeFilter(pull.openTime, startTime, endTime)) {
          // open pull
          addActivity(pull.id, 3);
        }
        if (pull.closeTime && this.timeRangeFilter(pull.closeTime, startTime, endTime) && pull.merged) {
          // merge pull
          addActivity(pull.id, 5);
        }
        pull.comments.forEach(c => {
          if (this.timeRangeFilter(c.time, startTime, endTime)) {
            // pull comment
            addActivity(c.id, 1);
          }
        });
        pull.reviewComments.forEach(c => {
          if (this.timeRangeFilter(c.time, startTime, endTime)) {
            // pull review comment
            addActivity(c.id, 4);
          }
        });
      });
    });

    for (const [id, activity] of idActivityMap) {
      const login = this.app.dataMgr.getLogin(id);
      if (!login) continue;
      result.activityMap.set(login, activity);
      result.totalActivity += Math.sqrt(activity);
    }

    return result;
  }

  public attention(repo: RepoData, startTime: Date, endTime: Date): number {
    let attention = 0;
    repo.stars.forEach(s => {
      if (this.timeRangeFilter(s.time, startTime, endTime)) {
        attention += 1;
      }
    });
    repo.forks.forEach(f => {
      if (this.timeRangeFilter(f.time, startTime, endTime)) {
        attention += 2;
      }
    });
    return attention;
  }

  public relation(repos: RepoData[], startTime: Date, endTime: Date): { login1: string; login2: string; relation: number }[] {
    const relationMap = new Map<string, number>();
    const genKey = (login1: string, login2: string): string => {
      if (login1 > login2) return `${login1}_${login2}`;
      return `${login2}_${login1}`;
    };
    const addRelation = (login1: string, login2: string, activity1: number, activity2: number) => {
      if (login1 === login2) return;
      const relation = (activity1 * activity2) / (activity1 + activity2);
      const key = genKey(login1, login2);
      relationMap.set(key, (relationMap.get(key) ?? 0) + relation);
    };
    repos.forEach(repo => {
      repo.issues.forEach(issue => {
        const activityMap = new Map<string, number>();
        const addActivity = (id: string, n: number) => {
          const login = this.app.dataMgr.getLogin(id);
          if (!login) return;
          activityMap.set(login, (activityMap.get(login) ?? 0) + n);
        };
        if (this.timeRangeFilter(issue.openTime, startTime, endTime)) {
          addActivity(issue.id, 2);
        }
        issue.comments.forEach(c => {
          if (this.timeRangeFilter(c.time, startTime, endTime)) {
            addActivity(c.id, 1);
          }
        });
        const arr = Array.from(activityMap.entries());
        for (const [l1, a1] of arr) {
          for (const [l2, a2] of arr) {
            addRelation(l1, l2, a1, a2);
          }
        }
      });
      repo.pulls.forEach(pull => {
        const activityMap = new Map<string, number>();
        const addActivity = (id: string, n: number) => {
          const login = this.app.dataMgr.getLogin(id);
          if (!login) return;
          activityMap.set(login, (activityMap.get(login) ?? 0) + n);
        };
        if (this.timeRangeFilter(pull.openTime, startTime, endTime)) {
          addActivity(pull.id, 3);
        }
        if (pull.closeTime && this.timeRangeFilter(pull.closeTime, startTime, endTime) && pull.merged) {
          addActivity(pull.id, 5);
        }
        pull.comments.forEach(c => {
          if (this.timeRangeFilter(c.time, startTime, endTime)) {
            addActivity(c.id, 1);
          }
        });
        pull.reviewComments.forEach(r => {
          if (this.timeRangeFilter(r.time, startTime, endTime)) {
            addActivity(r.id, 4);
          }
        });
        const arr = Array.from(activityMap.entries());
        for (const [l1, a1] of arr) {
          for (const [l2, a2] of arr) {
            addRelation(l1, l2, a1, a2);
          }
        }
      });
    });
    return Array.from(relationMap.entries()).map(v => {
      const logins = v[0].split('_');
      return {
        login1: logins[0],
        login2: logins[1],
        relation: v[1],
      }
    });
  }

  public issueStats(repo: RepoData, startTime: Date, endTime: Date): { open: number, close: number } {
    let openCount = 0, closeCount = 0;
    for (const [_, issue] of repo.issues) {
      if (this.timeRangeFilter(issue.openTime, startTime, endTime)) {
        openCount++;
      }
      if (issue.closeTime && this.timeRangeFilter(issue.closeTime, startTime, endTime)) {
        closeCount++;
      }
    }
    return {
      open: openCount,
      close: closeCount,
    };
  }

  public pullStats(repo: RepoData, startTime: Date, endTime: Date): { open: number; merge: number } {
    let openCount = 0, mergeCount = 0;
    for (const [_, pull] of repo.pulls) {
      if (this.timeRangeFilter(pull.openTime, startTime, endTime)) {
        openCount++;
      }
      if (pull.closeTime && this.timeRangeFilter(pull.closeTime, startTime, endTime) && pull.merged) {
        mergeCount++;
      }
    }
    return {
      open: openCount,
      merge: mergeCount,
    };
  }

  public participantNumber(repo: RepoData, startTime: Date, endTime: Date): number {
    const loginSet = new Set<string>();
    repo.stars.filter(s => this.timeRangeFilter(s.time, startTime, endTime)).forEach(s => loginSet.add(s.id));
    repo.forks.filter(f => this.timeRangeFilter(f.time, startTime, endTime)).forEach(f => loginSet.add(f.id));
    for (const [_, issue] of repo.issues) {
      if (this.timeRangeFilter(issue.openTime, startTime, endTime)) {
        loginSet.add(issue.id);
      }
      issue.comments.filter(c => this.timeRangeFilter(c.time, startTime, endTime)).forEach(c => loginSet.add(c.id));
    }
    for (const [_, pull] of repo.pulls) {
      if (this.timeRangeFilter(pull.openTime, startTime, endTime)) {
        loginSet.add(pull.id);
      }
      pull.comments.filter(c => this.timeRangeFilter(c.time, startTime, endTime)).forEach(c => loginSet.add(c.id));
      pull.reviewComments.filter(r => this.timeRangeFilter(r.time, startTime, endTime)).forEach(r => loginSet.add(r.id));
    }
    return loginSet.size;
  }

  public timeRangeFilter(t: Date, startTime: Date, endTime: Date): boolean {
    return t > startTime && t < endTime;
  }
}

export interface RepoActivity {
  activityMap: Map<string, number>;
  totalActivity: number;
}
