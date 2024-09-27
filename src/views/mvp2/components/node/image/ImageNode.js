import { h } from '@logicflow/core';
import RectNode from '../basic/RectNode';

// 사진-베이스 노드
class ImageModel extends RectNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 80;
    this.height = 60;
  }
}

class ImageNode extends RectNode.view {
  getImageHref() {
    return;
  }
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const href = this.getImageHref();
    const attrs = {
      x: x - (1 / 2) * width,
      y: y - (1 / 2) * height,
      width,
      height,
      href,
      // 폭과 높이에 따른 크기 조정
      preserveAspectRatio: 'none meet',
    };
    return h('g', {}, [h('image', { ...attrs })]);
  }
}

export default {
  type: 'image-node',
  view: ImageNode,
  model: ImageModel,
};
