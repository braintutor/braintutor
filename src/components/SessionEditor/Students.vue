<template>
  <div class="students m-card">
    <loading :active="loading" />
    <h1 class="students__title">Alumnos</h1>
    <div class="students__content">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entity, e_idx) in students" :key="e_idx">
            <td>{{ entity.first_name }}</td>
            <td>{{ entity.last_name }}</td>
            <td>{{ entity.user }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import { getStudentsBySession } from "@/services/studentService";

export default {
  data: () => ({
    session_id: "",
    students: [],
    //
    loading: true
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.students = await getStudentsBySession(this.session_id);
    this.loading = false;
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.students {
  padding: 14px 20px;
  &__title {
    margin-bottom: 6px;
    font-size: 1.4rem;
  }
  &__content {
    overflow-x: auto;
  }
}
</style>