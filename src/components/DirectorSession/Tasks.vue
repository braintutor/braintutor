<template>
  <div>
    <TaskCard
      v-for="(task, idx) in tasks"
      :key="idx"
      :time_start="task.time_start"
      :title="task.title"
      :description="task.description"
      class="mb-4"
    />
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

export default {
  data: () => ({
    tasks: [],
  }),
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