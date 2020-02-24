<template>
  <div class="editor-container m-fullscreen">
    <MaterialsEditor class="m-fullscreen-content" v-show="service_idx == 0" />
    <QuizzesEditor class="m-fullscreen-content" v-show="service_idx == 1" />
    <TasksEditor class="m-fullscreen-content" v-show="service_idx == 2" />
    <KnowledgeEditor class="m-fullscreen-content" v-show="service_idx == 3" />
    <div class="services-editor-navigator">
      <div class="services-editor-actions elevation-3">
        <div class="services-editor-action transform-scale-plus" @click="selectService(0)">
          <img src="@/assets/braintutor/icon-material.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(1)">
          <img src="@/assets/braintutor/icon-quiz.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(2)">
          <img src="https://img.icons8.com/cotton/2x/calendar.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(3)">
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
  </div>
</template>

<script>
import MaterialsEditor from "@/components/Editor/MaterialsEditor/index";
import QuizzesEditor from "@/components/Editor/QuizzesEditor/index";
import TasksEditor from "@/components/Editor/TasksEditor/index";
import KnowledgeEditor from "@/components/Editor/KnowledgeEditor";

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
    KnowledgeEditor
  }
};
</script>

<style lang='scss'>
.editor-container {
  height: calc(100vh - 65px);
}
.services-editor-navigator {
  z-index: 1;
  position: absolute;
  width: 100%;
  bottom: 0;
  pointer-events: none;
  .services-editor-actions {
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
    .services-editor-action {
      margin: 0 8px;
      img {
        width: 42px;
        height: 42px;
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
</style>