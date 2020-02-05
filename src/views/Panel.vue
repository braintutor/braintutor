<template>
  <div>
    <v-btn @click="redirect('chatbot')">Chatbot</v-btn>
  </div>
</template>

<script>
import { redirect } from "@/services/tools.js";

export default {
  methods: {
    redirect
  }
};
</script>

<style lang='scss' scoped>
</style>