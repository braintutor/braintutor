<template>
  <v-container>
    <v-row
      v-for="segment in segments"
      :key="segment.number"
      class="d-flex justify-space-around"
    >
      <v-col cols="3" class="d-flex align-center">
        <h4>{{formatSegment(type, segment.number)}}</h4>
      </v-col>
      <v-col>
        <date-input label="Inicio" 
          :date-picker-props="{'show-current': showCurrent(segment)}" 
          v-model="segment.start" />
      </v-col>
      <v-col>
        <date-input label="Fin" 
          :date-picker-props="{'min': segment.start, 'show-current': segment.start}" 
          v-model="segment.end" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DateInput from "./DateInput";
import { formatSegment } from "@/services/schoolCycleService"

export default {
  components: {
    DateInput,
  },
  props: {
    value: Array,
    type: String,
  },
  computed: {
    segments: {
      get() {
        return this.value;
      },
      set(date) {
        this.$emit("input", date);
      },
    },
  },
  methods: {
    formatSegment,
    showCurrent(segment) {
      const segmentIndex = this.segments.indexOf(segment)
      if(segmentIndex == 0) return true // if first return current date

      const lastSegment = this.segments[segmentIndex - 1]
      return lastSegment.end
    }
  }
};
</script>

<style>
</style>