<template>
  <!-- Course List -->
  <v-container class="pa-3">
    <v-row no-gutters>
      <v-col cols="6" sm='4' md="3" lg="2" class="pa-2" v-for="(chatbot, c_idx) in chatbots" :key="c_idx">
        <Cartel :title="chatbot.nombre" :callback="() => selectChatbot(chatbot)" />
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
    chatbots: []
  }),
  mounted() {
    getCourses().then(res => {
      let courses = JSON.parse(res);
      courses.forEach(course => {
        getChatbot(course._id.$oid).then(res=> {
          let chatbots = JSON.parse(res)
          chatbots.forEach(chatbot => {
            this.chatbots.push(chatbot)
          })
        })
      });
    });
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
</style>