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
        <date-input label="Inicio" v-model="start" />
        <date-input label="Fin" v-model="end" />
        <v-tabs v-model="tab" grow>
          <v-tab key="bimester">Bimestral</v-tab>
          <v-tab key="trimester">Trimestral</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="bimester">
            <v-card>
              <v-card-text
                >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure
                maxime, reprehenderit vero voluptate impedit, voluptas aliquam
                quas ad sapiente officia tempore, cupiditate nisi. Eaque vero
                expedita, error sapiente officia quas!</v-card-text
              >
            </v-card>
          </v-tab-item>
          <v-tab-item key="trimester">
            <v-card>
              <v-card-text
                >Trimestre Lorem, ipsum dolor sit amet consectetur adipisicing
                elit. Odio non laboriosam quam consequatur quidem repellendus
                nesciunt placeat error assumenda quia adipisci beatae, similique
                voluptates quos quisquam minima nobis ullam
                officiis!</v-card-text
              >
            </v-card>
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
import DateInput from "./DateInput.vue";

export default {
  components: {
    BrainDialog,
    DateInput,
  },
  data() {
    return {
      isEditDialogVisible: false,
      loading_save: false,

      start: "",
      end: "",
      tab: "",
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