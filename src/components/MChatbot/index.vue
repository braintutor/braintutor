<template>
  <div
    class="chatbot"
    :class="{' chatbot--active': show}"
    onclick="input.focus()"
    @click="showChatbot()"
  >
    <v-icon @click="hideChatbot($event)" class="chatbot__close">mdi-close</v-icon>
    <!-- Avatar -->
    <Avatar ref="avatar" />
    <!-- Messages -->
    <div id="messages" class="messages messages--active">
      <div
        v-for="(message, idx) in messages"
        :key="idx"
        class="message"
        :class="`message--${message.type}`"
      >
        <span class="message__text">{{message.text}}</span>
        <div
          v-for="(action, idx) in message.actions"
          :key="idx"
          @click="action.action"
          class="message__action"
        >{{action.text}}</div>
      </div>
    </div>
    <!-- Input -->
    <form @submit.prevent="newMessage()" class="input">
      <input
        id="input"
        type="text"
        v-model="new_message"
        placeholder="Escribe un mensaje"
        autocomplete="off"
      />
      <!-- <v-btn icon small>
        <v-icon small>mdi-send</v-icon>
      </v-btn>-->
    </form>
  </div>
</template>

<script>
import Avatar from "./Avatar";

import { scrollDown } from "@/services/scroll";
import Chatbot from "@/services/chatbot";

export default {
  props: {
    knowledge: Array
  },
  data: () => ({
    chatbot: new Chatbot(),
    messages: [
      {
        text: "Hola.\n¿En qué puedo ayudarte?",
        type: "bot"
      }
    ],
    new_message: "",
    show: false
  }),
  watch: {
    knowledge() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.knowledge.length > 1) {
        let entities = {
          usuario: {
            nombre: this.$store.state.user.first_name.split(/\s+/g)[0]
          }
        };
        this.chatbot.train(this.knowledge, entities);
      }
    },
    newMessage() {
      let answer = this.new_message;
      this.addMessage(answer, "user");
      this.new_message = "";

      let { answers, actions } = this.getAnswer(answer);
      answer = answers[Math.floor(Math.random() * answers.length)];

      this.$refs.avatar.startAnimationTalk();
      this.chatbot.talk(answer, () => this.$refs.avatar.startAnimationNormal());
      this.addMessage(answer, "bot", actions);
    },
    addMessage(text, type, actions = []) {
      this.messages.push({
        text,
        type,
        actions
      });
      setTimeout(() => {
        scrollDown("messages");
      }, 20);
    },
    getAnswer(answer) {
      return this.chatbot.getAnswer(answer);
    },
    //
    showChatbot() {
      if (!this.show) {
        this.show = true;
        setTimeout(() => {
          scrollDown("messages");
        }, 500);
      }
    },
    hideChatbot(e) {
      if (this.show) {
        e.stopPropagation();
        this.show = false;
      }
    }
  },
  components: {
    Avatar
  }
};
</script>

<style lang='scss' scoped>
$time: 0.3s;
$icon-height: 90px;
$icon-width: 90px;

$color-blue: #0078ff;

.chatbot {
  height: $icon-height;
  width: $icon-width;
  max-height: 90vh;
  max-width: 90vw;
  overflow: hidden;

  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: $time;
  z-index: 10000;
  cursor: pointer;

  position: fixed;
  right: 20px;
  bottom: 20px;

  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
  }

  &__close {
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0;
    transition: $time;
    z-index: 10001;

    color: #fff;
    pointer-events: none;

    &:focus {
      outline: none;
    }

    .chatbot--active & {
      opacity: 1;
      pointer-events: initial;
    }
  }

  &--active {
    width: 350px;
    height: 500px;
    border-radius: 4px;
    cursor: initial;

    &:hover {
      transform: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }
}

.avatar {
  background: #7a7aff;
  transition: $time;

  img {
    display: block;
    width: $icon-width;
    height: $icon-height;
    margin: 0 auto;
    transition: $time;
  }

  .chatbot--active & {
    img {
      width: 140px;
      height: 140px;
    }
  }
}

.messages {
  padding: 8px;
  overflow-y: auto;
  opacity: 0;
  transition: $time;

  .chatbot--active & {
    flex-grow: 1;
    opacity: 1;
  }
}

.message {
  overflow: hidden;
  width: max-content;
  max-width: 85%;
  font-size: 0.85rem;
  border-radius: 14px;
  word-wrap: break-word;
  white-space: pre-wrap;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &__text {
    display: block;
    padding: 4px 10px;
  }

  &__action {
    padding: 4px 10px;
    background: #fff;
    color: $color-blue;
    font-weight: bold;
    text-align: center;

    cursor: pointer;
  }

  &--bot {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);

    .message__action {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
  &--user {
    margin-left: auto;
    background: $color-blue;
    border: 1px solid $color-blue;
    color: #fff;

    .message__action {
      border-top: 1px solid $color-blue;
    }
  }
}

.input {
  padding: 6px;
  transition: $time;
  opacity: 0;
  display: flex;

  input[type="text"] {
    flex-grow: 1;
    padding: 6px 14px;

    background: #ececec;
    font-size: 0.85rem;
    border-radius: 20px;
    transition: $time;

    &:focus {
      outline: none;
    }
  }

  .chatbot--active & {
    opacity: 1;
  }
}

@media only screen and (max-width: 768px) {
  .chatbot {
    &--active {
      height: 100%;
      width: 100%;
      max-height: initial;
      max-width: initial;
      bottom: 0;
      right: 0;
      border-radius: 0;
    }
  }
}
</style>