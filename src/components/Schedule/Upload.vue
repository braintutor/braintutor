<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="500" :showCancel="false">
      <template #body>
        <div class="close-modal">
          <div>
            <h3>Importar horario para el {{formatSegment(cycle.segment_type, cycleNumber)}}</h3>
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
              Importe el horario de un archivo siguiendo la
              <a
                class="mx-1"
                href="/files/plantilla_horario.csv"
                __target="blank"
                >plantilla siguiente.</a
              >
            </p>
            <input
              @change="onFileSelected($event)"
              onclick="value = null"
              type="file"
            />
          </form>
        </div>
      </template>
      <template #actions>
        <m-btn @click="save" color="primary" small v-if="file">Importar</m-btn>
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
    file: null
  }),
  props: ["isVisible", "cycle", "cycleNumber"],
  async mounted() {},
  methods: {
    formatSegment,
    close() {
      this.$emit("close");
    },
    async save() {
      this.showLoading("Guardando");
      try {
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("school_cycle", this.cycle.id);
        formData.append("school_cycle_segment", this.cycleNumber);

        await loadSchedule(formData);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
  },
};
</script>
