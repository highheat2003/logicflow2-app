<script setup>
import { ref, onMounted } from 'vue';
import ZoomIn from './icon/ZoomIn.vue';
import ZoomOut from './icon/ZoomOut.vue';
import StepBack from './icon/StepBack.vue';
import StepFoward from './icon/StepFoward.vue';
import AreaSelect from './icon/AreaSelect.vue';

const props = defineProps({
  lf: Object,
  activeEdges: Array,
  fillColor: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['changeNodeFillColor', 'saveGraph']);

const selectionOpened = ref(false);
const undoAble = ref(false);
const redoAble = ref(false);
const linetype = ref('pro-polyline');

const lineOptions = [
  {
    value: 'pro-polyline',
    label: '폴리라인',
  },
  {
    value: 'pro-line',
    label: '직선',
  },
  {
    value: 'pro-bezier',
    label: '곡선',
  },
];

onMounted(() => {
  props.lf.on('history:change', ({ data }) => {
    redoAble.value = data.redoAble;
    undoAble.value = data.undoAble;
  });
});

function $_changeFillColor(val) {
  emit('changeNodeFillColor', val);
}

function $_saveGraph() {
  emit('saveGraph');
}

function $_zoomIn() {
  props.lf.zoom(true);
}

function $_zoomOut() {
  props.lf.zoom(false);
}

function $_undo() {
  if (undoAble.value) {
    props.lf.undo();
  }
}

function $_redo() {
  if (redoAble.value) {
    props.lf.redo();
  }
}

function $_selectionSelect() {
  selectionOpened.value = !selectionOpened.value;
  if (selectionOpened.value) {
    props.lf.extension.selectionSelect.openSelectionSelect();
  } else {
    props.lf.extension.selectionSelect.closeSelectionSelect();
  }
}

function $_changeLineType(value) {
  const { lf, activeEdges } = props;
  const { graphModel } = lf;
  lf.setDefaultEdgeType(value);
  if (activeEdges && activeEdges.length > 0) {
    activeEdges.forEach((edge) => {
      graphModel.changeEdgeType(edge.id, value);
    });
  }
}
</script>

<template>
  <div>
    <div class="toolbar-item" :class="{ 'selection-active': selectionOpened }" @click="$_selectionSelect()">
      <area-select size="18" />
    </div>
    <div>
      <el-color-picker :value="fillColor" @change="(c) => $_changeFillColor(c)" />
    </div>
    <div class="toolbar-item" @click="$_zoomIn()">
      <zoom-in size="18" />
    </div>
    <div class="toolbar-item" @click="$_zoomOut()">
      <zoom-out size="18" />
    </div>
    <div class="toolbar-item" :class="{ disabled: !undoAble }" @click="$_undo()">
      <step-back size="18" />
    </div>
    <div class="toolbar-item" :class="{ disabled: !redoAble }" @click="$_redo()">
      <step-foward size="18" />
    </div>
    <div>
      <el-button @click="$_saveGraph">저장</el-button>
    </div>
    <div>
      <el-select v-model="linetype" @change="$_changeLineType" style="width: 140px">
        <el-option v-for="item in lineOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </div>
  </div>
</template>

<style scoped>
.toolbar-item {
  width: 18px;
  height: 18px;
  float: left;
  margin: 12px 4px;
  cursor: pointer;
}
.toolbar-color-picker {
  width: 24px;
  height: 24px;
  margin: 8px 4px;
}
.selection-active {
  background: #33a3dc;
}
</style>
