<template>
  <el-form label-width="100px" :model="formData">
    <el-form-item label="배경편집">
      <el-checkbox v-model="formData.isLayerSelected" size="large" />
    </el-form-item>
    <el-form-item label="배경">
      <el-select v-model="formData.src" placeholder="선택" class="custom-select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          <template v-slot:default>
            <div class="option-content">
              <img :src="item.value" alt="" class="option-image" />
              <span class="option-label">{{ item.label }}</span>
            </div>
          </template>
        </el-option>
      </el-select>
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
  konvaHelper: { type: Object },
});
const emit = defineEmits(['onClose']);
const formData = ref({
  src: '',
});
const options = [
  {
    value: 'https://blog.kakaocdn.net/dn/WjTnf/btrKQhJM3Tn/AZXWBm8xomKUuCbwrmakFK/img.jpg',
    label: '원격이미지',
  },
  {
    value: '/RoomSketcher-House-Floor-Plans-2452430-800.jpg',
    label: '로컬이미지',
  },
];

onMounted(() => {
  const { src, isLayerSelected } = props.targetNode.attrs;
  console.log('onMounted===>', src);
  formData.value = { ...formData.value, src, isLayerSelected };
});

function onSubmit() {
  props.targetNode.setAttr('isLayerSelected', formData.value.isLayerSelected);
  props.targetNode.setAttr('draggable', formData.value.isLayerSelected);
  if (!formData.value.isLayerSelected) props.konvaHelper.clearTransformer();
  props.targetNode.setAttr('src', formData.value.src);
  props.targetNode.getAttr('image').src = formData.value.src;
  props.targetNode.getAttr('image').onload = function () {
    props.targetNode.parent.draw();
  };
  emit('onClose');
}
</script>
<style scoped>
.el-select-dropdown__item {
  height: 120px !important; /* 옵션 항목 높이 조정 */
  display: flex;
  align-items: center;
}

.option-content {
  display: flex;
  align-items: center;
  height: 100%; /* 컨텐츠가 항목 전체 높이를 채우도록 설정 */
  padding: 10px; /* 이미지와 텍스트 간격 조절 */
}

.option-image {
  width: 100px;
  height: 100px;
  object-fit: cover; /* 이미지를 비율에 맞춰 표시 */
  margin-right: 10px;
}

.option-label {
  font-size: 16px; /* 텍스트 크기 */
  display: flex; /* Flexbox로 텍스트를 감쌉니다 */
  align-items: center; /* 텍스트 자체를 가운데 정렬 */
}
</style>
