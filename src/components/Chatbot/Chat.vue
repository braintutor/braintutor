<template>
  <div class="m-fullscreen">
    <!-- Avatar -->
    <ChatAvatar />
    <!-- Messages -->
    <div class="m-fullscreen-content" id="messages-container">
      <div
        v-for="(message, m_idx) in messages"
        :key="m_idx"
        class="d-flex"
        :class="{ 'message-to-right': message.type==1 }"
      >
        <v-card
          v-ripple
          class="message"
          :class="{ 'message-0': message.type===0, 'message-1': message.type===1 }"
        >
          <span>{{message.text}}</span>
        </v-card>
      </div>
    </div>
    <!-- Input -->
    <v-form class="input-container" @submit.prevent="sendMessage">
      <v-text-field  v-model="message_text" class="mr-3 mt-3" dense autocomplete="off"></v-text-field>
      <v-btn :loading="loading_message" fab icon small color="primary" @click="sendMessage()">
        <v-icon dark>mdi-send</v-icon>
      </v-btn>
      <v-btn :loading="loading_microphone" fab icon small color="primary" @click="talkMessage()">
        <v-icon dark>mdi-microphone</v-icon>
      </v-btn>

      <!-- <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn fab icon dark small color="primary" v-on="on">
            <v-icon dark>mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
        <div class="contenedor-preguntas-disponibles">
          <p>Preguntas disponibles ({{conocimientos.length}})</p>
          <div>
            <v-list>
              <v-list-item
                v-for="(conocimiento, c_idx) in conocimientos"
                :key="c_idx"
                @click="escribirMensaje(conocimiento.preguntas[0]); if(!conocimiento.preguntas[0].includes('@')) enviarMensaje()"
              >
                <v-list-item-title>{{ conocimiento.preguntas[0] }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-menu>-->
    </v-form>
  </div>
</template>

<script>
import ChatAvatar from "./ChatAvatar";
import Message from "@/models/Message";
import { scrollDown } from "@/services/tools";

export default {
  data: () => ({
    messages: Array(8).fill(new Message("probando", 0)),
    message_text: "",
    //
    loading_message: false,
    loading_microphone: false
  }),
  methods: {
    sendMessage() {
      if (this.message_text) {
        this.messages.push(new Message(this.message_text, 1));
        this.message_text = "";
        scrollDown("messages-container");
      }
    },
    talkMessage() {}
  },
  components: {
    ChatAvatar
  }
};
</script>

<style lang='scss' scoped>
#messages-container {
  padding: 10px;

  .message {
    margin: 2px 0;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 6px;
    width: max-content;
    max-width: 70%;
    white-space: pre-wrap;

    &.message-0 {
      background: #fff;
      color: #000;
    }
    &.message-1 {
      background: #1976d2;
      color: #fff;
    }
  }
  .message-to-right {
    justify-content: flex-end;
  }
}

.input-container {
  padding: 0 8px 0 16px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eeeeee;
}
</style>