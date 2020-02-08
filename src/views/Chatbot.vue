<template>
  <div class="chatbot-container elevation-4">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <Chat class="col-12 col-sm-5 col-md-4" />
        <div class="col-12 col-sm-7 col-md-8 chatbot-content">
          <Resources />
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chat from "@/components/Chatbot/Chat/index";
import Resources from "@/components/Chatbot/Resources/index";

export default {
  components: {
    Chat,
    Resources
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.chatbot-container {
  height: calc(100vh - 93px);
  margin: 20px;
  margin-top: 8px;

  .chatbot-content {
    border-left: 1px solid #eee;
    height: 100%;
  }
}

@media only screen and (max-width: 599px) {
  .chatbot-container {
    .chatbot-content {
      margin: 14px 0;
      @include box-shadow;
    }
  }
}
</style>
