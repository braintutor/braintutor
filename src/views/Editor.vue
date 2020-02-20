<template>
  <div class="editor-container m-fullscreen">
    <div class="menu">
      <span class="menu-title">Conocimiento</span>
      <div class="menu-action">
        <v-btn icon @click="addKnowledge()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon @click="saveKnowledge()" :loading="loading_save">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="editor-content m-fullscreen-content">
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
              <v-icon v-if="k.show">mdi-chevron-up</v-icon>
              <v-icon v-else>mdi-chevron-down</v-icon>
            </v-btn>
          </v-badge>
          <v-btn icon @click="removeKnowledge(k_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getParam } from "@/services/router.js";
import { train } from "@/services/chatService";
import { getKnowledge, updateKnowledge, removeKnowledge } from "@/services/knowledgeService";

export default {
  data: () => ({
    chatbot_id: "",
    knowledge: [],
    knowledge_to_eliminate: [],
    //
    loading_save: false
  }),
  async mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.knowledge = await getKnowledge(this.chatbot_id);
  },
  methods: {
    addKnowledge() {
      this.knowledge.push({
        questions: [""],
        answers: [""]
      });
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
    },
    async saveKnowledge() {
      let knowledge = this.knowledge.map(k => ({
        ...k,
        id: k._id ? k._id.$oid : ""
      }));
      this.loading_save = true;
      await removeKnowledge(this.chatbot_id, this.knowledge_to_eliminate)
      await updateKnowledge(this.chatbot_id, knowledge);
      await train(this.chatbot_id);

      this.knowledge = await getKnowledge(this.chatbot_id);
      this.knowledge_to_eliminate = []
      this.loading_save = false;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.editor-container {
  height: calc(100vh - 65px);
  .menu {
    padding: 10px 20px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menu-title {
      font-size: calc(9.5px + 1vw);
      font-weight: bold;
    }
  }
  .editor-content {
    padding: 10px 14px;
    .editor-knowledge {
      padding: 8px 0;
      display: flex;
      .editor-knowledge-row {
        .editor-knowledge-col {
          padding: 4px 6px;
          & > div {
            padding: 10px 10px 10px 20px;
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
            font-size: calc(9px + 0.5vw);
          }
        }
      }
    }
  }
}
</style>