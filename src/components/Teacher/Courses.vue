<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <p class="message" v-if="courses.length <= 0">No tiene cursos asignados.</p>
    <div class="row no-gutters">
      <div
        class="col-4 col-6 col-sm-4 col-md-3 px-2 pb-4"
        v-for="(course, c_idx) in courses"
        :key="c_idx"
        @click="edit(course)"
      >
        <div class="course m-card transform-scale">
          <h3 class="course__name">{{course.name}}</h3>
          <div class="course__chatbots">
            <div
              class="course__chatbot"
              v-for="(chatbot, ch_idx) in course.chatbots"
              :key="ch_idx"
            >{{chatbot.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getCoursesByTeacher } from "@/services/courseService";
import { getChatbotsByCourse } from "@/services/chatbotService";
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
    this.loading_message = "Cargando Unidades";
    for (let course of this.courses) {
      let chatbots = await getChatbotsByCourse(course._id.$oid);
      course.chatbots = chatbots;
    }
    this.loading = false;
  },
  methods: {
    edit(course) {
      redirect("course-editor", { course_id: course._id.$oid });
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

.course {
  padding: 6%;
  padding-bottom: 2%;
  border-top: 4px solid #86bd98;
  cursor: pointer;
  &__name {
    padding: 0 4px;
    margin-bottom: 4%;
    font-size: 1.2rem;
  }
  &__chatbots {
  }
  &__chatbot {
    padding: 6px 12px;
    margin-bottom: 4%;
    border-radius: 10px;
    background: #e7e7e7;
    font-weight: lighter;
  }
}
.message {
  margin: 10px;
  color: #797979;
  font-size: 1.1rem;
  font-weight: lighter;
  text-align: center;
}
</style>