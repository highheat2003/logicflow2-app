<script setup>
import { computed, ref, watch, defineModel } from 'vue';
import * as util from '@/support/util';

const isOpen = defineModel('isOpen', { type: Boolean, default: false });
const props = defineProps({
  nodeData: { type: Object },
});
const emit = defineEmits(['update:isOpen', 'submit']);

const formData = ref({ ...props.nodeData }); // nodeData를 로컬 상태로 복사

// props.nodeData가 변경될 때 formData도 업데이트
watch(
  () => props.nodeData,
  (newData) => {
    const style = util.isEmpty(newData.properties.style) ? { properties: { style: {} } } : {};
    const text = util.isEmpty(newData.text) ? { text: { x: newData.x, y: newData.y, value: '' } } : {};
    formData.value = { ...newData, ...style, ...text };
  }
);

const formattedObj = computed(() => {
  return JSON.stringify(props.nodeData, null, 2);
});

function cancelClick() {
  handleClose();
}

function confirmClick() {
  emit('submit', formData.value); // 변경된 데이터를 부모로 전달
  handleClose();
}

function handleClose() {
  emit('update:isOpen', false);
}
</script>

<template>
  <el-drawer v-model="isOpen" direction="rtl" :before-close="handleClose">
    <template #header>
      <h4>속성</h4>
    </template>
    <template #default>
      <pre class="json-pre">{{ formattedObj }}</pre>
      <el-form label-width="auto" :model="formData">
        <el-form-item label="Id">
          <el-input v-model="formData.id" :readonly="true" />
        </el-form-item>
        <el-form-item label="Type">
          <el-input v-model="formData.type" :readonly="true" />
        </el-form-item>
        <el-form-item label="Text">
          <el-input v-model="formData.text.value" />
        </el-form-item>
        <el-form-item label="Fill">
          <el-color-picker v-model="formData.properties.style.fill" />
        </el-form-item>
        <el-form-item label="Stroke">
          <el-color-picker v-model="formData.properties.style.stroke" />
        </el-form-item>
        <el-form-item label="StrokeWidth">
          <el-input-number v-model="formData.properties.style.strokeWidth" :min="1" :max="20" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
