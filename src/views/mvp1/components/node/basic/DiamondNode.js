import { DiamondResize } from '@logicflow/extension';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// 마름모꼴
/**
 * 모델은 초기화 값을 제어
 */
class DiamondModel extends DiamondResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 35;
    this.ry = 35;
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

  setToBottom() {
    this.zIndex = 0;
  }
}

export default {
  type: 'pro-diamond',
  view: DiamondResize.view,
  model: DiamondModel,
};
