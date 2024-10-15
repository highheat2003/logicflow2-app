<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import Konva from 'konva';
import data from './data';
import * as util from '@/support/util';
import { IdUtil } from '@/support/IdUtil';
import { KonvaHelper } from '@/support/KonvaHelper';
import PropertyDialog from './PropertyDialog.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import useKonvaEdit from './useKonvaEdit';
import SelectionTool from './SelectionTool';

const konvaHelper = new KonvaHelper();
const width = window.innerWidth;
const height = window.innerHeight;
const propertyVisible = ref(false);
const targetNode = ref(null);
const targetType = computed(() => {
  return konvaHelper.getNodeType(targetNode.value);
});
const scale = ref(1);
const plan = ref('0');
const rectangles = ref([]);
const blankDevice = {
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
};

const selectedShapeName = ref('');
const addDeviceType = ref('');
const deviceTypeSvg = {
  SMART_PLUG: '/smartplug_off.svg',
  PDU: '/pdu_off.svg',
  PROJECTOR: '/projector_off.svg',
  PC_AGENT: '/pc_agent_off.svg',
};
let deviceTypeImg = {
  SMART_PLUG: null,
  PDU: null,
  PROJECTOR: null,
  PC_AGENT: null,
};
let menuNode; // context menu
const copyButton = ref(false);
const topButton = ref(false);
const upButton = ref(false);
const downButton = ref(false);
const bottomButton = ref(false);
const deleteButton = ref(false);
const { isReadOnly } = useKonvaEdit(konvaHelper);
const selectionTool = SelectionTool.getInstance();

watch(plan, (newVal) => {
  const layers = konvaHelper.getLayers();
  layers.forEach((layer, index) => {
    String(index) === newVal ? layer.show() : layer.hide();
  });
});

watch(addDeviceType, (newVal) => {
  const btnAdd = document.querySelectorAll('.btnAdd');
  btnAdd.forEach((el) => {
    el.style.backgroundColor = '';
    el.style.color = 'black';
  });
  const btn = document.querySelector(`#btn${newVal}`);
  if (btn === null) return;
  btn.style.backgroundColor = 'red';
  btn.style.color = 'white';
});

onMounted(async () => {
  console.log('windows size : ', width, height);
  console.log('data===>', data, selectionTool);
  menuNode = document.getElementById('menu');

  // 디바이스 이미지 로딩
  const deviceTypeImgData = await util.loadImages(deviceTypeSvg);
  deviceTypeImg = { ...deviceTypeImgData };

  //stage = Konva.Node.create(data, 'container')
  konvaHelper.init({ container: 'container' }, data, initStage);

  //console.log('container===>', konvaHelper.getContainer());
  konvaHelper.getContainer().tabIndex = 1;
  konvaHelper.getContainer().focus();
  konvaHelper.getContainer().addEventListener('click', handleWindowClick);
  konvaHelper.getContainer().addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  konvaHelper.getContainer().removeEventListener('click', handleWindowClick);
  konvaHelper.getContainer().removeEventListener('keydown', handleKeyDown);
});

function handleWindowClick() {
  // hide menu
  menuNode.style.display = 'none';
}

function initStage() {
  const layers = konvaHelper.getLayers();
  // layer별 배경이미지 로딩
  layers.forEach(async (layer, index) => {
    layer.children.forEach(async (el2, index2) => {
      if (el2.getClassName() === 'Image' && el2.attrs.src) {
        // layer의 배경이미지
        const image = await util.loadImage(el2.attrs.src);
        el2.image(image);
        // layer의 배경이미지를 선택해서 drag
        el2.on('dragstart', (e) => {
          e.cancelBubble = true;
        });
        el2.draggable(false);
        el2.setAttr('isLayerSelected', false);
        const newDevice = konvaHelper.getBlankDevice();
        newDevice.name = 'Layer';
        rectangles.value.push(newDevice);
      } else if (el2.getClassName() === 'Image' && el2.attrs.deviceType) {
        // 디바이스 이미지
        el2.image(deviceTypeImg[el2.attrs.deviceType]);
        const newDevice = konvaHelper.getBlankDevice();
        newDevice.name = el2.attrs.name;
        rectangles.value.push(newDevice); // transformer적용을 위해서
      }
    });
    index === 0 ? layer.show() : layer.hide(); // 초기 layer지정
  });

  konvaHelper.getLayer().add(selectionTool.selectionRectangle);
  konvaHelper.getStage().on('mousedown', handleStageMouseDown);
  konvaHelper.getStage().on('contextmenu', handleStageContextMenu);
  konvaHelper.getStage().on('mousemove', handleStageMouseMove);
  konvaHelper.getStage().on('mouseup', handleStageMouseUp);
  konvaHelper.registerWheelEvent();
  konvaHelper.getStage().setAttr('draggable', false);
}

