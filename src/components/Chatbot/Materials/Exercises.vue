<template>
  <div>
    <div class="category-text-menu">
      <div class="category-text-title">Ejercicios</div>
      <v-btn icon @click="resetExercises()">
        <v-icon>mdi-restore</v-icon>
      </v-btn>
    </div>
    <div v-for="(exercise, q_idx) in exercises" :key="q_idx" class="pb-6">
      <div class="category-text-content">
        <strong class="mr-3">{{q_idx+1}}.</strong>
        <div>{{exercise.question}}</div>
      </div>
      <div
        v-for="(alternative, a_idx) in exercise.alternatives"
        :key="a_idx"
        class="category-text-alternative transform-scale ml-4"
        :class="{'category-text-alternative-correct': exercise.show_correct && exercise.correct === a_idx, 
        'category-text-alternative-incorrect': exercise.incorrect === a_idx}"
        @click="selectAlternative(exercise, exercise.correct, a_idx)"
      >{{alternative}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["exercises", "talk"],
  methods: {
    resetExercises() {
      this.exercises.forEach(exercise => {
        (exercise.show_correct = false), (exercise.incorrect = -1);
      });
      this.$forceUpdate(); /* Correct Binding Update (:class) */
    },
    selectAlternative(exercise, correct_idx, alternative_idx) {
      if (!exercise.show_correct) {
        exercise.show_correct = true;
        if (correct_idx === alternative_idx) {
          this.talk("respuesta correcta");
        } else {
          exercise.incorrect = alternative_idx;
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

.category-text-menu {
  padding-bottom: 16px; // padding - padding-bottom
  display: flex;
  justify-content: space-between;
  .category-text-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-right: 10px;
  }
}
.category-text-content {
  padding-bottom: 16px; // padding - padding-bottom
  font-size: 1rem;
  white-space: pre-wrap;
  display: flex;
  align-items: flex-start;
}
.category-text-alternative {
  padding: 8px 16px; // padding - padding-bottom
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 1rem;
  white-space: pre-wrap;
  @include box-shadow;
  &:hover {
    cursor: pointer;
  }
  &.category-text-alternative-correct {
    background: #8bc34a;
    color: #fff;
    font-weight: bold;
  }
  &.category-text-alternative-incorrect {
    background: #ff887f;
    color: #fff;
    font-weight: bold;
  }
}
</style>