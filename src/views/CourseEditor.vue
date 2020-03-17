<template>
  <div class="course-editor container">
    <loading :active="loading" />
    <aside class="course-editor__nav">
      <div class="course-editor__nav-link transform-scale-plus" @click="editor_idx = 0">
        <img
          src="https://icons.iconarchive.com/icons/grafikartes/flat-retro-modern/512/settings-icon.png"
          alt
        />
      </div>
      <div class="course-editor__nav-link transform-scale-plus" @click="editor_idx = 1">
        <img src="https://cdn0.iconfinder.com/data/icons/user-collection-4/512/users-512.png" alt />
      </div>
    </aside>
    <div class="course-editor__content">
      <div v-show="editor_idx === 0">
        <h2 class="course-editor__title">Configuración</h2>
        <div class="course-editor__block py-5">
          <span class="course-editor__subtitle">Nombre:</span>
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
      <CourseStudentsEditor v-show="editor_idx === 1" />
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";
import CourseStudentsEditor from "@/components/CourseEditor/CourseStudentsEditor";

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
    CourseStudentsEditor,
    loading
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.course-editor {
  $self: &;
  padding: 0 12px;
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
    flex-grow: 1;
    padding: 20px 30px;
    border-radius: 10px;
    @include box-shadow;

    #{$self}__block {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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