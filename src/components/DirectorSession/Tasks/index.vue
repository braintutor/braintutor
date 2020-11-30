<template>
  <div>
    <div v-show="!task_show_id">
      <TaskCard
        v-for="(task, idx) in tasks_ordered"
        :key="idx"
        :time_start="task.time_start"
        :title="task.title"
        :description="task.description"
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
      <div v-show="tasks_ordered.length <= 0" class="text-center">
        No hay Tareas
      </div>
    </div>

    <!-- TASK -->
    <Task
      v-if="task_show_id"
      :task_id="task_show_id"
      :unselect="unselect"
      class="m-container-plus"
    />
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";
import Task from "@/components/TeacherSession/TasksEditor/Task";

export default {
  data: () => ({
    tasks: [],
    task_show_id: null,
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
  methods: {
    showAnswers(task_id) {
      this.task_show_id = task_id;
    },
    //
    async unselect() {
      this.task_show_id = null;
    },
  },
  components: {
    TaskCard,
    Task,
  },
};
</script>

<style>
</style>