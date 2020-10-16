export interface QueryResult {
  actor_id: string;
  actor_login: string;
  repo_id: string;
  type: string;
  action: string;
  created_at: string;
  pull_merged: string;
  issue_number: string;
}

export interface RepoData {
  id: string;
  name: string;
  stars: {
    id: string;
    time: Date;
  }[];
  forks: {
    id: string;
    time: Date;
  }[];
  issues: Map<number, IssueData>;
  pulls: Map<number, PullData>;
}

export interface IssueData {
  num: number
  id: string;
  openTime: Date;
  closeTime: Date | undefined;
  comments: {
    id: string;
    time: Date;
  }[];
}

export interface PullData {
  num: number
  id: string;
  openTime: Date;
  closeTime: Date | undefined;
  merged: boolean;
  comments: {
    id: string;
    time: Date;
  }[];
  reviewComments: {
    id: string;
    time: Date;
  }[];
}
