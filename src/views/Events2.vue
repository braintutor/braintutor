<template>
  <div class="m-container">
    <Calendario>
      <template v-slot:reSchedule="{ item }">
        <div >
          <p>Cambiar clase: </p >
          <div class="ma-2">
            <v-radio-group v-model="selectedAction">
              <v-radio label="Suspender" value="cancel"></v-radio>
              <v-radio value="reschedule">
                <template v-slot:label>
                  <div class="d-flex align-center">Reprogramar <date-time class="mx-2" v-model="newDate" /></div>
                </template>
              </v-radio>
            </v-radio-group>
          </div>
        </div>
      </template>
    </Calendario>
  </div>
</template>

<script>
import Calendario from "@/components/Calendar";
import DateTime from "@/components/globals/DateTime";

export default {
  components: { Calendario, DateTime },
  data: () => ({
    role: "",
    newDate: null,
    showEdit: false,
    selectedAction: "cancel",
  }),
  mounted() {
    this.role = localStorage.getItem("role");
  },
  methods: {},
};
</script>
