<template>
  <div>
    <h3>{{ question.id }}.{{ question.text }}</h3>
    <div v-for="(option, index) in question.options" :key="index">
      <input type="checkbox" :value="option" v-model="localValue" />
      {{ option }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: Object,
    modelValue: {
      type: Array,
      default: () => [], // modelValue가 기본적으로 빈 배열이어야 함
    },
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue; // 부모의 배열과 동기화
      },
      set(value) {
        this.$emit('update:modelValue', value); // 부모에게 변경된 배열을 전달
      },
    },
  },
};
</script>
