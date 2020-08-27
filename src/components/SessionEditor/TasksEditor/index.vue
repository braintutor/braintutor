<template>
  <div class="pa-3">
    <div v-if="!task_selected" class="m-container">
      <!-- MENU -->
      <div class="tasks__menu">
        <v-btn small rounded color="success" @click="showCreate()">
          Crear
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </div>
      <!-- TASKS -->
      <TaskCard
        v-for="(task, idx) in tasks_formatted"
        :key="idx"
        :time_start="task.time_start || new Date()"
        :title="task.title"
        :description="task.description"
        :options="[{
            text: 'Editar',
            action: () => {showEdit(task)}
          },{
            text: 'Eliminar',
            action: () => {showRemove(task)}
          }]"
        :buttons="[{
            text: 'Ver Respuestas',
            action: () => {showAnswers(task)}
          }]"
        disabled
        class="mb-4"
      />

      <div class="text-center" v-show="tasks.length === 0">No hay tareas.</div>
      <!-- DIALOG NEW -->
      <v-dialog v-model="dialog_new" persistent max-width="750">
        <v-card class="pt-4 pa-2">
          <v-card-text>
            <v-text-field
              v-model="task.title"
              :maxlength="TaskModel.title.max_length"
              :counter="TaskModel.title.max_length"
              label="Título"
            ></v-text-field>
            <v-textarea
              v-model="task.description"
              :maxlength="TaskModel.description.max_length"
              :counter="TaskModel.description.max_length"
              label="Descripción"
              value
            ></v-textarea>
          </v-card-text>
          <v-card-actions style="width: min-content; margin: 0 auto">
            <v-btn small text class="mr-1" v-show="!loading_save" @click="dialog_new = false">Cerrar</v-btn>
            <v-btn small color="primary" :loading="loading_save" @click="create()">Guardar</v-btn>
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
    <Task
      class="m-container-plus"
      v-else
      :task="task_selected"
      :students="students"
      :unselect="unselect"
      :restore="restore"
    />
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";
import Task from "./Task";

import {
  getTasksBySessionTeacher,
  addTask,
  updateTask,
  removeTask,
} from "@/services/taskService";
import { getStudentsBySession } from "@/services/studentService";
import { getParam } from "@/services/router.js";

import { mapMutations } from "vuex";

import { TaskModel } from "@/models/Task";

export default {
  data: () => ({
    session_id: "",
    tasks: [],
    task: {},
    task_selected: null,
    action: "",
    //
    loading_save: false,
    dialog_new: false,
    dialog_remove: false,
    TaskModel,
  }),
  async created() {
    this.session_id = getParam("session_id");
    this.restore();
  },
  computed: {
    tasks_formatted() {
      let tasks = this.tasks.map((t) => {
        let task = {
          ...t,
        };
        if (task.time_start.$date)
          task.time_start = new Date(t.time_start.$date);
        return task;
      });
      tasks.sort(function (a, b) {
        return b.time_start - a.time_start;
      });
      return tasks;
    },
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
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
      this.loading_save = true;
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
            (tasks) => tasks._id.$oid === this.task.id
          );
          this.tasks[task_idx] = Object.assign({}, this.task);
          this.tasks.splice();
          this.dialog_new = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      }
      this.loading_save = false;
    },
    async remove() {
      this.loading(true);
      this.loading_msg("Eliminando Tarea");
      try {
        let task_id_to_remove = this.task._id.$oid;
        await removeTask(task_id_to_remove);
        this.tasks = this.tasks.filter((t) => t._id.$oid !== task_id_to_remove);
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Eliminar", error.msg);
      }
      this.loading(false);
    },
    async restore() {
      this.loading(true);
      this.loading_msg("Cargando Tareas");
      try {
        this.students = await getStudentsBySession(this.session_id);
        this.tasks = await getTasksBySessionTeacher(this.session_id);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading(false);
    },
    unselect() {
      this.task_selected = null;
    },
  },
  components: {
    Task,
    TaskCard,
  },
};
</script>

<style lang='scss' scoped>
.tasks__menu {
  margin-bottom: 16px;
  //
  display: flex;
  justify-content: flex-end;
}
</style>