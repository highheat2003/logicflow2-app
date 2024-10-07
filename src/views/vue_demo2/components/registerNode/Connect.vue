<template>
  <div class="connect">
    <p>{{ props.name }}</p>
    <p>안녕하세요, 보험이 필요한가요?</p>
    <div class="button-list">
      <el-button @mousedown.stop="done(1)" class="block-button">보험에 가입되어 있습니다.</el-button>
      <el-button @mousedown.stop="done(2)" class="block-button">필요업음</el-button>
      <el-button @mousedown.stop="done(3)" class="block-button">필요</el-button>
      <el-button @mousedown.stop="done(4)" class="block-button">비정상적</el-button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String },
});
const emit = defineEmits(['select-button']);

function done(type) {
  emit('select-button', type);
}
</script>

<style scoped>
.connect {
  width: 100%;
  height: 100%;
  background: #fff;
  border: 1px solid #9a9a9b;
  box-sizing: border-box;
  padding: 10px;
}
.connect p {
  margin: 0;
}
.button-list {
  position: absolute;
  bottom: 0px;
}
.block-button {
  display: block; /* 버튼을 블록 요소로 설정 */
  width: 100%; /* 필요에 따라 버튼의 너비를 조정 */
  margin-bottom: 10px; /* 버튼 사이 간격 */
  margin-left: 0px; /* 버튼 사이 간격 */
}
</style>
