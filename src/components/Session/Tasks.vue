<template>
  <div>
    <div v-if="!task" class="tasks">
      <loading :active="loading" :message="loading_msg" />
      <!-- MENU -->
      <div class="tasks__menu">
        <span
          class="tasks__menu-option"
          :class="{'active': show_pending}"
          small
          rounded
          color="success"
          @click="show_pending = true"
        >Pendientes</span>
        <span class="mx-2">|</span>
        <span
          class="tasks__menu-option"
          :class="{'active': !show_pending}"
          small
          rounded
          color="success"
          @click="show_pending = false"
        >Respondidos</span>
      </div>
      <!-- TASKS -->
      <div
        class="task m-card"
        :style="{'border-left': show_pending? '4px solid #3968eb': '4px solid #aaa'}"
        v-for="(task, idx) in tasks_filtered"
        :key="idx"
        @click="select(task)"
      >
        <div class="task__menu">
          <div>
            <p class="task__time_start">{{task.time_start_f}}</p>
            <p class="task__title">{{task.title}}</p>
          </div>
          <!-- <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon small v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showEdit(task)">
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="task_to_remove = task; remove()">
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
          </v-menu>-->
        </div>
        <p class="task__description">{{task.description}}</p>
        <!-- <div class="task__actions">
        <v-btn color="primary" small>Responder</v-btn>
        </div>-->
      </div>
      <div class="text-center" v-show="tasks_filtered.length === 0">No hay tareas.</div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getTasksBySessionStudent } from "@/services/taskService";
import { getParam, redirect } from "@/services/router.js";

export default {
  data: () => ({
    session_id: "",
    tasks: [],
    task: null,
    show_pending: true,
    //
    loading: true,
    loading_msg: ""
  }),
  async created() {
    this.session_id = getParam("session_id");
    this.restore();
  },
  computed: {
    tasks_filtered() {
      let tasks = this.tasks_formated.filter(({ answer }) => {
        if (answer.text || (answer.data && answer.data.length > 0))
          return !this.show_pending;
        else return this.show_pending;
      });
      return tasks;
    },
    tasks_formated() {
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
    async restore() {
      this.loading = true;
      this.loading_msg = "Cargando Tareas";
      try {
        this.tasks = await getTasksBySessionStudent(this.session_id);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    },
    select(task) {
      redirect('task', { task_id: task._id.$oid })
      // this.task = task;
    },
    unselect() {
      this.task = null;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.tasks__menu {
  margin-bottom: 12px;
  font-size: 1.1rem;
  //
  display: flex;
  justify-content: center;
  .tasks__menu-option {
    color: #ccc;
    transition: all 0.3s;
    cursor: pointer;
    &.active {
      color: #000;
      font-weight: bold;
    }
    &:hover {
      color: #000;
    }
  }
}

.task {
  margin-bottom: 16px;
  transition: all 0.3s;
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
  }
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