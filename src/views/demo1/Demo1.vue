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
