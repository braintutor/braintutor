<template>
  <div>
    <div v-show="!grade_selected" class="editor">
      <div class="editor__menu">
        <h2>Grados y Secciones</h2>
        <m-btn @click="showCreate()" color="primary" small>
          <v-icon small class="mr-2">mdi-plus</v-icon>Crear
        </m-btn>
      </div>

      <v-select
        v-model="level_selected"
        :items="levels"
        item-text="name"
        item-value="_id"
        label="Nivel"
        class="mt-3"
      ></v-select>

      <div class="mt-3">
        <div v-for="(grade, idx) in grades_f" :key="idx" class="grade mb-3">
          <div @click="grade_selected = grade" class="grade__body">
            <span class="grade__name">
              {{ grade.name }}
            </span>
          </div>

          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" icon small v-on="on">
                <v-icon style="font-size: 1.5rem">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-0" dense>
              <v-list-item @click="grade_selected = grade">
                <v-list-item-title>Ver Más</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showEdit(grade)">
                <v-list-item-title>Editar</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showRemove(grade)">
                <v-list-item-title>Eliminar</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <p v-show="grades_f.length <= 0" class="text-center my-4">
          No hay información
        </p>
      </div>

      <!-- DLG CREATE -->
      <v-dialog v-model="dlg_create" max-width="600" persistent>
        <form @submit.prevent="create()" class="m-card">
          <div class="m-card__body">
            <h3>Crear</h3>
            <v-text-field
              v-model="grade.name"
              :maxlength="GradeModel.name.max_length"
              label="Nombre"
              autocomplete="off"
              required
              class="mt-4"
            ></v-text-field>
            <v-select
              v-model="grade.level"
              :items="levels"
              item-text="name"
              item-value="_id"
              label="Nivel"
            ></v-select>
          </div>
          <div class="m-card__actions">
            <m-btn
              v-if="!loading_btn"
              @click="dlg_create = false"
              color="primary"
              type="button"
              small
              text
              class="mr-2"
              >Cerrar</m-btn
            >
            <m-btn color="primary" type="submit" :loading="loading_btn" small
              >Guardar</m-btn
            >
          </div>
        </form>
      </v-dialog>

      <!-- DLG EDIT -->
      <v-dialog v-model="dlg_edit" max-width="600" persistent>
        <form @submit.prevent="update()" class="m-card">
          <div class="m-card__body">
            <h3>Editar</h3>
            <v-text-field
              v-model="grade.name"
              :maxlength="GradeModel.name.max_length"
              label="Nombre"
              autocomplete="off"
              required
              class="mt-4"
            ></v-text-field>
            <v-select
              v-model="grade.level"
              :items="levels"
              item-text="name"
              item-value="_id"
              label="Nivel"
            ></v-select>
          </div>
          <div class="m-card__actions">
            <m-btn
              v-if="!loading_btn"
              @click="dlg_edit = false"
              color="primary"
              type="button"
              small
              text
              class="mr-2"
              >Cerrar</m-btn
            >
            <m-btn color="primary" type="submit" :loading="loading_btn" small
              >Guardar</m-btn
            >
          </div>
        </form>
      </v-dialog>

      <!-- DLG REMOVE -->
      <v-dialog v-model="dlg_remove" max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h3>¿Desea eliminar?</h3>
          </div>
          <div class="m-card__actions">
            <m-btn
              @click="dlg_remove = false"
              color="primary"
              small
              class="mr-2"
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

    <!-- SECTIONS -->
    <SectionsEditor
      v-if="grade_selected"
      :grade="grade_selected"
      @unselect="grade_selected = null"
    />
  </div>
</template>

<script>
import SectionsEditor from "./SectionsEditor";
import GradeModel from "@/models/Grade";

export default {
  data: () => ({
    grades: [],
    grade: {},
    grade_selected: null,
    levels: [
      {
        _id: "PRI",
        name: "Primaria",
      },
      {
        _id: "SEC",
        name: "Secundaria",
      },
    ],
    level_selected: "PRI",
    //
    dlg_create: false,
    dlg_edit: false,
    dlg_remove: false,
    loading_btn: false,
    GradeModel,
  }),
  async created() {
    await this.init();
  },
  computed: {
    grades_f() {
      let grades = this.grades.filter((g) => g.level === this.level_selected);
      return [...grades].sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  methods: {
    async init() {
      this.showLoading("Cargando");
      try {
        this.grades = this.mongoArr(await this.$api.grade.getAll());
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async create() {
      this.loading_btn = true;
      try {
        let { $oid } = await this.$api.grade.add(this.grade);
        this.grade._id = $oid;
        this.grades.push(this.grade);
        this.dlg_create = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async update() {
      this.loading_btn = true;
      try {
        await this.$api.grade.update(this.grade._id, this.grade);
        let idx = this.grades.findIndex((e) => e._id === this.grade._id);
        this.grades[idx] = JSON.parse(JSON.stringify(this.grade));
        this.grades.splice(); // updates the array without modifying it
        this.dlg_edit = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async remove() {
      this.showLoading("Eliminando Aula");
      this.dlg_remove = false;
      try {
        await this.$api.grade.remove(this.grade._id);
        this.grades = this.grades.filter((e) => e._id !== this.grade._id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    showCreate() {
      this.dlg_create = true;
      this.grade = {};
    },
    showEdit(grade) {
      this.dlg_edit = true;
      this.grade = Object.assign({}, grade);
    },
    showRemove(grade) {
      this.dlg_remove = true;
      this.grade = grade;
    },
  },
  components: {
    SectionsEditor,
  },
};
</script>

<style lang='scss' scoped>
.editor {
  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.grade {
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  user-select: none;
  cursor: pointer;

  display: flex;
  align-items: center;

  &__body {
    padding: 18px 24px;
    flex-grow: 1;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    &:active {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>