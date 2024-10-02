export default function registerEnd(lf) {
  lf.register('end', ({ CircleNode, CircleNodeModel, h }) => {
    class EndNode extends CircleNode {
      getIconShape() {
        const { model } = this.props;
        const { x, y, width, height } = model;
        const stroke = '#404040';
        return h(
          'svg',
          {
            x: x - width / 2,
            y: y - height / 2,
            width: 40,
            height: 40,
            viewBox: '0 0 1024 1024',
          },
          h('path', {
            fill: stroke,
            d: 'M212.992 526.336 212.992 526.336 212.992 526.336 215.04 526.336 212.992 526.336Z',
          }),
          h('path', {
            fill: stroke,
            d: 'M724.992 296.96 724.992 296.96 296.96 296.96 296.96 724.992 724.992 724.992 724.992 296.96Z',
          })
        );
      }
      getShape() {
        const { model } = this.props;
        const { x, y, r } = model;
        const { fill, stroke, strokeWidth } = model.getNodeStyle();
        return h('g', {}, [
          h('circle', {
            cx: x,
            cy: y,
            r,
            fill,
            stroke,
            strokeWidth,
          }),
          this.getIconShape(),
        ]);
      }
    }
    class EndModel extends CircleNodeModel {
      initNodeData(data) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 35,
        };
        super.initNodeData(data);
        this.r = 20;
      }
      // 사용자 지정 앵커 스타일
      getAnchorStyle() {
        const style = super.getAnchorStyle();
        style.hover.r = 8;
        style.hover.fill = 'rgb(24, 125, 255)';
        style.hover.stroke = 'rgb(24, 125, 255)';
        return style;
      }
      // 사용자 지정 노드 개요
      getOutlineStyle() {
        const style = super.getOutlineStyle();
        style.stroke = '#88f';
        return style;
      }
      getConnectedSourceRules() {
        const rules = super.getConnectedSourceRules();
        const notAsTarget = {
          message: '종료 노드는 링크의 시작점이 될 수 없습니다.',
          validate: () => false,
        };
        rules.push(notAsTarget);
        return rules;
      }
    }
    return {
      view: EndNode,
      model: EndModel,
    };
  });
}
