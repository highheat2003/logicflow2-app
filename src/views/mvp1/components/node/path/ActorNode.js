import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// 캐릭터
class ActorModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 40;
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

class ActorView extends RectResize.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const style = this.props.model.getNodeStyle();
    // 머리가 둥근 그림
    const ellipseAttrs = {
      ...style,
      cx: x,
      cy: y - (3 / 8) * height,
      rx: (1 / 4) * width,
      ry: (1 / 8) * height,
      width,
      height,
    };
    // 캐릭터 어깨 수평선
    const pathAAttrs = {
      ...style,
      d: `M ${x - (1 / 2) * width} ${y - (1 / 8) * height} L ${x + (1 / 2) * width} ${y - (1 / 8) * height}`,
    };
    // 캐릭터 몸통의 세로선
    const pathBAttrs = {
      ...style,
      d: `M ${x} ${y - (1 / 4) * height} L ${x} ${y + (1 / 5) * height}`,
    };
    // 캐릭터의 왼쪽 다리 슬래시
    const pathCAttrs = {
      ...style,
      d: `M ${x} ${y + (1 / 5) * height} L ${x - (1 / 2) * width} ${y + (1 / 2) * height}`,
    };
    // 그림의 오른쪽 다리 슬래시
    const pathDAttrs = {
      ...style,
      d: `M ${x} ${y + (1 / 5) * height} L ${x + (1 / 2) * width} ${y + (1 / 2) * height}`,
    };
    // 문자 투명 배경
    const bgAttrs = {
      x: x - (1 / 5) * width,
      y: y - (1 / 2) * height,
      width: (2 / 5) * width,
      height,
      style: 'fill: transparent',
    };
    return h('g', {}, [
      h('ellipse', {
        ...ellipseAttrs,
      }),
      h('path', {
        ...pathAAttrs,
      }),
      h('path', {
        ...pathBAttrs,
      }),
      h('path', {
        ...pathCAttrs,
      }),
      h('path', {
        ...pathDAttrs,
      }),
      h('rect', {
        ...bgAttrs,
      }),
    ]);
  }
}

export default {
  type: 'actor',
  view: ActorView,
  model: ActorModel,
};
