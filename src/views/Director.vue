<template>
  <Layout v-model="link_idx" :links="links" fluid>
    <router-view />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    links: [],
  }),
  created() {
    this.links = [
      {
        image:
          "https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/iconathon/iconathon_flipped-classroom/iconathon_flipped-classroom_flat-circle-white-on-red_512x512.png",
        name: "Aulas",
        action: () => this.redirect(""),
      },
      {
        image:
          "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/student-icon.png",
        name: "Alumnos",
        action: () => this.redirect("students"),
      },
      // {
      //   image:
      //     "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
      //   name: "Cursos"
      // }
    ];
    let paths = window.location.href.split("/");
    let path = paths[paths.length - 1];
    this.link_idx = { students: 1 }[path];
    if (this.link_idx == null) this.link_idx = 0;
  },
  methods: {
    redirect(name) {
      this.$router.push(`/director/${name}`).catch(() => {});
    },
  },
  components: {
    Layout,
  },
};
</script>

<style lang='scss' scoped>
.no-available {
  margin-top: 20px;
  color: #b3b3b3;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
</style>