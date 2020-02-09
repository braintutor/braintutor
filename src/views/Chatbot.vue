<template>
  <div class="chatbot-container elevation-4">
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <Chat class="col-12 col-sm-5 col-md-4" :available_questions="available_questions"/>
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

import { getParam } from "@/services/router.js";
import { getResources } from "@/services/resourceService";
import { getKnowledge } from "@/services/knowledgeService";
import { getResourcesQuestions } from "@/services/resourceService";

export default {
  data: () => ({
    available_questions: []
  }),
  mounted() {
    let chatbot_id = getParam("chatbot_id");

    getResources(chatbot_id).then(res => {
      let resources = JSON.parse(res);
      this.$store.commit("setResources", resources);

      getKnowledge(chatbot_id).then(res => {
        this.available_questions = JSON.parse(res).map(
          item => item.preguntas[0]
        );
        getResourcesQuestions().then(res => {
          let questions = Object.values(res);
          resources.forEach(resource => {
            questions.forEach(question => {
              this.available_questions.push(
                question.replace(/@/, resource.nombre)
              );
            });
            resource.faq.forEach(item => {
              this.available_questions.push(item.pregunta);
            });
          });
        });
      });
    });
  },
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
