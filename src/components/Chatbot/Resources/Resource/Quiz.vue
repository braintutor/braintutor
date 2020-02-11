<template>
  <div class="item item-text">
    <div class="item-text-menu">
      <div class="item-text-title">Ejercicios</div>
    </div>
    <div v-for="(question, q_idx) in quiz" :key="q_idx" class="pb-6">
      <div class="item-text-content">
        <strong class="mr-3">{{q_idx+1}}.</strong>
        <div>{{question.enunciado}}</div>
      </div>
      <div
        v-for="(alternative, a_idx) in question.alternativas"
        :key="a_idx"
        class="item-text-alternative transform-scale ml-4"
        :class="{'item-text-alternative-correct': question.show_correct && question.correcta === a_idx, 
        'item-text-alternative-incorrect': question.incorrect === a_idx}"
        @click="selectAlternative(question, question.correcta, a_idx)"
      >{{alternative}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quiz", "talk"],
  methods: {
    selectAlternative(question, correct_idx, alternative_idx) {
      if (!question.show_correct) {
        question.show_correct = true;
        if (correct_idx === alternative_idx) {
          this.talk("respuesta correcta");
        } else {
          question.incorrect = alternative_idx;
          this.talk("respuesta incorrecta");
        }
        this.$forceUpdate(); /* Correct Binding Update (:class) */
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.item-text-alternative {
  padding: 10px 18px; // padding - padding-bottom
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 18px;
  white-space: pre-wrap;
  @include box-shadow;
  &:hover {
    cursor: pointer;
  }
  &.item-text-alternative-correct {
    background: #8bc34a;
    color: #fff;
    font-weight: bold;
  }
  &.item-text-alternative-incorrect {
    background: #ff887f;
    color: #fff;
    font-weight: bold;
  }
}
</style>