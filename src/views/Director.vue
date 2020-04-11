<template>
  <AppSidebar :links="links">
    <div class="period" slot="default">
      <span class="period__text">Mostrar resultados por:</span>
      <v-select class="period__select" v-model="period" :items="periods" label="Periodo" dense solo></v-select>
    </div>
    <Classrooms :slot="0" />
    <div class="no-available" :slot="1">En Desarrollo</div>
    <div class="no-available" :slot="2">En Desarrollo</div>
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Classrooms from "@/components/Director/Classrooms/index";

export default {
  data: () => ({
    period: "Día",
    periods: ["Día", "Mes", "Año"],
    links: []
  }),
  mounted() {
    this.links = [
      {
        image:
          "https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/iconathon/iconathon_flipped-classroom/iconathon_flipped-classroom_flat-circle-white-on-red_512x512.png",
        text: "Aulas"
      },
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Cursos"
      },
      {
        image:
          "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/student-icon.png",
        text: "Alumnos"
      }
    ];
  },
  components: {
    AppSidebar,
    Classrooms
  }
};
</script>

<style lang='scss' scoped>
.period {
  display: flex;
  justify-content: center;
  align-items: center;
  &__text {
    margin-right: 10px;
  }
  &__select {
    max-width: 100px;
  }
}
.no-available {
  margin-top: 20px;
  color: #b3b3b3;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
</style>