function getLayer() {
  const layers = konvaHelper.getLayers();
  return plan.value === '1' ? layers[1] : layers[0];
}

function getTransformer() {
  const layers = konvaHelper.getLayers();
  const layer = plan.value === '1' ? layers[1] : layers[0];
  return layer.findOne((node) => node.getClassName() === 'Transformer');
}

function getSelectedNode() {
  return konvaHelper.getSelectedNode(selectedShapeName.value);
}

function saveData() {
  console.log('saveData ===>', konvaHelper.getData());
}

function zoomPlus() {
  scale.value = scale.value + 0.1;
  if (scale.value >= 3.0) return;
  stage.scale({ x: scale.value, y: scale.value });
}

function zoomMinus() {
  scale.value = scale.value - 0.1;
  if (scale.value <= 0.1) return;
  stage.scale({ x: scale.value, y: scale.value });
}

/**
 * 해당 shape의 state update
 */

function handleStageMouseDown(e) {
  console.log('handleStageMouseDown===>', e, e.target.name());

  // add shape(device, text, rectangle)
  if (!!addDeviceType.value && addDeviceType.value === 'TEXT') {
    addText(e);
    return;
  } else if (!!addDeviceType.value && addDeviceType.value === 'RECTANGLE') {
    addRectangle(e);
    return;
  } else if (!!addDeviceType.value && addDeviceType.value === 'CIRCLE') {
    addCircle(e);
    return;
  } else if (!!addDeviceType.value && !['TEXT', 'RECTANGLE', 'CIRCLE'].includes(addDeviceType.value)) {
    addDevice(e);
    return;
  }

  // clicked on stage - clear selection
  if (e.target === e.target.getStage()) {
    console.log('handleStageMouseDown===>step2');
    selectedShapeName.value = '';
    updateTransformer(e);
    return;
  }

  // clicked on transformer - do nothing
  const clickedOnTransformer = e.target.getParent().className === 'Transformer';
  if (clickedOnTransformer) {
    console.log('handleStageMouseDown===>step3 : clicked on transformer');
    return;
  }

  // find clicked rect by its name
  const nodeType = konvaHelper.getNodeType(e.target);
  const name = nodeType === 'Layer' ? nodeType : e.target.name();
  const rect = rectangles.value.find((r) => r.name === name);
  if (rect) {
    if (nodeType === 'Layer' && !e.target.getAttr('isLayerSelected')) {
      e.evt.preventDefault();
      selectedShapeName.value = name;
      const pointerPos = konvaHelper.getPointerPosition();
      selectionTool.setPosition(pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y);
      selectionTool.selectionRectangle.width(0);
      selectionTool.selectionRectangle.height(0);
      selectionTool.selecting = true;

      console.log('handleStageMouseDown===>step5', pointerPos);
    } else {
      selectedShapeName.value = name;
    }
  } else {
    selectedShapeName.value = '';
  }
  console.log('handleStageMouseDown===>step4', nodeType, name, selectedShapeName.value);
  updateTransformer(e);
}

function handleStageMouseMove(e) {
  // 선택을 시작하지 않으면 아무것도 하지 않음.
  if (!selectionTool.selecting) {
    return;
  }
  e.evt.preventDefault();
  const pointerPos = konvaHelper.getPointerPosition();
  selectionTool.x2 = pointerPos.x;
  selectionTool.y2 = pointerPos.y;
  // console.log('mousemove', x2, y2)
  selectionTool.selectionRectangle.setAttrs({
    visible: true,
    x: Math.min(selectionTool.x1, selectionTool.x2),
    y: Math.min(selectionTool.y1, selectionTool.y2),
    width: Math.abs(selectionTool.x2 - selectionTool.x1),
    height: Math.abs(selectionTool.y2 - selectionTool.y1),
  });
}

