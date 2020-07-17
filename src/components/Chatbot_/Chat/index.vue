<template>
  <div class="m-fullscreen">
    <!-- Avatar -->
    <Avatar ref="component_avatar" />
    <!-- Messages -->
    <div
      v-show="show_messages"
      class="m-fullscreen-content background-pattern-1"
      id="messages-container"
    >
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
      <div v-if="loading_message" class="message message-0 message-loading elevation-3">
        <v-progress-linear color="primary" buffer-value="0" stream></v-progress-linear>
      </div>
    </div>
    <!-- Available Questions -->
    <div v-show="!show_messages" class="availables m-fullscreen-content">
      <div
        class="availables__question"
        v-for="(available_question, c_idx) in available_questions"
        :key="c_idx"
        @click="selectAvailableQuestion(available_question); show_messages = true"
      >
        <span>{{ available_question }}</span>
      </div>
      <p
        class="text-center mt-2"
        v-show="available_questions.length === 0"
      >No hay preguntas disponibles.</p>
    </div>
    <!-- Input -->
    <v-form class="input-container" @submit.prevent="sendMessage(); show_messages = true">
      <v-text-field v-model="message_text" class="mr-3 mt-3" dense hide-details autocomplete="off"></v-text-field>
      <v-btn
        :loading="loading_message"
        fab
        icon
        small
        color="primary"
        @click="talkMessage(); show_messages = true"
      >
        <v-icon>mdi-microphone</v-icon>
      </v-btn>
      <v-btn class="material-icon" fab icon small color="primary" @click="scrollLeft()">
        <v-icon>mdi-bookshelf</v-icon>
      </v-btn>
      <v-btn v-if="show_messages" fab icon small color="primary" @click="show_messages = false">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
      <v-btn v-else fab icon small color="primary" @click="show_messages = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import Message from "@/models/Message";

import { scrollLeft, scrollDown } from "@/services/scroll";
// import { getAnswer } from "@/services/chatService";
import { SpeechToText } from "@/services/speech";
import { getParam } from "@/services/router.js";

export default {
  props: ["bot", "knowledge"],
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
    question_template: {},
    loading_message: false,
    show_messages: true
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
    },
    available_questions() {
      return this.knowledge.map(k => k.questions[0]);
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

        try {
          // let { answer, material_id, category } = await getAnswer(
          //   this.chatbot_id,
          //   message_text
          // );
          let { answers, material_id, category } = this.bot.getAnswer(
            message_text
          );
          let answer = answers[Math.floor(Math.random() * answers.length)];

          if (material_id) {
            action = () => {
              let material = this.getMaterial(material_id);
              this.component_materials.selectMaterial(material, category);
              this.scrollLeft();
            };
            if (category) icon = this.icons.find(i => i.category === category);
            else icon = { text: "Ver información" };
          }
          this.addMessage(answer, 0, action, icon);
        } catch (error) {
          this.addMessage("No puedo responder en este momento.", 0, null, null);
        } finally {
          this.loading_message = false;
        }
      }
    },
    talkMessage() {
      this.component_avatar.stopTalk();
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
    },
    scrollLeft() {
      scrollLeft("chatbot-scroll");
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
    font-size: 0.9rem;
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
  .message-loading {
    width: 43px;
    padding: 20px 8px 8px 8px;
    display: flex;
    align-items: flex-end;
  }
}

.availables {
  &__loading {
    padding: 5px;
    color: #888888;
    text-align: center;
  }
  &__question {
    padding: 4px 8px;
    font-size: 0.9rem;
    border-top: 1px solid #eeeeee;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      background: #ecf1ff;
    }
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
.material-icon {
  display: none;
}
@media only screen and (max-width: 955px) {
  .material-icon {
    display: initial;
  }
}
</style>