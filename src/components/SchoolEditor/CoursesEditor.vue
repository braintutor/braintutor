<template>
  <div class="editor">
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Cursos</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"
          >({{
            `${entities.length}/${variables.max_courses_per_school}`
          }})</strong
        >
      </div>
      <m-btn
        @click="
          dialog_edit = true;
          add();
        "
        :disabled="entities.length >= variables.max_courses_per_school"
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
            <th class="text-left">Encargado</th>
            <th class="text-left">N° Unidades</th>
            <th class="text-left">N° Materiales</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, e_idx) in entities_aux" :key="e_idx">
            <td>{{ e.name }}</td>
            <td>{{ e.teacher }}</td>
            <td class="text-center">{{ e.units_count }}</td>
            <td class="text-center">{{ e.materials_count }}</td>
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
                    <v-list-item-title>Editar Curso</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      dialog_remove = true;
                      entity = e;
                    "
                  >
                    <v-list-item-title>Eliminar Curso</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="entities_aux.length === 0">
        No hay cursos.
      </p>
    </div>

    <!-- DIALOG CREATE|EDIT -->
    <v-dialog v-model="dialog_edit" max-width="600" persistent>
      <form @submit.prevent="save()" class="m-card">
        <div class="m-card__body">
          <h3 v-if="action === 'create'">Crear</h3>
          <h3 v-else>Editar</h3>
          <v-text-field
            v-model="entity.name"
            :maxlength="CourseModel.name.max_length"
            label="Nombre"
            autocomplete="off"
            required
            class="mt-4"
          ></v-text-field>
          <v-select
            v-model="entity.teacher_id"
            :items="teachers_aux"
            item-text="name"
            item-value="_id"
            label="Encargado"
          ></v-select>
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
            >Cerrar</m-btn
          >
          <m-btn color="primary" type="submit" :loading="loading_save" small
            >Guardar</m-btn
          >
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
          <m-btn
            @click="dialog_remove = false"
            color="primary"
            small
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              remove();
              dialog_remove = false;
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
import CourseModel from "@/models/Course";

import {
  getCoursesBySchool,
  addCourse,
  updateCourse,
  removeCourse,
} from "@/services/courseService";
import { getTeachersBySchool } from "@/services/teacherService";

import variables from "@/models/variables";

export default {
  data: () => ({
    entities: [],
    entity: {},
    teachers: [],
    //
    action: "",
    dialog_edit: false,
    dialog_remove: false,
    loading_save: false,
    CourseModel,
    variables,
  }),
  async mounted() {
    this.showLoading("Cargando Cursos");
    try {
      this.teachers = await getTeachersBySchool();
      this.entities = await getCoursesBySchool();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  computed: {
    teachers_aux() {
      let teachers = this.teachers.map((t) => ({
        ...t,
        name: `${t.last_name}, ${t.first_name}`,
      }));
      return teachers;
    },
    entities_aux() {
      let entities = this.entities.map((e) => {
        let teacher_id = e.teacher_id;
        if (teacher_id) {
          let teacher = this.teachers_aux.find(
            (t) => t._id.$oid === teacher_id.$oid
          );
          if (teacher) e.teacher = teacher.name;
        }
        return e;
      });
      return entities;
    },
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
          this.entity.knowledge = [];
          let entity_id = await addCourse(this.entity);
          this.entity._id = entity_id;
          this.entity.units_count = 0;
          this.entity.materials_count = 0;
          this.entities.push(this.entity);
          this.dialog_edit = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      } else if (this.action === "edit") {
        // Update
        try {
          await updateCourse(this.entity);
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
      this.showLoading("Eliminando Curso");
      this.dialog_edit = false;
      try {
        await removeCourse(this.entity._id.$oid);
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