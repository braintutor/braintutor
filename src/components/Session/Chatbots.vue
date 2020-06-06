<template>
  <div>
    <loading :active="loading" :message='loading_message' />
    <div class="row no-gutters">
      <div class="col-6 col-sm-4 col-md-3 px-2 pb-4" v-for="(chatbot, c_idx) in chatbots" :key="c_idx">
        <Cartel :title="chatbot.name" :image='chatbot.image' :callback="() => select(chatbot)" />
      </div>
    </div>
    <p class="text-center mt-2" v-show="chatbots.length === 0">No hay unidades.</p>
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
    loading: true,
    loading_message: ''
  }),
  async mounted() {
    let session_id = getParam('session_id')
    this.loading_message = 'Cargando Unidades'
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