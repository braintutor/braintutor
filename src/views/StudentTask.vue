<template>
  <div class="m-container pt-0">
    <div v-if="task">
      <div class="m-menu pa-0 pb-2">
        <div class="m-menu__left">
          <v-btn icon @click="redirectSession()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">Volver</span>
        </div>
      </div>
      <!-- TASK -->
      <TaskCard
        :time_start="task.time_start"
        :title="task.name"
        :description="task.content[0].question"
        disabled
      />
      <div class="my-2">Responder tarea:</div>
      <QuestionTypeFile
        class="my-3"
        :evaluationId="task.id"
        v-model="answer"
      ></QuestionTypeFile>

      <!-- ANSWER -->
      <div class="d-flex justify-end">
        <m-btn @click="save()" color="primary" small>Guardar</m-btn>
      </div>

      <!-- DLG REMOVE -->
      <v-dialog v-model="dlg_remove" max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h3>Confirmar eliminación</h3>
            <p class="mt-4">
              Si elimina este contenido, no podrá revertir los cambios.
            </p>
          </div>
          <div class="m-card__actions">
            <m-btn
              @click="dlg_remove = false"
              color="primary"
              small
              class="mr-2"
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                dlg_remove = false;
                removeFile();
              "
              color="error"
              small
              >Eliminar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";
import { getTask, updateTaskAnswer } from "@/services/taskService";
import { AnswerModel } from "@/models/Task";
import QuestionTypeFile from "@/components/StudentSession/Evaluations/QuestionTypeFile";
export default {
  data: () => ({
    task: null,
    resultId: null,
    answer: null,
    file_selected: null,
    dlg_remove: false,
    AnswerModel,
  }),
  computed: {},
  async created() {
    this.task_id = this.$route.params["task_id"];
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Tarea");
      try {
        const { id, evaluation, answers } = this.mongo(
          await getTask(this.task_id)
        );
        this.task = evaluation;
        this.taskResultId = id;
        this.answer = answers.length > 0 ? answers[0] : {};
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async save() {
      this.showLoading("Guardando Respuesta");
      try {
        await updateTaskAnswer(this.taskResultId, this.answer);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },

    async showRemove(file) {
      this.file_selected = file;
      this.dlg_remove = true;
    },
    kb_to_mb(size) {
      return `${(size / 1000 / 1000).toFixed(3)} MB`;
    },
    // ROUTE
    redirectSession() {
      this.$router
        .push(`/student-session/${this.task.session_id}/tasks`)
        .catch(() => {});
    },
  },
  components: {
    TaskCard,
    QuestionTypeFile,
  },
};
</script>

<style lang="scss" scoped>
.files {
  &__menu {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
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
