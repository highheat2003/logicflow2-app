<template>
  <div class="property-dialog">
    <User v-if="nodeData.type === 'user'" :nodeData="nodeData" :lf="lf" @onClose="handleClose" />
    <CommonProperty v-else :nodeData="nodeData" :lf="lf" @onClose="handleClose" />
  </div>
</template>
<script setup>
import CommonProperty from './CommonProperty.vue';
import User from './User.vue';

const props = defineProps({
  nodeData: { type: Object },
  lf: { type: Object },
});
const emit = defineEmits(['setPropertiesFinish']);

function handleClose() {
  emit('setPropertiesFinish');
}
</script>
<style>
.property-dialog {
  padding: 20px;
}
</style>
