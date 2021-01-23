<template>
  <div class="editor">
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Ciclo académico escolar</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"></strong>
      </div>
      <m-btn color="primary" small @click="isEditDialogVisible = true">
        <v-icon small class="mr-2">mdi-plus</v-icon>Crear
      </m-btn>
    </div>
    <div class="editor__content m-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Marzo 2021</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            Bimestre 2021
          </tr>
        </tbody>
      </table>
    </div>
    <brain-dialog
      v-model="isEditDialogVisible"
      @submit="save"
      :loading="loading_save"
    >
      <template #body>
        <div class="close-modal">
          <h3>Crear</h3>
          <v-btn class="mx-2" icon small @click="isEditDialogVisible = false">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <date-input label="Inicio" v-model="start"/>
        <date-input label="Fin" v-model="end"/>
      </template>
      <template #actions>
        <m-btn color="primary" type="submit" :loading="loading_save" small
          >Guardar</m-btn
        >
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import BrainDialog from "./BrainDialog";
import DateInput from './DateInput.vue';

export default {
  components: {
    BrainDialog,
    DateInput,
  },
  data() {
    return {
      isEditDialogVisible: false,
      loading_save: false,
      
      start: '',
      end: ''
    };
  },
  methods: {
    save() {},
  },
};
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

// TODO: move to brain-dialog
.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>