<template>
  <div>
    <TaskCard
      v-for="(task, idx) in tasks_ordered"
      :key="idx"
      :time_start="task.time_start"
      :title="task.title"
      :description="task.description"
      disabled
      class="mb-3"
    />
    <div v-show="tasks_ordered.length <= 0" class="text-center">
      No hay Tareas
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

export default {
  data: () => ({
    tasks: [],
  }),
  computed: {
    tasks_ordered() {
      return this.orderObjectsByDate(this.tasks, "time_start");
    },
  },
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Tareas");
    try {
      this.tasks = this.mongoArr(await this.$api.task.getAll(session_id));
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    TaskCard,
  },
};
</script>

<style>
</style>