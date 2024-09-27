<template>
  <div class="diagram-panel">
    <div class="setting-block">
      <div>스타일</div>
      <div class="short-styles">
        <div
          v-for="(item, index) in shortStyles"
          :key="index"
          :style="{
            backgroundColor: item.backgroundColor,
            borderColor: item.borderColor,
            borderWidth: item.borderWidth,
          }"
          @click="setStyle(item)"
        ></div>
      </div>
    </div>
    <div class="setting-block">
      <el-divider />
      <div class="setting-item">
        <span>배경색</span>
        <el-color-picker v-model="style.backgroundColor" @change="(c) => $_changeColorProperty(c, 'backgroundColor')" />
        <span>{{ style.backgroundColor }}</span>
      </div>
      <div class="setting-item" v-if="false">
        <span>그라데이션 색상</span>
        <el-color-picker v-model="style.gradientColor" @change="(c) => $_changeColorProperty(c, 'gradientColor')" />
      </div>
      <el-divider>테두리</el-divider>
      <div class="setting-item">
        <span>스타일</span>
        <el-select v-model="style.borderStyle" @change="$_selectBorder" placeholder="선택">
          <el-option value="hidden" label="표시되지 않음"></el-option>
          <el-option v-for="(border, index) in borderStyles" :value="border.value" :key="index">
            <div class="border-style" :style="{ borderBottomStyle: border.value }"></div>
          </el-option>
        </el-select>
      </div>
      <div class="setting-item">
        <span>색상</span>
        <el-color-picker v-model="style.borderColor" @change="(c) => $_changeColorProperty(c, 'borderColor')" />
        <span>{{ style.borderColor }}</span>
      </div>
      <div class="setting-item">
        <span>너비</span>
        <el-select v-model="style.borderWidth" @change="$_changeBorderWidth" placeholder="선택">
          <el-option v-for="item in borderWidthOptions" :key="item" :label="`${item}px`" :value="item"></el-option>
        </el-select>
      </div>
      <el-divider>텍스트</el-divider>
      <div class="setting-item">
        <span>색상</span>
        <el-color-picker v-model="style.fontColor" @change="(c) => $_changeColorProperty(c, 'fontColor')" />
        <span>{{ style.fontColor }}</span>
      </div>
      <div class="setting-item">
        <span>크기</span>
        <el-input-number
          v-model="style.fontSize"
          controls-position="right"
          @change="$_changeFontSize"
          :min="12"
          :max="30"
        >
        </el-input-number>
        <span>px</span>
      </div>
      <div class="setting-item">
        <span>글꼴</span>
        <el-select v-model="style.fontFamily" @change="$_changeFontFamily" placeholder="선택">
          <el-option v-for="(fontFamily, index) in fontFamilies" :value="fontFamily.value" :key="index"></el-option>
        </el-select>
      </div>
      <div class="setting-item">
        <span>줄 간격</span>
        <el-select v-model="style.lineHeight" @change="$_changeLineHeight" placeholder="선택">
          <el-option
            v-for="(item, index) in lineHeightOptions"
            :key="index"
            :label="`${item}`"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="setting-item">
        <span>정렬</span>
        <el-radio-group v-model="style.textAlign" @change="$_changeTextAlign">
          <el-radio-button value="left">좌</el-radio-button>
          <el-radio-button value="center">가운데</el-radio-button>
          <el-radio-button value="right">우</el-radio-button>
        </el-radio-group>
      </div>
      <div class="setting-item">
        <span>스타일</span>
        <el-button size="small" @click="$_changeFontWeight">B</el-button>
        <el-button size="small" @click="$_changeTextDecoration">U</el-button>
        <el-button size="small" @click="$_changeFontStyle">I</el-button>
      </div>
      <el-divider />
      <div class="setting-item">
        <span>z-index</span>
        <el-button @click="$emit('setZIndex', 'top')">top</el-button>
        <el-button @click="$emit('setZIndex', 'bottom')">bottom</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { shortStyles, borderStyles, fontFamilies } from '../constant';

