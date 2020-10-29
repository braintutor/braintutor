<template>
  <div class="pa-2">
    <div class="m-menu pa-0 pb-2">
      <div class="m-menu__left">
        <v-btn icon @click="unselect()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="m-menu__title">Ver Tareas</span>
      </div>
    </div>

    <TaskCard
      :time_start="task.time_start"
      :title="task.title"
      :description="task.description"
      disabled
    />

    <!-- ANSWERS -->
    <p style="font-weight: bold; font-size: 1.2rem" class="ml-2 mt-6 mb-3">
      Respuestas
    </p>
    <div class="row no-gutters">
      <!-- STUDENTS -->
      <div class="students m-card col-12 col-sm-2">
        <div
          class="student"
          :class="{ 'student--active': student === s }"
          v-for="(s, idx) in students"
          :key="idx"
          @click="student = s"
        >
          <span>{{ `${s.last_name}, ${s.first_name}` }}</span>
        </div>
      </div>
      <!-- ANSWER -->
      <div v-if="student" class="col-12 col-sm-10">
        <div v-if="!loading" class="response m-card mb-4 ml-sm-5">
          <div class="response__menu">
            <p class="response__student">
              {{ `${student.last_name}, ${student.first_name}` }}
            </p>
            <p v-if="answer" class="response__time">
              {{ toDateTimeString(answer.time_end) }}
            </p>
          </div>
          <div v-if="answer" class="response__answer">
            <p class="response__text">{{ answer.text }}</p>
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
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

import { toDateTimeString } from "@/services/date";

export default {
  props: ["task", "students", "unselect"],
  data: () => ({
    student: null,
    answer: null,
    files: [],
    loading: true,
  }),
  created() {
    this.student = this.students[0];
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
    async student() {
      this.loading = true;

      let answer = (this.task.answers || []).find(
        (answer) => answer._id === this.student._id
      );
      this.answer = answer;
      let { files } = await this.$api.file.getFilesTask(
        this.task._id,
        this.student._id
      );
      this.files = files;

      this.loading = false;
    },
  },
  methods: {
    toDateTimeString,
  },
  components: {
    TaskCard,
  },
};
</script>

<style lang='scss' scoped>
.students {
  border-radius: 0;
  overflow: hidden;
  height: min-content;
}
.student {
  padding: 6px 10px;
  font-size: 0.75rem;
  transition: all 0.3s;
  border-left: 3px solid #fff;
  border-bottom: 0.5px solid #e0e0e0;
  cursor: pointer;
  &:hover {
    background: #e7e7e7;
    border-left: 3px solid #e7e7e7;
  }
  &--active {
    border-left: 3px solid #3968eb;
    cursor: default;
    &:hover {
      border-left: 3px solid #3968eb;
      background: #fff;
    }
  }
}

.response {
  padding: 12px;
  &__menu {
    display: flex;
    justify-content: space-between;
  }
  &__student {
    font-size: 0.9rem;
    margin-bottom: 0;
    font-weight: bold;
  }
  &__time {
    margin-bottom: 2px;
    color: #a0a0a0;
    font-size: 0.75rem;
  }
  &__text {
    margin: 10px 2px 0 2px;
    font-size: 0.9rem;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
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