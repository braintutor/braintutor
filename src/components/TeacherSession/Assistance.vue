<template>
  <div class="editor">
    <div class="editor__menu d-flex justify-space-between align-center">
      <div class="editor__title align-center">
        <h2 class="pb-3">Asistencia</h2>
        <h3>Matemáticas - Primaria 1er Grado de Primaria Sección A</h3>
        <strong class="ml-2 mt-1" style="opacity: 0.5"></strong>
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
              <!-- <v-btn-toggle
                v-model="attendanceRecord.status"
                tile
                borderless
                                
              >
                <v-btn value="left">
                  Asistencia
                </v-btn>

                <v-btn value="center">
                  Tardanza
                </v-btn>

                <v-btn value="right">
                  Falta
                </v-btn>
              
              </v-btn-toggle> -->
              <v-select
                v-model="attendanceRecord.status"
                :items="items"
                item-text="text"
                item-value="value"
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
import { getAttendanceRecords } from "@/services/attendanceService";

export default {
  data() {
    return {
      attendanceRecords: [],
      items: [
        { text: "Asistió", value: "attended" }, 
        { text: "Tardanza", value: "late" }, 
        { text: "Falta", value: "absence" }],
    };
  },
  mounted() {
    getAttendanceRecords().then(x => this.attendanceRecords = x)
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
// .m-table {
//   width: 340px;
// }
</style>