<template>
  <div class="m-container">
    <SessionCard
      v-for="session in sessions"
      :key="session._id"
      class="mb-3"
      :session="session"
      :buttons="[
        {
          text: 'Material de clase',
          icon: 'mdi-book',
          color: 'primary',
          action: () => selectSession(session, 'learn'),
        },
        {
          text: 'Eventos',
          icon: 'mdi-calendar',
          color: 'error',
          action: () => selectSession(session, 'events'),
        },
        {
          text: 'Tareas',
          icon: 'mdi-format-list-checks',
          color: 'success',
          action: () => selectSession(session, 'tasks'),
        },
        {
          text: 'Notas',
          icon: 'mdi-list-status',
          color: 'warning',
          action: () => selectSession(session, 'evaluations'),
        },
      ]"
    />
  </div>
</template>

<script>
import SessionCard from "@/components/globals/Session/SessionCard";

export default {
  data: () => ({
    sessions: [],
  }),

  props: ["child"],
  watch: {
    child: {
      immediate: true,
      handler: async function(val) {
        this.getSessions(val);
      },
    },
  },
  mounted() {},

  methods: {
    async getSessions({ grade_id, section_id }) {
      this.showLoading("Cargando Sesiones");
      try {
        this.sessions = this.mongoArr(
          await this.$api.session.getAll({ grade_id, section_id })
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    selectSession(session, category) {
      this.$router.push({
        name: `parent-session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: { SessionCard },
};
</script>
