<template>
  <div class="editor">
    <div class="editor__menu d-flex justify-space-between align-center">
      <div class="editor__title align-center">
        <h2 class="pb-3">Asistencia</h2>
        <h3 class="pb-3">Matemáticas - Primaria 1er Grado de Primaria Sección A</h3>
      </div>
    </div>
    <div class="editor__content mt-4">
      <v-simple-table class="m-table" dense>
        <thead>
          <tr>
            <th class="text-center"><v-icon>mdi-account-group</v-icon><h3>Alumnos</h3></th>
            <th class="text-center"><v-icon>mdi-pencil</v-icon><h3>Asistencia</h3></th>
            <th class="text-center"><v-icon>mdi-file-find-outline</v-icon><h3>Observaciones</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendanceRecord of attendanceRecords" :key="attendanceRecord.id">
            <td class="student-td">{{ attendanceRecord.student }}</td>
            <td class="assistance-td">
              <v-select
                :value="attendanceRecord.status"
                :items="items"
                item-text="text"
                item-value="value"
                @change="markAttendance($event, attendanceRecord.id)"
                :loading="loading"
                :readonly="loading"
              ></v-select>
            </td>
            <td class="observaciones-td">Observaciones</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { getAttendanceRecords, markAttendance } from "@/services/attendanceService";

export default {
  data() {
    return {
      attendanceRecords: [],
      items: [
        { text: "Asistió", value: "attended" }, 
        { text: "Tardanza", value: "late" }, 
        { text: "Falta", value: "absence" }
      ],
      loading: false
    };
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      getAttendanceRecords(this.$route.params.class_id).then(x => this.attendanceRecords = x.results)
    },
    markAttendance(newStatus, attendanceRecordId) {
      const attendanceRecord = this.attendanceRecords.find(x => x.id === attendanceRecordId)
      const oldStatus = attendanceRecord.status

      const classId = this.$route.params.class_id
      this.loading = true
      
      attendanceRecord.status = newStatus
      markAttendance(classId, attendanceRecordId, newStatus)
        .catch(() => {
          alert("Algo salio mal!")
          attendanceRecord.status = oldStatus
        }).finally(() => {
          this.loading = false
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.editor {
  padding: 10px 16px;

  &__content {
    overflow-x: auto;
  }
}
.assistance-td {
  width: 13%;
}

.student-td {
  text-align: center;
}

.observaciones-td {
  text-align: center;
  width: 46%;
}
.m-table {
  background-color: #F1F8E9;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: black;
}

</style>