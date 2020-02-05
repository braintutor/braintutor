<template>
  <div class="m-fullscreen">
    <!-- Avatar -->
    <ChatAvatar ref="component_chat_avatar" />
    <!-- Messages -->
    <div class="m-fullscreen-content background-pattern-1" id="messages-container">
      <div
        v-for="(message, m_idx) in messages"
        :key="m_idx"
        class="message elevation-3"
        :class="{ 'message-0': message.type===0, 'message-1 message-to-right': message.type===1 }"
        v-ripple
      >
        <span>{{message.text}}</span>
      </div>
    </div>
    <!-- Input -->
    <v-form class="input-container" @submit.prevent="sendMessage">
      <v-text-field v-model="message_text" class="mr-3 mt-3" dense autocomplete="off"></v-text-field>
      <v-btn :loading="loading_message" fab icon small color="primary" @click="talkMessage()">
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
import { sendMessageTeacher } from "@/services/chatService";
import { getSession } from "@/services/security";
import { SpeechToText, TextToSpeech } from "@/services/speech";

export default {
  data: () => ({
    chatbot_id: "5d7dcb7421e43265b405c307",
    messages: [new Message("Hola.\n¿En qué puedo ayudarte?", 0)],
    message_text: "",
    //
    component_chat_avatar: null,
    //
    loading_message: false
  }),
  mounted() {
    this.component_chat_avatar = this.$refs.component_chat_avatar;
  },
  methods: {
    addMessage(text, type) {
      if (type === 0) {
        TextToSpeech(text, () => {
          this.component_chat_avatar.startAnimationNormal();
        });
        setTimeout(() => this.component_chat_avatar.startAnimationTalk(), 100); // Fixed animation error
      }
      this.messages.push(new Message(text, type));
      scrollDown("messages-container");
    },
    sendMessage() {
      if (this.message_text && !this.loading_message) {
        sendMessageTeacher(
          this.chatbot_id,
          this.message_text,
          getSession().token
        ).then(res => {
          let response = res.respuesta;
          if (response) this.addMessage(response, 0);
          this.loading_message = false;
        });
        this.addMessage(this.message_text, 1);
        this.message_text = "";
        this.loading_message = true;
      }
    },
    talkMessage() {
      SpeechToText(text => {
        this.message_text = text;
        this.sendMessage();
      });
    }
  },
  components: {
    ChatAvatar
  }
};
</script>

<style lang='scss' scoped>
#messages-container {
  padding: 10px;
  display: flex;
  flex-direction: column;

  .message {
    margin: 3px 0;
    padding: 8px 14px;
    width: max-content;
    max-width: 70%;
    border-radius: 6px;
    font-size: 14px;
    white-space: pre-wrap;
    cursor: pointer;

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
    margin-left: auto;
  }
}

.input-container {
  padding: 0 8px 0 16px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eeeeee;
}
</style>