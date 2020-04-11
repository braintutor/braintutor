<template>
  <div class="px-2">
    <loading :active="loading" :message="loading_message" />
    <div class="student__title">
      <span :class="{'disable': !show_courses}" @click="show_courses = true">Mis Cursos</span>
      <span class="mx-2"></span>
      <span :class="{'disable': show_courses}" @click="show_courses =  false">Mis Tareas</span>
    </div>
    <div v-if="show_courses">
      <div class="row no-gutters">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 px-3 pb-5"
          v-for="(session, s_idx) in sessions"
          :key="s_idx"
        >
          <div class="classroom m-card transform-scale" @click="select(session)">
            <p class="classroom__item">Curso</p>
            <p class="classroom__value">{{session.course.name}}</p>
            <p class="classroom__item">Profesor</p>
            <p
              class="classroom__value"
            >{{`${session.teacher.first_name} ${session.teacher.last_name}`}}</p>
          </div>
        </div>
      </div>
    </div>
    <Tasks v-else />
  </div>
</template>

<script>
import loading from "@/components/loading";
import Tasks from "@/components/Student/Tasks";

import { getSessionsByStudent } from "@/services/sessionService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
    show_courses: true,
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    this.loading_message = "Cargando Cursos";
    this.sessions = await getSessionsByStudent();
    this.loading = false;
  },
  methods: {
    select(session) {
      redirect("session", { session_id: session._id.$oid });
    }
  },
  components: {
    loading,
    Tasks
  }
};
</script>

<style lang='scss' scoped>
.student__title {
  margin: 10px 0 16px 0;
  color: #000;
  text-align: center;
  font-size: 2.5rem;
  font-weight: lighter;
  .disable {
    cursor: pointer;
    color: #dadada;
    font-size: 1.5rem;
    transition: all 0.3s;
    &:hover {
      color: #b4b4b4;
    }
  }
}
.classroom {
  // height: 100%;
  padding: 6%;
  padding-bottom: 2%;
  border-top: 6px solid #98a3ff;
  &:hover {
    cursor: pointer;
  }
  &__item {
    padding: 0 4px;
    margin-bottom: 2%;
    font-size: 1.2rem;
    font-weight: bold;
  }
  &__value {
    padding: 6px 12px;
    margin-bottom: 7%;
    background: #f1f1f1;
    font-size: 1rem;
    font-weight: lighter;
    border-radius: 10px;
  }
}
</style>