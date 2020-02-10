<template>
  <!-- Course List -->
  <v-container class="courses-container">
    <span class="courses-title">Cursos Disponibles</span>
    <div class="courses-search">
      <v-text-field v-model="chatbot_filter" dense hide-details>
        <v-icon slot="append-outer">mdi-magnify</v-icon>
      </v-text-field>
    </div>
    <v-row no-gutters>
      <v-col
        cols="6"
        sm="4"
        md="3"
        lg="2"
        class="pa-2"
        v-for="(chatbot, c_idx) in chatbots_filtered"
        :key="c_idx"
      >
        <Cartel :title="chatbot.course" :description="chatbot.nombre" :callback="() => selectChatbot(chatbot)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cartel from "@/components/Cartel";

import { redirect } from "@/services/router.js";
import { getCourses } from "@/services/courseService.js";
import { getChatbot } from "@/services/chatbotService.js";

export default {
  data: () => ({
    chatbots: [],
    chatbot_filter: ""
  }),
  mounted() {
    getCourses().then(res => {
      let courses = JSON.parse(res);
      courses.forEach(course => {
        getChatbot(course._id.$oid).then(res => {
          let chatbots = JSON.parse(res);
          chatbots.forEach(chatbot => {
            chatbot.course = course.nombre
            this.chatbots.push(chatbot);
          });
        });
      });
    });
  },
  computed: {
    chatbots_filtered() {
      return this.chatbots.filter(chatbot =>
        chatbot.nombre.toLowerCase().includes(this.chatbot_filter.toLowerCase())
      );
    }
  },
  methods: {
    redirect,
    selectChatbot(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
    }
  },
  components: {
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
    font-size: calc(18px + 1.4vw);
    font-weight: bold;
  }
  .courses-search {
    max-width: 600px;
    margin: 20px auto;
    padding: 10px 30px;
    border-radius: 50px;
    @include box-shadow;
  }
}
</style>