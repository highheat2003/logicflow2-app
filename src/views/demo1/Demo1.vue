<script setup>
import { ref, onMounted } from 'vue';
import LogicFlow from '@logicflow/core';
import { Control } from '@logicflow/extension';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import { data, SilentConfig, styleConfig } from './pluginData';

const container = ref(null);
const lf = ref(null);

onMounted(() => {
  lf.value = new LogicFlow({
    container: container.value,
    grid: true,
    plugins: [Control],
    //...SilentConfig,
    ...styleConfig,
  });
  lf.value.extension.control.controlItems.map((item) => {
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
  lf.value.render(data);
  lf.value.on('node:click,edge:click', (data) => {
    console.log('click===>', data);
  });
});
</script>

<template>
  <h2>demo1</h2>
  <div class="lf-container" ref="container"></div>
</template>

<style scoped></style>
