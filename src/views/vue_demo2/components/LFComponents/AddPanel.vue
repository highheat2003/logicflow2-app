<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="작업 추가">
      <div v-for="item in nodeList" :key="item.type">
        <el-button class="add-node-btn" type="primary" size="small" @click="$_addNode(item)">{{
          item.label
        }}</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="그룹 추가">
      <el-button class="add-node-btn" type="primary" size="small" @click="$_addTempalte">템플릿</el-button>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
const props = defineProps({
  nodeData: { type: Object },
  lf: { type: Object || String },
});
const emit = defineEmits(['addNodeFinish']);
const nodeList = [
  {
    type: 'user',
    label: '사용자',
  },
  {
    type: 'push',
    label: 'push',
  },
];

function $_addNode(item) {
  const { lf, nodeData } = props;
  const { id, x, y } = nodeData;
  const nextNode = lf.addNode({
    type: item.type,
    x: x + 150,
    y: y + 150,
  });
  const nextId = nextNode.id;
  lf.addEdge({ sourceNodeId: id, targetNodeId: nextId });
  emit('addNodeFinish');
}

function $_addTempalte() {
  const { lf, nodeData } = props;
  const { id, x, y } = nodeData;
  const timeNode = lf.addNode({
    type: 'download',
    x,
    y: y + 150,
  });
  const userNode = lf.addNode({
    type: 'user',
    x: x + 150,
    y: y + 150,
  });
  const pushNode = lf.addNode({
    type: 'push',
    x: x + 150,
    y: y + 300,
    properties: {},
  });
  const endNode = lf.addNode({
    type: 'end',
    x: x + 300,
    y: y + 150,
  });
  const endNode2 = lf.addNode({
    type: 'end',
    x: x + 300,
    y: y + 300,
  });
  lf.addEdge({ sourceNodeId: id, targetNodeId: timeNode.id });
  lf.addEdge({ sourceNodeId: timeNode.id, targetNodeId: userNode.id });
  lf.addEdge({
    sourceNodeId: userNode.id,
    targetNodeId: endNode.id,
    endPoint: { x: x + 280, y: y + 150 },
    text: {
      value: 'Y',
      x: x + 230,
      y: y + 140,
    },
  });
  lf.addEdge({
    sourceNodeId: userNode.id,
    targetNodeId: pushNode.id,
    text: {
      value: 'N',
      x: x + 160,
      y: y + 230,
    },
  });
  lf.addEdge({ sourceNodeId: pushNode.id, targetNodeId: endNode2.id, endPoint: { x: x + 280, y: y + 300 } });
  emit('addNodeFinish');
}
</script>
<style scoped>
.add-node-btn {
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
