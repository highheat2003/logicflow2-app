import * as util from '@/support/util';
import Konva from 'konva';

class KonvaHelper {
  static _instance;
  static _stage;
  static _selectedShapeName;
  static _scale;

  constructor() {
    if (this._instance) return this._instance;
    this._instance = this;
    this._scale = 1;
  }

  /**
   * stage를 초기화
   *
   * @param {object} config - 설정정보
   * @param {object} data - 화면에 표시될 데이터
   * @param {function} callback - 데이터가 존재시 이를 처리하는 함수를 호출
   */
  init(config, data, callback) {
    if (util.isEmpty(config.container)) throw new Error('Konva config에 container정보가 없습니다.');

    if (data) {
      this._stage = Konva.Node.create(data, config.container);
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      this._stage = Konva.Stage(config);
    }
  }

  getStage() {
    return this._stage;
  }

  getLayers() {
    return this._stage.find((node) => node.getType() === 'Layer');
  }

  getData() {
    return this._stage.toJSON();
  }

  getSelectedNode(name) {
    return this._stage.findOne('.' + name);
  }

  /**
   * 해당노드가 Image인 경우 image를 변경
   *
   */
  changeNodeImage(node, image) {
    if (node.getClassName() === 'Image' && !util.isEmpty(node.attrs.deviceType)) {
      node.image(image);
      node.getLayer().batchDraw();
    }
  }

  /**
   * 현재 활성화된 layer
   *
   */
  getLayer() {
    return this._stage.findOne((node) => node.getType() === 'Layer' && node.visible());
  }

  /**
   * 현재 활성화된 layer의 transformer
   *
   */
  getTransformer() {
    return this.getLayer().findOne((node) => node.getClassName() === 'Transformer');
  }

  /**
   * 현재 활성화된 layer의 배경image
   *
   */
  getLayerImage() {
    return this.getLayer().findOne((node) => node.getClassName() === 'Image' && !util.isEmpty(e.target.attrs.src));
  }

  zoomPlus() {
    this._scale = this._scale + 0.1;
    if (this._scale >= 3.0) return;
    this._stage.scale({ x: this._scale, y: this._scale });
  }

  zoomMinus() {
    this._scale = this._scale - 0.1;
    if (this._scale <= 0.1) return;
    this._stage.scale({ x: this._scale, y: this._scale });
  }

  /**
   * 읽기전용으로 설정 : true
   *
   */
  setReadOnly(flag) {
    this._stage.draggable(!flag);
    this.getLayers().forEach((layer) => {
      layer.getChildren().forEach((node) => {
        if (node.getClassName() === 'Transformer')
          node.nodes([]); // 선택된 transfomer제거
        else node.draggable(!flag);
      });
    });
  }
}

export { KonvaHelper };
