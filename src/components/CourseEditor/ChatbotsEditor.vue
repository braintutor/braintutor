<template>
  <div>
    <loading :active="loading" />
    <div class="row no-gutters">
      <div
        class="col-6 col-sm-4 col-md-3 px-2 pb-4"
        v-for="(chatbot, ch_idx) in chatbots"
        :key="ch_idx"
      >
        <Cartel
          :title="chatbot.name"
          :image="chatbot.image"
          :callback="() => {}"
          :actions="[{
                  icon: 'mdi-eye',
                  callback: () => select(chatbot)
                },{
                  icon: 'mdi-square-edit-outline',
                  callback: () => edit(chatbot)
                }]"
        />
      </div>
      <div v-if="chatbots && chatbots.length < 4" class="col-6 col-sm-4 col-md-3 px-2 pb-4">
        <div class="create transform-scale" @click="createChatbot()">+</div>
      </div>
    </div>
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import loading from "@/components/loading";

import { getChatbotsByCourse, addChatbot } from "@/services/chatbotService.js";
import { getParam, redirect } from "@/services/router.js";

export default {
  data: () => ({
    course_id: "",
    chatbots: [],
    loading: true
  }),
  async mounted() {
    this.course_id = getParam("course_id");
    this.chatbots = await getChatbotsByCourse(this.course_id);
    this.loading = false;
  },
  methods: {
    select(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
    },
    edit(chatbot) {
      redirect("chatbot-editor", { chatbot_id: chatbot._id.$oid });
    },
    async createChatbot() {
      this.loading = true;
      let chatbot = {
        name: "Nombre"
      };
      let chatbot_id = await addChatbot(this.course_id, chatbot);
      chatbot._id = chatbot_id;
      this.edit(chatbot);
      this.loading = false;
    }
  },
  components: {
    Cartel,
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

.create {
  min-height: 160px;
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