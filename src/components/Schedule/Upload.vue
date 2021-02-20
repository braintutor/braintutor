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
            <div v-if="scheduleItems.length > 0" @click="downloadTemplate">
              Descargue la plantilla de horarios
              <v-icon>mdi-download</v-icon>
            </div>
          </div>
          <form @submit.prevent="save()" class="mt-1 pa-4 box">
            <p>Suba el archivo con los horarios:</p>
            <div>
              <label for="ip-file" class="lab-file">Seleccionar archivo</label>
              <input @change="onFileSelected($event)" accept=".xlsx" type="file" id="ip-file" />
            </div>           
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
import { exportExcel } from "@/services/excel";

export default {
  components: { BrainDialog },
  data: () => ({
    file: null,
    loading: false,
    scheduleItems: [],
  }),
  props: ["isVisible", "cycle", "cycleNumber"],
  async mounted() {
    getAllSessions().then((r) => {
      this.scheduleItems = r;
      this.scheduleItems[0]["dia"] = "lunes"
      this.scheduleItems[0]["inicio"] = "22:00"
      this.scheduleItems[0]["fin"] = "22:30"
    });
  },
  methods: {
    downloadTemplate() {
      const nameFile =  formatSegment(this.cycle.segment_type, this.cycleNumber);
      exportExcel(this.scheduleItems, nameFile)
    },
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

<style lang="scss" scoped>

.lab-file {
 cursor:pointer;
 background: #DADADA;
 padding: 10px;
 border-radius: 10px;
 color: #000;
}

#ip-file {
  opacity:0;
  position: absolute;
  z-index: -1;
}
</style>
