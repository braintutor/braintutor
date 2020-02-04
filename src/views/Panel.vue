<template>
  <v-btn @click="redirect('chatbot')">Chatbot</v-btn>
</template>

<script>
import { redirect } from "@/services/tools.js";

export default {
  methods: {
    redirect
  }
}
</script>

<style>

</style>