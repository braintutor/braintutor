<template>
  <div class="editor">
    <loading :active="loading" />
    <div class="editor__menu">
      <h2 class="editor__title">Alumnos</h2>
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
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Usuario</th>
            <th class="text-left">Contraseña</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entity, e_idx) in entities_filtered" :key="e_idx">
            <td>{{ entity.first_name }}</td>
            <td>{{ entity.last_name }}</td>
            <td>{{ entity.user }}</td>
            <td>
              <v-btn class="mr-2" small icon @click="toogleShowPassword(entity)">
                <v-icon v-if="entity.showPassword">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
              <span v-if="entity.showPassword">{{ entity.pass }}</span>
              <span v-else>******</span>
            </td>
            <td class="text-center">
              <v-btn small icon @click="dialog_edit = true; edit(entity)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="editor__message" v-if="entities_filtered.length <= 0">Aún no hay alumnos.</p>
    </div>

    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear Alumno</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar Alumno</v-card-title>
        <v-card-text class="edit__content">
          <span class="mt-1 mr-4">Nombres:</span>
          <v-text-field
            class="text-field"
            v-model="entity.first_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Apellidos:</span>
          <v-text-field
            class="text-field"
            v-model="entity.last_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Aula:</span>
          <v-select
            v-model="entity.classroom_id"
            :items="classrooms"
            item-text="name"
            item-value="_id"
            dense
            solo
          ></v-select>
          <span class="mt-1 mr-4">Usuario:</span>
          <v-text-field
            class="text-field"
            v-model="entity.user"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Contraseña:</span>
          <v-text-field
            class="text-field"
            v-model="entity.pass"
            :append-icon="entity.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            dense
            hide-details
            autocomplete="off"
            :type="entity.showPassword ? 'text' : 'password'"
            @click:append="toogleShowPassword(entity)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="edit__actions">
          <v-btn
            v-if="action === 'edit'"
            color="error"
            :loading="loading_save"
            @click="showRemove(entity._id.$oid)"
          >Eliminar</v-btn>
          <v-btn color="primary" :loading="loading_save" @click="save()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title class="py-5">Eliminar</v-card-title>
        <v-card-text>
          <p>Es posible que el alumno tenga evaluaciones guardadas. ¿Desea Continuar?</p>
          <p>Escriba el usuario a eliminar:</p>
          <v-text-field
            class="text-field"
            v-model="entity_user_remove"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="edit__actions">
          <v-btn text @click="dialog_remove = false">Cancelar</v-btn>
          <v-btn
            v-if="action === 'edit'"
            color="error"
            :loading="loading_save"
            @click="remove()"
          >Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import {
  getStudents,
  addStudent,
  updateStudent,
  removeStudent
} from "@/services/studentService";
import { getClassroomsBySchool } from "@/services/classroomService";

export default {
  data: () => ({
    entities: [],
    entity: {},
    classrooms: [],
    classroom_id: "",
    action: "",
    //
    dialog_edit: false,
    loading: true,
    loading_save: false,
    //
    entity_id_remove: "",
    entity_user_remove: "",
    dialog_remove: false
  }),
  async mounted() {
    this.classrooms = await getClassroomsBySchool();
    this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
    this.classroom_id = this.classrooms[0]._id;
    this.entities = await getStudents();
    this.loading = false;
  },
  computed: {
    entities_filtered() {
      let entities = this.entities.filter(
        e => e.classroom_id.$oid === this.classroom_id.$oid
      );
      return entities;
    }
  },
  methods: {
    toogleShowPassword(entity) {
      entity.showPassword = !entity.showPassword;
      this.$forceUpdate();
    },
    add() {
      this.action = "create";
      this.entity = {
        first_name: "",
        last_name: "",
        user: "",
        pass: ""
      };
    },
    edit(entity) {
      this.action = "edit";
      this.entity = Object.assign({}, entity);
      this.entity.id = this.entity._id.$oid;
      this.entity.showPassword = false;
    },
    async save() {
      this.loading_save = true;
      if (this.action === "create") {
        try {
          let entity_id = await addStudent(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
          this.dialog_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      } else if (this.action === "edit") {
        try {
          await updateStudent(this.entity);
          let entity_idx = this.entities.findIndex(
            entity => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = Object.assign({}, this.entity);
          this.entities.splice();
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      }
      this.loading_save = false;
    },
    showRemove(entity_id) {
      this.entity_id_remove = entity_id;
      this.entity_user_remove = "";
      this.dialog_remove = true;
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando Alumno";
      this.dialog_remove = false;
      this.dialog_edit = false;
      let eid = this.entity_id_remove;
      try {
        await removeStudent(eid, this.entity_user_remove);
        this.entities = this.entities.filter(e => e._id.$oid !== eid);
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
    margin: 10px 0;
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