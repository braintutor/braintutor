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
      <TeachersEditor :slot="1" />
      <CoursesEditor :slot="2" />
      <ClassroomsEditor :slot="3" />
      <StudentsEditor :slot="4" />
      <SessionsEditor :slot="5" />
    </app-sidebar>
  </div>
</template>

<script>
import loading from "@/components/loading";
import AppSidebar from "@/components/AppSidebar";
import TeachersEditor from "@/components/SchoolEditor/TeachersEditor";
import ClassroomsEditor from "@/components/SchoolEditor/ClassroomsEditor";
import StudentsEditor from "@/components/SchoolEditor/StudentsEditor";
import CoursesEditor from "@/components/SchoolEditor/CoursesEditor";
import SessionsEditor from "@/components/SchoolEditor/SessionsEditor";

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
        image:
          "https://cdn0.iconfinder.com/data/icons/back-to-school/90/school-learn-study-teacher-teaching-512.png"
      },
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png"
      },
      {
        image:
          "https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/iconathon/iconathon_flipped-classroom/iconathon_flipped-classroom_flat-circle-white-on-red_512x512.png"
      },
      {
        image:
          "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/student-icon.png"
      },
      {
        image: require("@/assets/avatar/normal.png")
      }
    ];
    this.school = await getSchool();
    this.school.id = this.school._id.$oid;
    this.loading = false;
  },
  methods: {
    async save() {
      this.loading = true;
      await updateSchool(this.school);
      this.loading = false;
    }
  },
  components: {
    AppSidebar,
    StudentsEditor,
    TeachersEditor,
    CoursesEditor,
    ClassroomsEditor,
    SessionsEditor,
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