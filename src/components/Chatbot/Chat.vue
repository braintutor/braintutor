<template>
  <div class="m-fullscreen">
    <ChatAvatar />
    <div class="m-fullscreen-content">
      <div v-for="(message, m_idx) in messages" :key="m_idx">{{message}}</div>
    </div>
    <v-btn @click="add()">add</v-btn>
  </div>
</template>

<script>
import ChatAvatar from "./ChatAvatar";

export default {
  data: () => ({
    messages: Array(10).fill("mensaje de prueba")
  }),
  methods: {
    add() {
      this.messages.push("nuevo mensaje");
    }
  },
  components: {
    ChatAvatar
  }
};
</script>

<style>
</style>