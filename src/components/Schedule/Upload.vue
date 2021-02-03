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

        <div class="mt-2 d-flex justify-space-between">
          <form @submit.prevent="save()">
            <p>
              Importe el horario desde un archivo, siguiendo
              <a
                class="mx-1"
                href="/files/plantilla_horario.csv"
                __target="blank"
                >esta plantilla.</a
              >
            </p>
            <input @change="onFileSelected($event)" type="file" />
          </form>
        </div>
      </template>
      <template #actions>
        <m-btn @click="save" :loading="loading" color="primary" small v-if="file">Importar</m-btn>
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import { formatSegment } from "@/services/schoolCycleService";
import { loadSchedule } from "@/services/scheduleService";
import BrainDialog from "@/components/SchoolEditor/BrainDialog";

export default {
  components: { BrainDialog },
  data: () => ({
    file: null,
    loading: false
  }),
  props: ["isVisible", "cycle", "cycleNumber"],
  async mounted() {},
  methods: {
    formatSegment,
    close() {
      this.$emit("close");
    },
    save() {
      this.loading = true
      this.showLoading("Guardando");

      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("school_cycle", this.cycle.id);
      formData.append("school_cycle_segment", this.cycleNumber);

      loadSchedule(formData)
        .then(() => {
          this.showMessage("", "Horario cargado");
          this.close()
        })
        .catch(() => {
          this.showMessage("", "Errores al subir el horario");
        })
        .finally( () => {
          this.hideLoading()
          this.loading = false
          });
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
  },
};
</script>
