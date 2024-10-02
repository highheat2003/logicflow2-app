<template>
  <div>
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="활동 이름">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="활동 영역">
        <el-select v-model="formData.region" placeholder="활동 영역을 선택하세요.">
          <el-option label="지역 I" value="shanghai"></el-option>
          <el-option label="지역 II" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="활동 시간">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="날짜 선택"
            v-model="formData.date1"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="시간 선택" v-model="formData.date2" style="width: 100%"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="즉시 배송">
        <el-switch v-model="formData.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="활동의 성격">
        <el-checkbox-group v-model="formData.type">
          <el-checkbox
            value="미식가/레스토랑 온라인 이벤트"
            label="미식가/레스토랑 온라인 이벤트"
            name="type"
          ></el-checkbox>
          <el-checkbox value="현지 프로모션 활동" label="현지 프로모션 활동" name="type"></el-checkbox>
          <el-checkbox value="오프라인 테마 활동" label="오프라인 테마 활동" name="type"></el-checkbox>
          <el-checkbox value="브랜드 단독 노출" label="브랜드 단독 노출" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="특별 리소스">
        <el-radio-group v-model="formData.resource">
          <el-radio value="온라인 브랜드 스폰서십">온라인 브랜드 스폰서십</el-radio>
          <el-radio value="오프라인 장소는 무료입니다.">오프라인 장소는 무료입니다.</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="활동 형태">
        <el-input type="textarea" v-model="formData.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">저장</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  nodeData: { type: Object },
  lf: { type: Object || String },
});
const emit = defineEmits(['onClose']);
const formData = ref({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

onMounted(() => {
  const { properties } = props.nodeData;
  console.log('onMounted===>', properties);
  if (properties) {
    formData.value = { ...properties };
  }
});

function onSubmit() {
  console.log('submit!');
  props.lf.setProperties(props.nodeData.id, formData.value);
  emit('onClose');
}
</script>
<style scoped></style>
