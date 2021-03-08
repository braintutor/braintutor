<template>
  <div class="mt-2">
    <div
      v-for="(c, c_idx) in evaluation.content"
      :key="c_idx"
      class="question m-card mb-3"
    >
      <div class="m-card__body">
        <slot name="score"  v-bind:question="c" v-bind:idx="c_idx"></slot>
        <p class="question__text">{{ c.question }}</p>
        <div v-if="c.image" class="question__image">
          <img :src="c.image" />
        </div>

        <div v-if="c.type === 'closed'">
          <AnswerTypeClose
            :evaluationId="evaluation.id"
            :isReadonly="true"
            :value="answers[c_idx]"
            :question="c"
          ></AnswerTypeClose>
        </div>
        <div v-else-if="c.type === 'open'">
          <AnswerTypeOpen
            :evaluationId="evaluation.id"
            :isReadonly="true"
            :value="answers[c_idx]"
          ></AnswerTypeOpen>
        </div>
        <div v-else-if="c.type === 'file'">
          <AnswerTypeFile
            @selectedFile="showFile"
            :evaluationId="evaluation.id"
            :isReadonly="true"
            :value="answers[c_idx]"
          ></AnswerTypeFile>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnswerTypeFile from "@/components/Evaluations/AnswerTypeFile";
import AnswerTypeOpen from "@/components/Evaluations/AnswerTypeOpen";
import AnswerTypeClose from "@/components/Evaluations/AnswerTypeClose";

export default {
  components: {
    AnswerTypeFile,
    AnswerTypeOpen,
    AnswerTypeClose,
  },
  props: ["evaluation", "answers"],
  methods: {
    showFile(f){
      this.$emit("showFile", f)
    }
  }
};
</script>

<style lang="scss" scoped>


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
</style>
