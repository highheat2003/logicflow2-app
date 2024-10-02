<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="제목">
        <el-input v-model="formData.text"></el-input>
      </el-form-item>
      <el-form-item label="이름">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="활동 영역">
        <el-input v-model="formData.region"></el-input>
      </el-form-item>
      <el-form-item label="활동 형태">
        <el-input v-model="formData.type"></el-input>
      </el-form-item>
      <el-form-item label="A">
        <el-input v-model="formData.a.a1"></el-input>
        <el-input v-model="formData.a.a2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">저장</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  nodeData: { type: Object },
  lf: { type: Object || String },
});
const emit = defineEmits(['onClose']);
const formData = ref({
  text: '',
  name: '',
  region: '',
  type: '',
  a: {
    a1: '',
    a2: '',
  },
});

onMounted(() => {
  const { properties, text } = props.nodeData;
  console.log('onMounted===>', properties, text);
  if (properties) {
    formData.value = { ...formData.value, ...properties };
  }
  if (text && text.value) {
    formData.value.text = text.value;
  }
});

function onSubmit() {
  const { id } = props.nodeData;
  props.lf.setProperties(id, { ...formData.value });
  props.lf.updateText(id, formData.value.text);
  emit('onClose');
}
</script>
<style scoped></style>
