<template>
  <div class="editor m-fullscreen">
    <loading :active="loading" />
    <div class="menu">
      <span class="menu-title">Configuración</span>
      <div class="menu-action">
        <v-btn icon @click="restore()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
        <v-btn icon @click="save()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="chatbot" class="editor__content">
      <v-text-field label="Nombre" v-model="chatbot.name" dense hide-details autocomplete="off"></v-text-field>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import { getChatbot, updateChatbot } from "@/services/chatbotService";

export default {
  data: () => ({
    chatbot: null,
    loading: true
  }),
  async mounted() {
    this.restore();
  },
  methods: {
    async restore() {
      this.loading = true;
      let chatbot_id = getParam("chatbot_id");
      this.chatbot = await getChatbot(chatbot_id);
      this.loading = false;
    },
    async save() {
      this.loading = true;
      this.chatbot.id = this.chatbot._id.$oid;
      await updateChatbot(this.chatbot);
      this.loading = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.editor {
  .menu {
    padding: 10px 20px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menu-title {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  &__content {
    padding: 20px 30px;
  }
}
</style>