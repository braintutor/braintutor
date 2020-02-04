<template>
  <div class="chatbot-container ma-4 elevation-4 row">
    <div class="fill-height col-5">
      <Chat />
    </div>
    <div class="col-7">
      <Resources />
    </div>
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
