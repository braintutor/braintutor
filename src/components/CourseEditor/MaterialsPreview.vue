<template>
  <Materials v-if="course._id" :course="course">
    <v-btn @click="$emit('edit')" depressed tile>
      <v-icon class="mr-2" style="font-size: 1.1rem">mdi-pencil</v-icon>Editar
    </v-btn>
  </Materials>
</template>

<script>
import Materials from "@/components/Materials/index";

import { getParam } from "@/services/router.js";
import { getCourseByTeacher } from "@/services/courseService";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    course: {}
  }),
  async created() {
    this.loading(true);
    this.loading_msg("Cargando");

    let course_id = getParam("course_id");
    try {
      this.course = await getCourseByTeacher(course_id);
    } catch (error) {
      this.$root.$children[0].showMessage(
        "",
        error.msg || "Ha ocurrido un error."
      );
    }
    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"])
  },
  components: {
    Materials
  }
};
</script>

<style>
</style>