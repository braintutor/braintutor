<template>
  <div class="m-container">
    <div>
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
 
    <!-- DIALOG NEW ITEM -->
    <v-dialog v-model="dlg_new_item" width="400" persistent>
      <AssignMaterialSyllabus
        :unit="unit_selected"
        :course="$route.params['course_id']"
        @close="dlg_new_item = null"
      ></AssignMaterialSyllabus>
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
import { processUnits } from "@/components/MaterialReference/util.js";
import MaterialReference from "@/components/MaterialReference/List";

export default {
  props: [ "course"],
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
    dlg_new_item: false,
    dlg_remove_item: false,
  }),
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      console.log(this.course["_id"]["$oid"])
      let course_id = this.course["_id"]["$oid"];
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
    
   
    showItemEdit(item) {
      this.$router.push({
        name:
          item.material.type === "adaptative"
            ? "material-adaptative-editor"
            : "material-file-editor",
        params: { material_id: item.material.id },
      });
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
