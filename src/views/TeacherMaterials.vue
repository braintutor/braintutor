<template>
  <div class="m-container">
    <div class="materials">
      <div class="materials__menu">
        <v-select
          v-model="subject_id"
          :items="subjects"
          item-text="name"
          item-value="id"
          label="Materia"
          class="mt-4"
          dense
          hide-details
        ></v-select>
        <m-btn
          @click="dlg_new_material = true"
          color="primary"
          :rounded="false"
          class="ml-2"
          >Crear Material</m-btn
        >
      </div>
      <div class="py-3">
        <div
          v-for="(material, idx) in materials"
          :key="idx"
          class="material mt-3"
          :class="{ 'material--private': material.is_private }"
        >
          <div class="material__info">
            <v-icon style="font-size: 1.2rem" class="mb-1 mr-3">
              <template v-if="material.type === 'adaptative'"
                >mdi-robot</template
              >
              <template v-else-if="material.type === 'file'"
                >mdi-paperclip</template
              >
            </v-icon>
            <span class="material__name">{{ material.title }}</span>
          </div>
          <div class="material__options">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="showEditor(material)"
                  v-on="on"
                  icon
                  small
                  class="ml-2"
                >
                  <v-icon v-on="on" style="font-size: 1.3rem"
                    >mdi-arrow-right</v-icon
                  >
                </v-btn>
              </template>
              <span style="font-size: 0.75rem">Ver</span>
            </v-tooltip>
          </div>
        </div>
        <p v-if="materials.length === 0" class="text-center">
          No hay materiales
        </p>
      </div>
    </div>

    <!-- DIALOG NEW MATERIAL -->
    <v-dialog v-model="dlg_new_material" width="400" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <div class="d-flex justify-space-between">
            <h3>Crear Material</h3>
            <v-btn icon small @click="dlg_new_material = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <div class="new-items">
            <!-- CONTENIDO -->
            <div @click="showCreator('adaptative')" class="new-item">
              <div class="new-item__img">
                <img
                  src="https://cdn2.iconfinder.com/data/icons/machine-learning-filled-color/300/134026380Untitled-3-512.png"
                  alt=""
                />
              </div>
              <p class="new-item__name ma-0">Adaptativo</p>
            </div>
            <div @click="showCreator('file')" class="new-item">
              <div class="new-item__img">
                <img
                  src="https://icon-library.com/images/png-file-icon/png-file-icon-6.jpg"
                  alt=""
                />
              </div>
              <p class="new-item__name ma-0">Archivos</p>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    subjects: [],
    subject_id: null,
    materials: [],
    //
    dlg_new_material: false,
  }),
  watch: {
    async subject_id() {
      await this.getMaterials(this.subject_id);
    },
  },
  async created() {
    this.showLoading("Cargando");
    try {
      this.subjects = await this.$api.subject.getAll();
      if (this.subjects[0]) this.subject_id = this.subjects[0].id;
    } catch (error) {
      this.showMessage("", "Ha ocurrido un error");
    }
    this.hideLoading();
  },
  methods: {
    async getMaterials(subject_id) {
      this.materials = [];
      this.showLoading("Cargando");
      try {
        this.materials = await this.$api.material.index(subject_id);
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
      this.hideLoading();
    },
    showEditor(material) {
      if (material.type === "adaptative")
        this.$router.push({
          name: "material-adaptative-editor",
          params: { material_id: material.id },
        });
      else if (material.type === "file") {
        this.$router.push({
          name: "material-file-editor",
          params: { material_id: material.id },
        });
      }
    },
    async showCreator(type) {
      this.dlg_new_material = false;
      let new_material = {
        type,
        subject_id: this.subject_id,
        title: "Nuevo Material",
        description: "",
        is_private: true,
      };

      if (type === "file") new_material["files"] = [];
      else if (type === "adaptative")
        new_material["data_fs"] = {
          overview: JSON.stringify({
            blocks: [{ type: "header", data: { text: "Resumen", level: 2 } }],
          }),
          explanation: JSON.stringify({
            blocks: [{ type: "header", data: { text: "Título", level: 2 } }],
          }),
          movies: JSON.stringify({
            blocks: [{ type: "header", data: { text: "Videos", level: 2 } }],
          }),
          images: JSON.stringify({
            blocks: [{ type: "header", data: { text: "Imágenes", level: 2 } }],
          }),
          hyperlinks: JSON.stringify({
            blocks: [{ type: "header", data: { text: "Enlaces", level: 2 } }],
          }),
          examples: JSON.stringify({
            blocks: [
              { type: "header", data: { text: "Ejemplos", level: 2 } },
              {
                type: "list",
                data: {
                  style: "unordered",
                  items: ["Ejemplo 1", "Ejemplo 2"],
                },
              },
            ],
          }),
          exercises: [
            {
              question: "Pregunta",
              alternatives: ["Alternativa", "Alternativa"],
              correct: 0,
            },
          ],
          faq: [{ question: "Pregunta", answer: "Respuesta" }],
        };

      this.showLoading("Cargando");
      try {
        let { $oid } = await this.$api.material.create(new_material);
        new_material["id"] = $oid;
        this.showEditor(new_material);
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.materials {
  &__menu {
    display: flex;
    align-items: center;
  }
}

.material {
  padding: 12px 18px;
  background: #d8d8d8;
  border-radius: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &--private {
    background: #eeeeee;

    .material__name {
      color: #8d8d8d;
    }
  }

  &__name {
    font-weight: bold;
    color: #494949;
  }
}

// New Material
.new-items {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.new-item {
  padding: 10px;
  max-width: 40%;
  transition: 0.3s;
  cursor: pointer;

  &__img {
    img {
      display: block;
      margin: 0 auto;
      max-width: 50%;
    }
  }
  &__name {
    padding-top: 10px;
    text-align: center;
  }
  &:hover {
    background: #e7e7e7;
    border-radius: 12px;
  }
}
</style>