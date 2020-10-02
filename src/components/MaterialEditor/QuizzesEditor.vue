<template>
  <div style="padding-bottom: 120px">
    <section class="quizzes mb-4">
      <m-btn
        class="quizzes__type"
        @click="show_type = 'BAS'"
        :text="show_type !== 'BAS'"
        color="warning"
        small
        >Básico</m-btn
      >
      <m-btn
        class="quizzes__type"
        @click="show_type = 'INT'"
        :text="show_type !== 'INT'"
        color="warning"
        small
        >Intermedio</m-btn
      >
      <m-btn
        class="quizzes__type"
        @click="show_type = 'ADV'"
        :text="show_type !== 'ADV'"
        color="warning"
        small
        >Avanzado</m-btn
      >
    </section>

    <section v-show="show_type === 'BAS'" class="quiz">
      <QuizEditor
        :quiz="getQuiz('BAS')"
        :maxlength="MaterialModel.quizzes.max_length"
        @submit="save"
      />
    </section>
    <section v-show="show_type === 'INT'" class="quiz">
      <QuizEditor
        :quiz="getQuiz('INT')"
        :maxlength="MaterialModel.quizzes.max_length"
        @submit="save"
      />
    </section>
    <section v-show="show_type === 'ADV'" class="quiz">
      <QuizEditor
        :quiz="getQuiz('ADV')"
        :maxlength="MaterialModel.quizzes.max_length"
        @submit="save"
      />
    </section>
  </div>
</template>

<script>
import QuizEditor from "@/components/globals/QuizEditor";

import { updateMaterialQuiz } from "@/services/materialService";

import MaterialModel from "@/models/Material";

export default {
  props: ["material"],
  data: () => ({
    show_type: "BAS",
    MaterialModel,
  }),
  methods: {
    getQuiz(type) {
      let quiz = (this.material.quizzes || {})[type] || [];
      return quiz;
    },
    async save(data) {
      this.showLoading("Guardando");
      let material_id = this.material._id.$oid;
      let type = this.show_type;
      try {
        await updateMaterialQuiz(material_id, data, type);
        this.material.quizzes[type] = data;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    QuizEditor,
  },
};
</script>

<style lang='scss' scoped>
.quizzes {
  display: flex;
  justify-content: center;

  &__type {
    margin: 0 4px;
  }
}
</style>