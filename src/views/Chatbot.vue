<template>
  <div class="chatbot-container">
    <v-container fluid class="fill-height pa-0">
      <v-row id="chatbot-scroll" class="chatbot-scroll fill-height" no-gutters>
        <div class="chatbot-content col-12 col-sm-7 col-md-8 m-fullscreen">
          <Resources
            class="m-fullscreen-content"
            ref="component_resources"
            v-show="service_selected === 0"
            :showServices="bool => showServices(bool)"
          />
          <Evaluations
            class="m-fullscreen-content"
            ref="component_evaluations"
            v-show="service_selected === 1"
            :showServices="bool => showServices(bool)"
          />
          <Tasks
            class="m-fullscreen-content"
            ref="component_tasks"
            v-show="service_selected === 2"
            :showServices="bool => showServices(bool)"
          />
          <div v-show="show_services" class="chatbot-navigator">
            <div class="chatbot-actions elevation-3">
              <div class="chatbot-action transform-scale-plus" @click="selectService(0)">
                <img src="@/assets/braintutor/icon-resource.png" alt />
              </div>
              <div class="chatbot-action transform-scale-plus" @click="selectService(1)">
                <img src="@/assets/braintutor/icon-evaluation.png" alt />
              </div>
              <div class="chatbot-action transform-scale-plus" @click="selectService(2)">
                <img src="https://img.icons8.com/cotton/2x/calendar.png" alt />
              </div>
              <div
                class="chatbot-action chatbot-action-bot transform-scale-plus"
                @click="scrollRight('chatbot-scroll')"
              >
                <img src="@/assets/avatar/normal.png" alt />
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
import Tasks from "@/components/Chatbot/Tasks/index";

import { scrollRight } from "@/services/scroll";
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
    scrollRight,
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
    Evaluations,
    Tasks
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.chatbot-container {
  height: calc(100vh - 65px);
  .chatbot-content {
    position: relative;
    border-right: 1px solid #eee;
    .chatbot-navigator {
      z-index: 1;
      position: absolute;
      width: 100%;
      bottom: 0;
      pointer-events: none;
      .chatbot-actions {
        width: max-content;
        padding: 10px 8px;
        margin: 0 auto;
        background: #fff;
        border-radius: 10px 10px 0 0;
        opacity: 0.5;
        transition: all 0.5s;
        display: flex;
        pointer-events: all;
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
.chatbot-action-bot {
  display: none;
  img {
    border-radius: 50%;
  }
}

@media only screen and (max-width: 599px) {
  .chatbot-action-bot {
    display: block;
  }
  .chatbot-container {
    margin: 0;
    .chatbot-scroll {
      flex-wrap: nowrap;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      &::-webkit-scrollbar {
        display: none;
      }
      .chat-container {
        scroll-snap-align: start;
      }
      .chatbot-content {
        scroll-snap-align: start;
      }
    }
  }
}
</style>
