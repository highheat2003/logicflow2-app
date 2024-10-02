<template>
  <div class="logic-flow-view">
    <h3 class="demo-title">LogicFlow Turbo Adpter (Composition API)</h3>
    <!-- 보조 도구 모음 -->
    <Control
      class="demo-control"
      v-if="lf"
      :lf="lf"
      :catTurboData="true"
      @catData="$_catData"
      @catTurboData="$_catTurboData"
    ></Control>
    <!-- 노드 패널 -->
    <NodePanel :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- canvas -->
    <div id="LF-Turbo" ref="container"></div>
    <!-- 데이터 보기 패널 -->
    <el-dialog title="데이터" v-model="dataVisible" width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
    </el-dialog>
  </div>
</template>
<script>
import LogicFlow from '@logicflow/core';
import { Snapshot, BpmnElement, MiniMap } from '@logicflow/extension';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import NodePanel from './LFComponents/NodePanel.vue';
import Control from './LFComponents/Control.vue';
import DataDialog from './LFComponents/DataDialog.vue';
import { toTurboData, toLogicflowData } from '../Util/AdpterForTurbo';
import { BpmnNode } from './config';
import demoData from './dataTurbo.json';

export default {
  name: 'LF',
  components: { NodePanel, Control, DataDialog },
  data() {
    return {
      lf: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        grid: true,
        background: {
          color: '#f7f9ff',
        },
        keyboard: {
          enabled: true,
        },
      },
      nodeList: BpmnNode,
    };
  },
  mounted() {
    this.$_initLf();
  },
  methods: {
    $_initLf() {
      const lf = new LogicFlow({
        ...this.config,
        plugins: [BpmnElement, MiniMap, Snapshot],
        pluginsOptions: {
          miniMap: {
            isShowHeader: true,
            isShowCloseIcon: true,
            headerTitle: '썸네일',
            width: 200,
            height: 120,
            showEdge: true,
          },
        },
        container: this.$refs.container,
      });
      this.lf = lf;
      // 에지 유형 bpmn:sequenceFlow를 기본 유형으로 설정
      lf.setDefaultEdgeType('bpmn:sequenceFlow');
      this.$_render();
    },
    $_render() {
      // Turbo 데이터를 LogicFlow에서 내부적으로 인식하는 데이터 구조로 변환
      const lFData = toLogicflowData(demoData);
      this.lf.render(lFData);
    },
    closeDialog() {
      this.$data.dialogVisible = false;
    },
    $_catData() {
      this.$data.graphData = this.$data.lf.getGraphData();
      this.$data.dataVisible = true;
    },
    $_catTurboData() {
      const graphData = this.$data.lf.getGraphData();
      // Turbo가 인식하는 데이터 구조로 변환된 데이터
      this.$data.graphData = toTurboData(graphData);
      this.$data.dataVisible = true;
    },
  },
};
</script>
<style>
.logic-flow-view {
  height: 90vh;
  position: relative;
}
.demo-title {
  text-align: center;
  margin: 20px;
}
.demo-control {
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 2;
}
#LF-Turbo {
  width: calc(100% - 100px);
  height: 90%;
  outline: none;
  margin-left: 50px;
}
.time-plus {
  cursor: pointer;
}
.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}
.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}
</style>
