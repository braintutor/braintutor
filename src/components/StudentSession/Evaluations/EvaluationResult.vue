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
                'alternative--selected':
                  a_idx === result.answers[idx].alternative,
              }"
            >
              <p class="alternative__text ma-0">{{ alternative }}</p>
            </div>
          </div>
          <div v-else-if="question.type === 'open'">
            <h3>Respuesta</h3>
            <p class="ma-0 mt-3">{{ result.answers[idx].text }}</p>
          </div>
          <div v-else-if="question.type === 'file'">
            <h3>Respuesta</h3>
            <p class="ma-0 mt-3">{{ result.answers[idx].text }}</p>
            <a
              v-for="(file, f_idx) in result.answers[idx].files"
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
    </div>
  </div>
</template>

<script>
export default {
  props: ["evaluation", "result"],
  methods: {
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