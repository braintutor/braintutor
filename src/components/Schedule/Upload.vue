<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="500" :showCancel="false">
      <template #body>
        <div class="close-modal">
          <div>
            <h3>
              Importar horario para el
              {{ formatSegment(cycle.segment_type, cycleNumber) }}
            </h3>
          </div>
          <div>
            <v-btn class="mx-1" icon small @click="close">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
        </div>

        <div class="mt-2 ">
          <div class="mt-4 box">
            <div v-if="scheduleItems.length == 0">
              Construyendo plantilla de horarios 
              <v-btn loading text></v-btn>
            </div>
            <download-excel
              v-if="scheduleItems.length > 0"
              :name="nameFile"
              :type="type"
              :fields="scheduleFields"
              :data="scheduleItems"
            >
              Descargue la plantilla de horarios
              <v-icon>mdi-download</v-icon>
            </download-excel>
          </div>

          <form @submit.prevent="save()" class="mt-1 pa-4 box">
            <p>Suba el archivo con los horarios:</p>
            <input @change="onFileSelected($event)" accept=".xlsx" type="file" />
          </form>
        </div>
      </template>
      <template #actions>
        <m-btn
          @click="save"
          :loading="loading"
          color="primary"
          small
          v-if="file"
          >Importar</m-btn
        >
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import { formatSegment } from "@/services/schoolCycleService";
import { loadSchedule, getAllSessions } from "@/services/scheduleService";
import BrainDialog from "@/components/SchoolEditor/BrainDialog";
import downloadExcel from "vue-json-excel";

export default {
  components: { BrainDialog, downloadExcel },
  data: () => ({
    file: null,
    type: "xlsx",
    nameFile: null,
    loading: false,
    scheduleItems: [],
    scheduleFields: {
      nivel: "nivel",
      grado: "grado",
      seccion: "seccion",
      curso: "curso",
      dia: "dia",
      inicio: "inicio",
      fin: "fin",
    },
  }),
  props: ["isVisible", "cycle", "cycleNumber"],
  async mounted() {
    this.nameFile =
      formatSegment(this.cycle.segment_type, this.cycleNumber) + '.' + this.type;
    getAllSessions().then((r) => {
      this.scheduleItems = r;
      this.scheduleItems[0]["dia"] = "lunes"
      this.scheduleItems[0]["inicio"] = "22:00"
      this.scheduleItems[0]["fin"] = "22:30"
    });
  },
  methods: {
    formatSegment,
    close() {
      this.$emit("close");
    },
    save() {
      this.loading = true;
      this.showLoading("Guardando");

      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("school_cycle", this.cycle.id);
      formData.append("school_cycle_segment", this.cycleNumber);

      loadSchedule(formData)
        .then(() => {
          this.showMessage("", "Horario cargado");
          this.close();
        })
        .catch(() => {
          this.showMessage("", "Errores al subir el horario");
        })
        .finally(() => {
          this.hideLoading();
          this.loading = false;
        });
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
  },
};
</script>
