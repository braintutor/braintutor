<template>
  <div>
    <loading :active="loading" :message="loading_msg" />
    <div class="menu pa-0 pb-1">
      <div class="menu-left">
        <v-btn icon @click="unselect(); restore()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title"></span>
      </div>
      <div class="menu-right">
        <!-- <v-btn icon @click="createEvent()">
          <v-icon>mdi-calendar-plus</v-icon>
        </v-btn>
        <v-btn icon @click="restoreEvents()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>-->
      </div>
    </div>
    <div class="task m-card">
      <div class="task__menu">
        <div>
          <p class="task__time_start">{{task.time_start_f}}</p>
          <p class="task__title">{{task.title}}</p>
        </div>
      </div>
      <p class="task__description">{{task.description}}</p>
    </div>
    <div class="response m-card">
      <div class="response__menu">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="success" small v-on="on">
              <v-icon small class="mr-1">mdi-plus</v-icon>Agregar
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="dialog_link = true; link = ''">
              <v-list-item-title>Vínculo</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="response__answer">
        <div class="mb-3" v-for="(item, idx) in answer" :key="idx">
          <div class="link" v-if="item.type === 'link'">
            <a class="link__data" :href="item.url" target="_blank">
              <img class="link__image" :src="item.image" alt />
              <p class="link__title">{{item.title}}</p>
              <p class="link__description">{{item.description}}</p>
            </a>
            <v-btn class="ml-1" small icon @click="remove(idx)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="no-response" v-show="answer.length === 0">No hay respuestas.</div>
      </div>
      <div class="response__actions">
        <v-btn color="primary" small @click="save()">
          <v-icon small class="mr-1">mdi-content-save</v-icon>Guardar
        </v-btn>
      </div>
    </div>
    <!-- DIALOG LINK -->
    <v-dialog v-model="dialog_link" max-width="400">
      <v-card class="pt-3">
        <v-card-text>
          <v-text-field v-model="link" label="Vínculo"></v-text-field>
          <div style="width: min-content; margin: 0 auto">
            <v-btn color="primary" small @click="dialog_link = false; addLink()">Agregar</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { updateTaskAnswer } from "@/services/taskService";
import { getParam } from "@/services/router.js";

export default {
  props: ["task", "unselect", "restore"],
  data: () => ({
    session_id: "",
    answer: [],
    link: "",
    //
    loading: false,
    loading_msg: "",
    //
    dialog_link: false
  }),
  mounted() {
    this.session_id = getParam("session_id");
    if (this.task.answers && Object.entries(this.task.answers)[0]) {
      this.answer = Object.entries(this.task.answers)[0][1];
    }
  },
  methods: {
    async addLink() {
      this.loading = true;
      this.loading_msg = "Agregando Vínculo";
      try {
        let res = await fetch(
          `http://api.linkpreview.net/?key=2b589ffa30e00a45f2b349fff781eb99&q=${this.link}`
        );
        let data = await res.json();
        data.type = "link";
        data.url = this.link;
        this.answer.push(data);
      } catch (error) {
        //
      }
      this.loading = false;
    },
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando Respuesta";
      try {
        await updateTaskAnswer(this.task._id.$oid, this.answer);
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Guardar", error.msg);
      }
      this.loading = false;
    },
    remove(idx) {
      this.answer.splice(idx, 1);
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.task {
  margin-bottom: 16px;
  &__menu {
    padding: 12px 10px 0 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  &__time_start {
    margin-bottom: 2px;
    color: #a0a0a0;
    font-size: 0.75rem;
  }
  &__title {
    margin-bottom: 0;
    font-size: 1.3rem;
    font-weight: bold;
  }
  &__description {
    padding: 12px 18px 16px 18px;
    margin-bottom: 0;
    font-size: 0.95rem;
  }
}
.response {
  padding: 12px;
  &__menu {
    display: flex;
    justify-content: flex-end;
  }
  &__answer {
    margin: 12px 0;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
.no-response {
  padding: 20px;
  color: #969696;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.link {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  //
  display: flex;
  align-items: center;

  &:hover {
    box-shadow: 0 2px 6px #ccc;
  }
  &__data {
    flex-grow: 1;
    color: #494949;
    text-decoration: none;
    //
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    column-gap: 12px;
    row-gap: 6px;
    align-items: center;
  }
  &__image {
    max-width: 80px;
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
  }
  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    grid-column-start: 2;
  }
  &__description {
    margin: 0;
    font-size: 0.9rem;
    font-weight: lighter;
    grid-column-start: 2;
  }
}
</style>