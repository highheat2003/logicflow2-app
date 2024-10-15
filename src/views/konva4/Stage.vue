<template>
  <div>Stage</div>
  <el-form label-width="80px" :model="formData">
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
  const { draggable } = props.selectedNode.attrs;
  console.log('onMounted===>', draggable);
  formData.value = { ...formData.value, draggable };
});

function onSubmit() {
  props.selectedNode.setAttr('draggable', formData.value.draggable);
  emit('onClose');
}
</script>
