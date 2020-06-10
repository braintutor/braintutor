<template>
  <div>
    <loading :active="loading" :message="loading_msg" />
    <!-- Evaluation Content -->
    <div class="evaluation m-card">
      <!-- <div class="time">
        <p>Faltan {{time.m}} minuto(s) y {{time.s}} segundo(s)</p>
      </div>-->
      <p class="evaluation__name">{{evaluation.name}}</p>
      <div class="question" v-for="(c, c_idx) in evaluation.content" :key="c_idx">
        <p class="question__statement">{{`${c_idx + 1}. ${c.question}`}}</p>
        <v-radio-group v-model="c.answer">
          <v-radio
            class="question__alternative"
            v-for="(alternative, a_idx) in c.alternatives"
            :key="a_idx"
            :label="alternative"
            :value="a_idx"
          ></v-radio>
        </v-radio-group>
      </div>
      <div class="evaluation__action">
        <v-btn color="primary" small @click="saveAction()">Finalizar</v-btn>
      </div>
    </div>
    <!-- Dialog Save -->
    <v-dialog v-model="dlg_save" max-width="300">
      <v-card>
        <v-card-title style="font-size: 1.1rem">¿Finalizar Evaluación?</v-card-title>
        <v-card-text>{{dlg_save_msg}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dlg_save = false">Cancelar</v-btn>
          <v-btn small depressed color="primary" @click="dlg_save = false; finish()">Finalizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import {
  updateEvaluationAnswers,
  finishEvaluation
} from "@/services/evaluationService";

export default {
  props: ["evaluation", "getEvaluations", "unselect", "showResult"],
  data: () => ({
    time_remaining: 0,
    time_total: 0,
    //
    loading: false,
    loading_msg: "",
    dlg_save: false,
    dlg_save_msg: ""
  }),
  methods: {
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando Respuestas";
      let evaluation_id = this.evaluation._id.$oid;
      let answers = this.evaluation.content.map(c => c.answer);

      try {
        await updateEvaluationAnswers(evaluation_id, answers);
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
        this.unselect();
      }

      this.loading = false;
    },
    async finish() {
      await this.save();

      this.loading = true;
      this.loading_msg = "Finalizando Evaluación";
      let evaluation_id = this.evaluation._id.$oid;

      try {
        let { score } = await finishEvaluation(evaluation_id);
        this.unselect();
        await this.getEvaluations();
        await this.showResult(score);
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
        this.unselect();
      }

      this.loading = false;
    },
    saveAction() {
      let answer = this.evaluation.content.map(c => c.answer);
      this.dlg_save_msg = answer.every(a => a == null)
        ? "No hay respuestas seleccionadas. ¿Desea continuar?"
        : "No podrá cambiar sus respuestas posteriormente.";
      this.dlg_save = true;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
// .time {
//   color: #acacac;
//   text-align: center;
//   font-size: 0.9rem;
//   font-weight: bold;
// }
.evaluation {
  padding: 18px;
  padding-bottom: 24px;
  &__name {
    margin: 12px 0 28px;
    color: #585858;
    font-size: 1.15rem;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
  }
  &__action {
    margin-top: 8px;
    display: flex;
    justify-content: center;
  }
}
.question {
  padding-bottom: 16px;
  &__statement {
    margin: 8px;
    font-weight: bold;
  }
  &__alternative {
    margin-bottom: 8px;
    padding: 8px 10px;
    background: #f5f5f5;
    border-radius: 10px;
    transition: background-color 0.2s;
    cursor: pointer;
    &:hover {
      background: #e6ecff;
    }
  }
}
</style>