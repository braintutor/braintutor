<template>
  <div class="mcontainer">
    <h1 class="mtitle">
      <v-icon class="mr-3" style="font-size: 2.4rem">mdi-bookshelf</v-icon>Mis
      Cursos
    </h1>

    <!-- Sessions -->
    <div
      v-for="session in sessions"
      :key="session._id"
      class="session m-card mt-3"
    >
      <div class="m-card__body">
        <p class="session__course">{{ session.course.name }}</p>
        <div class="session__teacher">
          <v-icon class="session__avatar">mdi-account</v-icon>
          <span class="mt-1">
            {{ `${session.teacher.last_name}, ${session.teacher.first_name}` }}
          </span>
        </div>
      </div>
      <div class="session__actions m-card__actions">
        <m-btn
          @click="selectSession(session, 'learn')"
          color="success"
          text
          small
          class="mr-2"
        >
          <span class="session__btn-text">Aprender</span>
          <v-icon class="session__icon" style="font-size: 1.5rem"
            >mdi-book</v-icon
          >
        </m-btn>
        <m-btn
          @click="selectSession(session, 'tasks')"
          color="primary"
          text
          small
          class="mr-2"
        >
          <span class="session__btn-text">Tareas</span>
          <v-icon class="session__icon" style="font-size: 1.5rem"
            >mdi-format-list-checks</v-icon
          >
        </m-btn>
        <m-btn
          @click="selectSession(session, 'events')"
          color="error"
          text
          small
          class="mr-2"
        >
          <span class="session__btn-text">Eventos</span>
          <v-icon class="session__icon" style="font-size: 1.5rem"
            >mdi-calendar</v-icon
          >
        </m-btn>
        <m-btn
          @click="selectSession(session, 'evaluations')"
          color="warning"
          text
          small
        >
          <span class="session__btn-text">Evaluaciones</span>
          <v-icon class="session__icon" style="font-size: 1.5rem"
            >mdi-list-status</v-icon
          >
        </m-btn>
      </div>
    </div>

    <div v-show="sessions.length <= 0" class="text-center mt-3">
      No hay Sesiones
    </div>

    <!-- <div class="row no-gutters">
      <div v-for="(session, idx) in sessions" :key="idx" class="col-12 col-sm-6 col-md-4 pa-3">
        <section @click="selectSession(session)" class="session">
          <div
            class="session__image"
            :style="{ backgroundImage: `url('${require('@/assets/backgrounds/banner2.jpg')}')`}"
          />
          <section class="session__body">
            <div class="session__classroom">
              <v-icon class="session__avatar">mdi-account</v-icon>
              <span>{{`${session.teacher.last_name}, ${session.teacher.first_name}`}}</span>
            </div>
            <span class="session__course mb-7">{{session.course.name}}</span>
            <div class="session__actions">
              <button class="button">
                Ingresar
                <v-icon
                  class="ml-1"
                  style="color: var(--color-active); font-size: 1.4rem"
                >mdi-arrow-right</v-icon>
              </button>
            </div>
          </section>
        </section>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getSessionsByStudent } from "@/services/sessionService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
  }),
  async mounted() {
    // GOOGLE
    let fragmentString = location.hash.substring(1);
    let params = {};
    var regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(fragmentString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (params.access_token)
      localStorage.setItem("access_token", params.access_token);

    let state = params["state"] || params["/state"];
    if (state) redirect("task", { task_id: state });

    //
    this.showLoading("Cargando Cursos");
    try {
      this.sessions = this.mongoArr(await getSessionsByStudent());
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading(false);
  },
  methods: {
    selectSession(session, category) {
      this.$router.push({
        name: `session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: {},
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

.session {
  &__course {
    margin-bottom: 12px;
    color: #2b2e4a;
    font-size: 1.5rem;
    font-weight: bold;
  }
  &__teacher {
    color: #3f4158;
    display: flex;
    align-items: center;
  }
  &__avatar {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: 16px;
    background: var(--color-active);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }
  &__actions {
    flex-wrap: wrap;
  }
  &__icon {
    display: none;
  }
}

@import "@/mvuecss/styles/_breakpoints.scss";

@include media-breakpoint(sm) {
  .session {
    &__btn-text {
      display: none;
    }
    &__icon {
      display: initial;
    }
  }
}
</style>