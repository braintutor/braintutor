<template>
  <div class="editor">
    <div class="editor__menu d-flex justify-space-between align-center">
      <div class="editor__title">
        <h2>Encargados de Material</h2>
      </div>
      <m-btn
        @click="
          dialog_edit = true;
          add();
        "
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
            <th class="text-left">Material</th>
            <th class="text-left">Grado</th>
            <th class="text-left">Encargado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in courses" :key="e.id">
            <td>{{ e.subject_name }}</td>
            <td>{{ e.grade_name }}</td>
            <td>{{ e.teacher_name }}</td>
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
                    <v-list-item-title>Editar</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      dialog_remove = true;
                      entity = e;
                    "
                  >
                    <v-list-item-title>Eliminar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="courses.length === 0">
        No hay cursos.
      </p>
    </div>
    <!-- DIALOG CREATE|EDIT -->
    <brain-dialog v-model="dialog_edit" @submit="save" :loading="loading_save">
      <template #body>
        <div class="close-modal">
          <h3 v-if="action === 'create'">Crear Encargado de material</h3>
          <h3 v-else>Editar</h3>
          <v-btn class="mx-2" icon small @click="dialog_edit = false">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <div class="pa-4">
          <SubjectChooser
            @choose="chooseSubject"
            :value="entity.subject_id"
          ></SubjectChooser>
          <GradeChooser
            @choose="chooseGrade"
            :value="entity.grade_id"
          ></GradeChooser>
          <TeacherChooser
            @choose="chooseTeacher"
            :value="entity.teacher_id"
            label="Encargado"
          ></TeacherChooser>
        </div>
      </template>
      <template #actions>
        <m-btn color="primary" type="submit" :loading="loading_save" small
          >Guardar</m-btn
        >
      </template>
    </brain-dialog>
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body close-modal">
          <h3>¿Desea eliminar?</h3>
          <v-btn class="mx-2" icon small @click="dialog_remove = false">
            <v-icon>mdi-close-thick</v-icon>
          </v-btn>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_remove = false" small class="cancel-button"
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
import {
  getCoursesBySchool,
  addCourse,
  updateCourse,
  removeCourse,
} from "@/services/courseService";
import BrainDialog from "./BrainDialog";
import TeacherChooser from "@/components/globals/Teacher/Choose";
import SubjectChooser from "@/components/globals/Subject/Choose";
import GradeChooser from "@/components/globals/Grade/Choose";

export default {
  components: {
    BrainDialog,
    SubjectChooser,
    GradeChooser,
    TeacherChooser,
  },
  data: () => ({
    courses: [],
    entity: {},
    action: "",
    dialog_edit: false,
    dialog_remove: false,
    loading_save: false,
  }),
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.showLoading("Cargando Cursos");
      try {
        this.courses = await getCoursesBySchool();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    chooseGrade(grade) {
      this.entity.grade_id = grade._id;
    },
    chooseSubject(subject) {
      this.entity.subject_id = subject.id;
    },
    chooseTeacher(teacher) {
      this.entity.teacher_id = teacher._id;
    },
    add() {
      this.action = "create";
      this.entity = {};
    },
    edit(entity) {
      this.action = "edit";
      this.entity = entity;
      this.entity.id = this.entity.id;
    },
    async save() {
      this.loading_save = true;
      if (this.action === "create") {
        // Create
        try {
          this.entity.knowledge = [];
          let entity_id = await addCourse(this.entity);
          this.getData();
          this.entity.id = entity_id;
          this.dialog_edit = false;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      } else if (this.action === "edit") {
        // Update
        try {
          await updateCourse(this.entity);
          this.getData(); // updates the array without modifying it
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
        await removeCourse(this.entity.id);
        this.getData();
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

  &__title {
    display: flex;
    align-items: center;
  }
  &__content {
    overflow-x: auto;
  }
}

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}
</style>