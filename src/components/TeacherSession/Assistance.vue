<template>
  <div class="editor">
    <div class="editor__menu d-flex justify-space-between align-center">
      <div class="editor__title d-flex align-center">
        <h2>Asistencia</h2>
        <strong class="ml-2 mt-1" style="opacity: 0.5"></strong>
      </div>
    </div>
    <div class="editor__content mt-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left"><h3>Alumnos</h3></th>
            <th class="text-left"><h3>Asistencia</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attendanceRecord of attendanceRecords" :key="attendanceRecord.id">
            <td>{{ attendanceRecord.student }}</td>
            <td width="22%">
              <v-select
                v-model="attendanceRecord.status"
                :items="items"
                item-text="text"
                item-value="value"
              ></v-select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attendanceRecords: [
        { student: "Arthur", status: "missed" }, 
        { student: "Diana", status: "attended" }
      ],
      items: [
        { text: "Asistió", value: "attended" }, 
        { text: "Tardanza", value: "delay" }, 
        { text: "Falta", value: "missed" }],
    };
  },
};
</script>

<style lang="scss" scoped>
.editor {
  padding: 10px 16px;

  &__content {
    overflow-x: auto;
  }
}

.m-table {
  width: 340px;
}
</style>