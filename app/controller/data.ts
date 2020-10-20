import { Controller } from 'egg';
import dateformat = require('dateformat');

export default class DataController extends Controller {

  private getProj(): string {
    return this.ctx.query['base_proj'] ?? 'nacos';
  }

  private getConfig(): any {
    return this.app.config.datav[this.getProj()];
  }

  private getTime(): { startTime: Date, endTime: Date } | undefined {
    const startTimeStr = this.ctx.query['start_time'];
    const endTimeStr = this.ctx.query['end_time'];
    if (!startTimeStr || !endTimeStr) {
      return undefined;
    }
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);
    if (startTime > endTime) return undefined;
    return {
      startTime,
      endTime,
    };
  }

  private getProjects(): { name: string; repos: { id: string; name: string }[] }[] {
    const config = this.getConfig();
    if (!config) return [];
    return config.projects;
  }

  public async title() {
    this.ctx.body = [
      {
        value: this.getConfig()?.title ?? 'Not found',
      },
    ];
  }

  public async activityTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.activityTitle ?? 'Not found',
      },
    ];
  }

  public async activityData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    if (!config || !timeRange) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;
    const timeInterval = Math.round((endTime.getTime() - startTime.getTime()) / config.dataPartition);
    const projects = this.getProjects();
    const result: { x: string; y: number; s: string }[] = [];
    for (let i = 0; i <= config.dataPartition; i++) {
      const e = new Date(startTime.getTime() + i * timeInterval);
      const s = new Date(e.getTime() - timeInterval);
      projects.forEach((project, index) => {
        const activityData = this.ctx.service.calculator.activity(project.repos.map(r => this.app.dataMgr.getData(r.name)).filter(r => r !== undefined) as any, s, e);
        result.push({
          x: dateformat(e, 'yyyy/mm/dd HH:MM:ss', true),
          y: Math.round(activityData.totalActivity),
          s: `系列${index + 1}`,
        });
      });
    }
    this.ctx.body = result;
  }

  public async attentionTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.attentionTitle ?? 'Not found',
      },
    ];
  }

  public async attentionData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    if (!config || !timeRange) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;
    const timeInterval = Math.round((endTime.getTime() - startTime.getTime()) / config.dataPartition);
    const projects = this.getProjects();
    const result: { x: string; y: number; s: string }[] = [];
    for (let i = 0; i <= config.dataPartition; i++) {
      const e = new Date(startTime.getTime() + i * timeInterval);
      const s = new Date(e.getTime() - timeInterval);
      projects.forEach((project, index) => {
        let totalAttention = 0;
        project.repos.forEach(repo => {
          const repoData = this.app.dataMgr.getData(repo.name);
          if (!repoData) return;
          const attention = this.ctx.service.calculator.attention(repoData, s, e);
          totalAttention += attention;
        });
        result.push({
          x: dateformat(e, 'yyyy/mm/dd HH:MM:ss', true),
          y: totalAttention,
          s: `系列${index + 1}`,
        });
      });
    }
    this.ctx.body = result;
  }

  public async relationTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.relationTitle ?? 'Not found',
      },
    ];
  }

  public async relationData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    const index = this.ctx.query['index'];
    if (!config || !timeRange || index === undefined) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;

    const i = Math.abs(parseInt(index));
    const projects = this.getProjects();
    const project = projects[i % projects.length];
    const repos = project.repos;

    const repoData = repos.map(repo => this.app.dataMgr.getData(repo.name)).filter(r => r !== undefined) as any;
    const activityData = this.ctx.service.calculator.activity(repoData, startTime, endTime);
    const relationData = this.ctx.service.calculator.relation(repoData, startTime, endTime);

    const activityArr = Array.from(activityData.activityMap.entries()).sort((a, b) => {
      if (a[1] < b[1]) return 1;
      return -1;
    }).slice(0, 50);

    const result: { nodes: { name: string; value: number; category: number }[]; links: { source: string; target: string; value: number }[] } = {
      nodes: [],
      links: [],
    };

    const series = 9;
    activityArr.forEach(a => {
      result.nodes.push({
        name: a[0],
        value: Math.round(Math.sqrt(a[1])),
        category: (result.nodes.length % series) + 1,
      });
    });

    relationData.forEach(r => {
      if (result.nodes.findIndex(n => n.name === r.login1) >= 0 && result.nodes.findIndex(n => n.name === r.login2) >= 0) {
        result.links.push({
          source: r.login1,
          target: r.login2,
          value: Math.round(20 / r.relation),
        });
      }
    });

    this.ctx.body = [result];
  }

  public async issueTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.issueTitle ?? 'Not found',
      },
    ];
  }

  public async issueData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    if (!config || !timeRange) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;
    const projects = this.getProjects();
    const result: { y1: number; y2: number; x: string }[] = [];
    projects.forEach(project => {
      const repos = project.repos;
      let openCount = 0, closeCount = 0;
      repos.forEach(repo => {
        const repoData = this.app.dataMgr.getData(repo.name);
        if (!repoData) return;
        const { open, close } = this.ctx.service.calculator.issueStats(repoData, startTime, endTime);
        openCount += open;
        closeCount += close;
      });
      result.push({
        y1: openCount,
        y2: closeCount,
        x: project.name,
      });
    });
    this.ctx.body = result;
  }

  public async pullTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.pullTitle ?? 'Not found',
      },
    ];
  }

  public async pullData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    if (!config || !timeRange) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;
    const projects = this.getProjects();
    const result: { y1: number; y2: number; x: string }[] = [];
    projects.forEach(project => {
      const repos = project.repos;
      let openCount = 0, mergeCount = 0;
      repos.forEach(repo => {
        const repoData = this.app.dataMgr.getData(repo.name);
        if (!repoData) return;
        const { open, merge } = this.ctx.service.calculator.pullStats(repoData, startTime, endTime);
        openCount += open;
        mergeCount += merge;
      });
      result.push({
        y1: openCount,
        y2: mergeCount,
        x: project.name,
      });
    });
    this.ctx.body = result;
  }

  public async participantNumberTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.participantNumberTitle ?? 'Not found',
      },
    ];
  }

  public async participantNumberData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    if (!config || !timeRange) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;
    const projects = this.getProjects();
    const result: { value: string; content: string }[] = [];
    projects.forEach(project => {
      const repos = project.repos;
      let participantNumber = 0;
      repos.forEach(repo => {
        const repoData = this.app.dataMgr.getData(repo.name);
        if (!repoData) return;
        const num = this.ctx.service.calculator.participantNumber(repoData, startTime, endTime);
        participantNumber += num;
      });
      result.push({
        value: participantNumber.toString(),
        content: project.name,
      });
    });
    result.sort((a, b) => {
      if (parseInt(a.value) < parseInt(b.value)) return 1;
      return -1;
    });
    this.ctx.body = result;
  }

  public async participantRatioTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.participantRatioTitle ?? 'Not found',
      },
    ];
  }

  public async projectName() {
    const projects = this.getProjects();
    const index = this.ctx.query['index'];
    if (!projects || index === undefined) {
      this.ctx.body = 'Not found';
      return;
    }
    const i = Math.abs(parseInt(index));
    this.ctx.body = [
      {
        value: projects[i % projects.length].name,
      }
    ];
  }

  public async participantRatioData() {
    const config = this.getConfig();
    const timeRange = this.getTime();
    const index = this.ctx.query['index'];
    if (!config || !timeRange || index === undefined) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;

    const i = Math.abs(parseInt(index));
    const projects = this.getProjects();
    const project = projects[i % projects.length];
    const activityList: { login: string; score: number }[] = [];
    const result: { x: string; y: number }[] = [];
    let totalActivity = 0;

    const activityData = this.ctx.service.calculator.activity(project.repos.map(r => this.app.dataMgr.getData(r.name)).filter(r => r !== undefined) as any, startTime, endTime);
    for (const [login, score] of activityData.activityMap) {
      const item = activityList.find(i => i.login === login);
      if (item) {
        item.score += score;
      } else {
        activityList.push({
          login,
          score,
        });
      }
      totalActivity += score;
    }
    activityList.sort((a, b) => {
      if (a.score < b.score) return 1;
      return -1;
    });
    let totalRatio = 0;
    activityList.forEach(a => {
      const ratio = Math.round(a.score * 100 / totalActivity);
      if (ratio >= config.participantRatioThreshold) {
        totalRatio += ratio;
        result.push({
          x: a.login,
          y: ratio,
        });
      }
    });
    if (totalRatio < 100) {
      result.push({
        x: 'Others',
        y: 100 - totalRatio,
      });
    }
    this.ctx.body = result.map(r => { return { x: r.x, y: r.y.toString() }; });
  }

  public async participantRankListTitle() {
    this.ctx.body = [
      {
        value: this.getConfig()?.participantRankListTitle ?? 'Not found',
      },
    ];
  }

  public async participantRankListData() {
    const config = this.getConfig();
    const timeRange = this.getTime();

    if (!config || !timeRange) {
      this.ctx.body = 'Not found';
      return;
    }
    const { startTime, endTime } = timeRange;
    const projects = this.getProjects();
    const rankList: { login: string, proj: string; score: number }[] = [];
    projects.forEach(project => {
      const activityData = this.ctx.service.calculator.activity(project.repos.map(r => this.app.dataMgr.getData(r.name)).filter(r => r !== undefined) as any, startTime, endTime);
      for (const [login, score] of activityData.activityMap) {
        rankList.push({
          login,
          score,
          proj: project.name,
        });
      }
    });
    rankList.sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score === b.score && a.login < b.login) return -1;
      return -1;
    });
    this.ctx.body = rankList.map((r, i) => {
      return {
        ...r,
        rank: (i + 1).toString(),
        score: r.score.toString(),
      };
    }).slice(0, config.activityRankListNumber);
  }

  public async legendRequest() {
    const proj = this.getProj();
    this.ctx.body = [
      {
        img: `${this.ctx.app.config.deploy.baseUrl}/legend?base_proj=${proj}`,
        url: ''
      },
    ];
  }

  public async legend() {
    const config = this.getConfig();
    const projects = this.getProjects();
    if (!config) {
      this.ctx.body = 'Not found';
      return;
    }
    const colors = config.colors;
    // let svgInnerContent = '<rect x="0" y="0" width="400" height="140" style="fill:#41495C99" />';
    let svgInnerContent = '';
    projects.forEach((project, index) => {
      svgInnerContent += `<rect x="${20 + (index % 2) * 220}" y="${15 + (Math.floor(index / 2)) * 40}" width="200" height="30" fill="#000000CC" />`
      svgInnerContent += `<rect x="${22 + (index % 2) * 220}" y="${17 + (Math.floor(index / 2)) * 40}" width="26" height="26" fill="${colors[index]}" />`;
      svgInnerContent += `<text x="${135 + (index % 2) * 220}" y="${30 + (Math.floor(index / 2)) * 40}">${project.name}</text>`;
    });

    const svgContent = `<svg
xmlns="http://www.w3.org/2000/svg" width="460" height="140" background="">
<style type="text/css"><![CDATA[
text {
  text-anchor: middle;
  dominant-baseline: middle;
  fill: white;
  font-size: 18px;
  font-family: "Microsoft Yahei", Arial, sans-serif;
  font-weight: 700;
}
]]></style>
${svgInnerContent}
</svg>
`;
    this.ctx.body = svgContent;
    this.ctx.set('Content-Type', 'image/svg+xml');
  }

  public async startTime() {
    this.ctx.body = [
      {
        date: dateformat(new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd', true),
      },
    ];
  }

  public async endTime() {
    this.ctx.body = [
      {
        date: dateformat(new Date(), 'yyyy-mm-dd', true),
      },
    ];
  }

  public async getData() {
    const { owner, repo } = this.ctx.params;
    this.ctx.body = this.ctx.app.dataMgr.getData(`${owner}/${repo}`);
  }

}
