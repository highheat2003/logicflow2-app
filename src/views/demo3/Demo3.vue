<script setup>
import { ref, onMounted, computed } from 'vue';
import LogicFlow from '@logicflow/core';
import { Control, Menu, MiniMap } from '@logicflow/extension';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import { data, SilentConfig, styleConfig } from './data';
import PropsDrawer from './PropsDrawer.vue';
import * as util from '@/support/util';

const miniMapOptions = {
  isShowHeader: true,
  isShowCloseIcon: true,
  headerTitle: 'Mini-Map',
  width: 200,
  height: 120,
};
const propsDrawer = ref(false);
const selectedObj = ref(null);
const lfRef = ref(null);
//let lf = null;

onMounted(() => {
  const lf = new LogicFlow({
    container: document.querySelector('#container'),
    grid: true,
    plugins: [Control, Menu, MiniMap],
    pluginsOptions: {
      miniMap: {
        ...miniMapOptions,
        showEdge: true,
      },
    },
    //...SilentConfig,
    ...styleConfig,
  });

  lf.extension.control.controlItems.map((item) => {
    //console.log(item);
    switch (item.key) {
      case 'zoom-out':
        item.text = '축소';
        item.title = '축소';
        break;
      case 'zoom-in':
        item.text = '확대';
        item.title = '확대';
        break;
      case 'reset':
        item.text = 'Reset';
        item.title = '원래 크기 복원';
        break;
      case 'undo':
        item.text = '이전 단계';
        item.title = '이전 단계';
        break;
      case 'redo':
        item.text = '다음 단계';
        item.title = '다음 단계';
        break;
      default:
        break;
    }
  });

  lf.extension.control.addItem({
    key: 'mini-map',
    iconClass: 'custom-minimap',
    title: '',
    text: 'Map',
    onClick: (lf, ev) => {
      lf.extension.miniMap.show();
    },
  });

  lf.extension.menu.menuTypeMap.forEach((value, key) => {
    //console.log(key, value);
    switch (key) {
      case 'lf:defaultNodeMenu':
        lf.extension.menu.menuTypeMap.get(key)[0].text = '삭제';
        lf.extension.menu.menuTypeMap.get(key)[1].text = '텍스트 편집';
        lf.extension.menu.menuTypeMap.get(key)[2].text = '복사';
        break;
      case 'lf:defaultEdgeMenu':
        lf.extension.menu.menuTypeMap.get(key)[0].text = '삭제';
        lf.extension.menu.menuTypeMap.get(key)[1].text = '텍스트 편집';
        break;
      case 'lf:defaultSelectionMenu':
        lf.extension.menu.menuTypeMap.get(key)[0].text = '삭제';
        break;
      default:
        break;
    }
  });

  lf.extension.menu.addMenuConfig({
    nodeMenu: [
      {
        text: '속성',
        callback(nodeData) {
          console.log(nodeData);
          selectedObj.value = nodeData;
          propsDrawer.value = true;
        },
      },
    ],
    edgeMenu: [
      {
        text: '속성',
        callback(edgeData) {
          console.log(edgeData);
          selectedObj.value = edgeData;
          propsDrawer.value = true;
        },
      },
    ],
  });

  lf.render(data);
  lf.on('node:click,edge:click', (data) => {
    //selectedObj.value = data.data;
    console.log('click===>', data.data);
  });

  lfRef.value = lf;
});

function onUpdateProps(data) {
  const lf = lfRef.value;
  console.log('updateProps===>', data);
  const nodeModel = util.nvl(lf.getNodeModelById(data.id), lf.getEdgeModelById(data.id));
  nodeModel.setProperties({ ...data.properties });
  nodeModel.updateText(data.text.value);
}

function onExport() {
  const lf = lfRef.value;
  console.log(lf.getGraphData());
}
</script>

<template>
  <el-card header="demo3 : 속성Drawer를 component로 분리">
    <div class="flex-wrapper">
      <el-button type="primary" @click="onExport">Export JSON</el-button>
    </div>
  </el-card>
  <props-drawer v-model:isOpen="propsDrawer" v-model:nodeData="selectedObj" @submit="onUpdateProps" />
  <div class="lf-container" id="container"></div>
</template>

<style scoped></style>
