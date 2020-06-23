<template>
  <div>
    <section class="quizzes mb-4">
      <v-btn
        class="quizzes__type"
        @click="show_type = 'BAS'"
        :outlined="show_type !== 'BAS'"
        color="warning"
        dark
        small
        rounded
      >Básico</v-btn>
      <v-btn
        class="quizzes__type"
        @click="show_type = 'INT'"
        :outlined="show_type !== 'INT'"
        color="warning"
        dark
        small
        rounded
      >Intermedio</v-btn>
      <v-btn
        class="quizzes__type"
        @click="show_type = 'ADV'"
        :outlined="show_type !== 'ADV'"
        color="warning"
        dark
        small
        rounded
      >Avanzado</v-btn>
    </section>

    <!-- QUIZ -->
    <div v-if="quiz" class="quiz">
      <section class="question m-card">
        <p class="question__statement">{{question.question}}</p>
        <div class="alternatives">
          <div
            v-for="(alternative, a_idx) in question.alternatives"
            :key="a_idx"
            class="alternative"
            :class="{
              'alternative--correct': question.show_correct && a_idx === question.correct,
              'alternative--incorrect': question.show_correct && a_idx !== question.correct && a_idx === question.selected
            }"
            @click="selectAlternative(question, a_idx)"
          >{{alternative}}</div>
        </div>
      </section>
      <!-- QUIZ ACTIONS -->
      <div class="quiz__actions">
        <v-btn v-if="question_idx !== 0" @click="go(-1)" color="success" small rounded>Anterior</v-btn>
        <div></div>
        <v-btn
          v-if="question_idx !== quiz.length - 1"
          @click="go(+1)"
          color="success"
          small
          rounded
        >Siguiente</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quizzes"],
  data: () => ({
    show_type: "BAS",
    question_idx: 0
  }),
  computed: {
    quiz() {
      return this.quizzes[this.show_type];
    },
    question() {
      return this.quiz[this.question_idx];
    }
  },
  methods: {
    selectAlternative(question, a_idx) {
      if (!question.show_correct) {
        question.show_correct = true;
        question.selected = a_idx;
        this.quiz.splice();
      }
    },
    go(dir) {
      this.question_idx = Math.max(
        0,
        Math.min(this.quiz.length - 1, this.question_idx + dir)
      );
    }
  }
};
</script>

<style lang='scss' scoped>
.quizzes {
  display: flex;
  justify-content: center;

  &__type {
    margin: 0 4px;
  }
}

.quiz {
  &__actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
}

.question {
  padding: 20px;
  text-align: center;

  &__statement {
    font-size: 0.95rem;
    font-weight: bold;
  }
}

.alternatives {
}

$color-correct: #41c541;
$color-incorrect: #ff7c77;

.alternative {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 0.9rem;
  font-weight: initial;
  border: 1px solid #ccc;
  border-radius: 20px;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background: #eeeeee;
  }

  &--correct {
    background: $color-correct !important;
    color: #fff;
    border: none;
    &:hover {
      background: $color-correct !important;
    }
  }

  &--incorrect {
    background: $color-incorrect;
    color: #fff;
    border: none;
    &:hover {
      background: $color-incorrect;
    }
  }
}
</style>