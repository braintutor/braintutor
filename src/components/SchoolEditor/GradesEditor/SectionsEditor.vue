<template>
  <div>
    <div class="m-menu mb-3">
      <div class="m-menu__left">
        <v-btn icon @click="$emit('unselect')">
          <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
        </v-btn>
        <span class="m-menu__title">{{ grade.name }}</span>
      </div>
      <div class="m-menu__right">
        <m-btn @click="showCreate()" color="primary" small>
          <v-icon small class="mr-2">mdi-plus</v-icon>Crear Sección
        </m-btn>
      </div>
    </div>

    <div class="mt-4">
      <div v-for="(section, idx) in sections_f" :key="idx" class="section mb-3">
        <div class="section__body">
          <span class="section__name">
            {{ section.name }}
          </span>
        </div>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn class="mx-3" icon small v-on="on">
              <v-icon style="font-size: 1.5rem">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0" dense>
            <v-list-item @click="showEdit(section)">
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showRemove(section)">
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <p v-show="sections.length <= 0" class="text-center my-4">
        No hay Secciones
      </p>
    </div>

    <!-- DLG CREATE -->
    <v-dialog v-model="dlg_create" max-width="600" persistent>
      <form @submit.prevent="create()" class="m-card">
        <div class="m-card__body">
          <h3>Crear</h3>
          <v-text-field
            v-model="section.name"
            :maxlength="SectionModel.name.max_length"
            label="Nombre"
            autocomplete="off"
            required
            class="mt-4"
          ></v-text-field>
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
            v-model="section.name"
            :maxlength="SectionModel.name.max_length"
            label="Nombre"
            autocomplete="off"
            required
            class="mt-4"
          ></v-text-field>
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
import SectionModel from "@/models/Section";

export default {
  props: {
    grade: Object,
  },
  data: () => ({
    sections: [],
    section: {},
    //
    dlg_create: false,
    dlg_edit: false,
    dlg_remove: false,
    loading_btn: false,
    SectionModel,
  }),
  async created() {
    await this.init();
  },
  computed: {
    sections_f() {
      return [...this.sections].sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  methods: {
    async init() {
      this.showLoading("Cargando");
      try {
        this.sections = this.mongoArr(
          await this.$api.section.getAll({ grade_id: this.grade._id })
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async create() {
      this.loading_btn = true;
      try {
        let { $oid } = await this.$api.section.add({
          grade_id: this.grade._id,
          ...this.section,
        });
        this.section._id = $oid;
        this.sections.push(this.section);
        this.dlg_create = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async update() {
      this.loading_btn = true;
      try {
        await this.$api.section.update(this.section._id, this.section);
        let idx = this.sections.findIndex((e) => e._id === this.section._id);
        this.sections[idx] = JSON.parse(JSON.stringify(this.section));
        this.sections.splice(); // updates the array without modifying it
        this.dlg_edit = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async remove() {
      this.showLoading("Eliminando Sección");
      this.dlg_remove = false;
      try {
        await this.$api.section.remove(this.section._id);
        this.sections = this.sections.filter((e) => e._id !== this.section._id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    showCreate() {
      this.dlg_create = true;
      this.section = {};
    },
    showEdit(section) {
      this.dlg_edit = true;
      this.section = Object.assign({}, section);
    },
    showRemove(section) {
      this.dlg_remove = true;
      this.section = section;
    },
  },
};
</script>

<style lang='scss' scoped>
.section {
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  user-select: none;

  display: flex;
  align-items: center;

  &__body {
    padding: 18px 24px;
    flex-grow: 1;
  }
}
</style>