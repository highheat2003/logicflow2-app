<template>
  <el-form label-width="100px" :model="formData">
    <el-form-item label="shape type">
      <el-text class="mx-1">{{ formData.deviceType }}</el-text>
    </el-form-item>
    <el-form-item label="stroke">
      <el-color-picker v-model="formData.stroke" />
    </el-form-item>
    <el-form-item label="stroke width">
      <el-input-number v-model="formData.strokeWidth" :min="0" :max="20" />
    </el-form-item>
    <el-form-item label="corner radius">
      <el-input-number v-model="formData.cornerRadius" :min="0" :max="20" />
    </el-form-item>
    <el-form-item label="shadow blur">
      <el-input-number v-model="formData.shadowBlur" :min="0" :max="20" />
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
  const { draggable, deviceType, stroke, strokeWidth, cornerRadius, shadowBlur, fill } = props.targetNode.attrs;
  console.log('onMounted===>', draggable, deviceType, stroke, strokeWidth, cornerRadius, shadowBlur, fill);
  formData.value = { ...formData.value, draggable, deviceType, stroke, strokeWidth, cornerRadius, shadowBlur, fill };
});

function onSubmit() {
  props.targetNode.setAttr('stroke', formData.value.stroke);
  props.targetNode.setAttr('strokeWidth', formData.value.strokeWidth);
  props.targetNode.setAttr('cornerRadius', formData.value.cornerRadius);
  props.targetNode.setAttr('shadowBlur', formData.value.shadowBlur);
  props.targetNode.setAttr('fill', formData.value.fill);
  props.targetNode.setAttr('draggable', formData.value.draggable);
  emit('onClose');
}
</script>
