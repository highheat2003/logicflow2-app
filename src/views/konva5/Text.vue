<template>
  <el-form label-width="100px" :model="formData">
    <el-form-item label="device type">
      <el-text class="mx-1">{{ formData.deviceType }}</el-text>
    </el-form-item>
    <el-form-item label="font size">
      <el-input-number v-model="formData.fontSize" :min="0" :max="20" />
    </el-form-item>
    <el-form-item label="text">
      <el-input v-model="formData.text" />
    </el-form-item>
    <el-form-item label="fill">
      <el-color-picker v-model="formData.fill" />
    </el-form-item>
    <el-form-item label="draggable">
      <el-checkbox v-model="formData.draggable" size="large" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">저장</el-button>
      <el-button @click="() => emit('onClose')">취소</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  targetNode: { type: Object },
});
const emit = defineEmits(['onClose']);
const formData = ref({
  draggable: false,
});

onMounted(() => {
  const { draggable, deviceType, fontSize, text, fill } = props.targetNode.attrs;
  console.log('onMounted===>', draggable, deviceType, fontSize, text, fill);
  formData.value = { ...formData.value, draggable, deviceType, fontSize, text, fill };
});

function onSubmit() {
  props.targetNode.setAttr('fontSize', formData.value.fontSize);
  props.targetNode.setAttr('text', formData.value.text);
  props.targetNode.setAttr('fill', formData.value.fill);
  props.targetNode.setAttr('draggable', formData.value.draggable);
  emit('onClose');
}
</script>
