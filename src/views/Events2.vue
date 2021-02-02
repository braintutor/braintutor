<template>
  <div class="m-container">
    <school-cycle-segment-card 
      v-if="segment"
      :segment="segment"
      :type="segment.type"
       />
    <calendar>
      <template v-slot:reSchedule="{ item }">
        <div class="ma-2">
          <v-radio-group v-model="selectedAction">
            <v-radio label="Suspender" value="cancel"></v-radio>
            <v-radio value="reschedule">
              <template v-slot:label>
                <div class="d-flex align-center">Reprogramar <date-time class="mx-2" v-model="newDate" /></div>
              </template>
            </v-radio>
          </v-radio-group>
          <v-textarea  label="Motivo" placeholder="Problema de salud, sucedio un evento inesperado..." ></v-textarea>
        </div>
      </template>
    </calendar>
  </div>
</template>

<script>
import Calendar from "@/components/Calendar";
import DateTime from "@/components/globals/DateTime";
import SchoolCycleSegmentCard from "@/components/SchoolEditor/SchoolCycleSegmentCard";
import { getCurrentOrNextSegment } from '@/services/schoolCycleService'

export default {
  components: { Calendar, DateTime, SchoolCycleSegmentCard },
  data: () => ({
    role: "",
    newDate: null,
    showEdit: false,
    selectedAction: "cancel",
    segment: null
  }),
  mounted() {
    this.role = localStorage.getItem("role");
    getCurrentOrNextSegment().then(x => this.segment = x)
  },
  methods: {},
};
</script>
