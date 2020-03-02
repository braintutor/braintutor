<template>
  <div class="editor-container m-fullscreen">
    <div class="menu">
      <span class="menu-title">Conocimiento</span>
      <div v-if="!loading" class="menu-action">
        <v-btn icon @click="addKnowledge()">
          <v-icon>mdi-comment-plus-outline</v-icon>
        </v-btn>
        <v-btn icon @click="restoreKnowledge()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
        <v-btn icon @click="saveKnowledge()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-progress-circular :width="3" :size="20" indeterminate color="green"></v-progress-circular>
      </div>
    </div>
    <div id="knowledge-scroll" class="editor-content m-fullscreen-content">
      <div class="editor-knowledge" v-for="(k, k_idx) in knowledge" :key="k_idx">
        <div class="editor-knowledge-row row no-gutters">
          <div
            v-for="(type, t_idx) in ['questions', 'answers']"
            :key="t_idx"
            class="editor-knowledge-col col-md-6"
          >
            <div>
              <div v-for="(question, q_idx) in k[type]" :key="q_idx">
                <div v-if="q_idx == 0" class="editor-knowledge-principal">
                  <v-text-field
                    class="editor-input"
                    v-model="k[type][q_idx]"
                    dense
                    hide-details
                    autocomplete="off"
                  ></v-text-field>
                  <v-btn icon @click="add(k, k[type])">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
                <div v-else-if="k.show" class="editor-knowledge-more">
                  <v-text-field
                    class="editor-input"
                    v-model="k[type][q_idx]"
                    dense
                    hide-details
                    autocomplete="off"
                  ></v-text-field>
                  <v-btn icon @click="remove(k[type], q_idx)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="editor-actions">
          <v-badge
            :color="k.show || (k.questions.length + k.answers.length <= 2) ? 'rgba(255, 0, 0, 0)': 'green'"
            dot
            overlap
          >
            <v-btn icon @click="toggleShow(k)">
              <v-icon v-if="k.show">mdi-chevron-up-circle-outline</v-icon>
              <v-icon v-else>mdi-chevron-down-circle-outline</v-icon>
            </v-btn>
          </v-badge>
          <v-btn icon @click="removeKnowledge(k_idx)">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { train } from "@/services/chatService";
import {
  getKnowledge,
  updateKnowledge,
  removeKnowledge
} from "@/services/knowledgeService";
import { scrollDown } from "@/services/scroll";

import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    knowledge: [],
    knowledge_to_eliminate: [],
    chatbot_id: "",
    //
    loading: false
  }),
  async mounted() {
    this.chatbot_id = getParam("chatbot_id");
    await this.restoreKnowledge();
  },
  methods: {
    addKnowledge() {
      this.knowledge.push({
        questions: [""],
        answers: [""]
      });
      setTimeout(() => {
        scrollDown("knowledge-scroll");
      }, 100);
    },
    async saveKnowledge() {
      let knowledge = this.knowledge.map(k => ({
        ...k,
        id: k._id ? k._id.$oid : ""
      }));
      this.loading = true;
      await removeKnowledge(this.chatbot_id, this.knowledge_to_eliminate);
      this.knowledge_to_eliminate = [];
      await updateKnowledge(this.chatbot_id, knowledge);
      await train(this.chatbot_id);
      this.loading = false;

      await this.restoreKnowledge();
    },
    async restoreKnowledge() {
      this.loading = true;
      this.knowledge = await getKnowledge(this.chatbot_id);
      this.knowledge_to_eliminate = [];
      this.loading = false;
    },
    removeKnowledge(knowledge_idx) {
      let knowledge = this.knowledge[knowledge_idx];
      if (knowledge._id) {
        this.knowledge_to_eliminate.push(knowledge._id.$oid);
      }
      this.knowledge.splice(knowledge_idx, 1);
    },
    add(knowledge, arr) {
      arr.push("");
      knowledge.show = true;
    },
    remove(arr, idx) {
      arr.splice(idx, 1);
    },
    toggleShow(knowledge) {
      knowledge.show = !knowledge.show;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/box-shadow.scss";

.editor-container {
  .menu {
    padding: 10px 20px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menu-title {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  .editor-content {
    padding: 10px 14px;
    padding-bottom: 60px;
    .editor-knowledge {
      padding: 8px 0;
      display: flex;
      .editor-knowledge-row {
        .editor-knowledge-col {
          padding: 4px 6px;
          & > div {
            padding: 10px 8px 6px 16px;
            border-radius: 10px;
            @include box-shadow;
          }
          .editor-knowledge-principal {
            display: flex;
          }
          .editor-knowledge-more {
            display: flex;
          }
          .editor-input {
            font-size: 1rem;
          }
        }
      }
      .editor-actions {
        margin-top: 14px;
      }
    }
  }
}
</style>