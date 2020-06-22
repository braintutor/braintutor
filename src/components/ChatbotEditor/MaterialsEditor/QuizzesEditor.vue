<template>
  <div>
    <Menu :title="material.name" :back="unselectMaterial" />
    <section class="quizzes">
      <v-btn
        class="quizzes__type"
        @click="show_type = 'BAS'"
        :color="show_type === 'BAS'? '#f1c53a': ''"
        :dark="show_type === 'BAS'"
        small
        rounded
      >Básico</v-btn>
      <v-btn
        class="quizzes__type"
        @click="show_type = 'INT'"
        :color="show_type === 'INT'? '#f1c53a': ''"
        :dark="show_type === 'INT'"
        small
        rounded
      >Intermedio</v-btn>
      <v-btn
        class="quizzes__type"
        @click="show_type = 'ADV'"
        :color="show_type === 'ADV'? '#f1c53a': ''"
        :dark="show_type === 'ADV'"
        small
        rounded
      >Avanzado</v-btn>
    </section>

    <section class="quiz">
      <QuizEditor :data="(material.quizzes || {})[show_type]" />
    </section>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import QuizEditor from "@/components/globals/QuizEditor";

export default {
  props: ["material", "unselectMaterial"],
  data: () => ({
    show_type: "BAS"
  }),
  components: {
    Menu,
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