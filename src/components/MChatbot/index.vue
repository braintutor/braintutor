<template>
  <div style="z-index: var(--z-chatbot) !important">
    <div
      class="m-chatbot"
      :class="{
        'm-chatbot--loading': loading,
        'm-chatbot--disabled': show && !loading,
      }"
      @click="showChatbot()"
    >
      <img
        :src="require(`@/assets/avatar/normal.png`)"
        class="m-chatbot__img"
      />
    </div>

    <div class="chatbot" :class="{ 'chatbot--disabled': !(show && !loading) }">
      <!-- Avatar -->
      <div class="chatbot__avatar">
        <Avatar ref="avatar" />
      </div>
      <!-- Messages -->
      <div id="messages" class="messages messages--active">
        <div
          v-for="(message, idx) in messages"
          :key="idx"
          class="message"
          :class="`message--${message.type}`"
        >
          <span class="message__text" v-html="message.text"></span>
          <div
            v-for="(action, idx) in message.actions"
            :key="idx"
            @click="actionChatbot(action.action)"
            class="message__action"
          >
            {{ action.text }}
          </div>
        </div>
        <div v-if="writing" class="message message--bot message--writing">
          <div class="message--writing__dot" style="--offset: 0s"></div>
          <div class="message--writing__dot" style="--offset: 0.2s"></div>
          <div class="message--writing__dot" style="--offset: 0.4s"></div>
        </div>
      </div>
      <!-- Input -->
      <form @submit.prevent="newMessage(new_message)" class="input">
        <input
          id="input"
          type="text"
          v-model="new_message"
          placeholder="Escribe un mensaje"
          autocomplete="off"
        />
        <v-btn @click="talk()" icon>
          <v-icon>mdi-microphone</v-icon>
        </v-btn>
        <v-btn @click="show = false" icon>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import { SpeechToText } from "@/services/speech";
import { scrollDown } from "@/services/scroll";
import Chatbot from "@/services/chatbot";

export default {
  props: {
    knowledge: Array,
  },
  watch: {
    knowledge() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  data: () => ({
    show: false,
    chatbot: new Chatbot(),
    messages: [
      {
        text: "Hola.\n¿En qué puedo ayudarte?",
        type: "bot",
      },
    ],
    new_message: "",
    allow_new_message: true,
    writing: false,
    loading: false,
  }),
  methods: {
    init() {
      if (this.knowledge.length > 1) {
        let entities = {
          usuario: {
            nombre: this.$store.state.user.first_name.split(/\s+/g)[0],
            nombres: this.$store.state.user.first_name,
          },
        };
        this.loading = true;
        this.chatbot.train(this.knowledge, entities);
        this.loading = false;
      }
    },
    addMessage(text, type, actions = []) {
      this.messages.push({
        text,
        type,
        actions,
      });
      setTimeout(() => {
        scrollDown("messages");
      }, 20);
    },
    newMessage(new_message) {
      let answer = new_message.trim();
      if (this.allow_new_message && answer) {
        // User
        this.new_message = "";
        this.addMessage(answer, "user");
        this.allow_new_message = false;
        this.writing = true;

        // Bot
        setTimeout(() => {
          let res = this.chatbot.getAnswer(answer);
          if (res) {
            let { answers, actions } = res;
            answer = answers[Math.floor(Math.random() * answers.length)];
            this.addMessage(answer, "bot", actions);

            answer = answer.replace(/<[/]*[a-zA-z]+>/g, "");
            this.$refs.avatar.startAnimationTalk();
            this.chatbot.talk(answer, () =>
              this.$refs.avatar.startAnimationNormal()
            );
          }
          this.allow_new_message = true;
          this.writing = false;
        }, 1500);
      }
    },

    talk() {
      SpeechToText((text) => this.newMessage(text));
    },
    showChatbot() {
      this.show = true;
      document.getElementById("input").focus();
    },
    actionChatbot(action) {
      this.show = false;
      setTimeout(action, 200);
    },
  },
  components: {
    Avatar,
  },
};
</script>

<style lang='scss' scoped>
$icon-size: 64px;
$avatar-size: 100px;
$chatbot-height: 480px;
$chatbot-width: 320px;
$animation-time: 0.5s;
$color-message-user: #0078ff;

.m-chatbot {
  overflow: hidden;
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: var(--color-active);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  transition: $animation-time;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &__img {
    height: $icon-size;
    width: $icon-size;
    vertical-align: bottom;
  }

  &:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  }

  &--disabled {
    transform: translateX(24px);
    opacity: 0;
    pointer-events: none;
  }
  &--loading {
    &::after {
      content: "";
      background: rgba(255, 255, 255, 0.555);
      border-radius: 50%;
      border: 4px solid var(--color-active);
      border-top: 4px solid transparent;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      animation: rotating 1s ease infinite;
    }
  }
}

.chatbot {
  height: $chatbot-height;
  width: $chatbot-width;
  max-height: calc(100vh - 56px);
  max-width: 90vw;
  background: #fff;

  display: flex;
  flex-direction: column;

  position: fixed;
  bottom: 10px;
  right: 10px;
  border-radius: 8px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transition: $animation-time;

  &--disabled {
    transform: translateX(24px);
    opacity: 0;
    pointer-events: none;
  }
}

.avatar {
  height: $avatar-size;
  background: var(--color-active);
}

.messages {
  overflow-y: auto;
  flex-grow: 1;
  padding: 8px;
}

.message {
  overflow: hidden;
  width: max-content;
  max-width: 85%;
  font-size: 0.95rem;
  border-radius: 14px;
  word-wrap: break-word;
  white-space: pre-line;

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
    color: $color-message-user;
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
    background: $color-message-user;
    border: 1px solid $color-message-user;
    color: #fff;

    .message__action {
      border-top: 1px solid $color-message-user;
    }
  }
  &--writing {
    // animation: blink 1s linear infinite;
    padding: 10px;
    padding-left: calc(10px - 0.3rem);
    display: flex;

    &__dot {
      width: 0.4rem;
      height: 0.4rem;
      margin-left: 0.3rem;
      background: rgb(128, 128, 128);
      border-radius: 50%;

      animation: blink 1s linear infinite var(--offset);
    }
  }
}

.input {
  padding: 6px;
  display: flex;

  input[type="text"] {
    flex-grow: 1;
    padding: 8px 14px;

    background: #ececec;
    font-size: 0.95rem;
    border-radius: 20px;

    &:focus {
      outline: none;
    }
  }

  .chatbot--active & {
    opacity: 1;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media only screen and (max-width: 768px) {
  $icon-size: 48px;

  .m-chatbot {
    &__img {
      height: $icon-size;
      width: $icon-size;
    }
  }

  .chatbot {
    max-height: 100vh;
    max-width: 100vw;
    width: auto;
    height: auto;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
  }
}
</style>