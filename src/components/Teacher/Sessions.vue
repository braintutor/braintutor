<template>
  <div>
    <loading :active="loading" />
    <p class="message" v-if="sessions.length <= 0">No tiene cursos asignados.</p>
    <div class="row no-gutters">
      <div
        class="col-6 col-md-4 col-lg-3 px-2 pb-4"
        v-for="(session, s_idx) in sessions"
        :key="s_idx"
      >
        <div class="classroom m-card transform-scale" @click="edit(session)">
          <span class="classroom__item">Curso</span>
          <span class="classroom__value">{{session.course.name}}</span>
          <span class="classroom__item">Aula</span>
          <span class="classroom__value">{{session.classroom.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSessionsByTeacher } from "@/services/sessionService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
    loading: true
  }),
  async mounted() {
    this.sessions = await getSessionsByTeacher();
    this.loading = false;
  },
  methods: {
    edit(session) {
      redirect("session-editor", { session_id: session._id.$oid });
    }
  },
  components: {
    loading
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