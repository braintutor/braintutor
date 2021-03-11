<template>
  <div class="m-container">
    <div>
      <div style="display: flex; justify-content: flex-end" class="mb-2">
        <m-btn
          @click="
            new_unit_name = '';
            dlg_new_unit = true;
          "
          class="ml-2"
          color="primary"
          small
          ><v-icon class="mr-2" small>mdi-plus</v-icon>Crear Tema</m-btn
        >
      </div>
      <!-- Unit -->
      <MaterialReference :units="units">
        <template v-slot:unitMenu="{ unit }">
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
                <v-list-item-title>Asignar Material</v-list-item-title>
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
                <v-list-item-title>Eliminar Tema</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:materialMenu="{ unit, idx, unit_idx, material }">
          <div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="showItemEdit(material)"
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
                <v-list-item @click="moveItemUp(unit, idx, unit_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveItemDown(unit, idx, unit_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="
                    unit_selected = unit;
                    item_selected = Object.assign({}, material);
                    dlg_remove_item = true;
                  "
                >
                  <v-list-item-title>Quitar material</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </MaterialReference>
    </div>
    <!-- DIALOG NEW UNIT -->
    <v-dialog v-model="dlg_new_unit" width="400" persistent>
      <form @submit.prevent="addUnit()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Crear Tema</h3>
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
            <h3>Editar Tema</h3>
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
      <AssignMaterialSyllabus
        :unit="unit_selected"
        :course="$route.params['course_id']"
        @close="dlg_new_item = null"
      ></AssignMaterialSyllabus>
    </v-dialog>

    <v-dialog v-model="dlg_edit_item_name" width="400" persistent>
      <form @submit.prevent="updateItemName()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Crear Tema</h3>
            <v-btn class="mx-2" icon small @click="dlg_edit_item_name = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-text-field
            v-if="item_selected.type === 'adaptative'"
            v-model="item_selected.title"
            label="Nombre"
            required
            class="mt-4"
          ></v-text-field>
          <v-text-field
            v-else-if="item_selected.type === 'file'"
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
  </div>
</template>

<script>
import AssignMaterialSyllabus from "./AsignMaterialSyllabus";
import {
  addUnit,
  updateUnitOrder,
  updateUnit,
  removeUnit,
} from "@/services/unitService.js";
import { updateMaterial } from "@/services/materialService.js";
import { scrollDown } from "@/services/scroll";
import { processUnits } from "@/components/MaterialReference/util.js";
import MaterialReference from "@/components/MaterialReference/List";

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
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      let course_id = this.$route.params["course_id"];

      this.showLoading("Cargando contenido");
      try {
        let [units, materials] = await Promise.all([
          this.$api.unit.getAll(course_id),
          this.$api.syllabus.byCourse(course_id),
        ]);
        this.units = processUnits(this.mongoArr(units), materials);
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
      this.showLoading("Eliminando Tema");
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
    // Item
    showItemEdit(item) {
      this.$router.push({
        name:
          item.material.type === "adaptative"
            ? "material-adaptative-editor"
            : "material-file-editor",
        params: { material_id: item.material.id },
      });
    },

    async updateItemName() {
      this.dlg_edit_item_name = false;

      this.showLoading("Guardando");
      try {
        if (this.item_selected.type === "adaptative")
          await updateMaterial(
            this.item_selected._id,
            this.item_selected.title,
            this.item_selected.is_private
          );
        else if (this.item_selected.type === "file")
          await this.$api.courseMaterial.update(this.item_selected._id, {
            title: this.item_selected.title,
          });

        let item = this.unit_selected.content.find(
          (item) => item.id === this.item_selected.id
        );

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
        this.$api.syllabus.removeMaterialItem(this.item_selected.id);

        this.unit_selected.content = this.unit_selected.content.filter(
          (item) => item.id !== this.item_selected.id
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // Move Item
    async updateUnitOrder(unit) {
      let order = unit.content.map((item) => item.id);
      try {
        await updateUnitOrder(unit._id, order);
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
    },
    async moveItemUp(unit, idx, unit_idx) {
      let arr = unit.content;
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        unit = { ...unit, content: arr };
        this.units[unit_idx] = unit;
        this.units = [...this.units];

        await this.updateUnitOrder(unit);
      }
    },
    async moveItemDown(unit, idx, unit_idx) {
      let arr = unit.content;
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;

        unit = { ...unit, content: arr };
        this.units[unit_idx] = unit;
        this.units = [...this.units];
        await this.updateUnitOrder(unit);
      }
    },
  },
  components: { AssignMaterialSyllabus, MaterialReference },
};
</script>

<style lang="scss" scoped>
.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
