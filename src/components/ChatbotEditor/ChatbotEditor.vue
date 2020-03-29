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
        <v-btn class="editor__action" small color="success" @click="train()">Entrenar Bot</v-btn>
        <v-btn class="editor__action" small color="primary" @click="save()">Guardar Cambios</v-btn>
        <v-btn
          class="editor__action m-4"
          small
          color="error"
          @click="dialog_delete = true; name = ''"
        >Eliminar Unidad</v-btn>
      </div>
    </div>

    <!-- Dialog Error-->
    <v-dialog v-model="dialog_error" max-width="300">
      <v-card>
        <v-card-title>Entrenamiento Fallido</v-card-title>
        <v-card-text>
          <p>Asegúrese de haber ingresado material o preguntas y respuestas, para que el bot pueda aprender.</p>
          <div class="error-img">
            <img src="@/assets/avatar/sad.png" alt />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_error = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Delete -->
    <v-dialog v-model="dialog_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>
          <p>Si elimina este contenido, no podrá revertir los cambios.</p>
          <p>Los materiales y evaluaciones creados para esta unidad también serán eliminados.</p>
          <p>Escriba el nombre de la unidad para proceder con la eliminación.</p>
          <v-text-field v-model="name" dense hide-details autocomplete="off"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_delete = false">Cancelar</v-btn>
          <v-btn
            small
            depressed
            color="error"
            @click="dialog_delete = false; removeChatbot()"
            :disabled="!enableDelete"
          >Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { train } from "@/services/chatService";
import { getParam, redirect } from "@/services/router.js";
import {
  getChatbot,
  updateChatbot,
  removeChatbot
} from "@/services/chatbotService";

export default {
  data: () => ({
    chatbot: null,
    loading: true,
    dialog_error: false,
    dialog_delete: false,
    //
    name: ""
  }),
  async mounted() {
    this.restore();
  },
  computed: {
    enableDelete() {
      return this.chatbot && this.name === this.chatbot.name;
    }
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
    },
    async train() {
      try {
        this.loading = true;
        await train(this.chatbot._id.$oid);
      } catch (error) {
        this.dialog_error = true;
      } finally {
        this.loading = false;
      }
    },
    async removeChatbot() {
      this.loading = true;
      await removeChatbot(this.chatbot._id.$oid);
      redirect("teacher");
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
.error-img {
  display: flex;
  justify-content: center;
  img {
    max-width: 120px;
    background: #5c6dff;
    border-radius: 50%;
  }
}

@media only screen and (max-width: 560px) {
  .editor {
    $self: &;
    &__actions {
      flex-direction: column;
      align-items: center;
      #{$self}__action {
        margin: 4px 0;
      }
    }
  }
}
</style>