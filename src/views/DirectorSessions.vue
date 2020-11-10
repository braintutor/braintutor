<template>
  <div class="m-container pb-3 px-1">
    <div>
      <v-select
        v-model="classroom_id"
        :items="classrooms"
        item-value="_id"
        item-text="name"
        label="Aula"
        class="px-2 mb-3"
      ></v-select>
      <div v-show="!classroom_id" class="text-center">Seleccione un Aula</div>

      <!-- Sessions -->
      <div v-show="classroom_id">
        <SessionCard
          v-for="session in sessions"
          :key="session._id"
          class="session mb-3"
          :name="session.course.name"
          :user="`${session.teacher.last_name}, ${session.teacher.first_name}`"
          :buttons="[
            {
              text: 'Eventos',
              icon: 'mdi-calendar',
              color: 'primary',
              action: () => selectSession(session, 'events'),
            },
            {
              text: 'Tareas',
              icon: 'mdi-format-list-checks',
              color: 'success',
              action: () => selectSession(session, 'tasks'),
            },
            {
              text: 'Evaluaciones',
              icon: 'mdi-list-status',
              color: 'warning',
              action: () => selectSession(session, 'evaluations'),
            },
          ]"
        />
        <div v-show="sessions.length <= 0" class="text-center mt-3">
          No hay Sesiones
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SessionCard from "@/components/globals/Session/SessionCard";

export default {
  data: () => ({
    classrooms: [],
    sessions: [],
    classroom_id: null,
  }),
  watch: {
    async classroom_id() {
      this.$router
        .push({
          query: { classroom_id: this.classroom_id },
        })
        .catch(() => {});
      await this.getSessions(this.classroom_id);
    },
  },
  async created() {
    this.showLoading("Cargando Aulas");
    let classroom_id = this.$route.query.classroom_id;
    try {
      this.classrooms = this.mongoArr(await this.$api.classroom.getAll());
      if (this.classrooms.map((c) => c._id).includes(classroom_id))
        this.classroom_id = classroom_id;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async getSessions(classroom_id) {
      if (!classroom_id) return;

      this.showLoading("Cargando Sesiones");
      try {
        this.sessions = this.mongoArr(
          await this.$api.session.getAll({ classroom_id })
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    selectSession(session, category) {
      this.$router.push({
        name: `director-session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: {
    SessionCard,
  },
};
</script>

<style lang='scss' scoped>
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
}
</style>