<template>
  <div class="editor">
    <!-- EDITOR Menu -->
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Sesiones</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"
          >({{
            `${entities.length}/${variables.max_sessions_per_school}`
          }})</strong
        >
      </div>
      <m-btn
        @click="
          dialog_edit = true;
          add();
        "
        :disabled="entities.length >= variables.max_sessions_per_school"
        color="primary"
        small
      >
        <v-icon left small>mdi-plus</v-icon>Crear
      </m-btn>
    </div>
    <!-- EDITOR Filter -->
    <v-select
      v-model="classroom_id"
      :items="classrooms"
      item-text="name"
      item-value="_id"
      label="Aula"
    ></v-select>
    <!-- EDITOR Table -->
    <div class="editor__table mt-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Aula</th>
            <th class="text-left">Curso</th>
            <th class="text-left">Profesor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entity, e_idx) in entities_f" :key="e_idx">
            <td>{{ entity.classroom }}</td>
            <td>{{ entity.course }}</td>
            <td>{{ `${entity.teacher ? entity.teacher.name : ""}` }}</td>

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
                      edit(entity);
                    "
                  >
                    <v-list-item-title>Editar Sesión</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="showRemove(entity)">
                    <v-list-item-title>Eliminar Sesión</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="entities_f.length === 0">
        No hay sesiones
      </p>
    </div>

    <!-- DIALOG -->
    <v-dialog v-model="dialog_edit" max-width="600" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <h3 v-if="action === 'create'">Crear</h3>
          <h3 v-else>Editar</h3>
          <v-alert
            v-model="show_error"
            type="error"
            icon="mdi-cloud-alert"
            text
            dismissible
            class="mt-4"
            >{{ error }}</v-alert
          >
          <v-select
            v-model="entity.classroom_id"
            :disabled="action === 'edit'"
            :items="classrooms"
            item-text="name"
            item-value="_id"
            label="Aula"
            class="mt-4"
          ></v-select>
          <v-select
            v-model="entity.course_id"
            :disabled="action === 'edit'"
            :items="courses"
            item-text="name"
            item-value="_id"
            label="Curso"
            class="mt-4"
          ></v-select>
          <v-select
            v-model="entity.teacher_id"
            :items="teachers"
            item-text="name"
            item-value="_id"
            label="Profesor"
            class="mt-4"
          ></v-select>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_save"
            @click="dialog_edit = false"
            color="primary"
            text
            small
            class="mr-2"
            >Cerrar</m-btn
          >
          <m-btn @click="save()" :loading="loading_save" color="primary" small
            >Guardar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Desea eliminar?</h3>
          <p class="mt-4">
            La sesión no debe tener evaluaciones ni tareas asignadas para
            continuar con la eliminación.
          </p>
          <p>Los eventos creados dentro de la sesión serán eliminados.</p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              remove();
              dlg_remove = false;
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
import { getCoursesBySchool } from "@/services/courseService";
import { getClassroomsBySchool } from "@/services/classroomService";
import { getTeachersBySchool } from "@/services/teacherService";
import {
  getSessionsBySchool,
  addSession,
  updateSession,
  removeSession,
} from "@/services/sessionService";

import variables from "@/models/variables";

export default {
  data: () => ({
    entities: [],
    entity: {},
    courses: [],
    classrooms: [],
    classroom_id: "",
    teachers: [],
    action: "",
    error: "",
    //
    show_error: false,
    dialog_edit: false,
    dlg_remove: false,
    loading_save: false,
    variables,
  }),
  async created() {
    this.showLoading("Cargando Sesiones");
    try {
      this.courses = await getCoursesBySchool();

      this.classrooms = await getClassroomsBySchool();
      this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      if (this.classrooms.length !== 0)
        this.classroom_id = this.classrooms[0]._id;

      let teachers = await getTeachersBySchool();
      this.teachers = teachers.map((t) => ({
        ...t,
        name: `${t.last_name}, ${t.first_name}`,
      }));
      this.entities = await getSessionsBySchool();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  computed: {
    entities_f() {
      let entities = this.entities.map((e) => {
        e.course = this.courses.find(
          (c) => c._id.$oid === e.course_id.$oid
        ).name;
        e.classroom = this.classrooms.find(
          (c) => c._id.$oid === e.classroom_id.$oid
        ).name;
        e.teacher = this.teachers.find((c) => c._id.$oid === e.teacher_id.$oid);

        return e;
      });
      entities = entities.filter(
        (e) => e.classroom_id.$oid === this.classroom_id.$oid
      );
      return entities;
    },
  },
  methods: {
    add() {
      this.action = "create";
      this.show_error = false;
      this.entity = {};
    },
    edit(entity) {
      this.action = "edit";
      this.show_error = false;
      this.entity = JSON.parse(JSON.stringify(entity));
      this.entity.id = this.entity._id.$oid;
    },
    async save() {
      this.show_error = false;
      if (this.validate()) {
        this.loading_save = true;
        if (this.action === "create") {
          // Create
          try {
            let entity_id = await addSession(this.entity);
            this.entity._id = entity_id;
            this.entities.push(this.entity);
            this.dialog_edit = false;
          } catch (error) {
            this.showMessage("", error.msg || error);
          }
        } else if (this.action === "edit") {
          // Update
          try {
            await updateSession(this.entity);
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
      } else {
        this.show_error = true;
        this.error = "Completa todos los datos.";
      }
    },
    async remove() {
      this.showLoading("Eliminando");
      let entity_id = this.entity._id.$oid;
      try {
        await removeSession(entity_id);
        this.entities = this.entities.filter((e) => e._id.$oid !== entity_id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    validate() {
      let { classroom_id, course_id, teacher_id } = this.entity;
      return classroom_id && course_id && teacher_id;
    },
    //
    async showRemove(e) {
      this.entity = e;
      this.dlg_remove = true;
    },
  },
};
</script>

<style lang='scss' scoped>
.editor {
  &__title {
    display: flex;
    align-items: center;
  }
  &__menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
}
</style>