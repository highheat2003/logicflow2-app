<template>
  <div class="connect">
    <p>{{ props.name }}</p>
    <p>안녕하세요, 보험이 필요한가요?</p>
    <div class="button-list">
      <button @mousedown.stop="done(1)">보험에 가입되어 있습니다.</button>
      <button @mousedown.stop="done(2)">필요업음</button>
      <button @mousedown.stop="done(3)">필요</button>
      <button @mousedown.stop="done(4)">비정상적</button>
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
  bottom: 10px;
}
</style>
