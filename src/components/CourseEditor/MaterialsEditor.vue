<template>
  <div class="m-container" style="padding-bottom: 60px !important">
    <div class="options mb-3">
      <strong
        v-show="$store.state.show_limits"
        class="mt-1"
        style="opacity: 0.5"
        >({{ `${units.length}/${Variables.max_units_per_course}` }})</strong
      >
      <div></div>
      <m-btn
        @click="
          dlg_unit = true;
          unit_name = '';
        "
        :disabled="units.length >= Variables.max_units_per_course"
        class="ml-2"
        color="primary"
        small
      >
        <v-icon class="mr-2" small>mdi-plus</v-icon>Crear Unidad
      </m-btn>
    </div>
    <!-- Unit -->
    <section class="unit mb-4" v-for="(unit, idx) in units" :key="idx">
      <!-- <div class="unit__menu" @click="unit.show = !unit.show; $forceUpdate()"> -->
      <div class="unit__menu">
        <p v-if="!unit.edit_name" class="unit__name">{{ unit.name }}</p>
        <v-text-field
          v-else
          class="unit__name"
          v-model="unit.name"
          :maxlength="UnitModel.name.max_length"
          :counter="UnitModel.name.max_length"
          hide-details
          dense
        ></v-text-field>
        <div class="unit__options">
          <!-- <v-btn v-if="unit.show" icon small>
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn v-else icon small>
                <v-icon>mdi-chevron-down</v-icon>
          </v-btn>-->
          <v-menu v-if="!unit.edit_name && !unit.edit_order" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="ml-2" icon small v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-0" dense>
              <v-list-item
                @click="
                  unit.edit_name = true;
                  $forceUpdate();
                "
              >
                <v-list-item-title>Editar Nombre</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  unit.edit_order = true;
                  $forceUpdate();
                "
              >
                <v-list-item-title>Editar Orden</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  dlg_material = true;
                  material_name = '';
                  unit_selected = unit;
                "
                :disabled="materialsCount >= Variables.max_materials_per_course"
              >
                <v-list-item-title>Crear Material</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeUnit(unit._id.$oid)">
                <v-list-item-title>Eliminar</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            class="ml-2"
            v-show="unit.edit_name"
            @click="updateUnitName(unit)"
            small
            text
            rounded
            outlined
          >
            Finalizar
            <v-icon class="ml-2" small>mdi-close</v-icon>
          </v-btn>
          <v-btn
            class="ml-2"
            v-show="unit.edit_order"
            @click="updateUnitOrder(unit)"
            small
            text
            rounded
            outlined
          >
            Finalizar
            <v-icon class="ml-2" small>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Materials -->
      <div v-show="!unit.show" class="materials">
        <div v-for="(material, m_idx) in unit.materials" :key="m_idx">
          <!-- Material -->
          <div class="material">
            <p class="material__name">{{ material.name }}</p>
            <div v-show="!unit.edit_order" class="material__options">
              <v-btn
                @click="selectMaterial(material._id.$oid)"
                icon
                small
                class="mr-1"
              >
                <v-icon style="font-size: 1.2rem">mdi-pencil</v-icon>
              </v-btn>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn icon small v-on="on">
                    <v-icon style="font-size: 1.4rem">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0" dense>
                  <v-list-item
                    @click="
                      dlg_update_material_unit = true;
                      unit_selected = null;
                      material_selected = material;
                    "
                  >
                    <v-list-item-title>Cambiar Unidad</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      dlg_remove_material = true;
                      unit_selected = unit;
                      material_selected = material;
                    "
                  >
                    <v-list-item-title>Eliminar Material</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <!-- Material Menu -->
            <div v-show="unit.edit_order" class="material__menu">
              <v-btn
                icon
                small
                @click="moveUp(unit.materials, m_idx)"
                :disabled="m_idx === 0"
              >
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click="moveDown(unit.materials, m_idx)"
                :disabled="m_idx === unit.materials.length - 1"
              >
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Material Create -->
        <!-- <div
              v-show="!unit.edit_name && !unit.edit_order"
              @click="createMaterial(unit)"
              class="material--create"
        >+</div>-->
      </div>
    </section>

    <div v-show="units.length <= 0" class="text-center">No hay unidades</div>

    <!-- DIALOG UNIT -->
    <v-dialog v-model="dlg_unit" width="400" persistent>
      <form @submit.prevent="createUnit()" class="m-card">
        <div class="m-card__body">
          <v-text-field
            v-model="unit_name"
            :maxlength="UnitModel.name.max_length"
            label="Nombre"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            type="button"
            @click="dlg_unit = false"
            color="primary"
            text
            small
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" :loading="loading_btn" small
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <!-- DIALOG MATERIAL -->
    <v-dialog v-model="dlg_material" width="400" persistent>
      <form @submit.prevent="createMaterial(unit_selected)" class="m-card">
        <div class="m-card__body">
          <v-text-field
            v-model="material_name"
            :maxlength="MaterialModel.name.max_length"
            label="Nombre"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            type="button"
            @click="dlg_material = false"
            color="primary"
            text
            small
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn type="submit" color="primary" :loading="loading_btn" small
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <!-- DIALOG REMOVE MATERIAL -->
    <v-dialog v-model="dlg_remove_material" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            @click="dlg_remove_material = false"
            color="primary"
            small
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="removeMaterial()"
            color="error"
            :loading="loading_btn"
            small
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>
    <!-- DIALOG UPDATE MATERIAL UNIT -->
    <v-dialog v-model="dlg_update_material_unit" width="400" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <v-select
            v-model="unit_selected"
            :items="units"
            item-value="_id"
            item-text="name"
            label="Unidad"
          ></v-select>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            type="button"
            @click="dlg_update_material_unit = false"
            color="primary"
            text
            small
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="updateMaterialUnit()"
            type="submit"
            color="primary"
            :loading="loading_btn"
            small
            >Guardar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { getParam, redirect } from "@/services/router.js";
