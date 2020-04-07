<template>
  <div>
    <loading :active="loading" />
    <div class="row no-gutters">
      <div class="col-6 col-sm-4 col-md-3 px-2 pb-4" v-for="(chatbot, c_idx) in chatbots" :key="c_idx">
        <Cartel :title="chatbot.name" :callback="() => select(chatbot)" />
      </div>
    </div>
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import loading from "@/components/loading";

import { getChatbotsBySession } from "@/services/chatbotService";
import { getParam, redirect } from "@/services/router.js";

export default {
  data: () => ({
    chatbots: [],
    loading: true
  }),
  async mounted() {
    let session_id = getParam('session_id')
    this.chatbots = await getChatbotsBySession(session_id);
    this.loading = false;
  },
  methods: {
    select(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
    }
  },
  components: {
    Cartel,
    loading
  }
};
</script>

<style lang='scss' scoped>
</style>