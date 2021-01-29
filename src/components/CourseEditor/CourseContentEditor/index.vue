<template>
  <div class="m-container">
    <div v-show="!show_course_material_editor">
      <div style="display: flex; justify-content: flex-end" class="mb-2">
        <m-btn
          @click="
            new_unit_name = '';
            dlg_new_unit = true;
          "
          class="ml-2"
          color="primary"
          small
          ><v-icon class="mr-2" small>mdi-plus</v-icon>Crear Unidad</m-btn
        >
      </div>
      <!-- Unit -->
      <div v-for="(unit, idx) in units" :key="idx" class="unit">
        <div class="unit__menu">
          <p class="unit__name">{{ unit.name }}</p>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="ml-2" icon small v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-0" dense>
              <v-list-item
                @click="
                  unit_selected = unit;
                  dlg_new_item = true;
                "
              >
                <v-list-item-title>Crear Material</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  unit_selected = Object.assign({}, unit);
                  dlg_edit_unit = true;
                "
              >
                <v-list-item-title>Editar Nombre</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  unit_selected = unit;
                  dlg_remove_unit = true;
                "
              >
                <v-list-item-title>Eliminar Unidad</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="unit__content">
          <!-- Item -->
          <div
            v-for="(item, idx) in unit.content"
            :key="idx"
            class="item"
            :class="{ 'item--disabled': item.is_private }"
          >
            <p class="item__name">
              <template v-if="item.type === 'adaptive'">
                <v-icon style="font-size: 1.2rem" class="mb-1 mr-2"
                  >mdi-robot</v-icon
                >
                {{ item.name }}
              </template>
              <template v-else-if="item.type === 'material'">
                <v-icon style="font-size: 1.2rem" class="mb-1 mr-2"
                  >mdi-paperclip</v-icon
                >
                {{ item.title }}
              </template>
            </p>
            <div class="item__actions">
              <v-tooltip bottom v-if="item.is_private">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    icon
                    small
                    class="mr-4"
                    style="font-size: 1.3rem"
                  >
                    mdi-eye-off-outline
                  </v-icon>
                </template>
                <span>Privado</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="showItemEdit(item)"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    small
                    class="mr-2"
                  >
                    <v-icon style="font-size: 1.3rem">mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0" dense>
                  <v-list-item @click="moveItemUp(unit, idx)">
                    <v-list-item-title>Mover Arriba</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="moveItemDown(unit, idx)">
                    <v-list-item-title>Mover Abajo</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      unit_selected = unit;
                      item_selected = Object.assign({}, item);
                      dlg_edit_item_name = true;
                    "
                  >
                    <v-list-item-title>Editar Nombre</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      unit_selected = unit;
                      item_selected = Object.assign({}, item);
                      dlg_edit_item = true;
                    "
                  >
                    <v-list-item-title>Cambiar Unidad</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      unit_selected = unit;
                      item_selected = Object.assign({}, item);
                      dlg_remove_item = true;
                    "
                  >
                    <v-list-item-title>Eliminar Material</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </div>

    <course-material-editor
      v-if="show_course_material_editor"
      @exit="
        show_course_material_editor = false;
        init();
      "
      :material="course_material"
    />

    <!-- DIALOG NEW UNIT -->
    <v-dialog v-model="dlg_new_unit" width="400" persistent>
      <form @submit.prevent="addUnit()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Crear Unidad</h3>
            <v-btn class="mx-2" icon small @click="dlg_new_unit = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-text-field
            v-model="new_unit_name"
            label="Nombre"
            required
            class="mt-4"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_new_unit = false"
            type="button"
            text
            small
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <!-- DIALOG EDIT UNIT -->
    <v-dialog v-model="dlg_edit_unit" width="400" persistent>
      <form @submit.prevent="updateUnit()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Editar Unidad</h3>
            <v-btn class="mx-2" icon small @click="dlg_edit_unit = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-text-field
            v-model="unit_selected.name"
            label="Nombre"
            required
            class="mt-4"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_edit_unit = false"
            type="button"
            text
            small
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <!-- DIALOG REMOVE UNIT -->
    <v-dialog v-model="dlg_remove_unit" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Confirmar eliminación</h3>
            <v-btn class="mx-2" icon small @click="dlg_remove_unit = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove_unit = false" small class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove_unit = false;
              removeUnit();
            "
            color="error"
            small
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <!-- DIALOG NEW ITEM -->
    <v-dialog v-model="dlg_new_item" width="400" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Crear Material</h3>
            <v-btn class="mx-2" icon small @click="dlg_new_item = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <div class="new-items">
            <!-- CONTENIDO -->
            <div @click="showItemCreate('adaptive')" class="new-item">
              <div class="new-item__img">
                <img
                  src="https://cdn2.iconfinder.com/data/icons/machine-learning-filled-color/300/134026380Untitled-3-512.png"
                  alt=""
                />
              </div>
              <p class="new-item__name ma-0">Adaptativo</p>
            </div>
            <div @click="showItemCreate('material')" class="new-item">
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

    <!-- DIALOG EDIT ITEM -->
    <v-dialog v-model="dlg_edit_item" width="400" persistent>
      <form @submit.prevent="updateItemUnit()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Cambiar Unidad</h3>
            <v-btn class="mx-2" icon small @click="dlg_edit_item = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-select
            v-model="item_selected.unit_id"
            :items="units"
            item-text="name"
            item-value="_id"
            label="Unidad"
            class="mt-4"
          ></v-select>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_edit_item = false"
            type="button"
            text
            small
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <!-- DIALOG EDIT ITEM NAME -->
    <v-dialog v-model="dlg_edit_item_name" width="400" persistent>
      <form @submit.prevent="updateItemName()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Crear Unidad</h3>
            <v-btn class="mx-2" icon small @click="dlg_edit_item_name = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-text-field
            v-if="item_selected.type === 'adaptive'"
            v-model="item_selected.name"
            label="Nombre"
            required
            class="mt-4"
          ></v-text-field>
          <v-text-field
            v-else-if="item_selected.type === 'material'"
            v-model="item_selected.title"
            label="Nombre"
            required
            class="mt-4"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_edit_item_name = false"
            type="button"
            text
            small
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <!-- DAILOG REMOVE ITEM -->
    <v-dialog v-model="dlg_remove_item" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Confirmar eliminación</h3>
            <v-btn class="mx-2" icon small @click="dlg_remove_item = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove_item = false" small class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove_item = false;
              removeItem();
            "
            color="error"
            small
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <!-- DIALOG NEW COURSE ADAPTIVE -->
    <v-dialog v-model="dlg_new_course_adaptive" width="400" persistent>
      <form @submit.prevent="addCourseAdaptive()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Crear Material</h3>
            <v-btn
              class="mx-2"
              icon
              small
              @click="dlg_new_course_adaptive = false"
            >
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-text-field
            v-model="new_course_adaptive_name"
            label="Nombre"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_new_course_adaptive = false"
            type="button"
            text
            small
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>
  </div>
