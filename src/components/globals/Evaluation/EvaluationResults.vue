<template>
  <div>
    <div v-show="!show_evaluation_result" class="results">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th class="results__spacer"></th>
            <th>Nota</th>
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
            <td>
              <v-text-field
                class="box-sm"
                v-model="student.score"
                @blur="saveScore(student)"
              ></v-text-field>
            </td>
            <td class="results__value" title="correctas">{{ student.corrects }}</td>
            <td class="results__value" title="incorrectas">{{ student.incorrects }}</td>
            <td class="results__value" title="vacias">{{ student.emptys }}</td>
            <td></td>
            <td v-for="(answer, idx) in student.answers" :key="idx">
              <span
                class="answer"
                :class="[
                  answer.hasBeenAnswered
                    ? answer.isCorrect
                      ? 'answer--correct'
                      : 'answer--incorrect'
                    : 'answer--empty',
                ]"
              >
                <i
                  v-if="answer.hasBeenAnswered"
                  class="fa"
                  :class="[
                    answer.isCorrect
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
import { scoreEvaluation } from "@/services/evaluationService";

class Answer {
  static empty(question) { return new Answer(question, undefined)}
  constructor(question, value) {
    this.question = question
    this.value = value
  }

  get hasBeenAnswered() {
    return this.value >= 0
  }

  get isIncorrect() {
    return this.hasBeenAnswered && this.value !== this.question.correct
  }

  get isCorrect() {
    return this.hasBeenAnswered && this.value === this.question.correct
  }
}

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
          student.answers = this.evaluation.content.map((c, idx) => new Answer(c, result.answers[idx]));
          student.has_answer = true;
        } else {
          student.answers = this.evaluation.content.map(c => Answer.empty(c))
          student.has_answer = false;
        }

        student.corrects = this.corrects(student).length;
        student.incorrects = this.incorrects(student).length;
        student.emptys = this.emptys(student).length;
      });
    },
    corrects(student) {
      return student.answers.filter(answer => answer.isCorrect)
    },
    incorrects(student) {
      return student.answers.filter(answer => answer.isIncorrect)
    },
    emptys(student) {
      return student.answers.filter(answer => !answer.hasBeenAnswered)
    },
    showEvaluationStudent(student) {
      this.student_selected = student;
      this.show_evaluation_result = true;
    },
    async saveScore(student) {
      this.showLoading("Registrando nota");
      try {
        await scoreEvaluation(this.evaluation._id, student._id, student.score)
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    }
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
$size-box-sm:20px;

.box-sm{
  width: $size-box-sm;
}

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