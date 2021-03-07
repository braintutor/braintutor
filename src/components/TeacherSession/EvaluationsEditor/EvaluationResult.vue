<template>
  <div v-if="studentEvaluation.evaluation" class="evaluation">
    <div
      v-for="(c, c_idx) in studentEvaluation.evaluation.content"
      :key="c_idx"
      class="evaluation__question m-card mb-3"
    >
      <div class="m-card__body">
        <div class="score mb-4">
          <strong>Puntaje: </strong>
          <span
            v-if="c.type === 'closed'"
            class="score__value score__value--disabled ml-2"
            >{{ c.score }}</span
          >
          <input
            v-else-if="c.type === 'open' || c.type === 'file'"
            v-model.number="teacher_responses[c_idx].score"
            type="number"
            step="1"
            class="score__value ml-2"
          />
        </div>
        <p class="evaluation__statement">{{ c.question }}</p>
        <div v-if="c.image" class="evaluation__image">
          <img :src="c.image" />
        </div>

        <div v-if="c.type === 'closed'">
          <AnswerTypeClose
            :evaluationId="studentEvaluation.evaluation.id"
            :isReadonly="true"
            :value="studentEvaluation.answers[c_idx]"
            :question="c"
          ></AnswerTypeClose>
        </div>
        <div v-else-if="c.type === 'open'">
          <AnswerTypeOpen
            :evaluationId="studentEvaluation.evaluation.id"
            :isReadonly="true"
            :value="studentEvaluation.answers[c_idx]"
          ></AnswerTypeOpen>
        </div>
        <div v-else-if="c.type === 'file'">
          <QuestionTypeFile
            @selectedFile="showFile"
            :evaluationId="studentEvaluation.evaluation.id"
            :isReadonly="true"
            :value="studentEvaluation.answers[c_idx]"
          ></QuestionTypeFile>
        </div>
      </div>
    </div>
    <div class="m-card mt-5">
      <div class="m-card__body">
        <div>
          <strong>Puntaje Total:</strong>
          <span class="ml-3">{{ score }}</span>
        </div>
        <div class="mt-3">
          <strong>Nota Sugerida:</strong>
          <span class="ml-3">{{ note }}</span>
        </div>
        <div class="mt-3">
          <strong>Nota Final:</strong>
          <input
            type="text"
            v-model="studentEvaluation.score"
            class="ml-3"
            style="border: 1px solid #ccc; border-radius: 8px; padding: 4px 8px"
          />
        </div>
        <hr style="border: 1px solid #ccc" class="my-6" />
        <div>
          <strong>Comentario:</strong>
          <v-textarea
            v-model="comment"
            dense
            auto-grow
            rows="3"
            hide-details
            class="mt-3"
          />
        </div>
      </div>
      <div class="m-card__actions">
        <m-btn
          v-if="!studentEvaluation.is_score_published"
          @click="publicScore()"
          color="dark"
          small
          >Entregar Nota</m-btn
        >
        <strong
          v-else
          class="mr-1"
          style="
            background: #e6e6e6;
            padding: 4px 16px 4px 12px;
            border-radius: 16px;
          "
        >
          <v-icon style="font-size: 1.3rem" class="mr-1">mdi-check</v-icon>
          Nota entregada</strong
        >
        <m-btn @click="saveScore()" color="primary" small class="ml-2"
          >Guardar</m-btn
        >
      </div>
    </div>

    <v-dialog v-if="file_selected" v-model="dlg_file" width="1000">
      <div class="d-flex justify-end">
        <v-btn @click="dlg_file = false">Cerrar</v-btn>
      </div>
      <ViewerFile :file_selected="file_selected"></ViewerFile>
    </v-dialog>
  </div>
</template>

<script>
import {
  scoreEvaluation,
  getStudentEvaluation,
  publishScores,
} from "@/services/evaluationResultService";
import ViewerFile from "./ViewerFile";
import QuestionTypeFile from "@/components/Evaluations/QuestionTypeFile";
import AnswerTypeOpen from "@/components/Evaluations/AnswerTypeOpen";
import AnswerTypeClose from "@/components/Evaluations/AnswerTypeClose";

export default {
  components: {
    ViewerFile,
    QuestionTypeFile,
    AnswerTypeOpen,
    AnswerTypeClose,
  },
  props: {
    studentEvaluationId: String,
  },
  data: () => ({
    studentEvaluation: [],
    teacher_responses: [],
    comment: "",
    // FILE
    file_selected: null,
    dlg_file: false,
  }),
  computed: {
    score() {
      return this.getScore(
        this.studentEvaluation.evaluation,
        this.studentEvaluation
      );
    },
    note() {
      return this.getNote(this.studentEvaluation.evaluation, this.score);
    },
  },
  watch: {
    studentEvaluationId: {
      immediate: true,
      handler: async function(id) {
        let studentEvaluation = await getStudentEvaluation(id);
        this.evaluation = studentEvaluation.evaluation;
        this.comment = studentEvaluation.comment;
        this.teacher_responses = studentEvaluation.evaluation.content.map(
          (_, idx) =>
            studentEvaluation.teacher_responses[idx]
              ? studentEvaluation.teacher_responses[idx]
              : { score: 0 }
        );
        this.studentEvaluation = studentEvaluation;
      },
    },
  },
  methods: {
    showFile(file) {
      this.file_selected = file;
      this.dlg_file = true;
    },
    getScore(evaluation, result) {
      let score = 0;
      evaluation.content.forEach((question, idx) => {
        if (question.type === "closed") {
          if (question.correct === result.answers[idx].alternative)
            score += question.score;
        } else if (question.type === "open" || question.type === "file") {
          score += this.teacher_responses[idx].score || 0;
        }
      });
      return score;
    },
    getNote(evaluation, score) {
      let { map_score_to_note } = evaluation;

      for (let [idx, rule] of map_score_to_note.entries()) {
        if (idx === map_score_to_note.length - 1) return rule.note;
        if (rule.is_equal) {
          if (score <= rule.max) return rule.note;
        } else {
          if (score < rule.max) return rule.note;
        }
      }

      return "-";
    },
    async saveScore() {
      this.showLoading("Guardando Cambios");
      try {
        await scoreEvaluation(
          this.studentEvaluationId,
          this.studentEvaluation.score
        );
        await this.$api.evaluation_result.updateTeacherResponses(
          this.studentEvaluationId,
          {
            comment: this.comment,
            teacher_responses: this.teacher_responses,
          }
        );
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
      this.hideLoading();
    },
    async publicScore() {
      try {
        await this.saveScore();
        this.showLoading("Publicando nota");
        await publishScores([this.studentEvaluationId]);
        this.studentEvaluation.is_score_published = true;
        this.$forceUpdate();
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
      this.hideLoading();
    },
    // File
  },
};
</script>

<style lang="scss" scoped>
.evaluation {
  &__statement {
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
}



.score {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__value {
    width: 80px;
    padding: 6px 8px;
    border: 2px solid #000;
    border-radius: 8px;

    &--disabled {
      border: 2px solid #ccc;
      opacity: 0.5;
    }
  }
}



</style>
