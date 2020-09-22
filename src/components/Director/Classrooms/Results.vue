<template>
  <div>
    <div class="session m-card mt-3">
      <div class="session__body">
        <span class="session__label">Curso:</span>
        <span class="session__value">{{value.course.name}}</span>
        <span class="session__label">Profesor:</span>
        <span class="session__value">{{`${value.teacher.last_name}, ${value.teacher.first_name}`}}</span>
      </div>
    </div>

    <div class="m-menu mt-3">
      <div class="m-menu__left">
        <v-btn icon @click="$emit('input', null)">
          <v-icon style="font-size: 1.5rem">mdi-arrow-left</v-icon>
        </v-btn>
        <span class="m-menu__title">Resultados</span>
      </div>
    </div>

    <div v-if="evaluations.length > 0" class="mt-3" style="overflow-x: auto">
      <table class="m-table">
        <thead>
          <tr>
            <th></th>
            <th
              v-for="(evaluation, idx) in evaluations"
              :key="idx"
              class="evaluation"
            >{{evaluation.name}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, idx) in students" :key="idx">
            <td class="student pr-4">{{`${student.last_name}, ${student.first_name}`}}</td>
            <td
              v-for="(evaluation, idx) in evaluations"
              :key="idx"
              :set="score = getScore(student, evaluation)"
            >
              <div class="score" :class="`score--${score.state}`">{{score.text}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="evaluations.length <= 0" class="text-center mt-5">No hay evaluaciones</p>
  </div>
</template>

<script>
import { getEvaluationsBySessionDirector } from "@/services/evaluationService";

export default {
  props: {
    value: Object, // session
    students: Array,
    unselect: Function,
  },
  data: () => ({
    evaluations: [],
  }),
  watch: {
    async value() {
      await this.init();
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Evaluaciones");
      try {
        this.evaluations = await getEvaluationsBySessionDirector(
          this.value._id.$oid
        );
      } catch (error) {
      this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    getScore(student, evaluation) {
      if (!evaluation.results)
        return {
          text: "Sin Realizar",
          state: "",
        };

      let student_answer = evaluation.results.find(
        (result) => result._id.$oid === student._id.$oid
      );

      if (!student_answer)
        return {
          text: "Sin Realizar",
          state: "",
        };

      let correct = 0;
      evaluation.content.forEach((c, idx) => {
        if (c.correct === student_answer.answers[idx]) correct++;
      });

      return {
        text: `${correct}/${evaluation.content.length}`,
        state: correct / evaluation.content.length >= 0.5 ? 1 : 0,
      };
    },
  },
};
</script>

<style lang='scss' scoped>
.m-title {
  font-size: 1.5rem;
}
.session {
  margin: 0 auto;
  width: max-content;
  padding: 20px;
  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 10px;
  }
  &__label {
    font-weight: bold;
    color: rgb(66, 66, 66);
    // color: var(--color-subtitle);
  }
  &__value {
    color: rgb(66, 66, 66);
    font-weight: lighter;
  }
}

$cell-min-width: 150px;
$cell-max-width: 150px;

.m-table {
  width: max-content;
  padding: 10px;
  th {
    min-width: $cell-min-width;
    max-width: $cell-max-width;
    word-wrap: break-word;
    padding: 3px;
  }
  td {
    min-width: $cell-min-width;
    max-width: $cell-max-width;
    word-wrap: break-word;
    padding: 2px;
  }
  .score {
    padding: 6px;
    color: rgb(128, 128, 128);
    text-align: center;
    font-size: 0.85rem;
    font-weight: bold;
    border-radius: 6px;

    &--0 {
      background: rgb(255, 103, 116);
      color: #fff;
    }
    &--1 {
      background: rgb(67, 204, 73);
      color: #fff;
    }
  }
}
</style>