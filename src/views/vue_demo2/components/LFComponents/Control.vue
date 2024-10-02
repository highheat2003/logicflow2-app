<template>
  <div>
    <el-button-group>
      <el-button @click="$_zoomIn">확대</el-button>
      <el-button @click="$_zoomOut">축소</el-button>
      <el-button @click="$_zoomReset">크기 복원</el-button>
      <el-button @click="$_translateRest">위치 복원</el-button>
      <el-button @click="$_reset">복원(크기 및 위치)</el-button>
      <el-button @click="$_undo" :disabled="undoDisable">이전(ctrl+z)</el-button>
      <el-button @click="$_redo" :disabled="redoDisable">다음(ctrl+y)</el-button>
      <el-button @click="$_download">이미지 다운로드</el-button>
      <el-button @click="$_catData">데이터 보기</el-button>
      <el-button v-if="props.catTurboData" @click="$_catTurboData">터보 데이터 보기</el-button>
      <el-button @click="$_showMiniMap">썸네일 보기</el-button>
    </el-button-group>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  catTurboData: { type: Boolean },
  lf: { type: Object || String },
});
const emit = defineEmits(['catData', 'catTurboData']);
const undoDisable = ref(true);
const redoDisable = ref(true);
const graphData = ref(null);
const dataVisible = ref(false);

onMounted(() => {
  props.lf.on('history:change', ({ data }) => {
    undoDisable.value = !data.undoAble;
    redoDisable.value = !data.redoAble;
  });
});

function $_zoomIn() {
  props.lf.zoom(true);
}

function $_zoomOut() {
  props.lf.zoom(false);
}

function $_zoomReset() {
  props.lf.resetZoom();
}

function $_translateRest() {
  props.lf.resetTranslate();
}

function $_reset() {
  props.lf.resetZoom();
  props.lf.resetTranslate();
}

function $_undo() {
  props.lf.undo();
}

function $_redo() {
  props.lf.redo();
}

function $_download() {
  props.lf.getSnapshot();
}

function $_catData() {
  emit('catData');
}

function $_catTurboData() {
  emit('catTurboData');
}

function $_showMiniMap() {
  const { lf } = props;
  lf.extension.miniMap.show();
}
</script>
<style scoped></style>
