<template>
  <div
    class="chatbot"
    :class="{' chatbot--active': show}"
    onclick="input.focus()"
    @click="showChatbot()"
  >
    <v-icon @click="hideChatbot($event)" class="chatbot__close">mdi-close</v-icon>
    <!-- Avatar -->
    <div class="avatar">
      <img :src="require('@/assets/avatar/normal.png')" alt />
    </div>
    <!-- Messages -->
    <div id="messages" class="messages messages--active">
      <div
        v-for="(message, idx) in messages"
        :key="idx"
        class="message"
        :class="`message--${message.type}`"
      >{{message.text}}</div>
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
import { scrollDown } from "@/services/scroll";
import Chatbot from "@/services/chatbot";

export default {
  data: () => ({
    chatbot: null,
    messages: [
      {
        text: "hola soy tu ayudante",
        type: "bot"
      },
      {
        text: "hola soy tu ayudante asdad sada dsad sadsa dsa sadas",
        type: "user"
      },
      {
        text:
          "hola soy tu ayudante asdasd sadsa sad sad sadsa sadsa dsa dsadsa",
        type: "bot"
      },
      {
        text: "hola soy tu ayudante asdasd sa dsa sad",
        type: "user"
      },
      {
        text:
          "hola soy tu ayudante asdasd sadsa sad sad sadsa sadsa dsa dsadsa",
        type: "bot"
      },
      {
        text: "hola soy tu ayudante asdasd sa dsa sad",
        type: "user"
      }
    ],
    new_message: "",
    show: true
  }),
  mounted() {
    this.chatbot = new Chatbot();
    let knowledge = [
      { questions: ["Hola"], answers: ["Hola @usuario@nombre."] },
      {
        questions: ["Adiós", "Chau", "Nos vemos"],
        answers: ["Nos vemos pronto @usuario@nombre.", "Adiós @usuario@nombre."]
      },
      { questions: ["Gracias"], answers: ["No hay de qué."] }
    ];
    let entities = {
      usuario: {
        nombre: this.$store.state.user.first_name.split(/\s+/g)[0]
      }
    };
    this.chatbot.train(knowledge, entities);
  },
  methods: {
    newMessage() {
      let answer = this.new_message;
      this.addMessage(answer, "user");
      this.new_message = "";

      answer = this.getAnswer(answer);
      this.chatbot.talk(answer);
      this.addMessage(answer, "bot");
    },
    addMessage(text, type) {
      this.messages.push({
        text,
        type
      });
      setTimeout(() => {
        scrollDown("messages");
      }, 20);
    },
    getAnswer(answer) {
      let { answers } = this.chatbot.getAnswer(answer);
      return answers[Math.floor(Math.random() * answers.length)];
    },
    //
    showChatbot() {
      this.show = true;
      setTimeout(() => {
        scrollDown("messages");
      }, 500);
    },
    hideChatbot(e) {
      e.stopPropagation();
      this.show = false;
    }
  }
};
</script>

<style lang='scss' scoped>
$time: 0.3s;
$icon-height: 90px;
$icon-width: 90px;

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
  width: max-content;
  max-width: 80%;
  padding: 4px 10px;
  font-size: 0.85rem;
  border-radius: 14px;
  word-wrap: break-word;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &--bot {
    background: #e2e2e2;
  }
  &--user {
    margin-left: auto;
    background: #437bff;
    color: #fff;
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

    background: #d1d1d1;
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