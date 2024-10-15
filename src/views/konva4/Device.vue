<template>
  <div>Device</div>
  <el-form label-width="100px" :model="formData">
    <el-form-item label="device type">
      {{ formData.deviceType }}
    </el-form-item>
    <el-form-item label="draggable">
      <el-checkbox v-model="formData.draggable" size="large" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">저장</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  selectedNode: { type: Object },
});
const emit = defineEmits(['onClose']);
const formData = ref({
  draggable: false,
});

onMounted(() => {
  const { draggable, deviceType } = props.selectedNode.attrs;
  console.log('onMounted===>', draggable, deviceType);
  formData.value = { ...formData.value, draggable, deviceType };
});

function onSubmit() {
  props.selectedNode.setAttr('draggable', formData.value.draggable);
  emit('onClose');
}
</script>
