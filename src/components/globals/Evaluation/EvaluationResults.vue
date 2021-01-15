<template>
  <div>
    <div v-show="!show_evaluation_result" class="results">
      <v-btn class="mb-4">Entregar notas</v-btn>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="students"
        item-key="_id"
        show-select
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.fullName="{ item }">
          {{ `${item.last_name}, ${item.first_name}` }}
        </template>
        <template v-slot:item.score="{ item }">
          <div class="d-flex">
            <v-text-field
              class="box-sm"
              v-model="item.score"
              @blur="saveScore(item)"
            ></v-text-field>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="showEvaluationStudent(item)"
                >
                  <v-icon>mdi-magnify</v-icon>              
                </v-btn>
              </template>
              <span>Ver Examen</span>
            </v-tooltip>
            
          </div>

          <!--:disabled="!student.has_answer" 
             <td v-for="(button, idx) in buttons" :key="idx" @click="button.action(student)">
            <v-btn>{{ button.text }}</v-btn>
          </td> -->

        </template>
      </v-data-table>
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

    selected: [],
    headers: [{ text: 'Nombres', value: 'fullName' }, { text: "Nota", value: "score"}]
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