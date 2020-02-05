<template>
  <div class="chatbot-container ma-3 elevation-4">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <Chat class="col-4" />
        <Resources class="col-8" />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chat from "@/components/Chatbot/Chat";
import Resources from "@/components/Chatbot/Resources";

export default {
  components: {
    Chat,
    Resources
  }
};
</script>

<style lang='scss' scoped>
.chatbot-container {
  height: calc(100vh - 90px);
}
</style>
