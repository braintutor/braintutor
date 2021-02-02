<template>
  <div class="m-container">
    <school-cycle-segment-card 
      v-if="segment"
      :segment="segment"
      :type="segment.type"
       />
    <Calendario>
      <template v-slot:reSchedule="{ item }">
        <div>
          <h3>Cambiar clase:</h3>
          <div class="my-2">
            <v-text-field label="Link de videollamada" 
              placeholder="Ingrese el link de zoom, google meet o teams aquí" />
          </div>
          
          <div class="ma-2">
            <v-radio-group v-model="selectedAction">
              <v-radio label="Suspender" value="cancel"></v-radio>
              <v-radio value="reschedule">
                <template v-slot:label>
                  <div class="d-flex align-center">Reprogramar <date-time class="mx-2" v-model="newDate" /></div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-text-field label="Motivo" counter maxlength="50" ></v-text-field>
          </div>
        </div>
      </template>
    </Calendario>
  </div>
</template>

<script>
import Calendario from "@/components/Calendar";
import DateTime from "@/components/globals/DateTime";
import SchoolCycleSegmentCard from "@/components/SchoolEditor/SchoolCycleSegmentCard";
import { getCurrentOrNextSegment } from '@/services/schoolCycleService'

export default {
  components: { Calendario, DateTime, SchoolCycleSegmentCard },
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
