<template>
  <div class="chatbot-container">
    <loading :active="loading" :message="loading_msg" />
    <v-row id="chatbot-scroll" class="chatbot-scroll fill-height" no-gutters>
      <div class="chatbot-content col-12 col-md-8 m-fullscreen">
        <Materials class="m-fullscreen-content" ref="component_materials" :chatbot="chatbot" />
      </div>
      <Chat class="chat-container col-12 col-md-4" :bot="bot" :knowledge="knowledge" />
    </v-row>
  </div>
</template>

<script>
import Chat from "@/components/Chatbot/Chat/index";
import Materials from "@/components/Chatbot/Materials/index";
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import Chatbot from "@/services/chatbot";

import { getCourseIdByChatbot } from "@/services/courseService";
import { getMaterials } from "@/services/materialService";
import { getQuestionTemplate } from "@/services/chatService";
import { getChatbotNameOrder } from "@/services/chatbotService";
import {
  getKnowledge,
  getKnowledgeByCourse
} from "@/services/knowledgeService";

export default {
  data: () => ({
    chatbot: {},
    // CHAT
    bot: null,
    knowledge: [],
    //
    loading: true,
    loading_msg: ""
  }),
  async created() {
    let chatbot_id = getParam("chatbot_id");

    // Materials
    this.loading_msg = "Cargando Material";

    this.chatbot = await getChatbotNameOrder(chatbot_id);
    let order = (this.chatbot.order || []).reverse();
    let materials = await getMaterials(chatbot_id);
    materials.sort(
      (a, b) => order.indexOf(b._id.$oid) - order.indexOf(a._id.$oid)
    );
    this.$store.commit("setMaterials", materials);

    // Knowledge
    this.loading_msg = "Cargando Conocimiento";

    let course_id = await getCourseIdByChatbot(chatbot_id);
    let knowledge_course = await getKnowledgeByCourse(course_id);
    let knowledge_chatbot = await getKnowledge(chatbot_id);
    let knowledge = knowledge_course.concat(knowledge_chatbot);

    // Knowledge Material
    let question_template = await getQuestionTemplate();
    materials.forEach(material => {
      Object.entries(question_template).forEach(([category, questions]) => {
        if (questions[0]) {
          questions = questions.map(question =>
            question.replace(/@/, material.name)
          );
          knowledge.push({
            questions,
            answers: [],
            material_id: material._id.$oid,
            category
          });
        }
      });
      material.faq.forEach(({ question, answer }) => {
        knowledge.push({
          questions: [question],
          answers: [answer],
          material_id: material._id.$oid
        });
      });
    });
    this.knowledge = knowledge;

    // Chatbot
    let bot = new Chatbot();
    bot.train(knowledge);
    this.bot = bot;

    this.loading = false;
  },
  mounted() {
    this.$store.commit("setComponentMaterials", this.$refs.component_materials);
  },
  components: {
    Chat,
    Materials,
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
  }
}
.services-action-bot {
  display: none;
  img {
    border-radius: 10px;
  }
}

@media only screen and (max-width: 955px) {
  .services-action-bot {
    display: block;
  }
  .chatbot-container {
    height: calc(100vh - 57px);
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
