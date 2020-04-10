<template>
  <div class="editor m-fullscreen">
    <loading :active="loading" />
    <div class="menu">
      <p class="menu-title">Configuración</p>
      <div class="menu-action">
        <v-btn icon @click="restore()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="chatbot" class="editor__content">
      <v-text-field
        class="mb-3"
        label="Nombre"
        v-model="chatbot.name"
        dense
        hide-details
        autocomplete="off"
      ></v-text-field>
      <!-- Imagen -->
      <v-card class="editor-image">
        <div class="editor-image__menu">
          <v-text-field
            class="category-text mb-2"
            label="Imagen"
            v-model="chatbot.image"
            dense
            hide-details
          ></v-text-field>
          <v-btn class="ml-2" @click="save()" text icon>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn onclick="upload_image.click()" text icon>
            <v-icon>mdi-upload</v-icon>
          </v-btn>
        </div>
        <div class="editor-image__img">
          <img :src="chatbot.image" alt />
        </div>
        <v-file-input
          id="upload_image"
          @change="onFileSelected()"
          v-model="image_file"
          style="display:none"
        ></v-file-input>
      </v-card>
      <!--  -->
      <v-alert
        class="mt-4 mb-0"
        v-model="show_error"
        type="error"
        icon="mdi-cloud-alert"
        text
        dismissible
      >{{message_error}}</v-alert>
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

import firebase from "firebase";

export default {
  data: () => ({
    chatbot: {},
    image_file: null,
    show_error: false,
    message_error: "",
    //
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
      try {
        var ref = firebase
          .storage()
          .ref(`/chatbot/${this.chatbot._id.$oid}/image`);
        await ref.delete();
      } catch (error) {
        //
      }
      let response = await removeChatbot(this.chatbot._id.$oid);
      if (response.error) {
        this.show_error = true;
        this.message_error = response.error;
      } else {
        redirect("teacher");
      }
      this.loading = false;
    },
    // Image
    onFileSelected() {
      this.loading = true;
      let ref = firebase
        .storage()
        .ref(`/chatbot/${this.chatbot._id.$oid}/image`);
      let task = ref.put(this.image_file);
      task.on(
        "state_changed",
        snapshot => {
          this.image_progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        () => {
          /* error */
        },
        () => {
          this.image_progress = 100;
          task.snapshot.ref.getDownloadURL().then(async url => {
            this.image_progress = 0;
            this.chatbot.image = url;
            this.save();
          });
        }
      );
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.editor-image {
  &__menu {
    padding: 10px;
    padding-top: 16px;
    display: flex;
    align-items: flex-end;
  }
  &__img {
    margin: 0 auto;
    max-width: 600px;
    img {
      width: 100%;
    }
  }
}
.editor {
  $self: &;
  .menu {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menu-title {
      margin: 0 !important;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  &__content {
    padding: 10px;
  }
  &__image {
    margin: 0 auto;
    max-width: 200px;
    img {
      width: 100%;
    }
  }
  &__actions {
    width: 100%;
    margin: 18px auto;
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