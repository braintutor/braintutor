<template>
  <div class="m-fullscreen">
    <!-- Avatar -->
    <Avatar ref="component_avatar" />
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
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn fab icon dark small color="primary" v-on="on">
            <v-icon dark>mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
        <div class="available-questions-container">
          <p
            class="available-questions-title"
          >Preguntas disponibles ({{available_questions.length}})</p>
          <div class="available-questions-content">
            <v-list class="pa-0">
              <v-list-item
                v-for="(available_question, c_idx) in available_questions"
                :key="c_idx"
                @click="selectAvailableQuestion(available_question)"
              >
                <v-list-item-title>{{ available_question }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-menu>
    </v-form>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import Message from "@/models/Message";

import { scrollLeft, scrollDown } from "@/services/scroll";
import { getAnswer } from "@/services/chatService";
import { SpeechToText } from "@/services/speech";
import { getParam } from "@/services/router.js";

export default {
  props: ["available_questions", "selectService"],
  data: () => ({
    messages: [new Message("Hola.\n¿En qué puedo ayudarte?", 0)],
    message_text: "",
    chatbot_id: "",
    //
    loading_message: false
  }),
  computed: {
    materials() {
      return this.$store.state.materials;
    },
    component_avatar() {
      return this.$store.state.component_avatar;
    },
    component_materials() {
      return this.$store.state.component_materials;
    }
  },
  mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.$store.commit("setComponentAvatar", this.$refs.component_avatar);
  },
  methods: {
    addMessage(text, type) {
      if (type === 0) this.component_avatar.startTalk(text);
      this.messages.push(new Message(text, type));
      scrollDown("messages-container");
    },
    sendMessage() {
      if (this.message_text && !this.loading_message) {
        getAnswer(this.chatbot_id, this.message_text).then(res => {
          let { answer, material_id, category } = res;
          if (answer) this.addMessage(answer, 0);
          if (material_id) {
            let material = this.getMaterial(material_id);
            this.selectService(0);
            this.component_materials.selectMaterial(material, [category]);
            scrollLeft("chatbot-scroll");
          }
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
    },
    selectAvailableQuestion(question) {
      this.message_text = question;
      if (!question.includes("@")) this.sendMessage();
    },
    getMaterial(material_id) {
      return this.materials.find(material => material._id.$oid === material_id);
    }
  },
  components: {
    Avatar
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
    font-size: calc(12px + 0.2vw);
    white-space: pre-wrap;
    word-wrap: break-word;

    &:hover {
      cursor: pointer;
    }
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

.available-questions-container {
  background: #fff;
  .available-questions-title {
    background: #2c81d5;
    color: #fff;
    text-align: center;
    padding: 8px;
    margin: 0;
  }
  .available-questions-content {
    max-height: 400px;
    overflow: auto;
  }
}
</style>