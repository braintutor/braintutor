<template>
  <v-row>
    <v-col>
      <v-sheet height="800">
        <v-calendar
          ref="calendar"
          :now="today"
          :value="today"
          :events="events"
          color="primary"
          type="week"
          @click:time="addEvent"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>

import { getEvents } from "./event"
import { add, parse, format } from "date-fns/fp";

const parseDate = parse(new Date())("yyyy-MM-dd HH:mm")
const formatDate = format("yyyy-MM-dd HH:mm")

  export default {
    data: () => ({
      today: '2019-01-08',
      events: [],
    }),
    mounted () {
      this.$refs.calendar.scrollToTime('08:00')
      console.log("jjjjj")
      getEvents({startDate: "", endDate: ""})
      .then(x => {
        this.events = x.results
      })
    },
    methods: {
      addEvent(dateTime) {
        const start = this.getStart(dateTime)
        const end = add({ hours: 1 })(parseDate(start))

        const newEvent = {
          name: "Un curso",
          start,
          end: formatDate(end),
          color: "blue"
        }
        console.log(newEvent)
        this.events.push(newEvent)
      },
      getStart(dateTime) {
        // round to 0, 30
        const minute = dateTime.minute <= 30? 0: 30 
        return dateTime.date + " " + dateTime.hour + ":" + minute
      }
    }
  }
</script>

<style>

</style>