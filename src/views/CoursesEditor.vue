<template>
  <div class="mcontainer">
    <h1 class="mtitle mb-4">
      <v-icon class="mr-4" style="font-size: 2.4rem">mdi-monitor-edit</v-icon
      >Editar Cursos
    </h1>
    <div v-for="(course, idx) in courses" :key="idx" class="session mb-3">
      <section @click="selectCourse(course)" class="course m-card">
        <section class="m-card__body">
          <p class="course__course">{{ course.name }}</p>
          <div class="course__classroom">
            <v-icon class="course__avatar">mdi-account</v-icon>
            <span>{{ user.name }}</span>
          </div>
        </section>
        <div class="m-card__actions">
          <button class="button">
            Editar
            <v-icon
              class="ml-1"
              style="color: var(--color-active); font-size: 1.4rem"
              >mdi-arrow-right</v-icon
            >
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getCoursesByTeacher } from "@/services/courseService";
import { redirect } from "@/services/router.js";

import { mapState } from "vuex";

export default {
  data: () => ({
    courses: [],
  }),
  computed: {
    ...mapState(["user"]),
  },
  async created() {
    this.showLoading("Cargando Cursos");
    try {
      this.courses = await getCoursesByTeacher();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    selectCourse(course) {
      redirect("course-editor", { course_id: course._id.$oid });
    },
  },
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 950px;
  margin: 0 auto;
}

.mtitle {
  margin: 10px;
  color: #5b5b6a;
}

.course {
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: 0.4s;
  cursor: pointer;

  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  &--disable {
    -webkit-filter: grayscale(1);
    opacity: 0.75;
  }
  &__classroom {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }

  &__avatar {
    flex-shrink: 0;
    height: 28px;
    width: 28px;
    margin-right: 10px;
    background: var(--color-active);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  &__course {
    display: block;
    font-weight: bold;
    font-size: 1.5rem;
    letter-spacing: 0.25px;
  }
}

.button {
  padding: 10px 12px;
  font-weight: bold;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: 0.4s;

  &:hover {
    background: #e4e4e4;
  }
  &:focus {
    outline: none;
  }
}
</style>