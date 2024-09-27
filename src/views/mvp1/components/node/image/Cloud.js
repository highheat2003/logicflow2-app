import ImageNode from './ImageNode';

// 클라우드 형태의 이미지 노드
class CloudNode extends ImageNode.view {
  getImageHref() {
    return 'https://dpubstatic.udache.com/static/dpubimg/0oqFX1nvbD/cloud.png';
  }
}

export default {
  type: 'image-cloud',
  view: CloudNode,
  model: ImageNode.model,
};
