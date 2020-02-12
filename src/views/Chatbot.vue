<template>
  <div class="chatbot-container">
    <v-container fluid class="fill-height pa-0">
      <v-row id="prueba" no-gutters class="fill-height">
        <div class="chatbot-content col-12 col-sm-7 col-md-8">
          <Resources
            ref="component_resources"
            v-show="service_selected === 0"
            :showServices="bool => showServices(bool)"
          />
          <Evaluations
            ref="component_evaluations"
            v-show="service_selected === 1"
            :showServices="bool => showServices(bool)"
          />
          <div v-show="show_services" class="chatbot-navigator">
            <div class="chatbot-actions elevation-3">
              <div class="chatbot-action transform-scale-plus" @click="selectService(0)">
                <img src="@/assets/braintutor/icon-evaluation.png" alt />
              </div>
              <div class="chatbot-action transform-scale-plus" @click="selectService(1)">
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
    show_services: true,
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
    showServices(bool) {
      this.show_services = bool;
    },
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
    height: 100%;
    border-right: 1px solid #eee;

    .chatbot-navigator {
      position: absolute;
      width: 100%;
      bottom: 0;

      .chatbot-actions {
        width: max-content;
        padding: 10px 8px;
        margin: 0 auto;
        background: #fff;
        border-radius: 10px 10px 0 0;
        opacity: 0.5;
        transition: all 0.5s;
        display: flex;
        &:hover {
          cursor: pointer;
          opacity: 1;
        }
        .chatbot-action {
          margin: 0 8px;
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
