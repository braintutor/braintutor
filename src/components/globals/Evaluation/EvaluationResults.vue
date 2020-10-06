<template>
  <div>
    <div v-show="!show_evaluation_result" class="results">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th class="results__spacer"></th>
            <th>C</th>
            <th>I</th>
            <th>B</th>
            <th class="results__spacer"></th>
            <th v-for="(c, idx) in evaluation.content" :key="idx">
              {{ idx + 1 }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, idx) in students" :key="idx" class="result">
            <td>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="!student.has_answer"
                    icon
                    v-on="on"
                    class="pb-1"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="showEvaluationStudent(student)">
                    <v-list-item-title>Ver Examen</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-for="(button, idx) in buttons"
                    :key="idx"
                    @click="button.action(student)"
                  >
                    <v-list-item-title>{{ button.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
            <td class="results__name">
              {{ `${student.last_name}, ${student.first_name}` }}
            </td>
            <td></td>
            <td class="results__value">{{ student.corrects }}</td>
            <td class="results__value">{{ student.incorrects }}</td>
            <td class="results__value">{{ student.emptys }}</td>
            <td></td>
            <td v-for="(c, idx) in evaluation.content" :key="idx">
              <span
                class="answer"
                :class="[
                  student.answers[idx] >= 0
                    ? student.answers[idx] === c.correct
                      ? 'answer--correct'
                      : 'answer--incorrect'
                    : 'answer--empty',
                ]"
              >
                <i
                  v-if="student.answers[idx] >= 0"
                  class="fa"
                  :class="[
                    student.answers[idx] === c.correct
                      ? 'fa-check'
                      : 'fa-close',
                  ]"
                ></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="show_evaluation_result">
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn @click="show_evaluation_result = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <p class="m-menu__title">
            {{
              `${student_selected.last_name}, ${student_selected.first_name}`
            }}
          </p>
        </div>
      </div>
      <EvaluationStudent :evaluation="evaluation" :student="student_selected" />
    </div>
  </div>
</template>

<script>
import EvaluationStudent from "./EvaluationStudent";

export default {
  props: {
    evaluation: Object,
    students: Array,
    buttons: Array,
  },
  data: () => ({
    student_selected: null,
    show_evaluation_result: false,
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.students.forEach((student) => {
        let result = this.evaluation.results.find((r) => r._id === student._id);
        if (result) {
          student.answers = result.answers;
          student.has_answer = true;
        } else {
          student.answers = [];
          student.has_answer = false;
        }

        // corrects, incorrects, emptys
        let corrects = 0;
        let incorrects = 0;
        let emptys = 0;
        this.evaluation.content.forEach((c, idx) => {
          if (student.answers[idx] >= 0)
            if (student.answers[idx] === c.correct) corrects += 1;
            else incorrects += 1;
          else emptys += 1;
        });
        student.corrects = corrects;
        student.incorrects = incorrects;
        student.emptys = emptys;
      });
      this.students.splice();
    },
    showEvaluationStudent(student) {
      this.student_selected = student;
      this.show_evaluation_result = true;
    },
  },
  components: {
    EvaluationStudent,
  },
};
</script>

<style lang='scss' scoped>
$size-name: 180px;
$size-value: 32px;
$size-icon: 32px;
$size-spacer: 12px;

.results {
  overflow-x: auto;

  &__name {
    min-width: $size-name;
    max-width: $size-name;
    padding: 4px 0;
    font-size: 0.9rem;
  }
  &__value {
    min-width: $size-value;
    text-align: center;
  }
  &__spacer {
    min-width: $size-spacer;
  }
}

.answer {
  display: block;
  width: $size-icon;
  height: $size-icon;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  * {
    color: #fff;
    font-size: 0.9rem;
  }

  &--correct {
    background: rgb(63, 187, 63);
  }
  &--incorrect {
    background: rgb(255, 117, 117);
  }
  &--empty {
    background: white;
  }
}
</style>