function handleStageMouseUp(e) {
  // 선택을 시작하지 않으면 아무것도 하지 않음.
  selectionTool.selecting = false;
  if (!selectionTool.selectionRectangle.visible()) {
    return;
  }
  e.evt.preventDefault();
  // 타임아웃 시 가시성을 업데이트하여 클릭 이벤트에서 확인.
  selectionTool.selectionRectangle.visible(false);
  const shapes = konvaHelper.getChildren();
  const box = selectionTool.selectionRectangle.getClientRect();
  const selected = shapes.filter(
    (shape) => Konva.Util.haveIntersection(box, shape.getClientRect()) && util.nvl(shape.attrs.visible, true)
  );
  console.log('mouse-moveup', shapes, selected);
  konvaHelper.getTransformer().nodes(selected);
}

/**
 * shape의 transformer상태 update
 */
function updateTransformer(e) {
  if (isReadOnly.value) return;
  const transformerNode = getTransformer();
  const stage = transformerNode.getStage();

  if (selectedShapeName.value === 'Layer') {
    if (e.target.getAttr('isLayerSelected')) {
      konvaHelper.getLayerImage().draggable(true);
    } else {
      konvaHelper.clearTransformer();
      konvaHelper.getLayerImage().draggable(false);
      return;
    }
  }

  const selectedNode =
    selectedShapeName.value === 'Layer' ? konvaHelper.getLayerImage() : stage.findOne('.' + selectedShapeName.value);
  const isMember = transformerNode.nodes().indexOf(selectedNode) >= 0; // 다중선택된 요소인지
  // do nothing if selected node is already attached
  if (selectedNode === transformerNode.node()) {
    return;
  }

  if (selectedNode) {
    if (selectedShapeName.value === 'Layer') {
      transformerNode.nodes([selectedNode]);
    } else {
      if (isMember) return;
      transformerNode.nodes([selectedNode]);
    }
  } else {
    // remove transformer
    transformerNode.nodes([]);
  }
}

/**
 * 추가할 디바이스 선택
 */
function selectedAddDevice(arg) {
  addDeviceType.value = arg;
}

function handleCommand(command) {
  selectedAddDevice(command);
}

function addDevice(e) {
  const layer = getLayer();
  // 마우스 클릭한 위치로 초기위치 지정
  const pointerPos = konvaHelper.getPointerPosition(0, 0);
  console.log('handleStageMouseDown(add device)===>', addDeviceType.value, deviceTypeImg[addDeviceType.value]);
  const deviceName = `${addDeviceType.value}_${IdUtil.makeString()}`;

  const image = new Konva.Image({
    image: deviceTypeImg[addDeviceType.value],
    x: pointerPos.x,
    y: pointerPos.y,
    width: 50,
    height: (50 * deviceTypeImg[addDeviceType.value].height) / deviceTypeImg[addDeviceType.value].width,
    name: deviceName,
    deviceType: addDeviceType.value,
  });
  image.draggable(true);
  layer.add(image);
  layer.draw();

  const newDevice = JSON.parse(JSON.stringify(blankDevice));
  newDevice.name = deviceName;
  rectangles.value.push(newDevice);

  selectedShapeName.value = deviceName;
  updateTransformer(e);
  addDeviceType.value = '';
}

function addText(e) {
  const layer = getLayer();
  console.log('handleStageMouseDown(add text)===>', addDeviceType.value);
  // 마우스 클릭한 위치로 초기위치 지정
  const pointerPos = konvaHelper.getPointerPosition();
  const deviceName = `${addDeviceType.value}_${IdUtil.makeString()}`;

  const text = new Konva.Text({
    x: pointerPos.x,
    y: pointerPos.y,
    fontSize: 15,
    text: deviceName,
    fill: '#000000',
    draggable: true,
    name: deviceName,
    deviceType: addDeviceType.value,
  });

  layer.add(text);
  layer.draw();

  const newDevice = JSON.parse(JSON.stringify(blankDevice));
  newDevice.name = deviceName;
  rectangles.value.push(newDevice);

  selectedShapeName.value = deviceName;
  updateTransformer(e);
  addDeviceType.value = '';
}

