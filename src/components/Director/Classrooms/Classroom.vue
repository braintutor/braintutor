<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselect(); getClassrooms()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <p class="menu-title">{{classroom.name}}</p>
      </div>
    </div>
    <div class="session m-card" v-for="(session, s_idx) in sessions" :key="s_idx">{{session}}</div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSessionsByClassroom } from "@/services/sessionService";

export default {
  props: ["classroom", "getClassrooms", "unselect"],
  data: () => ({
    sessions: [],
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    this.loading_message = "Cargando Cursos";
    this.sessions = await getSessionsByClassroom(this.classroom._id.$oid);
    this.loading = false;
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.session {
  padding: 2%;
  margin: 0 10px 14px;
}
</style>