<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Konva from 'konva';
import data from './data';
import * as util from '@/support/util';
import { IdUtil } from '@/support/IdUtil';
import { KonvaHelper } from '@/support/KonvaHelper';

const konvaHelper = new KonvaHelper();
const width = window.innerWidth;
const height = window.innerHeight;
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
const isReadOnly = ref(false);

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
  console.log('data===>', data);
  menuNode = document.getElementById('menu');

  // 디바이스 이미지 로딩
  const deviceTypeImgData = await util.loadImages(deviceTypeSvg);
  deviceTypeImg = { ...deviceTypeImgData };

  //stage = Konva.Node.create(data, 'container')
  konvaHelper.init({ container: 'container' }, data, initStage);

  window.addEventListener('click', handleWindowClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick);
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
      } else if (el2.getClassName() === 'Image' && el2.attrs.deviceType) {
        // 디바이스 이미지
        el2.image(deviceTypeImg[el2.attrs.deviceType]);
        const newDevice = JSON.parse(JSON.stringify(blankDevice));
        newDevice.name = el2.attrs.name;
        rectangles.value.push(newDevice); // transformer적용을 위해서
        el2.on('mouseover', handleNodeMouseOver);
      }
    });
    index === 0 ? layer.show() : layer.hide(); // 초기 layer지정
  });

  konvaHelper.getStage().on('mousedown', handleStageMouseDown);
  konvaHelper.getStage().on('contextmenu', handleStageContextMenu);
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
  const layer = getLayer();

  // add device
  if (!!addDeviceType.value) {
    console.log('handleStageMouseDown===>step1', addDeviceType.value, deviceTypeImg[addDeviceType.value]);
    // 마우스 클릭한 위치로 초기위치 지정
    const pointerPos = {
      x: konvaHelper.getStage().getPointerPosition().x - 130,
      y: konvaHelper.getStage().getPointerPosition().y,
    };
    const deviceName = `${addDeviceType.value}_${IdUtil.makeString()}`;

    const image = new Konva.Image({
      image: deviceTypeImg[addDeviceType.value + '_OFF'],
      x: pointerPos.x,
      y: pointerPos.y,
      width: 50,
      height: 50,
      name: deviceName,
      deviceType: addDeviceType.value,
    });
    image.draggable(true);
    image.on('mouseover', handleNodeMouseOver);
    layer.add(image);
    layer.draw();

    const newDevice = JSON.parse(JSON.stringify(blankDevice));
    newDevice.name = deviceName;
    rectangles.value.push(newDevice);

    selectedShapeName.value = deviceName;
    updateTransformer();
    addDeviceType.value = '';
    return;
  }

  // clicked on stage - clear selection
  if (e.target === e.target.getStage()) {
    console.log('handleStageMouseDown===>step2');
    selectedShapeName.value = '';
    updateTransformer();
    return;
  }

  // clicked on transformer - do nothing
  const clickedOnTransformer = e.target.getParent().className === 'Transformer';
  if (clickedOnTransformer) {
    console.log('handleStageMouseDown===>step3');
    return;
  }

  console.log('handleStageMouseDown===>step4');
  // find clicked rect by its name
  const name = e.target.name();
  const rect = rectangles.value.find((r) => r.name === name);
  if (rect) {
    selectedShapeName.value = name;
  } else {
    selectedShapeName.value = '';
  }
  updateTransformer();
}

/**
 * shape의 transformer상태 update
 */
function updateTransformer() {
  if (isReadOnly.value) return;
  const transformerNode = getTransformer();
  const stage = transformerNode.getStage();

  const selectedNode = stage.findOne('.' + selectedShapeName.value);
  // do nothing if selected node is already attached
  if (selectedNode === transformerNode.node()) {
    return;
  }

  if (selectedNode) {
    // attach to another node
    transformerNode.nodes([selectedNode]);
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

function deviceDelete() {
  const selectedNode = getSelectedNode();
  const layer = getLayer();
  const transformer = getTransformer();
  console.log('device delete===>', getSelectedNode());
  selectedNode.destroy();
  transformer.nodes([]);
  layer.batchDraw();
}

function handleStageContextMenu(e) {
  e.evt.preventDefault();
  console.log('contextmenu===>', e.target);
  if (e.target === konvaHelper.getStage() || util.isEmpty(e.target.attrs.deviceType) || isReadOnly.value) {
    return;
  }
  // show menu
  menuNode.style.display = 'initial';
  const containerRect = konvaHelper.getStage().container().getBoundingClientRect();
  menuNode.style.top = containerRect.top + konvaHelper.getStage().getPointerPosition().y + 4 + 'px';
  menuNode.style.left = containerRect.left + konvaHelper.getStage().getPointerPosition().x + 4 + 'px';
}

function readOnlyChange() {
  isReadOnly.value = !isReadOnly.value;
  konvaHelper.setReadOnly(isReadOnly.value);
}

function handleNodeMouseOver(e) {
  console.log('mouseOver===>', e.target);
}
</script>
<template>
  <div style="margin-top: 10px">
    v5 (공통모듈:KonvaHelper)
    <el-button @click="saveData">데이터</el-button>
    <el-button @click="zoomPlus">Zoom(+)</el-button>
    <el-button @click="zoomMinus">Zoom(-)</el-button>
    <el-select v-model="plan" style="width: 140px; margin-left: 15px; margin-right: 15px">
      <el-option label="1층" value="0" />
      <el-option label="2층" value="1" />
    </el-select>
    <el-button @click="readOnlyChange">ReadOnly change : {{ isReadOnly }}</el-button>
    디바이스 :
    <el-button class="btnAdd" id="btnSMART_PLUG" @click="selectedAddDevice('SMART_PLUG')">스마트플러그</el-button>
    <el-button class="btnAdd" id="btnPDU" @click="selectedAddDevice('PDU')">Pdu</el-button>
    <el-button class="btnAdd" id="btnPROJECTOR" @click="selectedAddDevice('PROJECTOR')">프로젝터</el-button>
    <el-button class="btnAdd" id="btnPC_AGENT" @click="selectedAddDevice('PC_AGENT')">PC Agent</el-button>
  </div>
  <br />
  <div id="container" style="width: 1000px; height: 800px"></div>
  <div id="menu">
    <div>
      <button id="delete-button" @click="deviceDelete">삭제</button>
    </div>
  </div>
</template>
<style scoped>
#menu {
  display: none;
  position: absolute;
  width: 60px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}
#menu button {
  width: 100%;
  background-color: white;
  border: none;
  margin: 0;
  padding: 10px;
}
#menu button:hover {
  background-color: lightgray;
}
</style>
