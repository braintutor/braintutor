<template>
  <div>
    <!-- Evaluation Content -->
    <div class="evaluation">
      <!-- <div class="time">
        <p>Faltan {{time.m}} minuto(s) y {{time.s}} segundo(s)</p>
      </div>-->
      <p class="evaluation__name">{{ evaluation.name }}</p>
      <div
        class="question m-card mb-4"
        v-for="(c, c_idx) in evaluation.content"
        :key="c_idx"
      >
        <div class="m-card__body">
          <p class="question__statement">{{ c.question }}</p>
          <div v-if="c.image" class="question__image">
            <img :src="c.image" />
          </div>
          <v-radio-group v-model="c.answer">
            <v-radio
              class="question__alternative"
              v-for="(alternative, a_idx) in c.alternatives"
              :key="a_idx"
              :label="alternative"
              :value="a_idx"
            ></v-radio>
            <label
              class="m-btn m-btn--dark m-btn--text m-btn--small mt-3 mx-auto"
              style="width: max-content"
              :for="c_idx + ''"
            >
              Limpiar
            </label>
            <v-radio v-show="false" :value="-1" :id="c_idx + ''"></v-radio>
          </v-radio-group>
        </div>
      </div>
      <div class="evaluation__action">
        <m-btn @click="saveAction()" color="primary" small>Finalizar</m-btn>
      </div>
    </div>
    <!-- Dialog Save -->
    <v-dialog v-model="dlg_save" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Finalizar Evaluación?</h3>
          <p v-for="(m, idx) in dlg_save_msg" :key="idx" class="mt-4">
            {{ m }}
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_save = false"
            color="primary"
            small
            text
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_save = false;
              finish();
            "
            color="primary"
            small
            >Finalizar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {
  updateEvaluationAnswers,
  finishEvaluation,
} from "@/services/evaluationService";

export default {
  props: ["evaluation", "unselect"],
  data: () => ({
    time_remaining: 0,
    time_total: 0,
    //
    dlg_save: false,
    dlg_save_msg: "",
  }),
  methods: {
    async save() {
      this.showLoading("Guardando Respuestas");
      let evaluation_id = this.evaluation._id.$oid;
      let answers = this.evaluation.content.map((c) => {
        return c.answer != null ? c.answer : -1;
      });
      try {
        await updateEvaluationAnswers(evaluation_id, answers);
      } catch (error) {
        this.showMessage("", error.msg || error);
        this.unselect();
      }
      this.hideLoading();
    },
    async finish() {
      await this.save();
      this.showLoading("Finalizando Evaluación");
      let evaluation_id = this.evaluation._id.$oid;
      try {
        await finishEvaluation(evaluation_id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.unselect();
      this.hideLoading();
    },
    saveAction() {
      let answer = this.evaluation.content.map((c) => c.answer);
      this.dlg_save_msg = answer.every((a) => a == null)
        ? [
            "¡No hay respuestas seleccionadas!",
            "No podrá cambiar sus respuestas posteriormente. ¿Desea continuar?",
          ]
        : ["No podrá cambiar sus respuestas posteriormente. ¿Desea continuar?"];
      this.dlg_save = true;
    },
  },
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
  &__statement {
    margin: 8px;
    font-weight: bold;
    white-space: pre-line;
  }
  &__image {
    max-width: 80%;
    margin: 20px auto;
    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
  }
  &__alternative {
    margin-bottom: 8px;
    padding: 8px 10px;
    background: #f5f5f5;
    border-radius: 10px;
    transition: background-color 0.2s;
    white-space: pre-line;
    cursor: pointer;
    &:hover {
      background: #e6ecff;
    }
  }
}
</style>