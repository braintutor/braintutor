<template>
  <div class="tasks m-container py-3">
    <!-- MENU -->
    <div class="tasks__menu">
      <m-btn
        @click="show_pending = true"
        :text="!show_pending"
        color="primary"
        small
        class="mr-2"
      >Pendientes</m-btn>
      <m-btn @click="show_pending = false" :text="show_pending" color="dark" small>Respondidos</m-btn>
    </div>
    <!-- TASKS -->
    <TaskCard
      v-for="(task, idx) in tasks_filtered"
      :key="idx"
      @click="select(task)"
      :time_start="task.time_start"
      :title="task.title"
      :description="task.description"
      class="mt-4"
    />
    <div class="text-center mt-4" v-show="tasks_filtered.length === 0">No hay tareas.</div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

import { getTasksBySessionStudent } from "@/services/taskService";
import { getParam, redirect } from "@/services/router.js";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    session_id: "",
    tasks: [],
    show_pending: true,
  }),
  async created() {
    this.session_id = getParam("session_id");
    this.restore();
  },
  computed: {
    tasks_filtered() {
      let tasks = this.tasks.filter(({ answer }) => {
        if (answer.text || (answer.data && answer.data.length > 0))
          return !this.show_pending;
        else return this.show_pending;
      });
      tasks.sort(function (a, b) {
        return b.time_start - a.time_start;
      });
      return tasks;
    },
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async restore() {
      this.loading(true);
      this.loading_msg("Cargando Tareas");
      try {
        this.tasks = this.formatObjects(
          await getTasksBySessionStudent(this.session_id)
        );
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading(false);
    },
    select(task) {
      redirect("task", { task_id: task._id });
    },
  },
  components: {
    TaskCard,
  },
};
</script>

<style lang='scss' scoped>
.tasks {
  &__menu {
    width: max-content;
    margin: 10px auto;
  }
}
</style>