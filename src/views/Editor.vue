<template>
  <div class="editor-container m-fullscreen">
    <div class="services-editor-navigator elevation-3">
      <div class="services-editor-actions">
        <div class="services-editor-action transform-scale-plus" @click="selectService(0)">
          <img
            src="https://icons.iconarchive.com/icons/grafikartes/flat-retro-modern/512/settings-icon.png"
            alt
          />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(1)">
          <img src="@/assets/braintutor/icon-material.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(2)">
          <img src="@/assets/braintutor/icon-quiz.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(3)">
          <img src="https://img.icons8.com/cotton/2x/calendar.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(4)">
          <img src="https://pngimage.net/wp-content/uploads/2018/06/messaging-png-1.png" alt />
        </div>
        <div
          class="services-editor-action services-editor-action-bot transform-scale-plus"
          @click="redirectChatbot()"
        >
          <img src="@/assets/avatar/normal.png" alt />
        </div>
      </div>
    </div>
    <ChatbotEditor class="m-fullscreen-content" v-show="service_idx == 0" />
    <MaterialsEditor class="m-fullscreen-content" v-show="service_idx == 1" />
    <QuizzesEditor class="m-fullscreen-content" v-show="service_idx == 2" />
    <TasksEditor class="m-fullscreen-content" v-show="service_idx == 3" />
    <KnowledgeEditor class="m-fullscreen-content" v-show="service_idx == 4" />
  </div>
</template>

<script>
import MaterialsEditor from "@/components/Editor/MaterialsEditor/index";
import QuizzesEditor from "@/components/Editor/QuizzesEditor/index";
import TasksEditor from "@/components/Editor/TasksEditor/index";
import KnowledgeEditor from "@/components/Editor/KnowledgeEditor";
import ChatbotEditor from "@/components/Editor/ChatbotEditor";

import { redirect, getParam } from "@/services/router.js";

export default {
  data: () => ({
    service_idx: 0,
    chatbot_id: ""
  }),
  mounted() {
    this.chatbot_id = getParam("chatbot_id");
  },
  methods: {
    selectService(idx) {
      this.service_idx = idx;
    },
    redirectChatbot() {
      redirect("chatbot", { chatbot_id: this.chatbot_id });
    }
  },
  components: {
    MaterialsEditor,
    QuizzesEditor,
    TasksEditor,
    KnowledgeEditor,
    ChatbotEditor
  }
};
</script>

<style lang='scss'>
.editor-container {
  height: calc(100vh - 65px);
  display: flex;
  flex-direction: row;
}
.services-editor-navigator {
  height: 100%;
  border-radius: 0 10px 10px 0;
  .services-editor-actions {
    padding: 10px 8px;
    &:hover {
      cursor: pointer;
    }
    .services-editor-action {
      margin: 16px 0;
      img {
        width: 40px;
        height: 40px;
        vertical-align: bottom;
      }
    }
  }
}
.services-editor-action-bot {
  display: block;
  img {
    border-radius: 50%;
  }
}
@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }
  .services-editor-navigator {
    height: min-content;
    width: min-content;
    margin: 0 auto;
    border-radius: 10px;
    .services-editor-actions {
      padding: 6px;
      display: flex;
      justify-content: center;
      .services-editor-action {
        margin: 0 8px;
      }
    }
  }
}
</style>