<template>
  <div class="container">
    <loading :active="loading" :message="loading_message" />
    <p class="empty" v-if="courses.length <= 0">No tiene cursos asignados.</p>
    <div class="row no-gutters">
      <div
        class="col-6 col-md-4 col-lg-3 px-2 pb-4"
        v-for="(course, c_idx) in courses"
        :key="c_idx"
      >
        <Card :callback="() => edit(course)" color="#86bd98">
          <p class="card-item">{{course.name}}</p>
          <!-- <div
            class="card-value"
            v-for="(chatbot, ch_idx) in course.chatbots"
            :key="ch_idx"
          >{{chatbot.name}}</div>-->
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";
import Card from "@/components/Card";

import { getCoursesByTeacher } from "@/services/courseService";
// import { getChatbotsByCourse } from "@/services/chatbotService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    courses: [],
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    this.loading_message = "Cargando Cursos";
    this.courses = await getCoursesByTeacher();
    // this.loading_message = "Cargando Unidades";
    // for (let course of this.courses) {
    //   let chatbots = await getChatbotsByCourse(course._id.$oid);
    //   course.chatbots = chatbots;
    // }
    this.loading = false;
  },
  methods: {
    edit(course) {
      redirect("course-editor", { course_id: course._id.$oid });
    }
  },
  components: {
    loading,
    Card
  }
};
</script>

<style lang='scss' scoped>
</style>