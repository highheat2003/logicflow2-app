<template>
  <div style="margin-top: 10px">
    <el-text class="mx-1" style="margin-left: 5px">저장여부</el-text>
    <el-switch
      v-model="isSaved"
      class="ml-2"
      inline-prompt
      style="margin-left: 5px; --el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      active-text="Y"
      inactive-text="N"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

const isSaved = ref(true);

onBeforeRouteLeave((to, from, next) => {
  if (!isSaved.value) {
    const answer = window.confirm('변경 사항이 저장되지 않았습니다. 그래도 나가시겠습니까?');
    if (answer) {
      next(); // 이동 허용
    } else {
      next(false); // 이동 중단
    }
  } else {
    next();
  }
});
</script>
