<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <!-- MENU -->
    <div class="tasks__menu">
      <v-btn small rounded color="success" @click="showCreate()">
        Crear
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <!-- TASKS -->
    <div class="task m-card" v-for="(task, idx) in tasks" :key="idx">
      <div class="task__menu">
        <p class="task__title">{{task.title}}</p>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showEdit(task)">
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <p class="task__description">{{task.description}}</p>
    </div>
    <div class="text-center" v-show="tasks.length === 0">No hay tareas.</div>
    <!-- DIALOG NEW -->
    <v-dialog v-model="dialog_new" persistent max-width="900">
      <v-card class="pt-4 pa-2">
        <v-card-text>
          <v-text-field v-model="task.title" label="Título"></v-text-field>
          <v-textarea v-model="task.description" label="Descripición" value></v-textarea>
        </v-card-text>
        <v-card-actions style="width: min-content; margin: 0 auto">
          <v-btn small text class="mr-1" v-show="!loading" @click="dialog_new = false">Cerrar</v-btn>
          <v-btn small color="primary" :loading="loading" @click="create()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { addTask, getTasksBySessionTeacher } from "@/services/taskService";
import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    session_id: "",
    tasks: [],
    task: {},
    action: "",
    //
    loading: true,
    loading_message: "",
    dialog_new: false
  }),
  async created() {
    this.loading_message = "Cargando Tareas";
    try {
      this.session_id = getParam("session_id");
      this.tasks = await getTasksBySessionTeacher(this.session_id);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading = false;
  },
  methods: {
    showCreate() {
      this.action = "create";
      this.task = {};
      this.dialog_new = true;
    },
    showEdit(task) {
      this.action = "edit";
      this.task = Object.assign({}, task);
      this.dialog_new = true;
    },
    async create() {
      this.loading = true;
      this.loading_message = "";
      if (this.action === "create") {
        try {
          let _id = await addTask(this.session_id, this.task);
          this.tasks.id = _id;
          this.tasks.unshift(this.task);
          this.dialog_new = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      } else if (this.action === "edit") {
        console.log("Editando");
        this.dialog_new = false;
      }
      this.loading = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.tasks__menu {
  margin-bottom: 16px;
  //
  display: flex;
  justify-content: flex-end;
}

.task {
  margin-bottom: 18px;
  &__menu {
    padding: 12px 10px 0 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
</style>