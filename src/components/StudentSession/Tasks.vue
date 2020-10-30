<template>
  <div class="tasks m-container">
    <!-- MENU -->
    <div class="tasks__menu mb-3">
      <m-btn
        @click="show_pending = true"
        :text="!show_pending"
        color="primary"
        small
        class="mr-2"
        >Pendientes</m-btn
      >
      <m-btn
        @click="show_pending = false"
        :text="show_pending"
        color="dark"
        small
        >Respondidos</m-btn
      >
    </div>
    <!-- TASKS -->
    <TaskCard
      v-for="(task, idx) in tasks_ordered"
      :key="idx"
      @click="select(task)"
      :time_start="task.time_start"
      :title="task.title"
      :description="task.description"
      class="mb-3"
    />
    <div class="text-center" v-show="tasks_ordered.length === 0">
      No hay tareas.
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

import { getParam, redirect } from "@/services/router.js";

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
    tasks_ordered() {
      let tasks = this.tasks.filter(({ answer }) => {
        if (answer.text) return !this.show_pending;
        else return this.show_pending;
      });
      return this.orderObjectsByDate(tasks, "time_start");
    },
  },
  methods: {
    async restore() {
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
    select(task) {
      redirect("student-task", { task_id: task._id });
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
    margin: 0 auto;
  }
}
</style>