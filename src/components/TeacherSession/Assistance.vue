<template>
  <div class="m-container">
    <div class="editor__menu d-flex justify-space-between align-center">
      <div class="editor__title align-center">
        <h2 class="pb-3">Asistencia</h2>
        <h3 class="pb-3">{{ school_class.full_name }}</h3>
        <h3>
          {{school_class.proposed_range.start | date }}, 
          {{school_class.proposed_range.start | time }} - 
          {{school_class.proposed_range.end | time }}
        </h3>
      </div>
    </div>
    <div class="editor__content mt-4">
      <v-simple-table class="m-table" dense>
        <thead>
          <tr>
            <th class="text-center"><h3>Alumnos</h3></th>
            <th class="text-center"><v-icon>mdi-account-group</v-icon><h3>nombres</h3></th>
            <th class="text-center"><v-icon>mdi-pencil</v-icon><h3>Asistencia</h3></th>
            <th class="text-center"><v-icon>mdi-file-find-outline</v-icon><h3>Observaciones</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendanceRecord of school_class.attendance_records" :key="attendanceRecord.id">
            <td class="text-center"><img class="st-user" src="@/assets/icons/icon-student.svg" alt /></td>
            <td class="student-td">{{ attendanceRecord.student }}</td>
            <td class="assistance-td">
              <v-select
                :value="attendanceRecord.status"
                :items="items"
                item-text="text"
                item-value="value"
                @change="markAttendance($event, attendanceRecord)"
                :loading="attendanceRecord.loading"
                :readonly="attendanceRecord.loading"
              ></v-select>
            </td>
            <td class="observaciones-td">
              <span v-if="attendanceRecord.created_at">
                Asistio a las {{ attendanceRecord.created_at | time }}
              </span>
            </td>
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
      school_class: {},
      items: [
        { text: "Asistió", value: "attended" }, 
        { text: "Tardanza", value: "late" }, 
        { text: "Falta", value: "absence" }
      ]
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
      getAttendanceRecords(this.$route.params.class_id)
        .then(x => {
          x.attendance_records = x.attendance_records.map(item => ({...item, loading: false}))
          this.school_class = x
          })
    },
    markAttendance(newStatus, attendanceRecord) {
      const oldStatus = attendanceRecord.status

      const classId = this.$route.params.class_id
      attendanceRecord.loading = true
      
      attendanceRecord.status = newStatus
      markAttendance(classId, attendanceRecord.id, newStatus)
        .catch(() => {
          alert("Algo salio mal!")
          attendanceRecord.status = oldStatus
        }).finally(() => {
          attendanceRecord.loading = false
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
  width: 40%;
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

.st-user {
  width: 32px;
}

</style>