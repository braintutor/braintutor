<template>
  <div>
    <div class="m-menu mb-3">
      <div class="m-menu__left">
        <v-btn icon @click="unselect()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="m-menu__title">Ver Tareas</span>
      </div>
    </div>
    <div v-if="task">
      <!-- TASK -->
      <TaskCard
        :time_start="task.time_start"
        :title="task.name"
        disabled
        class="mb-4"
      />
      <div class="">
            <EvaluationResults type="tarea" :showPublishScore="false" :evaluation="task"  :role="'TEA'" />
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";
import EvaluationResults from "@/components/TeacherSession/EvaluationsEditor/EvaluationResults";
import {  getTask } from "@/services/taskService";

export default {
  props: ["task_id", "unselect"],
  data: () => ({
    task: null,
    students: [],
    student_selected: null,
    // ANSWER
    answer: null,
    files: [],
    loading: false,
  }),
  async created() {
    await this.init();
  },
  computed: {
    files_f() {
      return this.files.map((f) => ({
        ...f,
        name_f: f.name.substring(f.name.lastIndexOf("/") + 1),
        type: f.content_type.split("/")[0],
      }));
    },
  },
  watch: {
  
  },
  methods: {
    async init() {
      this.showLoading("Cargando Tarea");
      try {
        const  { evaluation } = await getTask(this.task_id);
        this.task = evaluation

      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    TaskCard,
    EvaluationResults
  },
};
</script>

<style lang='scss' scoped>
.answers {
  overflow: hidden;
  display: flex;
}

.answer {
  flex-grow: 1;
  padding: 16px;
  &__time {
    color: var(--color-active);
    text-align: end;
    font-weight: bold;
  }
}

.students {
  padding: 6px;
  padding-right: 0;
  width: 24%;
}

$background-active: #e4e9ff;
.student {
  padding: 8px 12px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--background-hover);
  }
  &:active {
    background: rgba(0, 0, 0, 0.1);
  }

  &--active {
    background: $background-active;
    * {
      color: var(--color-active);
    }
    &:hover {
      background: $background-active;
    }
  }
}

// FILE
.file {
  display: block;
  background: rgba(0, 0, 255, 0.07);
  border-radius: 6px;

  display: flex;
  align-items: center;

  &__body {
    overflow: hidden;
    flex-grow: 1;
    color: rgba(0, 0, 0, 0.75);
    text-decoration: none;

    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 255, 0.05);
    }
  }
  
  &__type {
    padding: 16px;
    opacity: 0.6;

    display: flex;
    align-items: center;

    img {
      height: 32px;
      width: 32px;
    }
  }
  &__name {
    flex-grow: 1;
    padding: 8px;
  }
}
</style>