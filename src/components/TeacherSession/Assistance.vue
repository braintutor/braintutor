<template>
  <div class="editor">
    <div class="editor__menu d-flex justify-space-between align-center">
      <div class="editor__title d-flex align-center">
        <h2>Asistencia</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"></strong>
      </div>
    </div>
    <div class="editor__content mt-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Alumnos</th>
            <th class="text-left">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student of students" :key="student.id">
            <td>Luis</td>
            <td>asistió</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.editor {
  padding: 10px 16px;

  &__content {
    overflow-x: auto;
  }
}
</style>