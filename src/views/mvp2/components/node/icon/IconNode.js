import { h } from '@logicflow/core';
import RectNode from '../basic/RectNode';

// 왼쪽 상단 모서리에 아이콘이 있는 노드
class IconNode extends RectNode.view {
  getImageHref() {
    return;
  }
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const style = this.props.model.getNodeStyle();
    const href = this.getImageHref();
    const iconAttrs = {
      x: x - (1 / 2) * width + 5,
      y: y - (1 / 2) * height + 5, // 아이콘은 왼쪽 상단 모서리에 위치
      width: 25,
      height: 18,
      href,
      // 폭과 높이에 따른 크기 조정
      preserveAspectRatio: 'none meet',
    };
    const rectAttrs = {
      ...style,
      strokeWidth: 1,
      rx: 5,
      ry: 5,
      x: x - (1 / 2) * width,
      y: y - (1 / 2) * height,
      width,
      height,
    };
    return h('g', {}, [h('rect', { ...rectAttrs }), h('image', { ...iconAttrs })]);
  }
}

export default {
  type: 'image-node',
  view: IconNode,
  model: RectNode.model,
};
