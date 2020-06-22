<template>
  <div class="container">
    <AppSidebar :links="links" :action_links="action_links">
      <MaterialsEditor :slot="0" />
      <KnowledgeEditor :slot="1" :get="get" :update="update" />
      <ChatbotEditor :slot="2" />
    </AppSidebar>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import MaterialsEditor from "@/components/ChatbotEditor/MaterialsEditor/index";
import KnowledgeEditor from "@/components/globals/KnowledgeEditor";
import ChatbotEditor from "@/components/ChatbotEditor/ChatbotEditor";

import { getKnowledge, updateKnowledge } from "@/services/knowledgeService";
import { redirect, getParam } from "@/services/router.js";

export default {
  data: () => ({
    chatbot_id: "",
    links: [
      {
        image: require("@/assets/braintutor/icon-material.png"),
        text: "Materiales"
      },
      {
        image: require("@/assets/braintutor/icon-knowledge.png"),
        text: "Conocimiento"
      },
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        text: "Configuración"
      }
    ],
    action_links: []
  }),
  mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.action_links = [
      {
        image: require("@/assets/avatar/normal.png"),
        action: () => {
          this.redirectChatbot();
        }
      }
    ];
  },
  methods: {
    redirectChatbot() {
      redirect("chatbot", { chatbot_id: this.chatbot_id });
    },
    async get() {
      return await getKnowledge(this.chatbot_id);
    },
    async update(knowledge) {
      return await updateKnowledge(this.chatbot_id, knowledge);
    }
  },
  components: {
    AppSidebar,
    MaterialsEditor,
    KnowledgeEditor,
    ChatbotEditor
  }
};
</script>

<style lang='scss'>
</style>