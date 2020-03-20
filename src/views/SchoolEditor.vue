<template>
  <div>
    <loading :active="loading" />
    <app-sidebar :links="links">
      <div :slot="0">
        <div class="editor">
          <h2 class="editor__title">Configuración</h2>
          <div class="editor__block">
            <span class="mt-1 mr-3">Nombre:</span>
            <v-text-field v-model="school.name" dense hide-details autocomplete="off"></v-text-field>
          </div>
          <v-btn color="primary" class="editor__action" @click="save()">Guardar</v-btn>
        </div>
      </div>
      <div :slot="1">
        <StudentsEditor />
      </div>
      <div :slot="2">
        <h1>3</h1>
      </div>
    </app-sidebar>
  </div>
</template>

<script>
import loading from "@/components/loading";
import AppSidebar from "@/components/AppSidebar";
import StudentsEditor from "@/components/SchoolEditor/StudentsEditor";

import { getSchool, updateSchool } from "@/services/schoolService";

export default {
  data: () => ({
    links: [],
    school: {},
    //
    loading: true
  }),
  async mounted() {
    this.links = [
      {
        image: require(`@/assets/braintutor/icon-settings.png`)
      },
      {
        image: require(`@/assets/braintutor/icon-students.png`)
      },
      {
        image: require(`@/assets/braintutor/icon-students.png`)
      }
    ];
    this.school = await getSchool();
    this.school.id = this.school._id.$oid;
    this.loading = false;
  },
  methods: {
    async save() {
      this.loading = true;
      console.log(this.school);

      await updateSchool(this.school);
      this.loading = false;
    }
  },
  components: {
    AppSidebar,
    StudentsEditor,
    loading
  }
};
</script>

<style lang='scss' scoped>
.editor {
  padding: 10px 14px;
  &__title {
    margin-bottom: 14px;
  }
  &__block {
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    * {
      font-size: 1.1rem;
    }
  }
  &__action {
    display: block;
    margin: 0 auto;
  }
}
</style>