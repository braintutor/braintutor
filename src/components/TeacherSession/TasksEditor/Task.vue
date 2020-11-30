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
        :title="task.title"
        :description="task.description"
        disabled
        class="mb-4"
      />

      <div class="answers m-card">
        <!-- STUDENTS -->
        <div class="students">
          <div
            v-for="(student, idx) in students"
            :key="idx"
            @click="student_selected = student"
            class="student"
            :class="{ 'student--active': student._id === student_selected._id }"
          >
            <v-icon class="mr-2" style="font-size: 1.2rem"
              >mdi-account-circle</v-icon
            >
            <div class="student__name">
              {{ `${student.last_name}, ${student.first_name}` }}
            </div>
          </div>
        </div>
        <!-- ANSWER -->
        <div v-if="student_selected" class="answer">
          <div v-if="!loading">
            <!-- ANSWER STUDENT -->
            <!-- <p>
              {{
                `${student_selected.last_name}, ${student_selected.first_name}`
              }}
            </p> -->
            <!-- ANSWER TEXT -->
            <div v-if="answer">
              <p class="answer__time">{{ formatDateTime(answer.time_end) }}</p>
              <p>{{ answer.text }}</p>
            </div>
            <!-- ANSWER FILES -->
            <a v-for="(file, idx) in files_f" :key="idx" class="file mt-2">
              <a :href="file.url" target="_blank" class="file__body">
                <div class="file__type">
                  <img
                    v-if="file.type === 'audio'"
                    src="@/assets/file/icon-audio.svg"
                  />
                  <img
                    v-else-if="file.type === 'image'"
                    src="@/assets/file/icon-image.svg"
                  />
                  <img
                    v-else-if="file.type === 'video'"
                    src="@/assets/file/icon-video.svg"
                  />
                  <!--  -->
                  <img
                    v-else-if="file.content_type === 'application/pdf'"
                    src="@/assets/file/icon-application-pdf.svg"
                  />
                  <img v-else src="@/assets/file/icon-default.svg" />
                </div>
                <span class="file__name">{{ file.name_f }}</span>
              </a>
            </a>

            <!-- ANSWER EMPTY -->
            <p
              v-if="!((answer && answer.text) || files_f.length > 0)"
              class="text-center"
            >
              No hay respuesta
            </p>
          </div>
          <div v-else style="width: max-content" class="pa-4 mx-auto">
            <v-progress-circular
              :width="3"
              :size="80"
              indeterminate
              color="var(--color-subtitle)"
            ></v-progress-circular>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

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
    async student_selected() {
      this.loading = true;

      let answer = (this.task.answers || []).find(
        (answer) => answer._id === this.student_selected._id
      );
      this.answer = answer;
      let { files } = await this.$api.file.getFilesTask(
        this.task._id,
        this.student_selected._id
      );
      this.files = files;

      this.loading = false;
    },
  },
  methods: {
    async init() {
      this.showLoading("Cargando Tarea");
      try {
        this.task = this.mongo(await this.$api.task.get(this.task_id));
        let session = this.mongo(
          await this.$api.session.get(this.task.session_id)
        );
        this.students = this.mongoArr(
          await this.$api.student.getAll({
            grade_id: session.grade_id,
            section_id: session.section_id,
          })
        );
        this.student_selected = this.students[0];
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    TaskCard,
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
  &__actions {
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