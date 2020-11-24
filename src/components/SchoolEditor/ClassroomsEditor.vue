<template>
  <div class="editor">
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Aulas</h2>
        <strong
          class="ml-2 mt-1"
          style="opacity: 0.5"
        >({{`${entities.length}/${variables.max_classrooms_per_school}`}})</strong>
      </div>
      <m-btn
        @click="dialog_edit = true; add()"
        :disabled="entities.length >= variables.max_classrooms_per_school"
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
            <th class="text-left">Nombre</th>
            <!-- <th class="text-center">Alumnos</th> -->
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, e_idx) in entities" :key="e_idx">
            <td>{{ e.name }}</td>
            <!-- <td class="text-center" v-if="!entity.students">0</td>
            <td class="text-center" v-else>{{ entity.students.length }}</td>-->
            <td class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" small icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0" dense>
                  <v-list-item @click="dialog_edit = true; edit(e)">
                    <v-list-item-title>Editar Aula</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="dialog_remove = true; entity = e">
                    <v-list-item-title>Eliminar Aula</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="entities.length === 0">No hay aulas.</p>
    </div>

    <!-- DIALOG CREATE|EDIT -->
    <v-dialog v-model="dialog_edit" max-width="600" persistent>
      <form @submit.prevent="save()" class="m-card">
        <div class="m-card__body">
          <h3 v-if="action === 'create'">Crear</h3>
          <h3 v-else>Editar</h3>
          <v-text-field
            v-model="entity.name"
            :maxlength="ClassroomModel.name.max_length"
            label="Nombre"
            autocomplete="off"
            required
            class="mt-4"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_save"
            @click="dialog_edit = false"
            color="primary"
            type="button"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <m-btn color="primary" type="submit" :loading="loading_save" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Desea eliminar?</h3>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_remove = false" color="primary" small class="mr-2">Cancelar</m-btn>
          <m-btn @click="remove(); dialog_remove = false" color="error" small>Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import ClassroomModel from "@/models/Classroom";

import {
  addClassroom,
  getClassroomsBySchool,
  updateClassroom,
  removeClassroom,
} from "@/services/classroomService";

import variables from "@/models/variables";

export default {
  data: () => ({
    entities: [],
    entity: {},
    //
    action: "",
    dialog_edit: false,
    dialog_remove: false,
    loading_save: false,
    ClassroomModel,
    variables,
  }),
  async mounted() {
    this.showLoading("Cargando Aulas");
    try {
      this.entities = await getClassroomsBySchool();
      this.entities.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    add() {
      this.action = "create";
      this.entity = {};
    },
    edit(entity) {
      this.action = "edit";
      this.entity = JSON.parse(JSON.stringify(entity));
      this.entity.id = this.entity._id.$oid;
    },
    async save() {
      this.loading_save = true;
      if (this.action === "create") {
        // Create
        try {
          let entity_id = await addClassroom(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
          this.dialog_edit = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      } else if (this.action === "edit") {
        // Update
        try {
          await updateClassroom(this.entity);
          let entity_idx = this.entities.findIndex(
            (entity) => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = JSON.parse(JSON.stringify(this.entity));
          this.entities.splice(); // updates the array without modifying it
          this.dialog_edit = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      }
      this.loading_save = false;
    },
    async remove() {
      this.showLoading("Eliminando Aula");
      this.dialog_edit = false;
      try {
        await removeClassroom(this.entity._id.$oid);
        this.entities = this.entities.filter(
          (e) => e._id.$oid !== this.entity._id.$oid
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang='scss' scoped>
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