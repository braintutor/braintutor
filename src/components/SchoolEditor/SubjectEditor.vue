<template>
  <div class="editor">
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Materias</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"
          >({{ `${subjects.length}` }})</strong
        >
      </div>
      <m-btn
        @click="
          dialog_edit = true;
          add();
        "
        color="primary"
        small
      >
        <v-icon small class="mr-2">mdi-plus</v-icon>Crear
      </m-btn>
    </div>
    <div class="editor__content mt-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Nombre</th>
            <th class="text-left">Color</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, e_idx) in subjects" :key="e_idx">
            <td>{{ e_idx + 1}}</td>
            <td>{{ e.name }}</td>
            <td>
              <div :style="getStyle(e.color)">
              </div>
            </td>
            <td class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" small icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0" dense>
                  <v-list-item
                    @click="
                      dialog_edit = true;
                      edit(e);
                    "
                  >
                    <v-list-item-title>Editar Materia</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="showRemove(e)">
                    <v-list-item-title>Eliminar Materia</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="subjects.length === 0">
        No hay materias.
      </p>
    </div>
    <!-- DIALOG CREATE|EDIT -->
    <brain-dialog v-model="dialog_edit" @submit="save" :loading="loading_save">
      <template #body>
        <div class="close-modal">
          <h3 v-if="action === 'create'">Crear materia</h3>
          <h3 v-else>Editar</h3>
          <v-btn class="mx-2" icon small @click="dialog_edit = false">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <div class="pa-4">
          <v-text-field
            v-model="entity.name"
            label="Nombre"
            required
          ></v-text-field>
          <label>Elija un color:</label>
          <v-color-picker
            v-model="entity.color"
            class="ma-2 color-picker"
            width="400"
            :swatches="swatches"
            show-swatches
            hide-canvas
            hide-sliders
            hide-inputs
            flat
        ></v-color-picker>
        </div>
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
import { index, add, update, remove } from "@/services/subjectService";
import BrainDialog from "./BrainDialog";

export default {
  components: {
    BrainDialog,
  },
  data: () => ({
    subjects: [],
    entity: {},
    action: "",
    dialog_edit: false,
    dialog_remove: false,
    loading_save: false,
    swatches: [
      ["#f00",    "#0f4"   , "#5e00ff"],
      ["#ff4d00", "#00ff91",  "#a0f"  ],
      ["#f90",    "#0fd" ,   "#f600ff"  ],
      ["#ffe500", "#0af",    "#f0b"  ],
      ["#cf0",    "#08f",    "#ff006e"  ],
      ["#80ff00", "#003bff",  "#800000" ],
      ["#08ff00", "#4000ff" , "#000"   ],

    ],
  }),
  async mounted() {
    this.getData();
  },
  methods: {
    async showRemove(e) {
      this.entity = e;
      this.$confirm(
        {
          callback: (confirm) => {
            if (confirm) {
              this.remove();
            }
          },
          message: `
           <p class="mt-4">
            Para eliminar una materia, no deben existir cursos, sessiones que se relacionen a esta.
          </p>
          `,
        },
        "delete"
      );
    },
    async getData() {
      this.showLoading("Cargando materias");
      try {
        this.subjects = await index();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },

    add() {
      this.action = "create";
      this.entity = {};
    },
    edit(entity) {
      this.action = "edit";
      this.entity =Object.assign({} , entity);
      this.entity.id = this.entity.id;
    },
    async save() {
      this.loading_save = true;
      if (this.action === "create") {
        // Create
        try {
          let entity_id = await add({ name: this.entity.name, color: this.entity.color.hsla });
          this.getData();
          this.entity._id = entity_id;
          this.dialog_edit = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      } else if (this.action === "edit") {
        // Update
        try {
          await update(this.entity.id, { name: this.entity.name, color: this.entity.color });
          this.getData(); // updates the array without modifying it
          this.dialog_edit = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      }
      this.loading_save = false;
    },
    async remove() {
      this.showLoading("Eliminando Curso");
      this.dialog_edit = false;
      try {
        await remove(this.entity.id);
        this.getData();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },

    getStyle(c) {
      return {
        "background-color": `hsl(${c.h}deg ${c.s*100}% ${c.l*100}% / ${c.a*100}%)`,
        "height": "20px",
        "width": "20px",
      }
    }
  },
};
</script>

<style lang="scss" scoped>
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

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}

.color-picker ::v-deep .v-color-picker__color {
  height: 36px;
  max-height: 36px;
}

</style>
