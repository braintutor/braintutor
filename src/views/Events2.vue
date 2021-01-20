<template>
  <v-row>
    <v-col>
      <v-sheet height="800">
        <div class="d-flex justify-space-between mb-6">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <v-calendar
          ref="calendar"
          :now="today"
          :value="today"
          :events="events"
          color="primary"
          type="week"
          @click:event="seeDetail"
        ></v-calendar>
        <!-- @click:time="addEvent" -->
      </v-sheet>
    </v-col>

    <!-- DLG SEE COURSE -->
    <v-dialog v-model="isEventSelected" max-width="450" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Lenguaje y comunicación</h3>
            <v-btn class="mx-2" icon small @click="isEventSelected = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <p class="date-modal">
            Jueves, 21 enero. 8:00 – 9:30am cada semana, el martes, jueves,
            viernes, 13 veces
          </p>
          <v-avatar color="indigo">
            <v-icon dark> mdi-account-circle </v-icon>
          </v-avatar>
        </div>
        <div class="m-card__actions">
          <!-- <m-btn
            @click="isEventSelected = false"
            class="cancel-button"
            small
            text
            >Cancelar</m-btn
          > -->
          <m-btn
            @click="
              isEventSelected = false;
              updateTime();
            "
            color="primary"
            small
            class="ml-2"
            >Entrar a clase</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
import { getEvents } from "./event";

export default {
  data: () => ({
    today: "2019-01-08",
    events: [],
    isEventSelected: false,
  }),
  mounted() {
    this.$refs.calendar.scrollToTime("08:00");
    console.log("jjjjj");
    getEvents({ startDate: "", endDate: "" }).then((x) => {
      this.events = x.results;
    });
  },

  methods: {
    getStart(dateTime) {
      // round to 0, 30
      const minute = dateTime.minute <= 30 ? 0 : 30;
      return dateTime.date + " " + dateTime.hour + ":" + minute;
    },
    seeDetail(event) {
      console.log(event);
      this.isEventSelected = true;
    },
  },
};
</script>

<style lang="scss">
.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-modal {
  padding: 10px 0px 0px 0px;
}
</style>