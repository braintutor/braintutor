<template>
  <div v-if="!task_selected" class="m-container">
    <!-- MENU -->
    <div class="tasks__menu mb-3">
      <strong
        v-show="$store.state.show_limits"
        class="mt-1"
        style="opacity: 0.5"
        >({{ `${tasks.length}/${variables.max_tasks_per_session}` }})</strong
      >
      <div></div>
      <m-btn
        @click="showCreate()"
        :disabled="tasks.length >= variables.max_tasks_per_session"
        color="primary"
        small
      >
        <v-icon left style="font-size: 0.9rem">mdi-plus</v-icon>Crear Tarea
      </m-btn>
    </div>
    <!-- TASKS -->
    <TaskCard
      v-for="(task, idx) in tasks_ordered"
      :key="idx"
      :time_start="task.time_start || new Date()"
      :title="task.title"
      :description="task.description"
      :options="[
        {
          text: 'Editar',
          action: () => {
            showEdit(task);
          },
        },
        {
          text: 'Eliminar',
          action: () => {
            showRemove(task);
          },
        },
      ]"
      :buttons="[
        {
          text: 'Ver Respuestas',
          action: () => {
            showAnswers(task);
          },
        },
      ]"
      disabled
      class="mb-3"
    />

    <div class="text-center" v-show="tasks_ordered.length === 0">
      No hay tareas.
    </div>

    <!-- DIALOG NEW -->
    <v-dialog v-model="dialog_new" persistent max-width="750">
      <form @submit.prevent="create()" class="m-card">
        <div class="m-card__body">
          <span class="mr-2">Tiempo de Inicio:</span>
          <input type="datetime-local" v-model="task.time_start_f" required />
          <v-text-field
            v-model="task.title"
            :maxlength="TaskModel.title.max_length"
            :counter="TaskModel.title.max_length"
            label="Título"
            required
          ></v-text-field>
          <v-textarea
            v-model="task.description"
            :maxlength="TaskModel.description.max_length"
            :counter="TaskModel.description.max_length"
            label="Descripción"
            required
          ></v-textarea>
          <v-checkbox v-model="task.public" label="Público"></v-checkbox>
        </div>
        <div class="m-card__actions">
          <m-btn
            type="button"
            small
            text
            color="primary"
            class="mr-2"
            v-show="!loading_save"
            @click="dialog_new = false"
            >Cerrar</m-btn
          >
          <m-btn type="submit" small color="primary" :loading="loading_save"
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Eliminar la Tarea?</h3>
          <p class="mt-4">
            También se borrarán las respuestas y calificaciones de los alumnos.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_remove = false" color="primary" small
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dialog_remove = false;
              remove();
            "
            color="error"
            small
            class="ml-2"
            >Eliminar</m-btn
          >
        </div>
      </div>
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
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";
import Task from "./Task";

import {
  getTasksBySessionTeacher,
  addTask,
  removeTask,
} from "@/services/taskService";
import { getStudentsBySession } from "@/services/studentService";
import { getParam } from "@/services/router.js";

import { TaskModel } from "@/models/Task";
import variables from "@/models/variables";

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
    variables,
  }),
  async created() {
    this.session_id = getParam("session_id");
    this.restore();
  },
  computed: {
    tasks_ordered() {
      return this.orderObjectsByDate(this.tasks, "time_start");
    },
  },
  methods: {
    showCreate() {
      this.action = "create";
      this.task = {
        time_start_f: this._formatDateToInput(new Date()),
        public: false,
      };
      this.dialog_new = true;
    },
    showEdit(task) {
      this.action = "edit";
      this.task = {
        ...task,
        id: task._id,
        time_start_f: this._formatDateToInput(task.time_start),
      };
      this.dialog_new = true;
    },
    showRemove(task) {
      this.task = Object.assign({}, task);
      this.task.id = this.task._id;
      this.dialog_remove = true;
    },
    showAnswers(task) {
      this.task_selected = Object.assign({}, task);
    },
    async create() {
      this.loading_save = true;
      if (this.action === "create") {
        try {
          let _id = await addTask(this.session_id, {
            ...this.task,
            time_start: new Date(this.task.time_start_f),
          });
          this.task._id = _id.$oid;
          this.task.time_start = new Date(this.task.time_start_f);
          this.tasks.push(this.task);
          this.dialog_new = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      } else if (this.action === "edit") {
        try {
          await this.$api.task.update(this.task.id, {
            ...this.task,
            time_start: new Date(this.task.time_start_f),
          });
          this.task.time_start = new Date(this.task.time_start_f);
          let task_idx = this.tasks.findIndex((t) => t._id === this.task.id);
          this.tasks[task_idx] = Object.assign({}, this.task);
          this.tasks.splice();
          this.dialog_new = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      }
      this.loading_save = false;
    },
    async remove() {
      this.showLoading("Eliminando Tarea");
      try {
        let task_id_to_remove = this.task._id;
        await removeTask(task_id_to_remove);
        this.tasks = this.tasks.filter((t) => t._id !== task_id_to_remove);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async restore() {
      this.showLoading("Cargando Tareas");
      try {
        this.students = this.mongoArr(
          await getStudentsBySession(this.session_id)
        );
        this.tasks = this.mongoArr(
          await getTasksBySessionTeacher(this.session_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    //
    _formatDateToInput(date) {
      let date_f = new Date();
      date_f.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      date_f = date_f.toISOString().substring(0, 16);
      return date_f;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>