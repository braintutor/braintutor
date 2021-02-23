<template>
  <div>
    <div v-show="!show_evaluation_result" class="results">
      <v-btn class="mb-4" :disabled="selected.length === 0" @click="publishScores">Entregar notas</v-btn>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="students"
        item-key="id"
        show-select
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.fullName="{ item }">
          {{ item.student.full_name }}
        </template>
        <template v-slot:item.score="{ item }">
          <div class="d-flex">
              <v-text-field
                class="box-sm"
                placeholder="0"
                v-model="item.score"
                @blur="saveScore(item)"
                :hint="!item.is_score_published? 'Aún no devuelto': false"
                persistent-hint
              >
                <template v-slot:append-outer>
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
                </template>
              </v-text-field>    
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
            {{evaluation_result_selected.student.full_name}}
          </p>
        </div>
      </div>
      <EvaluationStudent :student-evaluation-id="evaluation_result_selected.id" />
    </div>
  </div>
</template>

<script>
import EvaluationStudent from "./EvaluationStudent";
import { scoreEvaluation, publishScores } from "@/services/evaluationResultService";
import { getResults } from "@/services/evaluationService";

export default {
  props: {
    evaluation: Object,
    buttons: Array,
  },
  watch: {
    evaluation: {
      immediate: true,
      handler: async function(val) {
        this.students =  (await getResults(val._id)).results
      }
    }
  },
  data: () => ({
    evaluation_result_selected: null,
    show_evaluation_result: false,
    selected: [],
    students: [],
    headers: [{ text: 'Nombres', value: 'fullName' }, { text: "Nota", value: "score"}]
  }),
  methods: {
    showEvaluationStudent(student) {
      this.evaluation_result_selected = student;
      this.show_evaluation_result = true;
    },
    async saveScore(evaluationResult) {
      if(!evaluationResult.score) {
        return
      }

      this.showLoading("Registrando nota");
      try {
        await scoreEvaluation(evaluationResult.id, evaluationResult.score)
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async publishScores() {
      const studentEvaluationIds = this.selected.map(x => x.id)
      this.showLoading("Publicando notas");
      try {
        await publishScores(studentEvaluationIds)
        // refresh
        this.students =  (await getResults(this.evaluation._id)).results
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