<template>
  <div class="container">
    <div class="row no-gutters">
      <div class="col-6 col-sm-3 pa-2" v-for="(chatbot, c_idx) in chatbots" :key="c_idx">
        <Cartel
          :title="chatbot.name"
          :image="'https://dekids.com.mx/wp-content/uploads/2016/01/descarga.png'"
          :callback="() => selectChatbot(chatbot)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";

import { getParam, redirect } from "@/services/router.js";
import { getChatbots } from "@/services/chatbotService.js";

export default {
  data: () => ({
    chatbots: []
  }),
  async mounted() {
    let course_id = getParam("course_id");
    this.chatbots = await getChatbots(course_id);
  },
  methods: {
    selectChatbot(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
    }
  },
  components: {
    Cartel
  }
};
</script>

<style>
</style>