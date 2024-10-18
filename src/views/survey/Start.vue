<template>
  <div>
    <h3>{{ question.text }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    question: Object,
  },
  data() {
    return {};
  },
};
</script>
