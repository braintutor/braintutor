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
    <v-row no-gutters>
      <v-col
        cols="6"
        sm="4"
        md="3"
        lg="2"
        v-for="(chatbot, c_idx) in chatbots_filtered"
        :key="c_idx"
      >
        <Cartel
          :title="chatbot.course"
          :description="chatbot.name"
          :image="'https://i.pinimg.com/originals/ff/92/68/ff92685e660a2d347736f44cc7a11d38.jpg'"
          :callback="() => {}"
          :actions="[{
           icon: 'mdi-robot',
           callback: () => selectChatbot(chatbot)
          },{
           icon: 'mdi-square-edit-outline',
           callback: () => editChatbot(chatbot)
          }]"
        />
      </v-col>
    </v-row>
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
    chatbots: [],
    chatbot_filter: "",
    loading_courses: true
  }),
  async mounted() {
    let courses = await getAllCourses();
    await Promise.all(
      courses.map(async course => {
        let chatbots = await getChatbots(course._id.$oid);
        chatbots.forEach(chatbot => {
          chatbot.course = course.name;
          this.chatbots.push(chatbot);
        });
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
    },
    editChatbot(chatbot) {
      redirect("editor", { chatbot_id: chatbot._id.$oid });
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