<template>
  <div v-if="!session_selected" class="m-container">
    <h1 v-if="sessions.length > 0" class="m-title ml-3">Cursos</h1>

    <div
      v-for="(session, idx) in sessions"
      :key="idx"
      @click="session_selected = session"
      class="session m-card levitation mb-5"
    >
      <div class="m-card__body session__body">
        <span class="session__label">Curso:</span>
        <span class="session__value">{{session.course.name}}</span>
        <span class="session__label">Profesor:</span>
        <span
          class="session__value"
        >{{`${session.teacher.last_name}, ${session.teacher.first_name}`}}</span>
      </div>
    </div>
    <p v-if="sessions.length <= 0" class="text-center mt-4">No hay Cursos</p>
  </div>
  <Results v-else v-model="session_selected" :students="students" class="ma-3" />
</template>

<script>
import { getSessionsByClassroom } from "@/services/sessionService";
import { getStudentsByClassroomDirector } from "@/services/studentService";

import Results from "./Results";

import { mapMutations } from "vuex";

export default {
  props: {
    classroom_id: String,
  },
  data: () => ({
    sessions: [],
    students: [],
    session_selected: null,
  }),
  watch: {
    async classroom_id() {
      await this.init();
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async init() {
      this.loading(true);
      this.loading_msg("Cargando Cursos");
      try {
        this.sessions = await getSessionsByClassroom(this.classroom_id);
        this.students = await getStudentsByClassroomDirector(this.classroom_id);
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }
      this.loading(false);
    },
    reset() {
      this.session_selected = null;
    },
  },
  components: {
    Results,
  },
};
</script>

<style lang='scss' scoped>
.m-title {
  font-size: 1.5rem;
}

.session {
  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 10px;
  }
  &__label {
    color: rgb(66, 66, 66);
    // color: var(--color-subtitle);
    font-weight: bold;
  }
  &__value {
    color: rgb(66, 66, 66);
    font-weight: lighter;
  }
}
</style>