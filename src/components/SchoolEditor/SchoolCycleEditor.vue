<template>
  <div class="editor">
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Ciclo académico escolar</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"></strong>
      </div>
      <m-btn color="primary" small>
        <v-icon small class="mr-2">mdi-plus</v-icon>Crear
      </m-btn>
    </div>
    <div class="editor__content m-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Ciclo escolar</th>
            <th class="text-left">Fecha de inicio</th>
            <th class="text-left">Fecha de Fin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bimestre 2021</td>
            <td></td>
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