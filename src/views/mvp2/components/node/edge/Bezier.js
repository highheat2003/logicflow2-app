import { BezierEdge, BezierEdgeModel } from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// bezier 곡선
class Model extends BezierEdgeModel {
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
  type: 'pro-bezier',
  view: BezierEdge,
  model: Model,
};