function addRectangle(e) {
  const layer = getLayer();
  const pointerPos = konvaHelper.getPointerPosition();
  const deviceName = `${addDeviceType.value}_${IdUtil.makeString()}`;

  const rect = new Konva.Rect({
    x: pointerPos.x,
    y: pointerPos.y,
    width: 100, // 너비
    height: 100, // 높이
    stroke: '#0000ff', // 테두리 색상
    strokeWidth: 2, // 테두리 두께
    cornerRadius: 5,
    shadowBlur: 0,
    deviceType: addDeviceType.value,
    name: deviceName,
    // fill 속성을 설정하지 않거나 투명하게 설정
    fill: '#0000ff',
  });

  rect.draggable(true);
  layer.add(rect);
  layer.draw();

  const newDevice = JSON.parse(JSON.stringify(blankDevice));
  newDevice.name = deviceName;
  rectangles.value.push(newDevice);

  selectedShapeName.value = deviceName;
  updateTransformer(e);
  addDeviceType.value = '';
}

function addCircle(e) {
  const layer = getLayer();
  const pointerPos = konvaHelper.getPointerPosition();
  const deviceName = `${addDeviceType.value}_${IdUtil.makeString()}`;

  const circle = new Konva.Circle({
    x: pointerPos.x,
    y: pointerPos.y,
    radius: 25,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    deviceType: addDeviceType.value,
    name: deviceName,
  });

  circle.draggable(true);
  layer.add(circle);
  layer.draw();

  const newDevice = JSON.parse(JSON.stringify(blankDevice));
  newDevice.name = deviceName;
  rectangles.value.push(newDevice);

  selectedShapeName.value = deviceName;
  updateTransformer(e);
  addDeviceType.value = '';
}

function deviceDelete() {
  menuNode.style.display = 'none';
  const selectedNode = getSelectedNode();
  const layer = getLayer();
  const transformer = getTransformer();
  console.log('device delete===>', getSelectedNode());
  selectedNode.destroy();
  transformer.nodes([]);
  layer.batchDraw();
}

function deviceAttrs() {
  menuNode.style.display = 'none';
  propertyVisible.value = true;
}

function deviceCopy() {
  menuNode.style.display = 'none';
  const selectedNode = konvaHelper.getSelectedNode(selectedShapeName.value);
  if (util.isEmpty(selectedNode)) {
    console.log('경고', '복사할 디바이스를 선택해주세요');
    return;
  }
  const newDevice = konvaHelper.copyDevice(selectedNode);
  if (newDevice === null) {
    console.log('경고', '해당 디바이스의 복사를 지원하지 않습니다');
    return;
  }
  rectangles.value.push(newDevice);
  selectedShapeName.value = newDevice.name;
  updateTransformer(); // 복사된 디바이스 선택
}

function zIndexTop() {
  const selectedNode = konvaHelper.getSelectedNode(selectedShapeName.value);
  selectedNode.moveToTop();
}

function zIndexUp() {
  const selectedNode = konvaHelper.getSelectedNode(selectedShapeName.value);
  selectedNode.moveUp();
}

function zIndexDown() {
  const selectedNode = konvaHelper.getSelectedNode(selectedShapeName.value);
  if (selectedNode.getAbsoluteZIndex() > 2) selectedNode.moveDown();
}

function zIndexBottom() {
  const selectedNode = konvaHelper.getSelectedNode(selectedShapeName.value);
  selectedNode.zIndex(2);
}

function closePropertyDialog() {
  propertyVisible.value = false;
}

function handleStageContextMenu(e) {
  e.evt.preventDefault();
  //const targetType = konvaHelper.getNodeType(e.target);

  if (isReadOnly.value) {
    return;
  }
  // show menu
  menuNode.style.display = 'initial';
  const containerRect = konvaHelper.getStage().container().getBoundingClientRect();
  menuNode.style.top = containerRect.top + konvaHelper.getStage().getPointerPosition().y + 4 + 'px';
  menuNode.style.left = containerRect.left + konvaHelper.getStage().getPointerPosition().x + 4 + 'px';
  targetNode.value = e.target;
  console.log('contextmenu===>', e.target, targetType.value);

  if (['Stage', 'Layer'].includes(targetType.value)) {
    deleteButton.value = false;
    copyButton.value = false;
    topButton.value = false;
    upButton.value = false;
    downButton.value = false;
    bottomButton.value = false;
  } else {
    deleteButton.value = true;
    copyButton.value = true;
    topButton.value = true;
    upButton.value = true;
    downButton.value = true;
    bottomButton.value = true;
  }
}

