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
          <span class="score__value ml-2">{{ c.score }}</span>
        </div>
        <p class="evaluation__statement">{{ c.question }}</p>
        <div v-if="c.image" class="evaluation__image">
          <img :src="c.image" />
        </div>
        <div
          v-for="(alternative, a_idx) in c.alternatives"
          :key="a_idx"
          class="alternative mt-3"
        >
          <span
            class="alternative__checkbox mr-3"
            :class="{
              'alternative__checkbox--active':
                a_idx === studentEvaluation.answers[c_idx],
            }"
          ></span>
          <span
            class="alternative__text"
            :class="{
              'alternative__text--correct': a_idx === c.correct,
              'alternative__text--incorrect':
                a_idx !== c.correct &&
                a_idx === studentEvaluation.answers[c_idx],
            }"
            >{{ alternative }}</span
          >
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
            v-model="studentEvaluation.comment"
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
    //
    score: 0,
    note: "",
  }),
  watch: {
    studentEvaluationId: {
      immediate: true,
      handler: async function (id) {
        this.studentEvaluation = await getStudentEvaluation(id);
        this.score = this.getScore(
          this.studentEvaluation.evaluation,
          this.studentEvaluation
        );
        this.note = this.getNote(this.studentEvaluation.evaluation, this.score);
      },
    },
  },
  methods: {
    getScore(evaluation, result) {
      let score = 0;
      evaluation.content.forEach((question, idx) => {
        if (question.correct === result.answers[idx]) score += question.score;
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
        await this.$api.evaluation_result.updateComment(
          this.studentEvaluationId,
          {
            comment: this.studentEvaluation.comment,
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
  },
};
</script>

<style lang='scss' scoped>
.evaluation {
  &__question {
  }
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
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
}
</style>