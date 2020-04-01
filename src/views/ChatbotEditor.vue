<template>
  <AppSidebar :links="links">
    <ChatbotEditor :slot="0" />
    <MaterialsEditor :slot="1" />
    <QuizzesEditor :slot="2" />
    <KnowledgeEditor :slot="3" />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import MaterialsEditor from "@/components/ChatbotEditor/MaterialsEditor/index";
import QuizzesEditor from "@/components/ChatbotEditor/QuizzesEditor/index";
import KnowledgeEditor from "@/components/ChatbotEditor/KnowledgeEditor";
import ChatbotEditor from "@/components/ChatbotEditor/ChatbotEditor";

import { redirect, getParam } from "@/services/router.js";

export default {
  data: () => ({
    chatbot_id: "",
    links: [
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        text: "Configuración"
      },
      {
        image: require("@/assets/braintutor/icon-material.png"),
        text: "Materiales"
      },
      {
        image: require("@/assets/braintutor/icon-quiz.png"),
        text: "Pruebas"
      },
      {
        image: require("@/assets/braintutor/icon-knowledge.png"),
        text: "Conocimiento"
      },
      {
        image: require("@/assets/avatar/normal.png"),
        text: "Chatbot"
      }
    ]
  }),
  mounted() {
    this.chatbot_id = getParam("chatbot_id");
  },
  methods: {
    redirectChatbot() {
      redirect("chatbot", { chatbot_id: this.chatbot_id });
    }
  },
  components: {
    AppSidebar,
    MaterialsEditor,
    QuizzesEditor,
    KnowledgeEditor,
    ChatbotEditor
  }
};
</script>

<style lang='scss'>
</style>