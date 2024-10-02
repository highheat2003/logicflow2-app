<template>
  <div class="dialog-content">
    <vue-json-pretty :path="'res'" :data="props.graphData"> </vue-json-pretty>
  </div>
</template>
<script setup>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const props = defineProps({ graphData: { type: Object } });
</script>
<style scoped>
.dialog-content {
  max-height: 300px; /* 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 적용 */
}
</style>