export default {
  props: {
    elementsStyle: Object,
    onlyEdge: Boolean, // 가장자리의 속성만 설정할지 여부, 가장자리의 속성만 설정하는 경우 바로 가기 스타일 및 배경색 설정을 숨깁니다.
  },
  data() {
    return {
      shortStyles,
      borderStyles,
      fontFamilies,
      style: {
        backgroundColor: '', // 填充色
        gradientColor: '', // 渐变色
        borderType: 0, // 线条类型
        borderColor: '', // 填充颜色
        borderWidth: 1, // 线条宽度
        borderStyle: '', // 线条类型
        fontSize: 12, // 文本大小
        fontColor: '', // 文本颜色
        fontWeight: '', // 文本加粗
        fontFamily: '', // 文本样式
        lineHeight: '', // 行高
        textAlign: '', // 对齐
      },
      borderWidthOptions: Array(11)
        .fill()
        .map((_, i) => i),
      fontWeight: '', // 文本加粗
      lineHeightOptions: Array(5)
        .fill(1)
        .map((_, i) => _ + i * 0.5),
    };
  },
  watch: {
    elementsStyle: {
      handler(val) {
        this.style = { ...this.style, ...val };
      },
      immediate: true,
    },
  },
  methods: {
    setStyle(item) {
      this.$emit('setStyle', item);
    },
    $_selectBorder(val) {
      this.$emit('setStyle', {
        borderStyle: val,
      });
    },
    /*
    $_changeColorProperty({ rgba: { r, g, b, a } }, type) {
      const color = `rgba(${r},${g},${b},${a})`;
      this[type] = color;
      this.$emit('setStyle', {
        [type]: color,
      });
    },*/
    $_changeColorProperty(color, type) {
      console.log('_changeColorProperty===>', color, type);
      this[type] = color;
      this.$emit('setStyle', {
        [type]: color,
      });
    },
    $_changeFontSize(val) {
      this.$emit('setStyle', {
        fontSize: val,
      });
    },
    $_changeBorderWidth(val) {
      this.$emit('setStyle', {
        borderWidth: val,
      });
    },
    $_changeFontFamily(val) {
      this.$emit('setStyle', {
        fontFamily: val,
      });
    },
    $_changeLineHeight(val) {
      this.$emit('setStyle', {
        lineHeight: val,
      });
    },
    $_changeFontWeight() {
      if (this.style.fontWeight === 'bold') {
        this.$emit('setStyle', {
          fontWeight: 'normal',
        });
      } else {
        this.$emit('setStyle', {
          fontWeight: 'bold',
        });
      }
    },
    $_changeTextDecoration() {
      if (this.style.textDecoration === 'underline') {
        this.$emit('setStyle', {
          textDecoration: 'none',
        });
      } else {
        this.$emit('setStyle', {
          textDecoration: 'underline',
        });
      }
    },
    $_changeFontStyle() {
      if (this.style.fontStyle === 'italic') {
        this.$emit('setStyle', {
          fontStyle: 'normal',
        });
      } else {
        this.$emit('setStyle', {
          fontStyle: 'italic',
        });
      }
    },
    $_changeTextAlign(val) {
      this.$emit('setStyle', {
        textAlign: val,
      });
    },
  },
};
</script>

<style scoped>
.diagram-panel {
  padding: 20px;
}
.short-styles {
  width: 240px;
}
.short-styles > div {
  width: 20px;
  height: 20px;
  margin: 0 10px 5px 0;
  box-sizing: border-box;
  float: left;
  border: 1px solid #fff;
  cursor: pointer;
}
.border-style {
  width: 150px;
  height: 0px;
  margin-top: 18px;
  border-bottom-width: 1px;
  border-bottom-color: black;
}
.setting-block {
  overflow: hidden;
}
.setting-item {
  line-height: 12px;
  font-size: 12px;
  display: flex;
  vertical-align: middle;
  align-items: center;
  margin-top: 10px;
}
.setting-item > span {
  width: 50px;
  margin-right: 10px;
  text-align: right;
  flex-shrink: 0;
  flex-grow: 0;
}
.border-color {
  width: 40px;
  height: 30px;
  display: inline-block;
  border: 1px solid #eaeaeb;
}
</style>
