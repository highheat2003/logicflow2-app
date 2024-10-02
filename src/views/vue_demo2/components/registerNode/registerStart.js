export default function registerStart(lf) {
  lf.register('start', ({ CircleNode, CircleNodeModel, h }) => {
    class StartNode extends CircleNode {
      getLabelShape() {
        const { model } = this.props;
        const { x, y } = model;
        return h(
          'text',
          {
            fill: '#000000',
            fontSize: 12,
            x: x - 12,
            y: y + 4,
            width: 50,
            height: 25,
          },
          'Start'
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
          this.getLabelShape(),
        ]);
      }
    }
    class StartModel extends CircleNodeModel {
      // 사용자 정의 노드 모양 속성
      initNodeData(data) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 35,
          dragable: false,
          editable: true,
        };
        super.initNodeData(data);
        this.r = 20;
      }
      // 사용자 정의 노드 스타일 속성
      getNodeStyle() {
        const style = super.getNodeStyle();
        return style;
      }
      // 사용자 지정 앵커 스타일
      getAnchorStyle() {
        const style = super.getAnchorStyle();
        style.hover.r = 8;
        style.hover.fill = 'rgb(24, 125, 255)';
        style.hover.stroke = 'rgb(24, 125, 255)';
        return style;
      }
      // 사용자 지정 노드 outline
      getOutlineStyle() {
        const style = super.getOutlineStyle();
        style.stroke = '#88f';
        return style;
      }
      getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules();
        const notAsTarget = {
          message: '시작 노드는 링크의 끝점이 될 수 없습니다.',
          validate: () => false,
        };
        rules.push(notAsTarget);
        return rules;
      }
    }
    return {
      view: StartNode,
      model: StartModel,
    };
  });
}
