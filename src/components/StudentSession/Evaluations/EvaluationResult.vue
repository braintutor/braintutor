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
      <EvaluationDetail :evaluation="evaluation" :answers="result.answers"></EvaluationDetail>
     
    </div>
  </div>
</template>

<script>

import EvaluationDetail from "@/components/Evaluations/Detail"
export default {
  components: { EvaluationDetail},
  props: ["evaluation", "result"],
  methods: {
 
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




</style>