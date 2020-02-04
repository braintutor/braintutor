<template>
  <div class="chatbot-container ma-4 elevation-4">
    <v-container fluid class="fill-height py-0">
      <v-row class="fill-height">
        <Chat class="col-5 pa-0" />
        <Resources class="col-7" />
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

<style lang='scss'>
.chatbot-container {
  height: calc(100vh - 100px);
}
</style>
