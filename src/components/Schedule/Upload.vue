<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="500" :showCancel="false">
      <template #body>
        <div class="close-modal">
          <div>
            <h3>Subir horario para:</h3>
          </div>
          <div>
            <v-btn class="mx-1" icon small @click="close">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
        </div>

        <div class="d-flex justify-space-between align-center">
          <v-select
            :items="cycle.segments"
            :label="displayType(cycle.segment_type)"
            :item-text="displaySegment"
            item-value="number"
            @change="chooseSegment"
          ></v-select>

          <a class="mx-1" href="/files/plantilla_horario.csv" __target="blank"
            >Descargar plantilla</a
          >
          <!-- <SessionFilter @query="filter"></SessionFilter> -->
        </div>
        <div class="mt-2 d-flex justify-space-between">
          <form @submit.prevent="save()">
            <div class="">
              <input
                @change="onFileSelected($event)"
                onclick="value = null"
                type="file"
              />
            </div>
          </form>
        </div>
      </template>
      <template #actions>
        <m-btn @click="save" color="primary" small v-if="file"
          >Subir horarios (por {{ displayType(cycle.segment_type) }})</m-btn
        >
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import { formatSegment, displayType } from "@/services/schoolCycleService";
import { loadSchedule } from "@/services/scheduleService";
// import SessionFilter from "@/components/globals/Session/Filter";
import BrainDialog from "@/components/SchoolEditor/BrainDialog";

export default {
  components: { BrainDialog },
  data: () => ({
    school: {},
    file: null,
    loadingCycle: false,
    selectedCycleSegmentNumber: null,
  }),
  props: ["cycle_id", "isVisible", "cycle"],
  async mounted() {},
  methods: {
    displayType,
    displaySegment(segment) {
      return formatSegment(this.cycle.segment_type, segment.number);
    },
    close() {
      this.$emit("close");
    },
    async save() {
      this.showLoading("Guardando");
      try {
        var formData = new FormData();
        formData.append("file", this.file);
        formData.append("school_cycle", this.cycle.id);
        formData.append(
          "school_cycle_segment",
          this.selectedCycleSegmentNumber
        );

        await loadSchedule(formData);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    chooseSegment(segmentCycleNumber) {
      // const segment = this.cycle.segments.find(
      //   (s) => s["number"] == segmentCycleNumber
      // );

      this.selectedCycleSegmentNumber = segmentCycleNumber;
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
    filter(query) {
      console.log(query);
    },
  },
};
</script>
