<template>
  <div class="chatbot-container">
    <loading :active="loading_chatbot" />
    <v-row id="chatbot-scroll" class="chatbot-scroll fill-height" no-gutters>
      <div class="chatbot-content col-12 col-sm-7 col-md-8 m-fullscreen">
        <Materials
          class="m-fullscreen-content"
          ref="component_materials"
          v-show="service_selected === 0"
          :showServices="bool => showServices(bool)"
        />
        <Quizzes
          class="m-fullscreen-content"
          ref="component_quizzes"
          v-show="service_selected === 1"
          :showServices="bool => showServices(bool)"
        />
        <div v-show="show_services" class="services-navigator">
          <div class="services-actions elevation-3">
            <div class="services-action transform-scale-plus" @click="selectService(0)">
              <img src="@/assets/braintutor/icon-material.png" alt />
            </div>
            <div class="services-action transform-scale-plus" @click="selectService(1)">
              <img src="@/assets/braintutor/icon-quiz.png" alt />
            </div>
            <div
              class="services-action services-action-bot transform-scale-plus"
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
  </div>
</template>

<script>
import Chat from "@/components/Chatbot/Chat/index";
import Materials from "@/components/Chatbot/Materials/index";
import Quizzes from "@/components/Chatbot/Quizzes/index";
import loading from "@/components/loading";

import { scrollRight } from "@/services/scroll";
import { getParam } from "@/services/router.js";

import { getMaterials } from "@/services/materialService";
import { getQuestionTemplate } from "@/services/chatService";
import { getCourseIdByChatbot } from "@/services/courseService";
import {
  getKnowledge,
  getKnowledgeByCourse
} from "@/services/knowledgeService";

export default {
  data: () => ({
    available_questions: [],
    show_services: true,
    service_selected: 0,
    loading_chatbot: true
  }),
  async mounted() {
    // Components
    this.$store.commit("setComponentMaterials", this.$refs.component_materials);
    this.$store.commit("setComponentQuizzes", this.$refs.component_quizzes);
    let chatbot_id = getParam("chatbot_id");

    let materials = await getMaterials(chatbot_id);
    this.$store.commit("setMaterials", materials);

    let course_id = await getCourseIdByChatbot(chatbot_id);
    let knowledge_course = await getKnowledgeByCourse(course_id);
    let knowledge_chatbot = await getKnowledge(chatbot_id);
    let knowledge = knowledge_course.concat(knowledge_chatbot);
    this.available_questions = knowledge.map(item => item.questions[0]);

    let question_template = await getQuestionTemplate();
    materials.forEach(material => {
      Object.values(question_template).forEach(value => {
        if (value[0])
          this.available_questions.push(value[0].replace(/@/, material.name));
      });
      material.faq.forEach(item => {
        this.available_questions.push(item.question);
      });
    });
    this.loading_chatbot = false;
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
    Materials,
    Quizzes,
    loading
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
    .services-navigator {
      z-index: 1;
      position: absolute;
      width: 100%;
      bottom: 8px;
      pointer-events: none;
      .services-actions {
        width: max-content;
        padding: 8px;
        margin: 0 auto;
        background: #fff;
        border-radius: 10px;
        display: flex;
        pointer-events: all;
        &:hover {
          cursor: pointer;
        }
        .services-action {
          margin: 0 8px;
          img {
            width: 40px;
            height: 40px;
            vertical-align: bottom;
          }
        }
      }
    }
  }
}
.services-action-bot {
  display: none;
  img {
    border-radius: 10px;
  }
}

@media only screen and (max-width: 599px) {
  .services-action-bot {
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
