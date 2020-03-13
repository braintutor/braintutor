<template>
  <div class="course-editor container">
    <loading :active="loading" />
    <h1 class="course-editor__title">Configuración</h1>
    <div class="course-editor__content">
      <v-text-field v-model="course.name" dense hide-details autocomplete="off"></v-text-field>
    </div>
    <div class="course-editor__actions">
      <v-btn color="primary" @click="save()">Guardar</v-btn>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import { getCourse, updateCourse } from "@/services/courseService.js";

export default {
  data: () => ({
    course: {},
    loading: true
  }),
  async mounted() {
    let course_id = getParam("course_id");
    this.course = await getCourse(course_id);
    this.course.id = course_id;
    this.loading = false;
  },
  methods: {
    async save() {
      if (!this.loading) {
        this.loading = true;
        await updateCourse(this.course);
        this.loading = false;
      }
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.course-editor {
  padding: 20px;
  border-radius: 10px;
  @include box-shadow;

  &__title {
    font-size: 1.5rem;
  }
  &__content {
    padding: 20px 0;
  }
  &__actions {
    width: min-content;
    margin: 0 auto;
  }
}
</style>