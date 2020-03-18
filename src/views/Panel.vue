<template>
  <!-- Course List -->
  <v-container class="courses-container">
    <span class="courses-title">Cursos Disponibles</span>
    <div class="courses-search">
      <v-text-field v-model="course_filter" dense hide-details>
        <v-icon slot="append-outer">mdi-magnify</v-icon>
      </v-text-field>
    </div>
    <loading :active="loading_courses" />
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col
          class="pa-3"
          cols="6"
          sm="4"
          md="3"
          lg="2"
          v-for="(course, c_idx) in courses_filtered"
          :key="c_idx"
        >
          <Cartel
            :title="course.name"
            :image="'https://dekids.com.mx/wp-content/uploads/2016/01/descarga.png'"
            :callback="() => selectCourse(course)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import loading from "@/components/loading";
import Cartel from "@/components/Cartel";

import { redirect } from "@/services/router.js";
import { getAllCourses } from "@/services/courseService.js";

export default {
  data: () => ({
    courses: [],
    course_filter: "",
    loading_courses: true
  }),
  async mounted() {
    this.courses = await getAllCourses();
    this.loading_courses = false;
  },
  computed: {
    courses_filtered() {
      let courses = this.courses.filter(course =>
        course.name.toLowerCase().includes(this.course_filter.toLowerCase())
      );
      return courses;
    }
  },
  methods: {
    redirect,
    selectCourse(course) {
      redirect("course", { course_id: course._id.$oid });
    }
  },
  components: {
    loading,
    Cartel
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.courses-container {
  .courses-title {
    display: block;
    margin: 20px 0;
    color: #444444;
    text-align: center;
    font-size: 2.5em;
    font-weight: bold;
  }
  .courses-search {
    max-width: 600px;
    margin: 20px auto;
    padding: 10px 24px 10px 32px;
    border-radius: 50px;
    @include box-shadow;
  }
}
</style>