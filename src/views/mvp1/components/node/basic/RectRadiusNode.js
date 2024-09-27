import RectNode from './RectNode';

// 모서리가 둥근 직사각형
class RectRadiusModel extends RectNode.model {
  setAttributes() {
    super.setAttributes();
    this.radius = 20;
  }
}
export default {
  type: 'rect-radius',
  view: RectNode.view,
  model: RectRadiusModel,
};
