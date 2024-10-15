<template>
  <div class="property-dialog">
    <pre class="json-pre">{{ formattedObj }}</pre>
    <Stage v-if="props.targetType === 'Stage'" :targetNode="props.targetNode" @onClose="handleClose" />
    <Layer
      v-if="props.targetType === 'Layer'"
      :targetNode="props.targetNode"
      :konvaHelper="props.konvaHelper"
      @onClose="handleClose"
    />
    <Device v-if="props.targetType === 'Device'" :targetNode="props.targetNode" @onClose="handleClose" />
    <Rectangle v-if="props.targetType === 'RECTANGLE'" :targetNode="props.targetNode" @onClose="handleClose" />
    <Text v-if="props.targetType === 'TEXT'" :targetNode="props.targetNode" @onClose="handleClose" />
    <Circle v-if="props.targetType === 'CIRCLE'" :targetNode="props.targetNode" @onClose="handleClose" />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import Stage from './Stage.vue';
import Layer from './Layer.vue';
import Device from './Device.vue';
import Rectangle from './Rectangle.vue';
import Text from './Text.vue';
import Circle from './Circle.vue';

const props = defineProps({
  targetNode: { type: Object },
  targetType: { type: String },
  konvaHelper: { type: Object },
});
const emit = defineEmits(['setPropertiesFinish']);
const formattedObj = computed(() => {
  return JSON.stringify(props.targetNode.attrs, null, 2);
});

function handleClose() {
  emit('setPropertiesFinish');
}
</script>
<style>
.property-dialog {
  padding: 20px;
}
</style>
