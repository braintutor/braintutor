<template>
  <div>
    <h2>Horarios</h2>
    <div class="d-flex justify-space-between">
      <div>
        <SessionFilter @query="filter"></SessionFilter>
        <TeacherChooser @choose="filterByTeacher"></TeacherChooser>
      </div>
      <form @submit.prevent="save()">
        <div class="m-card__body">
          <input
            @change="onFileSelected($event)"
            onclick="value = null"
            type="file"
          />
        </div>
        <div class="m-card__actions">
          <m-btn color="primary" small>Subir horarios</m-btn>
        </div>
      </form>
    </div>

    <Calendario :query="queryCalendar"></Calendario>
  </div>
</template>

<script>
import { getSchool } from "@/services/schoolService";
import { loadSchedule } from "@/services/scheduleService";
import TeacherChooser from "@/components/globals/Teacher/Choose";
import SchoolModel from "@/models/School";
import Calendario from "@/components/Calendar";
import SessionFilter from "@/components/globals/Session/Filter";

export default {
  components: { Calendario, SessionFilter, TeacherChooser },
  data: () => ({
    school: {},
    SchoolModel,
    file: null,
    queryCalendar: {},
  }),
  async mounted() {
    this.showLoading("Cargando Datos");
    try {
      this.school = await getSchool();
      this.school = this.mongo(this.school);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      try {
        var formData = new FormData();
        formData.append("file", this.file);
        await loadSchedule(this.school._id, formData);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
    filter(query) {
      this.queryCalendar = { ...this.queryCalendar, ...query };
    },
    filterByTeacher({ _id }) {
      console.log(_id)
      this.queryCalendar = { ...this.queryCalendar, ...{ teacher_id: _id } };
    },
  },
};
</script>
