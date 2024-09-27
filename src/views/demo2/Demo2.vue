<script setup>
import { ref, onMounted, computed } from 'vue';
import LogicFlow from '@logicflow/core';
import { Control, Menu, MiniMap } from '@logicflow/extension';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import { data, SilentConfig, styleConfig } from './pluginData';

const miniMapOptions = {
  isShowHeader: true,
  isShowCloseIcon: true,
  headerTitle: 'Mini-Map',
  width: 200,
  height: 120,
  // leftPosition: 100,
  // topPosition: 100,
};
const propsDrawer = ref(false);
const direction = ref('rtl');
const selectedObj = ref(null);
const formattedObj = computed(() => {
  return JSON.stringify(selectedObj.value, null, 2);
});

function cancelClick() {
  propsDrawer.value = false;
}

function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose  ?`)
    .then(() => {
      propsDrawer.value = false;
    })
    .catch(() => {
      // catch error
    });
}

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
    console.log('click===>', data);
  });
});
</script>

<template>
  <h2>demo2</h2>
  <el-button type="primary" @click="propsDrawer = true">속성</el-button>
  <el-drawer v-model="propsDrawer" :direction="direction">
    <template #header>
      <h4>속성</h4>
    </template>
    <template #default>
      <pre class="json-pre">{{ formattedObj }}</pre>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
  <div class="lf-container" id="container"></div>
</template>

<style scoped></style>
