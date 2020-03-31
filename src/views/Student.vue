<template>
  <div class="px-2">
    <loading :active="loading" />
    <div class="row no-gutters">
      <div
        class="col-6 col-md-4 col-lg-3 px-2 pb-2"
        v-for="(session, s_idx) in sessions"
        :key="s_idx"
      >
        <div class="classroom m-card transform-scale" @click="select(session)">
          <span class="classroom__item">Curso</span>
          <span class="classroom__value">{{session.course.name}}</span>
          <span class="classroom__item">Profesor</span>
          <span
            class="classroom__value"
          >{{`${session.teacher.first_name} ${session.teacher.last_name}`}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSessionsByStudent } from "@/services/sessionService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
    loading: true
  }),
  async mounted() {
    this.sessions = await getSessionsByStudent();
    this.loading = false;
  },
  methods: {
    select(session) {
      redirect("session", { session_id: session._id.$oid });
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
</style>