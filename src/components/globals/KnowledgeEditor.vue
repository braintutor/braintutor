<template>
  <div class="editor-container m-fullscreen">
    <loading :active="loading" :message="loading_message" />
    <div class="menu">
      <!-- <span class="menu-title">Conocimiento</span> -->
      <div></div>
      <div class="menu-action">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="addKnowledge()">
              <v-icon>mdi-comment-plus-outline</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Agregar Conocimiento</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="restoreKnowledge()">
              <v-icon>mdi-restore</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Restaurar Cambios</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="saveKnowledge()">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Guardar Cambios</span>
        </v-tooltip>
      </div>
    </div>
    <div id="knowledge-scroll" class="editor-content m-fullscreen-content">
      <p v-if="knowledge.length <= 0" class="editor-empty">No hay conocimientos.</p>
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
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="moveUp(k_idx)">
                <v-list-item-title>Mover Arriba</v-list-item-title>
              </v-list-item>
              <v-list-item @click="moveDown(k_idx)">
                <v-list-item-title>Mover Abajo</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeKnowledge(k_idx)">
                <v-list-item-title>Eliminar</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { scrollDown } from "@/services/scroll";

export default {
  props: ["get", "update"],
  data: () => ({
    knowledge: [],
    //
    loading: false,
    loading_message: ""
  }),
  async mounted() {
    await this.restoreKnowledge();
  },
  methods: {
    // Menu
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
      this.loading = true;
      this.loading_message = "Guardando Conocimiento";
      await this.update(this.knowledge);
      this.loading = false;
    },
    async restoreKnowledge() {
      this.loading = true;
      this.loading_message = "Cargando Conocimiento";
      this.knowledge = await this.get();
      this.loading = false;
    },
    //
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
    // Options
    moveUp(k_idx) {
      if (k_idx > 0) {
        let aux = this.knowledge[k_idx];
        this.knowledge[k_idx] = this.knowledge[k_idx - 1];
        this.knowledge[k_idx - 1] = aux;
        this.knowledge.splice();
      }
    },
    moveDown(k_idx) {
      if (k_idx < this.knowledge.length - 1) {
        let aux = this.knowledge[k_idx];
        this.knowledge[k_idx] = this.knowledge[k_idx + 1];
        this.knowledge[k_idx + 1] = aux;
        this.knowledge.splice();
      }
    },
    removeKnowledge(knowledge_idx) {
      this.knowledge.splice(knowledge_idx, 1);
    }
  },
  components: {
    loading
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/box-shadow.scss";

.editor-container {
  flex-direction: column;
  .menu {
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menu-title {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  .editor-content {
    padding: 10px 10px;
    padding-top: 0;
    .editor-empty {
      color: rgb(148, 148, 148);
      font-size: 1rem;
      text-align: center;
    }
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