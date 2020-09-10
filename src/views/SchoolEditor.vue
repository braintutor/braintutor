<template>
  <Layout :links="links">
    <div :slot="0">
      <form @submit.prevent="save()" class="school m-card">
        <div class="m-card__body">
          <h3>Configuración</h3>
          <v-text-field
            v-model="school.name"
            :maxlength="SchoolModel.name.max_length"
            label="Nombre"
            autocomplete="off"
            required
            class="mt-4"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </div>
    <TeachersEditor :slot="1" />
    <CoursesEditor :slot="2" />
    <ClassroomsEditor :slot="3" />
    <StudentsEditor :slot="4" />
    <SessionsEditor :slot="5" />
    <DirectorEditor :slot="6" />
    <ParentsEditor :slot="7" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import TeachersEditor from "@/components/SchoolEditor/TeachersEditor";
import ClassroomsEditor from "@/components/SchoolEditor/ClassroomsEditor";
import StudentsEditor from "@/components/SchoolEditor/StudentsEditor/index";
import CoursesEditor from "@/components/SchoolEditor/CoursesEditor";
import SessionsEditor from "@/components/SchoolEditor/SessionsEditor";
import DirectorEditor from "@/components/SchoolEditor/DirectorEditor";
import ParentsEditor from "@/components/SchoolEditor/ParentsEditor";

import { getSchool, updateSchool } from "@/services/schoolService";

import SchoolModel from "@/models/School";

export default {
  data: () => ({
    links: [],
    school: {},
    //
    SchoolModel,
  }),
  async mounted() {
    this.links = [
      {
        image: require(`@/assets/braintutor/icon-settings.png`),
        name: "Configuración",
      },
      {
        image:
          "https://cdn0.iconfinder.com/data/icons/back-to-school/90/school-learn-study-teacher-teaching-512.png",
        name: "Docentes",
      },
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        name: "Cursos",
      },
      {
        image:
          "https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/iconathon/iconathon_flipped-classroom/iconathon_flipped-classroom_flat-circle-white-on-red_512x512.png",
        name: "Aulas",
      },
      {
        image:
          "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/student-icon.png",
        name: "Alumnos",
      },
      {
        image: require("@/assets/avatar/normal.png"),
        name: "Sesiones",
      },
      {
        image:
          "https://www.kindpng.com/picc/m/475-4750705_school-administrator-icon-png-transparent-png.png",
        name: "Director",
      },
      {
        image:
          "https://www.kindpng.com/picc/m/475-4750705_school-administrator-icon-png-transparent-png.png",
        name: "Padres",
      },
    ];

    this.showLoading("Cargando Datos");
    try {
      this.school = await getSchool();
    } catch (error) {
      this.showMessage("Cargando Datos");
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      try {
        await updateSchool(this.school);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    Layout,
    StudentsEditor,
    TeachersEditor,
    CoursesEditor,
    ClassroomsEditor,
    SessionsEditor,
    DirectorEditor,
    ParentsEditor,
  },
};
</script>

<style lang='scss' scoped>
.school {
  max-width: 600px;
  margin: 0 auto;
}
</style>