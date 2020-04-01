<template>
  <div class="editor">
    <loading :active="loading" />
    <div class="editor__menu">
      <h2 class="editor__title">Cursos</h2>
      <v-btn rounded small color="success" @click="dialog_edit = true; add()">
        Añadir
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="editor__content">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Nombre</th>
            <th class="text-left">Encargado</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entity, e_idx) in entities_aux" :key="e_idx">
            <td>{{ entity.name }}</td>
            <td>{{ entity.teacher }}</td>
            <td class="text-center">
              <v-btn small icon @click="dialog_edit = true; edit(entity)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear Curso</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar Curso</v-card-title>
        <v-card-text class="edit__content">
          <span class="mt-1 mr-4">Nombre:</span>
          <v-text-field
            class="text-field"
            v-model="entity.name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Encargado:</span>
          <v-select
            v-model="entity.teacher_id"
            :items="teachers_aux"
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

import {
  getCoursesBySchool,
  addCourse,
  updateCourse
} from "@/services/courseService";
import { getTeachersBySchool } from "@/services/teacherService";

export default {
  data: () => ({
    entities: [],
    entity: {},
    teachers: [],
    //
    action: "",
    dialog_edit: false,
    loading: true,
    loading_save: false
  }),
  async mounted() {
    this.teachers = await getTeachersBySchool();
    this.entities = await getCoursesBySchool();
    this.loading = false;
  },
  computed: {
    teachers_aux() {
      let teachers = this.teachers.map(t => ({
        ...t,
        name: `${t.first_name} ${t.last_name}`
      }));
      return teachers;
    },
    entities_aux() {
      let entities = this.entities.map(e => {
        let teacher_id = e.teacher_id;
        if (teacher_id) {
          let { name } = this.teachers_aux.find(
            t => t._id.$oid === teacher_id.$oid
          );
          e.teacher = name;
        }
        return e;
      });
      return entities;
    }
  },
  methods: {
    add() {
      this.action = "create";
      this.entity = {
        name: ""
      };
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
        let entity_id = await addCourse(this.entity);
        this.entity._id = entity_id;
        this.entities.push(this.entity);
        this.dialog_edit = false;
      } else if (this.action === "edit") {
        // Update
        try {
          await updateCourse(this.entity);
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
  &__title {
    margin-bottom: 10px;
  }
  &__content {
    overflow-x: auto;
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