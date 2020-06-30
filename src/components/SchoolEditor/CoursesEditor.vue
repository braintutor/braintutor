<template>
  <div class="editor">
    <loading :active="loading" :message="loading_msg" />
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
      <p class="text-center mt-2" v-show="entities_aux.length === 0">No hay cursos.</p>
    </div>

    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar</v-card-title>
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
          <v-btn
            v-if="action === 'edit'"
            color="error"
            :loading="loading_save"
            @click="dialog_remove = true"
            small
          >Eliminar</v-btn>
          <v-btn color="primary" :loading="loading_save" @click="save()" small>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Remove -->
    <v-dialog v-model="dialog_remove" persistent max-width="300">
      <v-card class="edit">
        <div class="py-5 text-center">¿Desea eliminar?</div>
        <v-card-actions class="edit__actions">
          <v-btn @click="dialog_remove = false" small text>Cancelar</v-btn>
          <v-btn @click="remove(); dialog_remove = false" color="error" small>Eliminar</v-btn>
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
  updateCourse,
  removeCourse
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
    dialog_remove: false,
    loading: true,
    loading_msg: "",
    loading_save: false
  }),
  async mounted() {
    this.loading_msg = "Cargando Cursos";
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
          let teacher = this.teachers_aux.find(
            t => t._id.$oid === teacher_id.$oid
          );
          if (teacher) e.teacher = teacher.name;
        }
        return e;
      });
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
          this.entity.knowledge = [];
          let entity_id = await addCourse(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
          this.dialog_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      } else if (this.action === "edit") {
        // Update
        try {
          await updateCourse(this.entity);
          let entity_idx = this.entities.findIndex(
            entity => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = JSON.parse(JSON.stringify(this.entity));
          this.entities.splice(); // updates the array without modifying it
          this.dialog_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      }
      this.loading_save = false;
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando Curso";
      this.dialog_edit = false;
      try {
        await removeCourse(this.entity._id.$oid);
        this.entities = this.entities.filter(
          e => e._id.$oid !== this.entity._id.$oid
        );
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Eliminar", error.msg);
      }
      this.loading = false;
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