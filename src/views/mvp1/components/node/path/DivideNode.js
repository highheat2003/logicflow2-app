import { h } from '@logicflow/core';
import RectNode from '../basic/RectNode';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// 나눗셈 기호 (수학.)
class DivideModel extends RectNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 80;
    this.height = 80;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    const properties = this.getProperties();
    return getShapeStyleFuction(style, properties);
  }

  getTextStyle() {
    const style = super.getTextStyle();
    const properties = this.getProperties();
    return getTextStyleFunction(style, properties);
  }
}

class DivideView extends RectNode.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const style = this.props.model.getNodeStyle();
    const pointList = [
      [x - (1 / 2) * width, y - (1 / 8) * height],
      [x + (1 / 2) * width, y - (1 / 8) * height],
      [x + (1 / 2) * width, y + (1 / 8) * height],
      [x - (1 / 2) * width, y + (1 / 8) * height],
    ];
    const points = pointList.map((item) => {
      return `${item[0]},${item[1]}`;
    });

    const attrs = {
      ...style,
      x,
      y,
      width,
      height,
    };

    // 구분 기호 가운데에 있는 가로선
    const lineAttrs = {
      ...attrs,
      points: points.join(' '),
    };

    // 구분 기호 위의 점
    const upEllipseAttrs = {
      ...attrs,
      cy: y - (3 / 8) * height,
      cx: x,
      rx: (1 / 8) * width,
      ry: (1 / 8) * height,
    };

    // 구분 기호 아래의 점
    const downEllipseAttrs = {
      ...attrs,
      cy: y + (3 / 8) * height,
      cx: x,
      rx: (1 / 8) * width,
      ry: (1 / 8) * height,
    };

    return h('g', {}, [
      h('polygon', { ...lineAttrs }),
      h('ellipse', { ...upEllipseAttrs }),
      h('ellipse', { ...downEllipseAttrs }),
    ]);
  }
}

export default {
  type: 'divide',
  view: DivideView,
  model: DivideModel,
};
