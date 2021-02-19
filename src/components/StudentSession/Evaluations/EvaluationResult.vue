<template>
  <div>
    <div class="evaluation mt-3">
      <div v-if="result.score" class="evaluation__score mt-3">
        <strong>Nota:</strong>
        <span class="ml-2">{{ result.score }} </span>
      </div>
      <div v-if="result.comment" class="evaluation__comment mt-3">
        <strong>Comentario:</strong>
        <p style="white-space: pre-line" class="ma-0 mt-2">
          {{ result.comment }}
        </p>
      </div>
      <div class="evaluation__content">
        <div
          v-for="(question, idx) in evaluation.content"
          :key="idx"
          class="question mt-5"
        >
          <p class="question__text ma-0 mb-3">
            <span class="ml-2">{{ question.question }}</span>
          </p>
          <div v-if="question.image" class="question__image my-2">
            <img :src="question.image" alt="" />
          </div>
          <div v-if="question.type === 'closed'">
            <div
              v-for="(alternative, a_idx) in question.alternatives"
              :key="a_idx"
              class="alternative mt-2"
              :class="{
                'alternative--selected': a_idx === result.answers[idx].alternative,
              }"
            >
              <p class="alternative__text ma-0">{{ alternative }}</p>
            </div>
          </div>
          <div v-else-if="question.type === 'open'">
            <h3>Respuesta</h3>
            <p class="ma-0 mt-3">{{result.answers[idx].text}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["evaluation", "result"],
};
</script>

<style lang='scss' scoped>
.evaluation {
  &__score {
    width: max-content;
    padding: 10px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px #ccc;
  }
  &__comment {
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px #ccc;
    white-space: pre-line;
  }
}

.question {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px #ccc;

  &__text {
    font-size: 1rem;
    white-space: pre-line;
  }

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
    }
  }
}

.alternative {
  padding: 8px 16px;
  border-radius: 12px;
  background: rgb(241, 241, 241);

  &__text {
    font-size: 0.9rem;
    white-space: pre-line;
  }

  &--selected {
    background: rgba(72, 121, 255, 0.25);
    color: rgb(72, 121, 255);
    font-weight: bold;
  }
}
</style>