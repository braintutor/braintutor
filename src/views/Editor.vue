<template>
  <div class="editor-container m-fullscreen">
    <div class="menu">
      <span class="menu-title">Conocimiento</span>
      <div class="menu-action">
        <v-btn icon @click="saveKnowledge()" :loading="loading_save">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="editor-content m-fullscreen-content">
      <div v-for="(k, k_idx) in knowledge" :key="k_idx">
        <div class="editor-knowledge-row row no-gutters">
          <!-- Questions -->
          <div class="editor-knowledge col-md-6">
            <div>
              <div v-for="(question, q_idx) in k.questions" :key="q_idx">
                <div v-if="q_idx == 0" class="editor-knowledge-principal">
                  <v-text-field
                    class="editor-input"
                    v-model="k.questions[q_idx]"
                    dense
                    hide-details
                    autocomplete="off"
                  ></v-text-field>
                  <v-badge
                    :content="k.questions.length - 1"
                    :color="k.show_questions || (k.questions.length - 1 <= 0) ? 'rgba(255, 0, 0, 0)': 'green'"
                    overlap
                    bottom
                  >
                    <v-btn icon @click="toggleQuestions(k)">
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </v-badge>
                </div>
                <div v-else-if="k.show_questions" class="editor-knowledge-more">
                  <div>
                    <v-text-field
                      class="editor-input"
                      v-model="k.questions[q_idx]"
                      dense
                      hide-details
                      autocomplete="off"
                    ></v-text-field>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Answers -->
          <div class="editor-knowledge col-md-6">
            <div>
              <div v-for="(answer, a_idx) in k.answers" :key="a_idx">
                <div v-if="a_idx == 0" class="editor-knowledge-principal">
                  <v-text-field
                    class="editor-input"
                    v-model="k.answers[a_idx]"
                    dense
                    hide-details
                    autocomplete="off"
                  ></v-text-field>
                  <v-badge
                    :content="k.answers.length - 1"
                    :color="k.show_answers || (k.answers.length - 1 <= 0) ? 'rgba(255, 0, 0, 0)': 'green'"
                    overlap
                    bottom
                  >
                    <v-btn icon @click="toggleAnswers(k)">
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </v-badge>
                </div>
                <div v-else-if="k.show_answers" class="editor-knowledge-more">
                  <div>
                    <v-text-field
                      class="editor-input"
                      v-model="k.answers[a_idx]"
                      dense
                      hide-details
                      autocomplete="off"
                    ></v-text-field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getParam } from "@/services/router.js";
import { getKnowledge, updateKnowledge } from "@/services/knowledgeService";

export default {
  data: () => ({
    chatbot_id: "",
    knowledge: [],
    //
    loading_save: false
  }),
  mounted() {
    this.chatbot_id = getParam("chatbot_id");
    getKnowledge(this.chatbot_id).then(knowledge => {
      this.knowledge = knowledge;
    });
  },
  methods: {
    saveKnowledge() {
      let knowledge = this.knowledge.map(k => ({
        ...k,
        id: k._id.$oid
      }));
      this.loading_save = true;
      updateKnowledge(this.chatbot_id, knowledge).then(() => {
        this.loading_save = false;
      });
    },
    toggleQuestions(knowledge) {
      knowledge.show_questions = !knowledge.show_questions;
      this.$forceUpdate();
    },
    toggleAnswers(knowledge) {
      knowledge.show_answers = !knowledge.show_answers;
      this.$forceUpdate();
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
    padding: 10px;
    .editor-knowledge-row {
      padding: 12px 0;
      .editor-knowledge {
        padding: 4px 8px;
        & > * {
          padding: 8px 8px 8px 18px;
          margin: 0;
          border-radius: 10px;
          @include box-shadow;
        }
        .editor-input {
          font-size: calc(9px + 0.5vw);
        }
        .editor-knowledge-principal {
          display: flex;
        }
        .editor-knowledge-more {
          margin: 10px 10px 10px 0;
        }
      }
    }
  }
}
</style>