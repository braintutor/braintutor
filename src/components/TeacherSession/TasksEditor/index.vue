<template>
  <div v-if="!task_show_id" class="m-container">
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
      :isPublic="task.public"
      :options="[
        {
          text: 'Editar Tarea',
          action: () => {
            showEdit(task);
          },
        },
        {
          text: 'Editar Fecha',
          action: () => {
            showEditDate(task);
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
            showAnswers(task._id);
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
    <v-dialog v-model="dlg_new" persistent max-width="750">
      <form @submit.prevent="create()" class="m-card">
        <div class="m-card__body">
          <div>
            <span class="mr-2">Tiempo de Inicio:</span>
            <input type="datetime-local" v-model="task.time_start_f" required />
          </div>
          <v-text-field
            v-model="task.title"
            :maxlength="TaskModel.title.max_length"
            :counter="TaskModel.title.max_length"
            label="Título"
            required
            class="mt-3"
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
            @click="dlg_new = false"
            >Cerrar</m-btn
          >
          <m-btn type="submit" small color="primary" :loading="loading_save"
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <!-- DIALOG EDIT -->
    <v-dialog v-model="dlg_edit" persistent max-width="750">
      <form @submit.prevent="save()" class="m-card">
        <div class="m-card__body">
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
            @click="dlg_edit = false"
            >Cerrar</m-btn
          >
          <m-btn type="submit" small color="primary" :loading="loading_save"
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <!-- DIALOG EDIT DATE -->
    <v-dialog v-model="dlg_edit_date" persistent max-width="450">
      <form @submit.prevent="saveDate()" class="m-card">
        <div class="m-card__body">
          <div>
            <span class="mr-2">Tiempo de Inicio:</span>
            <input type="datetime-local" v-model="task.time_start_f" required />
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn
            type="button"
            small
            text
            color="primary"
            class="mr-2"
            v-show="!loading_save"
            @click="dlg_edit_date = false"
            >Cerrar</m-btn
          >
          <m-btn type="submit" small color="primary" :loading="loading_save"
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Eliminar la Tarea?</h3>
          <p class="mt-4">
            También se borrarán las respuestas y calificaciones de los alumnos.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove = false;
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
    v-else
    :task_id="task_show_id"
    :unselect="unselect"
    class="m-container-plus"
  />
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";
import Task from "./Task";

import { addTask, removeTask } from "@/services/taskService";

import { TaskModel } from "@/models/Task";
import variables from "@/models/variables";

export default {
  data: () => ({
    session_id: "",
    tasks: [],
    task: {},
    task_show_id: null,
    action: "",
    //
    loading_save: false,
    dlg_new: false,
    dlg_edit: false,
    dlg_edit_date: false,
    dlg_remove: false,
    TaskModel,
    variables,
  }),
  async created() {
    this.session_id = this.$route.params["session_id"];
    let task_id = this.$route.query.task_id;

    await this.init();
    if (this.tasks.map((t) => t._id).includes(task_id))
      this.task_show_id = task_id;
  },
  computed: {
    tasks_ordered() {
      return this.orderObjectsByDate(this.tasks, "time_start");
    },
  },
  watch: {
    async task_show_id() {
      let query = null;
      if (this.task_show_id) query = { task_id: this.task_show_id };

      this.$router
        .push({
          query,
        })
        .catch(() => {});
    },
  },
  methods: {
    async init() {
      this.showLoading("Cargando Tareas");
      try {
        this.tasks = this.mongoArr(
          await this.$api.task.getAll(this.session_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async create() {
      this.loading_save = true;
      try {
        let _id = await addTask(this.session_id, {
          ...this.task,
          time_start: new Date(this.task.time_start_f),
        });
        this.task._id = _id.$oid;
        this.task.time_start = new Date(this.task.time_start_f);
        this.tasks.push(this.task);
        this.dlg_new = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_save = false;
    },
    async save() {
      this.loading_save = true;
      try {
        await this.$api.task.update(this.task._id, {
          ...this.task,
        });
        let task_idx = this.tasks.findIndex((t) => t._id === this.task._id);
        this.tasks[task_idx] = {
          ...this.tasks[task_idx],
          ...this.task,
        };
        this.tasks.splice();
        this.dlg_edit = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_save = false;
    },
    async saveDate() {
      this.loading_save = true;
      try {
        await this.$api.task.update(this.task._id, {
          time_start: new Date(this.task.time_start_f),
        });
        this.task.time_start = new Date(this.task.time_start_f);
        let task_idx = this.tasks.findIndex((t) => t._id === this.task._id);
        this.tasks[task_idx].time_start = this.task.time_start;
        this.tasks.splice();
        this.dlg_edit_date = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
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
    showCreate() {
      this.task = {
        time_start_f: this.dateToInput(new Date().addHours(1)),
        public: false,
      };
      this.dlg_new = true;
    },
    showEdit(task) {
      this.task = {
        _id: task._id,
        title: task.title,
        description: task.description,
        public: task.public,
      };
      this.dlg_edit = true;
    },
    showEditDate(task) {
      this.task = {
        _id: task._id,
        time_start_f: this.dateToInput(task.time_start),
      };
      this.dlg_edit_date = true;
    },
    showRemove(task) {
      this.task = Object.assign({}, task);
      this.task.id = this.task._id;
      this.dlg_remove = true;
    },
    showAnswers(task_id) {
      this.task_show_id = task_id;
    },
    //
    async unselect() {
      this.task_show_id = null;
      await this.init();
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