</template>

<script>
import CourseMaterialEditor from "./CourseMaterialEditor.vue";

import {
  addUnit,
  updateUnitOrder,
  updateUnit,
  removeUnit,
} from "@/services/unitService.js";
import {
  updateMaterial,
  updateMaterialUnit,
  removeMaterial,
} from "@/services/materialService.js";
import { scrollDown } from "@/services/scroll";

export default {
  data: () => ({
    units: [],
    unit_selected: {},
    new_unit_name: "",
    dlg_new_unit: false,
    dlg_edit_unit: false,
    dlg_remove_unit: false,
    // Item
    item_selected: {},
    dlg_edit_item: false,
    dlg_edit_item_name: false,
    dlg_new_item: false,
    dlg_remove_item: false,
    // Course Adaptive
    new_course_adaptive_name: "",
    dlg_new_course_adaptive: false,
    // Course Material
    course_material: {},
    show_course_material_editor: false,
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.units = [];
      let course_id = this.$route.params["course_id"];

      this.showLoading("Cargando contenido");
      try {
        // Get Course Content
        let [
          units,
          course_adaptive_arr,
          course_material_arr,
        ] = await Promise.all([
          this.$api.unit.getAll(course_id),
          this.$api.material.getAll(course_id),
          this.$api.courseMaterial.getAll(course_id),
        ]);

        // Set Item Type
        units = this.mongoArr(units);
        course_adaptive_arr = this.mongoArr(course_adaptive_arr).map((i) => ({
          ...i,
          type: "adaptive",
        }));
        course_material_arr = this.mongoArr(course_material_arr).map((i) => ({
          ...i,
          type: "material",
        }));

        // Set Unit Items
        let items = course_adaptive_arr.concat(course_material_arr);
        for (let unit of units) {
          unit.content = items.filter((i) => i.unit_id === unit._id);

          let order = (unit.order || []).reverse();
          unit.content.sort((a, b) => {
            let a_order = order.indexOf(a._id);
            let b_order = order.indexOf(b._id);
            return b_order - a_order;
          });
        }

        this.units = units;
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
      this.hideLoading("");
    },
    // Unit
    async addUnit() {
      this.dlg_new_unit = false;

      if (!this.new_unit_name) return;
      let new_unit = {
        name: this.new_unit_name,
      };
      let course_id = this.$route.params["course_id"];

      this.showLoading("Guardando");
      try {
        let res = await addUnit(course_id, new_unit);
        new_unit._id = res.$oid;
        this.units.push(new_unit);
        setTimeout(() => scrollDown("app__body"), 100);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async updateUnit() {
      this.dlg_edit_unit = false;

      this.showLoading("Guardando");
      let unit = {
        id: this.unit_selected._id,
        name: this.unit_selected.name,
      };
      try {
        await updateUnit(unit);
        let idx = this.units.findIndex(
          (unit) => unit._id === this.unit_selected._id
        );
        this.units[idx] = this.unit_selected;
        this.$forceUpdate();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async removeUnit() {
      this.showLoading("Eliminando Unidad");
      try {
        await removeUnit(this.unit_selected._id);
        this.units = this.units.filter(
          (unit) => unit._id !== this.unit_selected._id
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // Course Adaptive
    async addCourseAdaptive() {
      this.dlg_new_course_adaptive = false;
      if (!this.new_course_adaptive_name) return;

      let explanation = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Título", level: 2 } }],
      });
      let examples = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Ejemplos", level: 2 } },
          {
            type: "list",
            data: { style: "unordered", items: ["Ejemplo 1", "Ejemplo 2"] },
          },
        ],
      });
      let movies = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Videos", level: 2 } }],
      });
      let images = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Imágenes", level: 2 } }],
      });
      let hyperlinks = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Enlaces", level: 2 } }],
      });
      let exercises = [
        {
          question: "Pregunta",
          alternatives: ["Alternativa", "Alternativa"],
          correct: 0,
        },
      ];

      let new_material = {
        unit_id: this.unit_selected._id,
        name: this.new_course_adaptive_name,
        data_fs: {
          overview: "Resumen",
          explanation,
          movies,
          images,
          hyperlinks,
          examples,
          exercises,
          faq: [{ question: "Pregunta", answer: "Respuesta" }],
        },
      };

      this.showLoading("Guardando");
      try {
        let res = await this.$api.material.add(new_material);

        this.$router.push({
          name: "material-editor",
          params: { material_id: res.$oid },
        });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // Item
    showItemEdit(item) {
      if (item.type === "adaptive") {
        this.$router.push({
          name: "material-editor",
          params: { material_id: item._id },
        });
      } else if (item.type === "material") {
        this.course_material = item;
        this.show_course_material_editor = true;
      }
    },
    showItemCreate(type) {
      this.dlg_new_item = false;

      if (type === "adaptive") {
        this.new_course_adaptive_name = "";
        this.dlg_new_course_adaptive = true;
      } else if (type === "material") {
        this.course_material = {
          course_id: this.$route.params["course_id"],
          unit_id: this.unit_selected._id,
          files: [],
          is_private: true,
        };
        this.show_course_material_editor = true;
      }
    },
    async updateItemUnit() {
      this.dlg_edit_item = false;
      if (this.unit_selected._id === this.item_selected.unit_id) return;

      this.showLoading("Guardando");
      try {
        if (this.item_selected.type === "adaptive")
          await updateMaterialUnit(
            this.item_selected._id,
            this.item_selected.unit_id
          );
        else if (this.item_selected.type === "material")
          await this.$api.courseMaterial.update(this.item_selected._id, {
            unit_id: this.item_selected.unit_id,
          });

        this.unit_selected.content = this.unit_selected.content.filter(
          (item) => item._id !== this.item_selected._id
        );
        let to_unit = this.units.find(
          (unit) => unit._id === this.item_selected.unit_id
        );
        to_unit.content = to_unit.content || [];
        to_unit.content.push(this.item_selected);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async updateItemName() {
      this.dlg_edit_item_name = false;

      this.showLoading("Guardando");
      try {
        if (this.item_selected.type === "adaptive")
          await updateMaterial(
            this.item_selected._id,
            this.item_selected.name,
            this.item_selected.is_private
          );
        else if (this.item_selected.type === "material")
          await this.$api.courseMaterial.update(this.item_selected._id, {
            title: this.item_selected.title,
          });

        let item = this.unit_selected.content.find(
          (item) => item._id === this.item_selected._id
        );
        if (this.item_selected.type === "adaptive")
          item.name = this.item_selected.name;
        else if (this.item_selected.type === "material")
          item.title = this.item_selected.title;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async removeItem() {
      this.dlg_remove_item = false;

      this.showLoading("Guardando");
      try {
        if (this.item_selected.type === "adaptive")
          await removeMaterial(this.item_selected._id);
        else if (this.item_selected.type === "material")
          await this.$api.courseMaterial.remove(this.item_selected._id);

        this.unit_selected.content = this.unit_selected.content.filter(
          (item) => item._id !== this.item_selected._id
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // Move Item
    async updateUnitOrder(unit) {
      let order = unit.content.map((item) => item._id);
      try {
        await updateUnitOrder(unit._id, order);
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
    },
    async moveItemUp(unit, idx) {
      let arr = unit.content;
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;

        this.$forceUpdate();
        await this.updateUnitOrder(unit);
      }
    },
    async moveItemDown(unit, idx) {
      let arr = unit.content;
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;

        this.$forceUpdate();
        await this.updateUnitOrder(unit);
      }
    },
  },
  components: { CourseMaterialEditor },
};
</script>

<style lang='scss' scoped>
.unit {
  margin-bottom: 24px;
  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__name {
    padding: 6px 4px;
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
}

.item {
  padding: 12px 20px;
  margin-top: 8px;
  background: #dfdfdf;
  border-radius: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &__name {
    margin: 0;
    font-weight: bold;
  }

  &--disabled {
    background: #f0f0f0e7;
    .item__name {
      opacity: 0.5;
    }
  }
}

// New Item
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