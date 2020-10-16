import { Service } from 'egg';
import { RepoData } from '../plugin/data-manager/types';

export default class CalculatorService extends Service {
  public activity(repo: RepoData, startTime: Date, endTime: Date): RepoActivity {
    const result: RepoActivity = {
      activityMap: new Map<string, number>(),
      totalActivity: 0,
    };
    const idActivityMap = new Map<string, number>();
    const addActivity = (id: string, n: number) => {
      idActivityMap.set(id, (idActivityMap.get(id) ?? 0) + n);
    };
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
