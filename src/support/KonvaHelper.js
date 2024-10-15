import * as util from '@/support/util';
import Konva from 'konva';
import { IdUtil } from '@/support/IdUtil';

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

  getContainer() {
    return this._stage.container();
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

  clearTransformer() {
    this.getTransformer()?.nodes([]);
  }

  /**
   * 현재 활성화된 layer의 배경image
   *
   */
  getLayerImage() {
    return this.getLayer().findOne((node) => node.getClassName() === 'Image');
  }

  /**
   * Stage, Layer, Device, Shape 구분
   *
   */
  getNodeType(node) {
    if (node?.nodeType === 'Stage') {
      return 'Stage';
    } else if (node?.nodeType === 'Shape') {
      if (node.attrs?.deviceType) {
        return ['TEXT', 'RECTANGLE', 'CIRCLE'].includes(node.attrs.deviceType) ? node.attrs.deviceType : 'Device';
      } else if (node.parent?.children[0] === node) {
        return 'Layer';
      } else {
        return null;
      }
    } else {
      return null;
    }
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
        else if (this.getNodeType(node) !== 'Layer' /* layer배경 image제외 */) node.draggable(!flag);
      });
    });
  }

  /**
   * 현재 canvas에서 마우스 클릭위치(konva에 node추가시 사용)
   */
  getPointerPosition(adjustX = 0, adjustY = 0) {
    return {
      x: -1 * this._stage.getAttr('x') + this._stage.getPointerPosition().x + adjustX,
      y: -1 * this._stage.getAttr('y') + this._stage.getPointerPosition().y + adjustY,
    };
  }

  registerWheelEvent() {
    this._stage.on('wheel', (e) => {
      // console.log('wheel event===>', e)
      const scaleBy = 1.01;
      // stop default scrolling
      e.evt.preventDefault();

      const oldScale = this._stage.scaleX();
      const pointer = this._stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - this._stage.x()) / oldScale,
        y: (pointer.y - this._stage.y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? 1 : -1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) {
        direction = -direction;
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      this._stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this._stage.position(newPos);
    });
  }

  getBlankDevice() {
    return {
      rotation: 0,
      x: 150,
      y: 150,
      width: 50,
      height: 50,
      scaleX: 1,
      scaleY: 1,
      fill: 'green',
      name: 'rect2',
      draggable: true,
      deviceType: '',
      deviceId: 0,
      deviceNm: '',
      deviceStatus: '',
      model: '',
      modelNm: '',
      gubun: '',
    };
  }

  copyDevice(node) {
    const deviceType = node?.getAttr('deviceType');
    const gubun = node?.getAttr('gubun');
    console.log('copyDevice===>', deviceType, gubun, node.attrs);
    const deviceName = `${deviceType}_${IdUtil.makeString()}`;
    const attrs = { ...node.attrs, name: deviceName, x: node.attrs.x + 20, y: node.attrs.y + 20 };

    if (deviceType === 'TEXT') {
      const text = new Konva.Text(attrs);
      this.getLayer().add(text);
      this.getLayer().draw();
      const newDevice = JSON.parse(JSON.stringify(this.getBlankDevice()));
      newDevice.name = deviceName;
      return newDevice;
    } else if (deviceType === 'RECTANGLE') {
      const rect = new Konva.Rect(attrs);
      rect.draggable(true);
      this.getLayer().add(rect);
      this.getLayer().draw();
      const newDevice = JSON.parse(JSON.stringify(this.getBlankDevice()));
      newDevice.name = deviceName;
      return newDevice;
    } else if (deviceType === 'CIRCLE') {
      const circle = new Konva.Circle(attrs);
      circle.draggable(true);
      this.getLayer().add(circle);
      this.getLayer().draw();
      const newDevice = JSON.parse(JSON.stringify(this.getBlankDevice()));
      newDevice.name = deviceName;
      return newDevice;
    } else if (!util.isEmpty(deviceType)) {
      const image = new Konva.Image({ ...attrs });
      image.draggable(true);
      this.getLayer().add(image);
      this.getLayer().draw();
      const newDevice = JSON.parse(JSON.stringify(this.getBlankDevice()));
      newDevice.name = deviceName;
      return newDevice;
    }
    return null;
  }

  /**
   * layer상에 존재하는 child node(text, rect, image)
   */
  getChildren() {
    return this.getLayer().children.filter(
      (el) =>
        ['Rect', 'Text', 'Circle'].includes(el.getClassName()) || (el.getClassName() === 'Image' && el.attrs.deviceType)
    );
  }
}

export { KonvaHelper };
