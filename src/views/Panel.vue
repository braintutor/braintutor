<template>
  <!-- Course List -->
  <v-container class="courses-container">
    <span class="courses-title">Cursos Disponibles</span>
    <div class="courses-search">
      <v-text-field v-model="chatbot_filter" dense hide-details>
        <v-icon slot="append-outer">mdi-magnify</v-icon>
      </v-text-field>
    </div>
    <loading :active="loading_courses" />
    <div class="course" v-for="(course, co_idx) in courses" :key="co_idx">
      <h1 class="course__title">{{course.name}}</h1>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col
            class="pa-3"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            v-for="(chatbot, ch_idx) in course.chatbots"
            :key="ch_idx"
          >
            <Cartel
              :title="chatbot.course"
              :description="chatbot.name"
              :image="'https://dekids.com.mx/wp-content/uploads/2016/01/descarga.png'"
              :callback="() => selectChatbot(chatbot)"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<script>
import loading from "@/components/loading";
import Cartel from "@/components/Cartel";

import { redirect } from "@/services/router.js";
import { getAllCourses } from "@/services/courseService.js";
import { getChatbots } from "@/services/chatbotService.js";

export default {
  data: () => ({
    courses: [],
    chatbot_filter: "",
    loading_courses: true
  }),
  async mounted() {
    let courses = await getAllCourses();
    await Promise.all(
      courses.map(async course => {
        course.chatbots = await getChatbots(course._id.$oid);
        this.courses.push(course);
      })
    );
    this.loading_courses = false;
  },
  computed: {
    chatbots_filtered() {
      return this.chatbots.filter(
        chatbot =>
          chatbot.name
            .toLowerCase()
            .includes(this.chatbot_filter.toLowerCase()) ||
          chatbot.course
            .toLowerCase()
            .includes(this.chatbot_filter.toLowerCase())
      );
    },
    includes(text, filter) {
      return text.toLowerCase().includes(filter.toLowerCase());
    }
  },
  methods: {
    redirect,
    selectChatbot(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
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
  .course {
    padding: 10px;
    border-radius: 10px;
    // @include box-shadow;
    &__title {
      padding: 8px 16px 4px 16px;
      font-size: 1.5rem;
    }
  }
}
</style>