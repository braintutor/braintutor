<template>
  <Materials v-if="course._id" :course="course" />
</template>

<script>
import Materials from "@/components/Materials/index";

import { getParam } from "@/services/router.js";
import { getCourseByTeacher } from "@/services/courseService";

export default {
  data: () => ({
    course: {},
  }),
  async created() {
    this.showLoading("Cargando");
    let course_id = getParam("course_id");
    try {
      this.course = await getCourseByTeacher(course_id);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    Materials,
  },
};
</script>