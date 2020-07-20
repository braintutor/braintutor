<template>
  <div>
    <section v-for="(material, idx) in materials" :key="idx" class="material">{{material}}</section>
  </div>
</template>

<script>
import { getMaterialsByCourseTeacher } from "@/services/materialService";

import { mapState, mapMutations } from "vuex";

export default {
  props: {
    course: Object
  },
  data: () => ({
    materials: []
  }),
  computed: {
    ...mapState(["user"])
  },
  async created() {
    this.loading(true);
    this.loading_msg("Cargando Cursos");

    let course_id = this.course._id.$oid;
    try {
      this.materials = await getMaterialsByCourseTeacher(course_id);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"])
  }
};
</script>

<style>
</style>