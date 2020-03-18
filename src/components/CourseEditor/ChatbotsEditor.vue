<template>
  <div class="container">
    <div class="row no-gutters">
      <div class="col-6 col-sm-4 col-md-3 pa-2" v-for="(chatbot, c_idx) in chatbots" :key="c_idx">
        <Cartel
          :title="chatbot.name"
          image="https://cdn.hipwallpaper.com/i/93/9/2SWDp5.jpg"
          :callback="() => editChatbot(chatbot)"
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
    editChatbot(chatbot) {
      redirect("editor", { chatbot_id: chatbot._id.$oid });
    }
  },
  components: {
    Cartel
  }
};
</script>

<style>
</style>