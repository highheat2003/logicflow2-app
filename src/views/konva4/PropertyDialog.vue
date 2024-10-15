<template>
  <div class="property-dialog">
    <pre class="json-pre">{{ formattedObj }}</pre>
    <Stage v-if="nodeType === 'Stage'" :selectedNode="props.selectedNode" @onClose="handleClose" />
    <Layer v-if="nodeType === 'Layer'" :selectedNode="props.selectedNode" @onClose="handleClose" />
    <Device v-if="nodeType === 'Device'" :selectedNode="props.selectedNode" @onClose="handleClose" />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import Stage from './Stage.vue';
import Layer from './Layer.vue';
import Device from './Device.vue';

const props = defineProps({
  selectedNode: { type: Object },
});
const emit = defineEmits(['setPropertiesFinish']);
const formattedObj = computed(() => {
  return JSON.stringify(props.selectedNode.attrs, null, 2);
});
const nodeType = getType(props.selectedNode);

function handleClose() {
  emit('setPropertiesFinish');
}

// Stage, Layer, Shape 구분
function getType(obj) {
  return obj.parent === null ? 'Stage' : obj.attrs?.deviceType ? 'Device' : 'Layer';
}
</script>
<style>
.property-dialog {
  padding: 20px;
}
</style>
