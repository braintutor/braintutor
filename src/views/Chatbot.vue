<template>
  <div class="chatbot-container">
    <v-container fluid class="fill-height pa-0">
      <v-row id="prueba" no-gutters class="fill-height">
        <div class="chatbot-content col-12 col-sm-7 col-md-8">
          <Resources ref="component_resources" v-show="service_selected === 0" />
          <Evaluations ref="component_evaluations" v-show="service_selected === 1" />
          <div class="chatbot-navigator">
            <div class="chatbot-actions elevation-3">
              <div class="chatbot-action transform-scale-plus" @click="selectService(0)">
                <img src="@/assets/braintutor/icon-evaluation.png" alt />
              </div>
              <div class="chatbot-action transform-scale-plus" @click="selectService(1)">
                <img src="@/assets/braintutor/icon-evaluation.png" alt />
              </div>
            </div>
          </div>
        </div>
        <Chat
          class="chat-container col-12 col-sm-5 col-md-4"
          :available_questions="available_questions"
          :selectService="idx => selectService(idx)"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chat from "@/components/Chatbot/Chat/index";
import Resources from "@/components/Chatbot/Resources/index";
import Evaluations from "@/components/Chatbot/Evaluations/index";

import { getParam } from "@/services/router.js";
import { getResources } from "@/services/resourceService";
import { getKnowledge } from "@/services/knowledgeService";
import { getResourcesQuestions } from "@/services/resourceService";

export default {
  data: () => ({
    available_questions: [],
    service_selected: 0
  }),
  mounted() {
    // Components
    this.$store.commit("setComponentResources", this.$refs.component_resources);
    this.$store.commit(
      "setComponentEvaluations",
      this.$refs.component_evaluations
    );

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
  methods: {
    selectService(idx) {
      this.service_selected = idx;
    }
  },
  components: {
    Chat,
    Resources,
    Evaluations
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.chatbot-container {
  height: calc(100vh - 93px);
  margin: 20px;
  margin-top: 8px;
  @include box-shadow;

  .chat-container {
    min-height: 500px;
  }
  .chatbot-content {
    position: relative;
    border-right: 1px solid #eee;
    height: 100%;

    .chatbot-navigator {
      position: absolute;
      bottom: 0;
      left: 0;
      //
      display: flex;
      flex-direction: column;
      justify-content: center;

      .chatbot-actions {
        padding: 0 10px;
        background: #fff;
        border-radius: 0 20px 0 0;
        opacity: 0.4;
        transition: all 0.5s;
        &:hover {
          cursor: pointer;
          opacity: 1;
        }
        .chatbot-action {
          display: block;
          margin: 10px 0;
          img {
            width: 42px;
            height: 42px;
            vertical-align: bottom;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 599px) {
  .chat-container {
    margin: 14px 0;
    @include box-shadow;
  }
}
</style>
