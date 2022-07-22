// tslint:disable: binary-expression-operand-order
import { Controller } from 'egg';

export default class AdvanceDashboard extends Controller {

  public async data() {
    const type = this.ctx.query.t;
    try {
      this.ctx.body = await this.process(type);
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
    return (await this.app.curl(url, { dataType: 'json' })).data;
  }

  public async legend() {
    const colors = [
      '#03ffff',
      '#33b4ff',
      '#8b73ff',
      '#cc529b',
      '#eb6b63',
      '#d6c25e',
    ];
    const meta = await this.process('meta');
    // let svgInnerContent = '<rect x="0" y="0" width="400" height="140" style="fill:#41495C99" />';
    let svgInnerContent = '';
    meta.names.forEach((name, index) => {
      svgInnerContent += `<rect x="${20 + (index % 2) * 220}" y="${15 + (Math.floor(index / 2)) * 40}" width="200" height="30" fill="#000000CC" />`;
      svgInnerContent += `<rect x="${22 + (index % 2) * 220}" y="${17 + (Math.floor(index / 2)) * 40}" width="26" height="26" fill="${colors[index]}" />`;
      svgInnerContent += `<text x="${135 + (index % 2) * 220}" y="${30 + (Math.floor(index / 2)) * 40}">${name}</text>`;
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

}
