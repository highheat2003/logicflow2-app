<script setup>
import { ref, onMounted, computed } from 'vue';
import Konva from 'konva';
import { IdUtil } from '@/support/IdUtil';

const stage = ref(null); // stage객체 참조용
const stageConfig = ref({
  width: 1200,
  height: 750,
  draggable: true,
});
const scale = ref(1);
const bgImg = ref([]);
const list = ref([{ x: 100, y: 100, radius: 50, fill: 'blue' }]);
const plan = ref('0');
const imgUrl = [
  'https://blog.kakaocdn.net/dn/WjTnf/btrKQhJM3Tn/AZXWBm8xomKUuCbwrmakFK/img.jpg' /* size : 923,676 */,
  '/RoomSketcher-House-Floor-Plans-2452430-800.jpg' /* size : 800,460 */,
];
const getImageUrl = computed(() => bgImg.value[plan.value]);
const layer1 = ref(null);
const transformer1 = ref(null);
const rectangles = ref([
  {
    rotation: 0,
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: 'red',
    name: 'rect1',
    draggable: true,
    deviceType: '',
  },
  {
    rotation: 0,
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: 'green',
    name: 'rect2',
    draggable: true,
    deviceType: '',
  },
]);
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
const deviceTypeImg = {
  SMART_PLUG: null,
  PDU: null,
  PROJECTOR: null,
  PC_AGENT: null,
};

onMounted(() => {
  // 층별 배경 이미지 로딩
  imgUrl.forEach((el, index) => {
    const image = new window.Image();
    image.src = imgUrl[index];
    image.onload = () => {
      bgImg.value[index] = image;
    };
  });

  // 디바이스 이미지 로딩
  Object.entries(deviceTypeSvg).forEach(([key, value]) => {
    console.log('@@', value);
    const image = new window.Image();
    image.src = value;
    image.onload = () => {
      deviceTypeImg[key] = image;
    };
  });

  const container = stage.value.getNode().container();
  container.tabIndex = 1;
  container.focus();
  container.addEventListener('keydown', function (e) {
    console.log('keydown', e, !!selectedShapeName.value);
    if (!!selectedShapeName.value && e.keyCode === 46) {
      // Delete
      // shape delete
      const selectedNode = stage.value.getNode().findOne('.' + selectedShapeName.value);
      selectedNode.destroy();
      transformer1.value.getNode().nodes([]);
      layer1.value.getNode().batchDraw();
    } else {
      return;
    }
    e.preventDefault();
  });
});

function saveData() {
  console.log('saveData ===>', stage.value.getStage().toJSON());
}

function zoomPlus() {
  scale.value = scale.value + 0.1;
  if (scale.value >= 3.0) return;
  stage.value.getStage().scale({ x: scale.value, y: scale.value });
}

function zoomMinus() {
  scale.value = scale.value - 0.1;
  if (scale.value <= 0.1) return;
  stage.value.getStage().scale({ x: scale.value, y: scale.value });
}

/**
 * 해당 shape의 state update
 */
function handleTransformEnd(evt) {
  const rect = rectangles.value.find((r) => r.name === selectedShapeName.value);
  // update the state
  rect.x = e.target.x();
  rect.y = e.target.y();
  rect.rotation = e.target.rotation();
  rect.scaleX = e.target.scaleX();
  rect.scaleY = e.target.scaleY();

  // change fill
  rect.fill = Konva.Util.getRandomColor();
}

function handleStageMouseDown(e) {
  console.log('handleStageMouseDown===>', e, e.target.name());

  // add device
  if (!!addDeviceType.value) {
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
    });
    image.draggable(true);
    layer1.value.getNode().add(image);
    layer1.value.getNode().draw();

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
    selectedShapeName.value = '';
    updateTransformer();
    return;
  }

  // clicked on transformer - do nothing
  const clickedOnTransformer = e.target.getParent().className === 'Transformer';
  if (clickedOnTransformer) {
    return;
  }

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
  const transformerNode = transformer1.value.getNode();
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
</script>
<template>
  <div style="margin-top: 10px">
    <el-button @click="saveData">데이터</el-button>
    <el-button @click="zoomPlus">Zoom(+)</el-button>
    <el-button @click="zoomMinus">Zoom(-)</el-button>
    <el-select v-model="plan" style="width: 240px; margin-left: 15px">
      <el-option label="1층" value="0" />
      <el-option label="2층" value="1" />
    </el-select>
    디바이스 :
    <el-button @click="selectedAddDevice('SMART_PLUG')">스마트플러그</el-button>
    <el-button @click="selectedAddDevice('PDU')">Pdu</el-button>
    <el-button @click="selectedAddDevice('PROJECTOR')">프로젝터</el-button>
    <el-button @click="selectedAddDevice('PC_AGENT')">PC Agent</el-button>
  </div>
  <br />
  <v-stage ref="stage" :config="stageConfig" @mousedown="handleStageMouseDown">
    <v-layer ref="layer1">
      <v-image :config="{ image: getImageUrl }" />
      <v-transformer ref="transformer1" />
    </v-layer>
    <v-layer ref="layer2">
      <v-circle v-for="item in list" :key="item.id" :config="item" />
    </v-layer>
  </v-stage>
</template>
<style scoped></style>
