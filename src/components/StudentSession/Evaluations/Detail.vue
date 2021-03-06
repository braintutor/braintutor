<template>
  <div>
    <!-- Evaluation Content -->
    <div class="evaluation">
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn icon @click="$emit('onExit')">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">Volver</span>
        </div>
      </div>
   
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
          <div v-if="c.type === 'closed'">
            <AnswerTypeClose
            :evaluationId="evaluation._id"
            v-model="answers[c_idx]"
            :question="c"
            :id="c_idx"
          ></AnswerTypeClose>
          </div>
          <div
            v-else-if="c.type === 'open'"
            class="pt-4"
            style="border-top: 1px solid #ddd"
          >
             <AnswerTypeOpen
              :evaluationId="evaluation._id"
              v-model="answers[c_idx]"
            ></AnswerTypeOpen>
          </div>
          <div
            v-else-if="c.type === 'file'"
            class="pt-4"
            style="border-top: 1px solid #ddd"
          >
            <AnswerTypeFile
              @selectedFile="showFile"
              :evaluationId="evaluation._id"
              v-model="answers[c_idx]"
            ></AnswerTypeFile>
          </div>
        </div>
      </div>
      <div class="evaluation__action">
        <m-btn @click="save()" color="primary" small>Guardar</m-btn>
        <m-btn @click="dlg_save = true" color="dark" small class="ml-2"
          >Finalizar</m-btn
        >
      </div>
    </div>
    <!-- Dialog Save -->
    <v-dialog v-model="dlg_save" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Finalizar Evaluación?</h3>
          <p class="mt-4">
            No podrá cambiar sus respuestas posteriormente. ¿Desea continuar?
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
import AnswerTypeClose from "@/components/Evaluations/AnswerTypeClose";
import AnswerTypeOpen from "@/components/Evaluations/AnswerTypeOpen";
import AnswerTypeFile from "@/components/Evaluations/AnswerTypeFile";

export default {
  components: { AnswerTypeFile, AnswerTypeOpen, AnswerTypeClose },
  props: ["evaluation"],
  data: () => ({
    time_remaining: 0,
    time_total: 0,
    answers: [],
    dlg_save: false,
  }),
  async created() {
    this.answers = this.evaluation.content.map(() => ({
      files: [],
    }));
    this.showLoading("Cargando");
    try {
      this.answers = await this.$api.evaluation.getAnswers(this.evaluation._id);
    } catch (error) {
      this.showMessage("", "Ha ocurrido un error");
      this.$emit("onExit");
    }
    this.hideLoading();
  },
  methods: {
    showFile({ url }) {
      window.open(url, '_blank');

    },
    async save() {
      this.showLoading("Guardando Respuestas");
      try {
        await this.$api.evaluation.updateAnswers(this.evaluation._id, {
          answers: this.answers,
        });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async finish() {
      await this.save();
      this.showLoading("Finalizando Evaluación");
      try {
        await this.$api.evaluation.finishExam(this.evaluation._id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
      this.$emit("onExit");
    },
  },
};
</script>

<style lang="scss" scoped>
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
.file {
  display: block;
  background: rgba(0, 0, 255, 0.07);
  border-radius: 6px;
  display: flex;
  align-items: center;

  &__body {
    overflow: hidden;
    flex-grow: 1;
    color: rgba(0, 0, 0, 0.75);
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 255, 0.05);
    }
  }

  &__type {
    padding: 16px;
    opacity: 0.6;
    display: flex;
    align-items: center;

    img {
      height: 32px;
      width: 32px;
    }
  }
  &__name {
    flex-grow: 1;
    padding: 8px;
  }
}
</style>
