<template>
  <div class="editor-container m-fullscreen">
    <div class="services-editor-navigator">
      <div class="services-editor-actions">
        <div class="services-editor-action transform-scale-plus" @click="selectService(0)">
          <img src="@/assets/braintutor/icon-settings.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(1)">
          <img src="@/assets/braintutor/icon-material.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(2)">
          <img src="@/assets/braintutor/icon-quiz.png" alt />
        </div>
        <div class="services-editor-action transform-scale-plus" @click="selectService(3)">
          <img src="@/assets/braintutor/icon-knowledge.png" alt />
        </div>
        <v-divider class="divider-horizontal my-2"></v-divider>
        <v-divider class="divider-vertical mx-1" vertical></v-divider>
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
    <KnowledgeEditor class="m-fullscreen-content" v-show="service_idx == 3" />
  </div>
</template>

<script>
import MaterialsEditor from "@/components/ChatbotEditor/MaterialsEditor/index";
import QuizzesEditor from "@/components/ChatbotEditor/QuizzesEditor/index";
import KnowledgeEditor from "@/components/ChatbotEditor/KnowledgeEditor";
import ChatbotEditor from "@/components/ChatbotEditor/ChatbotEditor";

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
    KnowledgeEditor,
    ChatbotEditor
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.editor-container {
  height: calc(100vh - 65px);
  display: flex;
  flex-direction: row;
}
.services-editor-navigator {
  .services-editor-actions {
    padding: 10px 8px;
    border-radius: 0 10px 10px 0;
    @include box-shadow;
    &:hover {
      cursor: pointer;
    }
    .services-editor-action {
      margin: 18px 2px;
      img {
        width: 36px;
        height: 36px;
        vertical-align: bottom;
      }
    }
  }
}
.services-editor-action-bot {
  display: block;
  img {
    border-radius: 10px;
  }
}

.divider-vertical {
  display: none;
}

@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }
  .services-editor-navigator {
    height: min-content;
    width: min-content;
    margin: 0 auto;
    .services-editor-actions {
      padding: 6px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      .services-editor-action {
        margin: 2px 6px;
        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
  .divider-horizontal {
    display: none;
  }
  .divider-vertical {
    display: initial;
  }
}
</style>