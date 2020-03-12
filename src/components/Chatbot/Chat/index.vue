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
      >
        <span>{{message.text}}</span>
        <div class="message-action" v-if="message.action">
          <v-btn @click="message.action" color="primary" small outlined block>
            {{message.icon.text}}
            <v-icon small v-if="message.icon.icon" right>mdi-{{message.icon.icon}}</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <!-- Input -->
    <v-form class="input-container" @submit.prevent="sendMessage">
      <v-text-field v-model="message_text" class="mr-3 mt-3" dense hide-details autocomplete="off"></v-text-field>
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
            <v-list>
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
    icons: [
      {
        category: "overview",
        icon: "",
        text: "Ver información"
      },
      {
        category: "explanation",
        icon: "",
        text: "Ver información"
      },
      {
        category: "bullets",
        icon: "",
        text: "Ver información"
      },
      {
        category: "hyperlinks",
        icon: "",
        text: "Ver enlaces"
      },
      {
        category: "examples",
        icon: "",
        text: "Ver ejemplos"
      },
      {
        category: "exercises",
        icon: "",
        text: "Ver ejercicios"
      },
      {
        category: "movies",
        icon: "video",
        text: "Ver videos"
      },
      {
        category: "images",
        icon: "image",
        text: "Ver imágenes"
      },
      {
        category: "faq",
        icon: "help",
        text: "Más preguntas"
      }
    ],
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
    addMessage(text, type, action, icon) {
      if (text && type === 0) this.component_avatar.startTalk(text);
      this.messages.push(new Message(text, type, action, icon));
      setTimeout(() => {
        scrollDown("messages-container");
      }, 100);
    },
    async sendMessage() {
      if (this.message_text && !this.loading_message) {
        let message_text = this.message_text;
        let action = null;
        let icon = null;
        this.loading_message = true;
        this.component_avatar.stopTalk();

        this.addMessage(message_text, 1);
        this.message_text = "";

        setTimeout(async () => {
          // delay response for more realism
          try {
            let { answer, material_id, category } = await getAnswer(
              this.chatbot_id,
              message_text
            );
            if (material_id) {
              action = () => {
                let material = this.getMaterial(material_id);
                this.selectService(0);
                this.component_materials.selectMaterial(material, category);
                scrollLeft("chatbot-scroll");
              };
              icon = this.icons.find(i => i.category === category);
            }
            this.addMessage(answer, 0, action, icon);
          } catch (error) {
            // I want application to not crush, but don't care about the message
          } finally {
            this.loading_message = false;
          }
        }, 500);
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
    font-size: 0.95rem;
    white-space: pre-wrap;
    word-wrap: break-word;

    &.message-0 {
      background: #fff;
      color: #000;
    }
    &.message-1 {
      background: #1976d2;
      color: #fff;
    }
    .message-action {
      padding-top: 5px;
      display: flex;
      justify-content: center;
    }
  }
  .message-to-right {
    margin-left: auto;
  }
}

.input-container {
  padding: 4px 8px 4px 12px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eeeeee;
  & * {
    margin: 0 !important;
  }
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