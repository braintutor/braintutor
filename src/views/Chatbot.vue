<template>
  <div class="chatbot-container ma-4 elevation-4 row">
    <Chat class="pa-0 col-5" />
    <Resources class="col-7" />
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
