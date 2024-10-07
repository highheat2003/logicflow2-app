<script setup>
import { ref, onMounted, watch } from 'vue';
import Konva from 'konva';
import data from './data';
import * as util from '@/support/util';
import { IdUtil } from '@/support/IdUtil';

const width = window.innerWidth;
const height = window.innerHeight;

let stage = null; // stage객체 참조용
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

watch(plan, (newVal) => {
  console.log('plan watch===>', newVal);
  const layers = stage.find((node) => node.getType() === 'Layer');
  if (newVal === '0') {
    layers[0].show();
    layers[1].hide();
  } else if (newVal === '1') {
    layers[0].hide();
    layers[1].show();
  }
});

watch(addDeviceType, (newVal) => {
  const btnAdd = document.querySelectorAll('.btnAdd');
  console.log(btnAdd);
  btnAdd.forEach((el) => {
    el.style.backgroundColor = '';
    el.style.color = 'black';
  });
  const btn = document.querySelector(`#btn${newVal}`);
  if (btn === null) return;
  console.log('addDeviceType===>', newVal, btn);
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

  stage = Konva.Node.create(data, 'container');
  stage.setAttr('draggable', false);
  const layers = stage.find((node) => node.getType() === 'Layer');
  console.log('layers===>', layers, stage);
  // layer별 배경이미지 로딩
  layers.forEach(async (el, index) => {
    console.log(`layer[${index}]`, el.children.length);
    el.children.forEach(async (el2, index2) => {
      console.log(
        `layer[${index}]`,
        el2.attrs.src,
        el2.attrs.deviceType,
        el2.className === 'Image',
        el2.getClassName()
      );
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
      }
    });
  });

  const container = stage.container();
  container.tabIndex = 1;
  container.focus();
  container.addEventListener('keydown', function (e) {
    console.log('keydown', e, !!selectedShapeName.value);
    if (!!selectedShapeName.value && e.keyCode === 46) {
      // Delete
      // shape delete
      const selectedNode = stage.findOne('.' + selectedShapeName.value);
      const layer = getLayer();
      const transformer = getTransformer();
      selectedNode.destroy();
      transformer.nodes([]);
      layer.batchDraw();
    } else {
      return;
    }
    e.preventDefault();
  });

  window.addEventListener('click', () => {
    // hide menu
    menuNode.style.display = 'none';
  });

  layers[0].show();
  layers[1].hide();
  stage.on('mousedown', handleStageMouseDown);
  stage.on('contextmenu', (e) => {
    e.evt.preventDefault();
    console.log('contextmenu===>', e.target);
    if (e.target === stage || util.isEmpty(e.target.attrs.deviceType)) {
      return;
    }
    //currentShape = e.target;
    // show menu
    menuNode.style.display = 'initial';
    const containerRect = stage.container().getBoundingClientRect();
    menuNode.style.top = containerRect.top + stage.getPointerPosition().y + 4 + 'px';
    menuNode.style.left = containerRect.left + stage.getPointerPosition().x + 4 + 'px';
  });
});

function getLayer() {
  const layers = stage.find((node) => node.getType() === 'Layer');
  return plan.value === '1' ? layers[1] : layers[0];
}

function getTransformer() {
  const layers = stage.find((node) => node.getType() === 'Layer');
  const layer = plan.value === '1' ? layers[1] : layers[0];
  const nodes = layer.find((node) => node.getClassName() === 'Transformer');
  return nodes.length === 0 ? null : nodes[0];
}

function getSelectedNode() {
  return stage.findOne('.' + selectedShapeName.value);
}

function saveData() {
  console.log('layer===>', getLayer());
  console.log('saveData ===>', stage.toJSON());
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
    console.log('handleStageMouseDown===>step1', deviceTypeImg[addDeviceType.value]);
    // 마우스 클릭한 위치로 초기위치 지정
    const pointerPos = e.target.getStage().getPointerPosition();
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
    //image.filters([colorizeFilter]);
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

function isConnectedChange() {
  if (util.isEmpty(selectedShapeName.value)) return;
  const layer = getLayer();
  const nodes = layer.find(
    (node) =>
      node.getClassName() === 'Image' &&
      !util.isEmpty(node.attrs.deviceType) &&
      selectedShapeName.value === util.nvl(node.attrs.name, '')
  );
  if (nodes.length > 0) {
    nodes[0].attrs.isCconnected = !util.nvl(nodes[0].attrs.isCconnected, false);
    const isConnected = nodes[0].attrs.isCconnected ? '_ON' : '_OFF';
    nodes[0].image(deviceTypeImg[nodes[0].attrs.deviceType + isConnected]);
    layer.batchDraw();
  }
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
</script>
<template>
  <div style="margin-top: 10px">
    v4 (데이터 로딩)
    <el-button @click="saveData">데이터</el-button>
    <el-button @click="zoomPlus">Zoom(+)</el-button>
    <el-button @click="zoomMinus">Zoom(-)</el-button>
    <el-select v-model="plan" style="width: 140px; margin-left: 15px; margin-right: 15px">
      <el-option label="1층" value="0" />
      <el-option label="2층" value="1" />
    </el-select>
    디바이스 :
    <el-button class="btnAdd" id="btnSMART_PLUG" @click="selectedAddDevice('SMART_PLUG')">스마트플러그</el-button>
    <el-button class="btnAdd" id="btnPDU" @click="selectedAddDevice('PDU')">Pdu</el-button>
    <el-button class="btnAdd" id="btnPROJECTOR" @click="selectedAddDevice('PROJECTOR')">프로젝터</el-button>
    <el-button class="btnAdd" id="btnPC_AGENT" @click="selectedAddDevice('PC_AGENT')">PC Agent</el-button>
  </div>
  <br />
  <div id="container" style="width: 1200px; height: 700px"></div>
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
