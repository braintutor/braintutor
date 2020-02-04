<template>
  <div class="m-fullscreen">
    <div>sadsad sada</div>
    <v-btn @click="add()">add</v-btn>
    <div class="m-fullscreen-content">
      <div v-for="(message, m_idx) in messages" :key="m_idx">{{message}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    messages: Array(10).fill("sadsadad sadsa dad sad sa ")
  }),
  methods: {
    add() {
      this.messages.push("probando");
    }
  }
};
</script>

<style>
</style>