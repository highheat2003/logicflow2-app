import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// 파선(직선 선분으로 구성된 연속 도형)
class Model extends PolylineEdgeModel {
  constructor(data, graphModel) {
    super(data, graphModel);
    this.strokeWidth = 1;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    return getTextStyleFunction(style, this.properties);
  }

  getEdgeStyle() {
    const attributes = super.getEdgeStyle();
    const properties = this.properties;
    const style = getShapeStyleFuction(attributes, properties);
    return { ...style, fill: 'none' };
  }
}
export default {
  type: 'pro-polyline',
  view: PolylineEdge,
  model: Model,
};
