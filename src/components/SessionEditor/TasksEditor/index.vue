<template>
  <div v-if="!task_selected">
    <loading :active="loading" :message="loading_msg" />
    <!-- MENU -->
    <div class="tasks__menu">
      <v-btn small rounded color="success" @click="showCreate()">
        Crear
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <!-- TASKS -->
    <div class="task m-card" v-for="(task, idx) in tasks_formatted" :key="idx">
      <div class="task__menu">
        <div>
          <p class="task__time_start">{{task.time_start_f}}</p>
          <p class="task__title">{{task.title}}</p>
        </div>
        <v-menu offset-y left>
          <template v-slot:activator="{ on }">
            <v-btn icon small v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showEdit(task)">
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showRemove(task)">
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <p class="task__description">{{task.description}}</p>
      <div class="task__actions">
        <v-btn text small @click="showAnswers(task)">Ver Respuestas</v-btn>
      </div>
    </div>
    <div class="text-center" v-show="tasks.length === 0">No hay tareas.</div>
    <!-- DIALOG NEW -->
    <v-dialog v-model="dialog_new" persistent max-width="750">
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
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" max-width="400">
      <v-card>
        <v-card-title>¿Eliminar la Tarea?</v-card-title>
        <v-card-text
          class="pb-3"
        >También se borrarán las respuestas y calificaciones de los alumnos.</v-card-text>
        <v-card-actions class="pb-3" style="width: min-content; margin: 0 auto">
          <v-btn small text class="mr-1" @click="dialog_remove = false">Cancelar</v-btn>
          <v-btn small color="error" @click="dialog_remove = false; remove()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- TASK -->
  <Task v-else :task="task_selected" :students="students" :unselect="unselect" :restore="restore" />
</template>

<script>
import loading from "@/components/loading";
import Task from "./Task";

import {
  getTasksBySessionTeacher,
  addTask,
  updateTask,
  removeTask
} from "@/services/taskService";
import { getStudentsBySession } from "@/services/studentService";
import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    session_id: "",
    tasks: [],
    task: {},
    task_selected: null,
    action: "",
    //
    loading: true,
    loading_msg: "",
    dialog_new: false,
    dialog_remove: false
  }),
  async created() {
    this.session_id = getParam("session_id");
    this.restore();
  },
  computed: {
    tasks_formatted() {
      let tasks = this.tasks.map(t => {
        let time_start_f = new Date(t.time_start).toLocaleString("es-ES");
        return {
          ...t,
          time_start_f
        };
      });
      tasks.sort(function(a, b) {
        return new Date(b.time_start) - new Date(a.time_start);
      });
      return tasks;
    }
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
      this.task.id = this.task._id.$oid;
      this.dialog_new = true;
    },
    showRemove(task) {
      this.task = Object.assign({}, task);
      this.task.id = this.task._id.$oid;
      this.dialog_remove = true;
    },
    showAnswers(task) {
      this.task_selected = Object.assign({}, task);
    },
    async create() {
      this.loading = true;
      this.loading_msg = "";
      if (this.action === "create") {
        try {
          this.task.time_start = new Date();
          let _id = await addTask(this.session_id, this.task);
          this.task._id = _id;
          this.tasks.push(this.task);
          this.dialog_new = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      } else if (this.action === "edit") {
        try {
          await updateTask(this.task);
          let task_idx = this.tasks.findIndex(
            tasks => tasks._id.$oid === this.task.id
          );
          this.tasks[task_idx] = Object.assign({}, this.task);
          this.tasks.splice();
          this.dialog_new = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      }
      this.loading = false;
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando Tarea";
      try {
        let task_id_to_remove = this.task._id.$oid;
        await removeTask(task_id_to_remove);
        this.tasks = this.tasks.filter(t => t._id.$oid !== task_id_to_remove);
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Eliminar", error.msg);
      }
      this.loading = false;
    },
    async restore() {
      this.loading = true;
      this.loading_msg = "Cargando Tareas";
      try {
        this.students = await getStudentsBySession(this.session_id);
        this.tasks = await getTasksBySessionTeacher(this.session_id);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    },
    unselect() {
      this.task_selected = null;
    }
  },
  components: {
    loading,
    Task
  }
};
</script>

<style lang='scss' scoped>
.tasks__menu {
  margin-bottom: 12px;
  //
  display: flex;
  justify-content: flex-end;
}

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
  &__actions {
    padding: 12px;
    padding-top: 0;
    //
    display: flex;
    justify-content: flex-end;
  }
}
</style>