/**
 * 선택된 node를 keyboard로 이동
 */
function handleKeyDown(e) {
  e?.preventDefault();
  if (util.isEmpty(selectedShapeName.value)) return;
  if (propertyVisible.value) return;
  const moveAmount = 5;
  const transformerNode = konvaHelper?.getTransformer();
  const selectedNodes = transformerNode?.nodes();

  if (util.isEmpty(selectedNodes)) return;

  switch (e.key) {
    case 'ArrowUp':
      selectedNodes.map((e) => e.y(e.y() - moveAmount));
      break;
    case 'ArrowDown':
      selectedNodes.map((e) => e.y(e.y() + moveAmount));
      break;
    case 'ArrowLeft':
      selectedNodes.map((e) => e.x(e.x() - moveAmount));
      break;
    case 'ArrowRight':
      selectedNodes.map((e) => e.x(e.x() + moveAmount));
      break;
  }
  console.log('handleKeyDown', e.key, e.code);
}
</script>
<template>
  <div style="margin-top: 10px">
    v5 (KonvaHelper)
    <el-button @click="saveData">데이터</el-button>
    <el-button @click="zoomPlus">Zoom(+)</el-button>
    <el-button @click="zoomMinus">Zoom(-)</el-button>
    <el-select v-model="plan" style="width: 140px; margin-left: 5px">
      <el-option label="1층" value="0" />
      <el-option label="2층" value="1" />
    </el-select>
    <el-text class="mx-1" style="margin-left: 5px">ReadOnly</el-text>
    <el-switch
      v-model="isReadOnly"
      class="ml-2"
      inline-prompt
      style="margin-left: 5px; --el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      active-text="Y"
      inactive-text="N"
    />
    <el-dropdown style="margin-left: 5px" @command="handleCommand">
      <el-button>
        Shape<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="TEXT">텍스트</el-dropdown-item>
          <el-dropdown-item command="RECTANGLE">사각형</el-dropdown-item>
          <el-dropdown-item command="CIRCLE">원</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown style="margin-left: 5px" @command="handleCommand">
      <el-button>
        Device<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="SMART_PLUG">스마트플러그</el-dropdown-item>
          <el-dropdown-item command="PDU">Pdu</el-dropdown-item>
          <el-dropdown-item command="PROJECTOR">프로젝터</el-dropdown-item>
          <el-dropdown-item command="PC_AGENT">PC Agent</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <br />
  <div id="container" style="width: 1000px; height: 800px"></div>
  <div id="menu">
    <div>
      <button @click="deviceAttrs">속성</button>
      <button v-if="copyButton" @click="deviceCopy">복사</button>
      <button v-if="topButton" @click="zIndexTop">맨 앞으로</button>
      <button v-if="upButton" @click="zIndexUp">앞으로</button>
      <button v-if="downButton" @click="zIndexDown">뒤로</button>
      <button v-if="bottomButton" @click="zIndexBottom">맨 뒤로</button>
      <button v-if="deleteButton" @click="deviceDelete">삭제</button>
    </div>
  </div>
  <!-- 속성 패널 -->
  <el-drawer
    :title="`${targetType} : 속성 설정`"
    v-model="propertyVisible"
    direction="rtl"
    size="500px"
    :before-close="closePropertyDialog"
  >
    <PropertyDialog
      v-if="propertyVisible"
      :targetNode="targetNode"
      :targetType="targetType"
      :konvaHelper="konvaHelper"
      @setPropertiesFinish="closePropertyDialog"
    />
  </el-drawer>
</template>
<style scoped>
#menu {
  display: none;
  position: absolute;
  width: 100px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
  z-index: 99;
}
#menu button {
  width: 100%;
  background-color: white;
  border: none;
  margin: 0;
  padding: 10px;
  text-align: left;
}
#menu button:hover {
  background-color: lightgray;
}
</style>
