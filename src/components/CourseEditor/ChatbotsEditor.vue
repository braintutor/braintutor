<template>
  <div class="container">
    <loading :active="loading" />
    <div class="row no-gutters">
      <div class="col-6 col-sm-4 col-md-3 pa-2" v-for="(chatbot, c_idx) in chatbots" :key="c_idx">
        <Cartel
          :title="chatbot.name"
          image="https://cdn.hipwallpaper.com/i/93/9/2SWDp5.jpg"
          :callback="() => {}"
          :actions="[{
                  icon: 'mdi-square-edit-outline',
                  callback: () => editChatbot(chatbot)
                }]"
        />
      </div>
      <div class="col-6 col-sm-4 col-md-3 pa-2">
        <div class="create transform-scale" @click="createChatbot()">+</div>
      </div>
    </div>
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import loading from "@/components/loading";

import { getParam, redirect } from "@/services/router.js";
import { getChatbots, addChatbot } from "@/services/chatbotService.js";

export default {
  data: () => ({
    course_id: "",
    chatbots: [],
    loading: true
  }),
  async mounted() {
    this.course_id = getParam("course_id");
    this.chatbots = await getChatbots(this.course_id);
    this.loading = false;
  },
  methods: {
    editChatbot(chatbot) {
      redirect("editor", { chatbot_id: chatbot._id.$oid });
    },
    async createChatbot() {
      this.loading = true
      let chatbot = {
        name: "Nombre"
      };
      let chatbot_id = await addChatbot(this.course_id, chatbot);
      chatbot._id = chatbot_id;
      this.editChatbot(chatbot);
      this.loading = false
    }
  },
  components: {
    Cartel,
    loading
  }
};
</script>

<style lang='scss' scoped>
.create {
  height: 100%;
  color: #b6b6b6;
  font-weight: lighter;
  font-size: 3rem;
  border: 2px dashed #b6b6b6;
  border-radius: 10px;
  //
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #eee;
  }
}
</style>