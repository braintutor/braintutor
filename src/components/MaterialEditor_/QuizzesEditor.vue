<template>
  <div>
    <loading :active="loading" :message="loading_msg" />
    <section class="quizzes mb-4">
      <v-btn
        class="quizzes__type"
        @click="show_type = 'BAS'"
        :outlined="show_type !== 'BAS'"
        color="warning"
        dark
        small
        rounded
      >Básico</v-btn>
      <v-btn
        class="quizzes__type"
        @click="show_type = 'INT'"
        :outlined="show_type !== 'INT'"
        color="warning"
        dark
        small
        rounded
      >Intermedio</v-btn>
      <v-btn
        class="quizzes__type"
        @click="show_type = 'ADV'"
        :outlined="show_type !== 'ADV'"
        color="warning"
        dark
        small
        rounded
      >Avanzado</v-btn>
    </section>

    <section v-show="show_type === 'BAS'" class="quiz">
      <QuizEditor :data="getQuiz('BAS')" @submit="save($event, 'BAS')" />
    </section>
    <section v-show="show_type === 'INT'" class="quiz">
      <QuizEditor :data="getQuiz('INT')" @submit="save($event, 'INT')" />
    </section>
    <section v-show="show_type === 'ADV'" class="quiz">
      <QuizEditor :data="getQuiz('ADV')" @submit="save($event, 'ADV')" />
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";
import QuizEditor from "@/components/globals/QuizEditor";

import { updateMaterialQuiz } from "@/services/materialService";

export default {
  props: ["material"],
  data: () => ({
    show_type: "BAS",
    loading: false,
    loading_msg: ""
  }),
  methods: {
    getQuiz(type) {
      let quiz = (this.material.quizzes || {})[type] || [];
      return quiz;
    },
    async save(data, type) {
      this.loading = true;
      this.loading_msg = "Guardando";
      try {
        await updateMaterialQuiz(this.material._id.$oid, data, type);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    }
  },
  components: {
    loading,
    QuizEditor
  }
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