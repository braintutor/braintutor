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
          <div
            v-for="(alternative, a_idx) in c.alternatives"
            :key="a_idx"
            class="alternative mt-3"
          >
            <span
              class="alternative__checkbox mr-3"
              :class="{
                'alternative__checkbox--active':
                  a_idx === studentEvaluation.answers[c_idx].alternative,
              }"
            ></span>
            <span
              class="alternative__text"
              :class="{
                'alternative__text--correct': a_idx === c.correct,
                'alternative__text--incorrect':
                  a_idx !== c.correct &&
                  a_idx === studentEvaluation.answers[c_idx].alternative,
              }"
              >{{ alternative }}</span
            >
          </div>
        </div>
        <div v-else-if="c.type === 'open'">
          <h3>Respuesta:</h3>
          <p class="ma-0 mt-3">{{ studentEvaluation.answers[c_idx].text }}</p>
        </div>
        <div v-else-if="c.type === 'file'">
          <h3>Respuesta:</h3>
          <p class="ma-0 mt-3">{{ studentEvaluation.answers[c_idx].text }}</p>
          <a
            v-for="(file, f_idx) in studentEvaluation.answers[c_idx].files"
            :key="f_idx"
            class="file mt-2"
          >
            <a :href="file.url" target="_blank" class="file__body">
              <div class="file__type">
                <img
                  v-if="getType(file) === 'audio'"
                  src="@/assets/file/icon-audio.svg"
                />
                <img
                  v-else-if="getType(file) === 'image'"
                  src="@/assets/file/icon-image.svg"
                />
                <img
                  v-else-if="getType(file) === 'video'"
                  src="@/assets/file/icon-video.svg"
                />
                <!--  -->
                <img
                  v-else-if="file.content_type === 'application/pdf'"
                  src="@/assets/file/icon-application-pdf.svg"
                />
                <img v-else src="@/assets/file/icon-default.svg" />
              </div>
              <span class="file__name">{{ getName(file) }}</span>
            </a>
          </a>
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
  </div>
</template>

<script>
import {
  scoreEvaluation,
  getStudentEvaluation,
  publishScores,
} from "@/services/evaluationResultService";

export default {
  props: {
    studentEvaluationId: String,
  },
  data: () => ({
    studentEvaluation: [],
    teacher_responses: [],
    comment: "",
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
      handler: async function (id) {
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
    getName(file) {
      return file.name.substring(file.name.lastIndexOf("/") + 1);
    },
    getType(file) {
      return file.content_type.split("/")[0];
    },
  },
};
</script>

<style lang='scss' scoped>
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

.alternative {
  display: flex;
  align-items: center;
  &__checkbox {
    position: relative;
    flex-shrink: 0;
    display: block;
    width: 18px;
    height: 18px;
    border: 1px solid var(--color-active);
    border-radius: 50%;

    &--active:before {
      content: " ";
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      background: var(--color-active);
      border-radius: 50%;
    }
  }
  &__text {
    flex-grow: 1;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.025);
    border-radius: 6px;
    white-space: pre-line;
    &:last-child {
      margin-bottom: 0;
    }
    &--correct {
      background: rgba(17, 192, 70, 0.2);
      color: rgb(17, 192, 69);
    }
    &--incorrect {
      background: rgba(197, 47, 47, 0.2);
      color: rgb(197, 47, 47);
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