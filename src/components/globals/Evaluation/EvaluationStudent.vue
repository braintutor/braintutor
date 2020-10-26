<template>
  <div class="evaluation">
    <div
      v-for="(c, c_idx) in evaluation.content"
      :key="c_idx"
      class="evaluation__question m-card mb-3"
    >
      <div class="m-card__body">
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
              'alternative__checkbox--active': a_idx === answers[c_idx],
            }"
          ></span>
          <span
            class="alternative__text"
            :class="{
              'alternative__text--correct': a_idx === c.correct,
              'alternative__text--incorrect':
                a_idx !== c.correct && a_idx === answers[c_idx],
            }"
            >{{ alternative }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    evaluation: Object,
    student: Object,
  },
  data: () => ({
    answers: [],
  }),
  created() {
    let result = this.evaluation.results.find(
      (r) => r._id === this.student._id
    );
    if (result) this.answers = result.answers;
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
</style>