import Konva from 'konva';

export default class SelectionTool {
  static #instance = null;
  static #selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
    listening: false /* disable events to not interrupt with events*/,
  });
  static #x1 = 0;
  static #y1 = 0;
  static #x2 = 0;
  static #y2 = 0;
  static #selecting = false;

  constructor() {
    if (SelectionTool.#instance) {
      throw new Error('Use SelectionTool.getInstance() to create an instance.');
    }
    SelectionTool.#instance = this;
  }

  static getInstance() {
    if (!SelectionTool.#instance) {
      SelectionTool.#instance = new SelectionTool();
    }
    return SelectionTool.#instance;
  }

  get selectionRectangle() {
    return SelectionTool.#selectionRectangle;
  }

  get x1() {
    return SelectionTool.#x1;
  }

  set x1(data) {
    SelectionTool.#x1 = data;
  }

  get x2() {
    return SelectionTool.#x2;
  }

  set x2(data) {
    SelectionTool.#x2 = data;
  }

  get y1() {
    return SelectionTool.#y1;
  }

  set y1(data) {
    SelectionTool.#y1 = data;
  }

  get y2() {
    return SelectionTool.#y2;
  }

  set y2(data) {
    SelectionTool.#y2 = data;
  }

  get selecting() {
    return SelectionTool.#selecting;
  }

  set selecting(data) {
    SelectionTool.#selecting = data;
  }

  setPosition(x1, y1, x2, y2) {
    SelectionTool.#x1 = x1;
    SelectionTool.#y1 = y1;
    SelectionTool.#x2 = x2;
    SelectionTool.#y2 = y2;
  }
}
