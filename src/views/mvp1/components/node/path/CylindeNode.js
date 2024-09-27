import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// 원통
class CylindeModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 60;
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

class CylindeView extends RectResize.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const style = this.props.model.getNodeStyle();
    // 원통형 상단 타원
    const ellipseAAttrs = {
      ...style,
      cx: x,
      cy: y - (1 / 3) * height,
      rx: (1 / 2) * width,
      ry: (1 / 6) * height,
      width,
      height,
    };
    // 실린더 왼쪽 직선
    const pathAAttrs = {
      ...style,
      d: `M ${x - (1 / 2) * width} ${y - (1 / 3) * height} L ${x - (1 / 2) * width} ${y + (1 / 3) * height}`,
    };
    // 원통형 오른쪽 직선
    const pathBAttrs = {
      ...style,
      d: `M ${x + (1 / 2) * width} ${y - (1 / 3) * height} L ${x + (1 / 2) * width} ${y + (1 / 3) * height}`,
    };
    // 원통형 타원
    const ellipseBAttrs = {
      ...style,
      cx: x,
      cy: y + (1 / 3) * height,
      rx: (1 / 2) * width,
      ry: (1 / 6) * height,
      width,
      height,
    };
    // 실린더 중앙 채우기 섹션
    const rectAttrs = {
      ...style,
      x: x - (1 / 2) * width,
      y: y - (1 / 3) * height,
      width,
      height: (2 / 3) * height,
      stroke: 'transparent',
    };
    return h('g', {}, [
      h('ellipse', {
        ...ellipseBAttrs,
      }),
      h('rect', {
        ...rectAttrs,
      }),
      h('path', {
        ...pathAAttrs,
      }),
      h('path', {
        ...pathBAttrs,
      }),
      h('ellipse', {
        ...ellipseAAttrs,
      }),
    ]);
  }
}

export default {
  type: 'cylinde',
  model: CylindeModel,
  view: CylindeView,
};
