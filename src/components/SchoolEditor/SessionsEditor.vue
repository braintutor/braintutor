<template>
  <div class="editor">
    <!-- EDITOR Menu -->
    <div class="editor__menu">
      <div class="editor__title">
        <h2>Sesiones</h2>
      </div>
      <m-btn
        v-if="grade_id && section_id"
        @click="showCreate()"
        color="primary"
        small
      >
        <v-icon left small>mdi-plus</v-icon>Crear
      </m-btn>
    </div>

    <!-- EDITOR Filter -->
    <v-select
      v-model="grade_id"
      :items="grades"
      item-text="name"
      item-value="_id"
      label="Grado"
      class="mt-3"
    ></v-select>
    <v-select
      v-show="sections.length > 0"
      v-model="section_id"
      :items="sections"
      item-text="name"
      item-value="_id"
      label="Sección"
      class="mt-2"
    ></v-select>

    <!-- SESSIONS -->
    <div class="mt-4">
      <div v-for="(e, idx) in entities" :key="idx" class="session mb-3">
        <div class="session__body">
          <span>{{ e.course.name }}</span>
          <span>{{ `${e.teacher.last_name}, ${e.teacher.first_name}` }}</span>
        </div>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn class="mx-3" icon small v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0" dense>
            <v-list-item @click="showEdit(e)">
              <v-list-item-title>Asignar Docente</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showRemove(e)">
              <v-list-item-title>Eliminar Sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <p v-show="entities.length <= 0" class="text-center my-4">
        No hay Sesiones
      </p>
    </div>

    <!-- DLG CREATE -->
    <v-dialog v-model="dlg_create" max-width="600" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <h3>Nueva Sesión</h3>
          <v-select
            v-model="entity.course_id"
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
            v-if="!ldg_save"
            @click="dlg_create = false"
            color="primary"
            text
            small
            class="mr-2"
            >Cerrar</m-btn
          >
          <m-btn @click="add()" :loading="ldg_save" color="primary" small
            >Guardar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <!-- DLG EDIT -->
    <v-dialog v-model="dlg_edit" max-width="600" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <h3>Asignar Docente</h3>
          <p class="mt-4">
            <strong>{{
              (courses.find((c) => c._id === entity.course_id) || {}).name
            }}</strong>
          </p>
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
            v-if="!ldg_save"
            @click="dlg_edit = false"
            color="primary"
            text
            small
            class="mr-2"
            >Cerrar</m-btn
          >
          <m-btn @click="update()" :loading="ldg_save" color="primary" small
            >Guardar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <!-- DLG REMOVE -->
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
          <m-btn @click="remove()" color="error" small>Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    entities: [],
    entity: {},
    courses: [],
    teachers: [],
    //
    grades: [],
    grade_id: "",
    sections: [],
    section_id: "",
    //
    dlg_create: false,
    dlg_edit: false,
    dlg_remove: false,
    ldg_save: false,
  }),
  watch: {
    async grade_id() {
      if (this.grade_id) {
        this.showLoading("Cargando Aulas");
        this.sections = [];
        this.entities = [];
        try {
          this.sections = this.mongoArr(
            await this.$api.section.getAll({
              grade_id: this.grade_id,
            })
          );
          this.sections.sort((a, b) => a.name.localeCompare(b.name));
          this.section_id = this.sections[0] ? this.sections[0]._id : null;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
    async section_id() {
      this.entities = [];
      if (this.section_id) {
        this.showLoading("Cargando Sesiones");
        try {
          this.entities = this.mongoArr(
            await this.$api.session.getAll({
              grade_id: this.grade_id,
              section_id: this.section_id,
            })
          );
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
  },
  async created() {
    this.showLoading("Cargando Aulas");
    try {
      let grades = this.mongoArr(await this.$api.grade.getAll());
      grades.sort((a, b) => a.name.localeCompare(b.name));
      this.grades = [
        ...grades.filter((g) => g.level === "PRI"),
        ...grades.filter((g) => g.level === "SEC"),
      ];
      this.grade_id = this.grades[0] ? this.grades[0]._id : null;

      this.courses = this.mongoArr(await this.$api.course.getAll({}));
      let teachers = this.mongoArr(await this.$api.teacher.getAll());
      this.teachers = teachers.map((t) => ({
        ...t,
        name: `${t.last_name}, ${t.first_name}`,
      }));
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async add() {
      this.ldg_save = true;
      try {
        let { _id } = await this.$api.session.add(this.entity);
        this.entity._id = _id;
        this.entity.course = this.courses.find(
          (c) => c._id === this.entity.course_id
        );
        this.entity.teacher = this.teachers.find(
          (t) => t._id === this.entity.teacher_id
        );
        this.entities.push(this.entity);
        this.dlg_create = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.ldg_save = false;
    },
    async update() {
      this.ldg_save = true;
      try {
        await this.$api.session.update(this.entity._id, this.entity);
        this.entity.teacher = this.teachers.find(
          (t) => t._id === this.entity.teacher_id
        );
        let idx = this.entities.findIndex((e) => e._id === this.entity._id);
        this.entities[idx] = JSON.parse(JSON.stringify(this.entity));
        this.entities.splice(); // updates the array without modifying it
        this.dlg_edit = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.ldg_save = false;
    },
    async remove() {
      this.showLoading("Eliminando");
      this.dlg_remove = false;
      try {
        await this.$api.session.remove(this.entity._id);
        this.entities = this.entities.filter((e) => e._id !== this.entity._id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    //
    async showCreate() {
      this.entity = {
        grade_id: this.grade_id,
        section_id: this.section_id,
      };
      this.dlg_create = true;
    },
    async showEdit(e) {
      this.entity = e;
      this.dlg_edit = true;
    },
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

.session {
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  user-select: none;

  display: flex;
  align-items: center;

  &__body {
    padding: 18px 24px;
    flex-grow: 1;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
  }
}
</style>