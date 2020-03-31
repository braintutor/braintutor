<template>
  <div class="editor">
    <loading :active="loading" />
    <div class="editor__menu">
      <h2 class="editor__title">Sesión</h2>
      <v-btn rounded small color="success" @click="dialog_edit = true; add()">
        Añadir
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="editor__filter">
      <h3 class="mr-5">Aula:</h3>
      <v-select
        v-model="classroom_id"
        :items="classrooms"
        item-text="name"
        item-value="_id"
        dense
        solo
      ></v-select>
    </div>
    <v-divider class="mt-5 mb-4"></v-divider>
    <div class="editor__content">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Aula</th>
            <th class="text-left">Curso</th>
            <th class="text-left">Profesor</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entity, e_idx) in entities_filtered" :key="e_idx">
            <td>{{entity.classroom}}</td>
            <td>{{entity.course}}</td>
            <td>{{entity.teacher}}</td>
            <td class="text-center">
              <v-btn small icon @click="dialog_edit = true; edit(entity)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="editor__message" v-if="entities_filtered.length <= 0">Aún no hay sesiones.</p>
    </div>

    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear Sesión</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar Sesión</v-card-title>
        <v-card-text class="edit__content">
          <span class="mt-1 mr-4">Aula:</span>
          <v-select
            v-model="entity.classroom_id"
            :items="classrooms"
            item-text="name"
            item-value="_id"
            dense
            solo
          ></v-select>
          <span class="mt-1 mr-4">Curso:</span>
          <v-select
            v-model="entity.course_id"
            :items="courses"
            item-text="name"
            item-value="_id"
            dense
            solo
          ></v-select>
          <span class="mt-1 mr-4">Profesor:</span>
          <v-select
            v-model="entity.teacher_id"
            :items="teachers"
            item-text="name"
            item-value="_id"
            dense
            solo
          ></v-select>
        </v-card-text>
        <v-card-actions class="edit__actions">
          <v-btn color="primary" :loading="loading_save" @click="save()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getCoursesBySchool } from "@/services/courseService";
import { getClassroomsBySchool } from "@/services/classroomService";
import { getTeachersBySchool } from "@/services/teacherService";
import {
  getSessionsBySchool,
  addSession,
  updateSession
} from "@/services/sessionService";

export default {
  data: () => ({
    entities: [],
    entity: {},
    courses: [],
    classrooms: [],
    classroom_id: "",
    teachers: [],
    //
    action: "",
    dialog_edit: false,
    loading: true,
    loading_save: false
  }),
  async mounted() {
    this.courses = await getCoursesBySchool();
    this.classrooms = await getClassroomsBySchool();
    this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
    this.classroom_id = this.classrooms[0]._id;
    this.teachers = await getTeachersBySchool();
    this.teachers.forEach(t => {
      t.name = `${t.first_name} ${t.last_name}`;
    });
    this.entities = await getSessionsBySchool();
    this.loading = false;
  },
  computed: {
    entities_aux() {
      let entities = this.entities.map(e => {
        e.course = this.courses.find(c => c._id.$oid === e.course_id.$oid).name;
        e.classroom = this.classrooms.find(
          c => c._id.$oid === e.classroom_id.$oid
        ).name;
        let teacher = this.teachers.find(c => c._id.$oid === e.teacher_id.$oid);
        e.teacher = `${teacher.first_name} ${teacher.last_name}`;
        return e;
      });
      return entities;
    },
    entities_filtered() {
      let entities = this.entities_aux.filter(
        e => e.classroom_id.$oid === this.classroom_id.$oid
      );
      return entities;
    }
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
          let entity_id = await addSession(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
          this.dialog_edit = false;
        } catch {
          //
        }
      } else if (this.action === "edit") {
        // Update
        try {
          await updateSession(this.entity);
          let entity_idx = this.entities.findIndex(
            entity => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = JSON.parse(JSON.stringify(this.entity));
          this.entities.splice(); // updates the array without modifying it
        } catch {
          //
        }
      }
      this.loading_save = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.editor {
  padding: 10px 16px;
  &__menu {
    display: flex;
    justify-content: space-between;
  }
  &__filter {
    display: flex;
    align-items: center;
  }
  &__title {
    margin-bottom: 10px;
  }
  &__content {
    overflow-x: auto;
  }
  &__message {
    margin: 18px 0 10px;
    font-weight: lighter;
    font-size: 1.1rem;
    text-align: center;
  }
}

.edit {
  &__content {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-row-gap: 20px;
    align-items: center;
    & * {
      font-size: 1rem;
    }
  }
  &__actions {
    padding: 20px;
    padding-top: 0;
    display: flex;
    justify-content: center;
  }
}
</style>