import { scrollDown } from "@/services/scroll";
import {
  addUnit,
  updateUnit,
  updateUnitOrder,
  removeUnit,
} from "@/services/unitService.js";
import {
  updateMaterialUnit,
  removeMaterial,
} from "@/services/materialService.js";

import UnitModel from "@/models/Unit";
import MaterialModel from "@/models/Material";
import Variables from "@/models/variables";

export default {
  data: () => ({
    course_id: "",
    course: "",
    units: [],
    material_selected: null,
    loading_btn: false,
    // New Unit
    unit_name: "",
    dlg_unit: false,
    // New Material
    unit_selected: null,
    material_name: "",
    dlg_material: false,
    dlg_remove_material: false,
    dlg_update_material_unit: false,
    //
    UnitModel,
    MaterialModel,
    Variables,
  }),
  computed: {
    materialsCount() {
      let count = this.units.reduce(
        (sum, unit) => sum + unit.materials.length,
        0
      );
      return count;
    },
  },
  async created() {
    this.course_id = getParam("course_id");
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Contenido");
      try {
        // this.course = await getCourseByTeacher(this.course_id);
        this.units = await this.$api.unit.getAllMaterials(this.course_id);
        // Materials
        for (let unit of this.units) {
          let order = (unit.order || []).reverse();
          unit.materials.sort((a, b) => {
            let a_order = order.indexOf(a._id.$oid);
            let b_order = order.indexOf(b._id.$oid);
            return b_order - a_order;
          });
        }
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async createUnit() {
      if (!this.unit_name) return;

      this.loading_btn = true;
      let new_unit = {
        name: this.unit_name,
      };
      try {
        let unit_id = await addUnit(this.course_id, new_unit);
        new_unit._id = unit_id;
        new_unit.materials = [];
        this.units.push(new_unit);
        setTimeout(() => scrollDown("app__body"), 100);
        this.dlg_unit = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async removeUnit(unit_id) {
      this.showLoading("Eliminando Unidad");
      try {
        await removeUnit(unit_id);
        this.units = this.units.filter((unit) => unit._id.$oid !== unit_id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    selectMaterial(material_id) {
      redirect("material-editor", { material_id });
    },
    async createMaterial(unit) {
      if (!this.material_name) return;

      let explanation = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Título", level: 2 } },
          // { type: "paragraph", data: { text: "Descripción" } }
        ],
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
      // Documents
      // let documents = [
      //   JSON.stringify({
      //     blocks: [{ type: "header", data: { text: "Título", level: 2 } }],
      //   }),
      // ];
      // Quizzes
      let quiz = [
        {
          question: "Pregunta",
          alternatives: ["Alternativa", "Alternativa"],
          correct: 0,
        },
      ];
      // let quizzes = {
      //   BAS: quiz,
      //   INT: quiz,
      //   ADV: quiz,
      // };

      let new_material = {
        unit_id: unit._id.$oid,
        name: this.material_name,
        data_fs: {
          overview: "Resumen",
          explanation,
          movies,
          images,
          hyperlinks,
          examples,
          exercises: quiz,
          faq: [{ question: "Pregunta", answer: "Respuesta" }],
        },
      };

      this.loading_btn = true;
      try {
        let material_id = await this.$api.material.add(new_material);
        new_material._id = material_id;
        unit.materials.push(new_material);
        // this.selectMaterial(material_id.$oid);
        this.dlg_material = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async updateMaterialUnit() {
      if (!this.material_selected || !this.unit_selected) return;

      this.loading_btn = true;
      let material_id = this.material_selected._id.$oid;
      let unit_id = this.unit_selected.$oid; // v-select result
      try {
        await updateMaterialUnit(material_id, unit_id);
        this.dlg_update_material_unit = false;
        await this.init();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async removeMaterial() {
      this.loading_btn = true;
      let material_id = this.material_selected._id.$oid;
      try {
        await removeMaterial(material_id);
        this.unit_selected.materials = this.unit_selected.materials.filter(
          (m) => m._id.$oid !== material_id
        );
        this.dlg_remove_material = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async updateUnitName(unit) {
      this.showLoading("Guardando Cambios");
      unit.id = unit._id.$oid;
      try {
        await updateUnit(unit);
        unit.edit_name = false;
        this.$forceUpdate();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // Unit Order
    async updateUnitOrder(unit) {
      this.showLoading("Guardando Cambios");
      let order = unit.materials.map((material) => material._id.$oid);
      try {
        await updateUnitOrder(unit._id.$oid, order);
        unit.edit_order = false;
        this.$forceUpdate();
      } catch (error) {
        this.showMessage("", "Error al Guardar");
      }
      this.hideLoading();
    },
    moveUp(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        this.$forceUpdate();
      }
    },
    moveDown(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        this.$forceUpdate();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit {
  border-radius: 12px;
  transition: 0.3s;
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;

  &__menu {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    // cursor: pointer;
  }

  &__name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: bold;
  }
}

.materials {
  padding: 18px;
  padding-top: 0;
  margin-top: -10px;
}

.material {
  margin-top: 12px;
  padding: 10px 14px;
  padding-right: 10px;
  background: #eee;
  color: #555;
  border-radius: 12px;

  display: flex;
  align-items: center;

  &__name {
    flex-grow: 1;
    margin: 0;
    // font-weight: bold;
    font-size: 1rem;
  }
  &__options {
    display: flex;
  }
  &__menu {
    display: flex;
    flex-direction: column;
  }

  &--create {
    width: 100%;
    padding: 10px;
    margin-top: 12px;
    color: #c9c9c9;
    font-size: 1.6rem;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 10px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      background: #f3f3f3;
    }
  }
}
</style>