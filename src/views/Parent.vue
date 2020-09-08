<template>
  <div class="students m-container">
    <h1 class="students__title pl-4 my-2">Mis Alumnos</h1>

    <div class="row no-gutters">
      <div v-for="(student, idx) in students" :key="idx" class="col-12 col-md-6 pa-2">
        <div class="student m-card">
          <!-- {{student}} -->
          <div class="student__body m-card__body">
            <span class="student__label">Nombre:</span>
            <span class="student__value">{{`${student.last_name}, ${student.first_name}`}}</span>
            <span class="student__label">Usuario:</span>
            <span class="student__value">{{student.username}}</span>
            <span class="student__label">Correo:</span>
            <span class="student__value">{{student.email}}</span>
            <!-- <p>{{student.time}}</p> -->
          </div>
          <div class="m-card__actions">
            <m-btn color="primary" small>Ver Más</m-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudentsByParent } from "@/services/studentService";

export default {
  data: () => ({
    students: [],
  }),
  async created() {
    this.showLoading("Cargando");
    try {
      this.students = await getStudentsByParent();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
};
</script>

<style lang='scss' scoped>
.students {
  &__title {
    margin: 0;
    color: rgb(87, 87, 87);
    font-size: 1.8rem;
  }
}

.student {
  height: 100%;

  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 16px;
    row-gap: 8px;
  }
  &__label {
    font-weight: bold;
  }
  &__value {
    color: rgb(87, 87, 87);
    font-size: 0.95rem;
  }
}
</style>