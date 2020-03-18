<template>
  <div class="course-editor container">
    <loading :active="loading" />
    <aside class="course-editor__nav">
      <div class="course-editor__nav-link transform-scale-plus" @click="editor_idx = 0">
        <img src="@/assets/braintutor/icon-settings.png" alt />
      </div>
      <div class="course-editor__nav-link transform-scale-plus" @click="editor_idx = 1">
        <img src="@/assets/braintutor/icon-students.png" alt />
      </div>
      <div class="course-editor__nav-link transform-scale-plus" @click="editor_idx = 2">
        <img src="@/assets/braintutor/icon-task.png" alt />
      </div>
      <div class="course-editor__nav-link transform-scale-plus" @click="editor_idx = 3">
        <img src="@/assets/avatar/normal.png" alt />
      </div>
    </aside>
    <div class="course-editor__content">
      <div v-show="editor_idx === 0" class="pa-5">
        <h2 class="course-editor__title">Configuración</h2>
        <div class="course-editor__block py-5">
          <span class="course-editor__subtitle mt-1">Nombre:</span>
          <v-text-field
            class="course-editor__input"
            v-model="course.name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
        </div>
        <div class="course-editor__actions">
          <v-btn color="primary" @click="save()">Guardar</v-btn>
        </div>
      </div>
      <StudentsEditor v-show="editor_idx === 1" />
      <TasksEditor v-show="editor_idx === 2" />
      <ChatbotsEditor v-show="editor_idx === 3" />
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";
import StudentsEditor from "@/components/CourseEditor/StudentsEditor";
import TasksEditor from "@/components/CourseEditor/TasksEditor/index";
import ChatbotsEditor from "@/components/CourseEditor/ChatbotsEditor";

import { getParam } from "@/services/router.js";
import { getCourse, updateCourse } from "@/services/courseService.js";

export default {
  data: () => ({
    course: {},
    editor_idx: 0,
    loading: true
  }),
  async mounted() {
    let course_id = getParam("course_id");
    this.course = await getCourse(course_id);
    this.course.id = course_id;
    this.loading = false;
  },
  methods: {
    async save() {
      if (!this.loading) {
        this.loading = true;
        await updateCourse(this.course);
        this.loading = false;
      }
    }
  },
  components: {
    StudentsEditor,
    TasksEditor,
    ChatbotsEditor,
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.course-editor {
  $self: &;
  padding: 0 12px 12px 12px;
  border-radius: 10px;
  display: flex;

  &__nav {
    height: min-content;
    padding: 10px 8px;
    margin-right: 20px;
    border-radius: 10px;
    @include box-shadow;
    display: flex;
    flex-direction: column;

    #{$self}__nav-link {
      padding: 10px 4px;
      img {
        vertical-align: bottom;
        width: 36px;
        height: 36px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }

  &__content {
    height: min-content;
    flex-grow: 1;
    border-radius: 10px;
    @include box-shadow;

    #{$self}__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__title {
    font-size: 1.5rem;
  }
  &__subtitle {
    font-size: 1.1rem;
    font-weight: bold;
    margin-right: 16px;
  }
  &__input {
    font-size: 1.1rem;
  }
  &__actions {
    width: min-content;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .course-editor {
    $self: &;
    flex-direction: column;

    &__nav {
      width: min-content;
      padding: 8px;
      margin: 0 auto 10px auto;
      flex-direction: row;

      #{$self}__nav-link {
        padding: 0 8px;
        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>