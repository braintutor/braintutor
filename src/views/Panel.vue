<template>
  <!-- Course List -->
  <v-container fluid class="resources-container pa-3">
    <v-row no-gutters>
      <v-col cols="6" md="3" lg="2" class="pa-2" v-for="(course, c_idx) in courses" :key="c_idx">
        <Cartel :title="course.nombre" :callback="() => redirect('chatbot')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cartel from "@/components/Cartel";

import { redirect } from "@/services/tools.js";
import { getCourses } from "@/services/courseService.js";

export default {
  data: () => ({
    courses: []
  }),
  mounted() {
    getCourses().then(res => {
      this.courses = JSON.parse(res);
    });
  },
  methods: {
    redirect
  },
  components: {
    Cartel
  }
};
</script>

<style lang='scss' scoped>
</style>