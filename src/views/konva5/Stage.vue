<template>
  <el-form label-width="100px" :model="formData">
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
  const { draggable } = props.targetNode.attrs;
  console.log('onMounted===>', draggable);
  formData.value = { ...formData.value, draggable };
});

function onSubmit() {
  props.targetNode.setAttr('draggable', formData.value.draggable);
  emit('onClose');
}
</script>
