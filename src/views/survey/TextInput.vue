<template>
  <div>
    <h3>{{ question.id }}.{{ question.text }}</h3>
    <input type="text" v-model="localValue" />
  </div>
</template>

<script>
export default {
  props: {
    question: Object,
    modelValue: String, // 부모로부터 v-model을 통해 전달받은 값
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue; // 부모의 값과 동기화
      },
      set(value) {
        this.$emit('update:modelValue', value); // 부모에게 변경된 값을 전달
      },
    },
  },
};
</script>
