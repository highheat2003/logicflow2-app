import Konva from 'konva';

export default class SelectionTool {
  static #_instance = null;
  static #_selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
    listening: false /* disable events to not interrupt with events*/,
  });
  static #_x1 = 0;
  static #_y1 = 0;
  static #_x2 = 0;
  static #_y2 = 0;
  static #_selecting = false;

  constructor() {
    if (SelectionTool.#_instance) {
      throw new Error('Use SelectionTool.getInstance() to create an instance.');
    }
    SelectionTool.#_instance = this;
  }

  static getInstance() {
    if (!SelectionTool.#_instance) {
      SelectionTool.#_instance = new SelectionTool();
    }
    return SelectionTool.#_instance;
  }

  get selectionRectangle() {
    return SelectionTool.#_selectionRectangle;
  }

  get x1() {
    return SelectionTool.#_x1;
  }

  set x1(data) {
    SelectionTool.#_x1 = data;
  }

  get x2() {
    return SelectionTool.#_x2;
  }

  set x2(data) {
    SelectionTool.#_x2 = data;
  }

  get y1() {
    return SelectionTool.#_y1;
  }

  set y1(data) {
    SelectionTool.#_y1 = data;
  }

  get y2() {
    return SelectionTool.#_y2;
  }

  set y2(data) {
    SelectionTool.#_y2 = data;
  }

  get selecting() {
    return SelectionTool.#_selecting;
  }

  set selecting(data) {
    SelectionTool.#_selecting = data;
  }

  setPosition(x1, y1, x2, y2) {
    SelectionTool.#_x1 = x1;
    SelectionTool.#_y1 = y1;
    SelectionTool.#_x2 = x2;
    SelectionTool.#_y2 = y2;
  }
}
