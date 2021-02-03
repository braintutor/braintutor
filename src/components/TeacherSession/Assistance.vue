<template>
  <div class="editor">
    <div class="editor__menu">
      <div class="editor__title">
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
          <tr>
            <td>Luis</td>
            <td>asistió</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.editor {
  padding: 10px 16px;
  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    display: flex;
    align-items: center;
  }
  &__content {
    overflow-x: auto;
  }
}
</style>