<template>
  <div class="editor m-fullscreen">
    <loading :active="loading" />
    <div class="menu">
      <span class="menu-title">Configuración</span>
      <div class="menu-action">
        <v-btn icon @click="restore()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="chatbot" class="editor__content">
      <v-text-field label="Nombre" v-model="chatbot.name" dense hide-details autocomplete="off"></v-text-field>
      <div class="editor__actions">
        <v-btn class="editor__action" small color="primary" @click="save()">Guardar Cambios</v-btn>
        <v-btn
          class="editor__action"
          small
          color="error"
          @click="dialog_delete = true"
          disabled
        >Eliminar Curso</v-btn>
      </div>
    </div>

    <!-- Dialog -->
    <v-dialog v-model="dialog_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>Si elimina este contenido, no podrá revertir los cambios.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_delete = false">Cancelar</v-btn>
          <v-btn small depressed color="error" @click="deleteMaterial(material._id.$oid)">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import { getChatbot, updateChatbot } from "@/services/chatbotService";

export default {
  data: () => ({
    chatbot: null,
    loading: true,
    dialog_delete: false
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
  $self: &;
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
    padding: 30px;
  }
  &__actions {
    width: 100%;
    margin: 20px auto;
    float: right;
    display: flex;
    justify-content: center;
    #{$self}__action {
      margin: 0 4px;
    }
  }
}
</style>