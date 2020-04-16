<template>
  <div>
    <loading :active="loading" :message='loading_message' />
    <p class="message" v-if="sessions.length <= 0">No tiene cursos asignados.</p>
    <div class="row no-gutters">
      <div
        class="col-6 col-md-4 col-lg-3 px-2 pb-4"
        v-for="(session, s_idx) in sessions"
        :key="s_idx"
      >
        <Card :callback="() => edit(session)" color="#8492ec">
          <p class="card-item">Curso</p>
          <p class="card-value">{{session.course.name}}</p>
          <div class="card-divider"></div>
          <p class="card-item">Aula</p>
          <p class="card-value">{{session.classroom.name}}</p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";
import Card from "@/components/Card";

import { getSessionsByTeacher } from "@/services/sessionService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
    loading: true,
    loading_message: ''
  }),
  async mounted() {
    this.loading_message = "Cargando Cursos";
    this.sessions = await getSessionsByTeacher();
    this.loading = false;
  },
  methods: {
    edit(session) {
      redirect("session-editor", { session_id: session._id.$oid });
    }
  },
  components: {
    loading,
    Card
  }
};
</script>

<style lang='scss' scoped>
.classroom {
  // height: 100%;
  padding: 20px;
  padding-bottom: 10px;
  border-top: 6px solid rgb(121, 134, 255);
  &:hover {
    cursor: pointer;
  }
  &__item {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
  }
  &__value {
    display: block;
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: lighter;
  }
}
.message {
  margin: 10px;
  color: #797979;
  font-size: 1.1rem;
  font-weight: lighter;
  text-align: center;
}
</style>