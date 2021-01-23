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
        <v-tabs v-model="tab" grow @change="changeSegments">
          <v-tab key="bimester">Bimestral</v-tab>
          <v-tab key="trimester">Trimestral</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="bimester">
            <school-cycle-segments v-model="segments" text="Bimestre" />
          </v-tab-item>
          <v-tab-item key="trimester">
            <school-cycle-segments v-model="segments" text="Trimestre" />
          </v-tab-item>
        </v-tabs-items>
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
import SchoolCycleSegments from './SchoolCycleSegments.vue';

export default {
  components: {
    BrainDialog,
    SchoolCycleSegments,
  },
  data() {
    return {
      isEditDialogVisible: false,
      loading_save: false,

      start: "",
      end: "",
      tab: 0, // 0 == bimester, 1 == trimester
      segments: this.getSegments(0)
    };
  },
  methods: {
    save() {
      console.log(this.segments)
    },   
    changeSegments(tab) {
      this.segments = this.getSegments(tab)
    },
    getSegments(tab) {
      const numbers = tab == 0? ["I", "II", "III", "IV"]: ["I", "II", "III"]
      return numbers.map(x => ({ number: x, start: null, end: null }))
    }
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