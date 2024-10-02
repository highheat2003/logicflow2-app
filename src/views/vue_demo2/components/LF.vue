<template>
  <div class="logic-flow-view">
    <h3 class="demo-title">LogicFlow Vue demo (Composition API)</h3>
    <!-- 보조 도구 모음 -->
    <Control class="demo-control" v-if="lf" :lf="lf" @catData="$_catData"></Control>
    <!-- 노드 패널 -->
    <NodePanel v-if="lf" :lf="lf" :nodeList="nodeList"></NodePanel>
    <!-- canvas -->
    <div id="LF-view" ref="container"></div>
    <!-- 사용자 노드 사용자 지정 조작 패널 -->
    <AddPanel
      v-if="showAddPanel"
      class="add-panel"
      :style="addPanelStyle"
      :lf="lf"
      :nodeData="addClickNode"
      @addNodeFinish="hideAddPanel"
    >
    </AddPanel>
    <!-- 속성 패널 -->
    <el-drawer title="노드 속성 설정" v-model="dialogVisible" direction="rtl" size="500px" :before-close="closeDialog">
      <PropertyDialog
        v-if="dialogVisible"
        :nodeData="clickNode"
        :lf="lf"
        @setPropertiesFinish="closeDialog"
      ></PropertyDialog>
    </el-drawer>
    <!-- 데이터 보기 패널 -->
    <el-dialog title="데이터" v-model="dataVisible" width="50%">
      <DataDialog :graphData="graphData"></DataDialog>
    </el-dialog>
  </div>
</template>
<script>
import LogicFlow from '@logicflow/core';
// const LogicFlow = window.LogicFlow
import { Menu, Snapshot, MiniMap } from '@logicflow/extension';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import NodePanel from './LFComponents/NodePanel.vue';
import AddPanel from './LFComponents/AddPanel.vue';
import Control from './LFComponents/Control.vue';
import PropertyDialog from './PropertySetting/PropertyDialog.vue';
import DataDialog from './LFComponents/DataDialog.vue';
import { nodeList } from './config';
import demoData from './data.json';

import {
  registerStart,
  registerUser,
  registerEnd,
  registerPush,
  registerDownload,
  registerPolyline,
  registerTask,
  registerConnect,
} from './registerNode';

export default {
  name: 'LF',
  components: { NodePanel, AddPanel, Control, PropertyDialog, DataDialog },
  data() {
    return {
      lf: null,
      showAddPanel: false,
      addPanelStyle: {
        top: 0,
        left: 0,
      },
      nodeData: null,
      addClickNode: null,
      clickNode: null,
      dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        background: {
          backgroundColor: '#f7f9ff',
        },
        grid: {
          size: 10,
          visible: false,
        },
        keyboard: {
          enabled: true,
        },
        edgeTextDraggable: true,
        hoverOutline: false,
      },
      moveData: {},
      nodeList,
    };
  },
  mounted() {
    this.$_initLf();
  },
  methods: {
    $_initLf() {
      // logicflow 구성
      const lf = new LogicFlow({
        ...this.config,
        plugins: [Menu, MiniMap, Snapshot],
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
      // 테마 설정하기
      lf.setTheme({
        circle: {
          stroke: '#000000',
          strokeWidth: 1,
          outlineColor: '#88f',
        },
        rect: {
          outlineColor: '#88f',
          strokeWidth: 1,
        },
        polygon: {
          strokeWidth: 1,
        },
        polyline: {
          stroke: '#000000',
          hoverStroke: '#000000',
          selectedStroke: '#000000',
          outlineColor: '#88f',
          strokeWidth: 1,
        },
        nodeText: {
          color: '#000000',
        },
        edgeText: {
          color: '#000000',
          background: {
            fill: '#f7f9ff',
          },
        },
      });
      this.$_registerNode();
    },
    // 노드등록
    $_registerNode() {
      registerStart(this.lf);
      registerUser(this.lf);
      registerEnd(this.lf);
      registerPush(this.lf, this.clickPlus, this.mouseDownPlus);
      registerDownload(this.lf);
      registerPolyline(this.lf);
      registerTask(this.lf);
      registerConnect(this.lf);
      this.$_render();
    },
    $_render() {
      this.lf.render(demoData);
      this.$_LfEvent();
    },
    $_getData() {
      const data = this.lf.getGraphData();
      console.log(JSON.stringify(data));
    },
    $_LfEvent() {
      this.lf.on('node:click', ({ data }) => {
        console.log('node:click', data);
        this.$data.clickNode = data;
        this.$data.dialogVisible = true;
      });
      this.lf.on('edge:click', ({ data }) => {
        console.log('edge:click', data);
        this.$data.clickNode = data;
        this.$data.dialogVisible = true;
      });
      this.lf.on('element:click', () => {
        this.hideAddPanel();
      });
      this.lf.on('edge:add', ({ data }) => {
        console.log('edge:add', data);
      });
      this.lf.on('node:mousemove', ({ data }) => {
        //console.log('node:mousemove');
        this.moveData = data;
      });
      this.lf.on('blank:click', () => {
        this.hideAddPanel();
      });
      this.lf.on('connection:not-allowed', (data) => {
        this.$message({
          type: 'error',
          message: data.msg,
        });
      });
      this.lf.on('node:mousemove', () => {
        //console.log('on mousemove');
      });
    },
    clickPlus(e, attributes) {
      e.stopPropagation();
      console.log('clickPlus', e, attributes);
      const { clientX, clientY } = e;
      console.log(clientX, clientY);
      this.$data.addPanelStyle.top = clientY - 40 + 'px';
      this.$data.addPanelStyle.left = clientX + 'px';
      this.$data.showAddPanel = true;
      this.$data.addClickNode = attributes;
    },
    mouseDownPlus(e, attributes) {
      e.stopPropagation();
      console.log('mouseDownPlus', e, attributes);
    },
    hideAddPanel() {
      this.$data.showAddPanel = false;
      this.$data.addPanelStyle.top = 0;
      this.$data.addPanelStyle.left = 0;
      this.$data.addClickNode = null;
    },
    closeDialog() {
      this.$data.dialogVisible = false;
    },
    $_catData() {
      this.$data.graphData = this.$data.lf.getGraphData();
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
#LF-view {
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

@keyframes lf_animate_dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
