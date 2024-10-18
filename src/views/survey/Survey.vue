<template>
  <div>
    <h2>설문 조사</h2>
    <p>남은 시간: {{ formattedTime }}</p>
    <!-- 남은 시간을 표시 -->
    <component
      v-for="(question, index) in currentQuestions"
      :key="index"
      :is="getComponentType(question.type)"
      :question="question"
      v-model="responses[question.id]"
    />

    <button @click="goToNextStep" v-if="currentQuestionType !== 'end'">다음</button>
    <button @click="submitSurvey" v-if="currentQuestionType === 'end'">제출</button>
  </div>
</template>

<script>
import SingleChoice from './SingleChoice.vue';
import MultiChoice from './MultiChoice.vue';
import TextInput from './TextInput.vue';
import Start from './Start.vue';
import End from './End.vue';

export default {
  data() {
    return {
      step: 0, // 설문의 현재 단계
      questions: [
        { id: 0, type: 'start', text: '설문을 시작합니다' },
        { id: 1, type: 'single-choice', text: '이 항목을 선택하세요', options: ['A', 'B', 'C'] },
        { id: 2, type: 'multi-choice', text: '복수 항목을 선택하세요', options: ['X', 'Y', 'Z'] },
        { id: 3, type: 'text', text: '의견을 입력하세요' },
        { id: 4, type: 'end', text: '설문을 종료합니다' },
      ],
      responses: {}, // 사용자가 입력한 설문 응답을 저장하는 객체
      timeLimit: 300, // 제한 시간 (초), 여기서는 5분으로 설정
      remainingTime: 300, // 남은 시간 (초)
      timer: null, // 타이머를 저장할 변수
    };
  },
  computed: {
    currentQuestions() {
      // 단계별로 질문을 필터링 (이 예시에서는 간단하게 단계에 맞게 질문 하나씩 표시)
      return [this.questions[this.step]];
    },
    currentQuestionType() {
      // 단계별로 질문의 유형
      return this.questions[this.step].type;
    },
    formattedTime() {
      // 남은 시간을 mm:ss 형식으로 변환
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
  },
  methods: {
    getComponentType(type) {
      switch (type) {
        case 'single-choice':
          return SingleChoice;
        case 'multi-choice':
          return MultiChoice;
        case 'text':
          return TextInput;
        case 'start':
          return Start;
        case 'end':
          return End;
        default:
          return null;
      }
    },
    goToNextStep() {
      if (this.step === 0) {
        if (this.timer !== null) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.startTimer(); // 컴포넌트가 마운트될 때 타이머 시작
      }

      if (this.step < this.questions.length - 1) {
        this.step++;
      }
    },
    submitSurvey() {
      if (this.timer !== null) {
        clearInterval(this.timer); // 타이머 중지
        this.timer = null;
      }
      // 설문 데이터를 서버로 전송하거나 저장하는 로직
      console.log('설문 응답:', this.responses);
      alert('설문이 제출되었습니다!');
      // 여기에서 서버에 데이터를 전송하거나 로컬 스토리지에 저장할 수 있습니다.
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          this.submitSurvey(); // 시간이 다 되면 설문 자동 제출
        }
      }, 1000); // 1초마다 실행
    },
  },
  beforeDestroy() {
    if (this.timer !== null) clearInterval(this.timer); // 컴포넌트가 소멸될 때 타이머 정리
  },
};
</script>
