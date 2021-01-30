<template>
  <v-card elevation="0">
    <v-card-title>
      {{ name }}
    </v-card-title>
    <v-card-subtitle v-if="currentDate < start">
      Proximo inicio de clases
    </v-card-subtitle>
    <v-card-text>
      Inicio: {{ formatDate(start) }} - Fin:
      {{ formatDate(end) }}
    </v-card-text>
  </v-card>
</template>

<script>
import { formatSegment } from "@/services/schoolCycleService";
import { parse, format } from "date-fns/fp";

const dateFormat = "yyyy-MM-dd";
const parseDate = parse(new Date())(dateFormat)

const prettyFormat = "dd/MM"
const formatDate = format(prettyFormat)

export default {
  props: {
    segment: Object, // expects Segment to have start & end in format {dateFormat}
    type: String,
  },
  data() {
    return { currentDate: new Date() }
  },
  methods: {
    formatSegment,
    formatDate
  },
  computed: {
    start() {
      return parseDate(this.segment.start);
    },
    end() {
      return parseDate(this.segment.end);
    },
    name() {
      return formatSegment(this.type, this.segment.number);
    },
  },
};
</script>

<style>
</style>