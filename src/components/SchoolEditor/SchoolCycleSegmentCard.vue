<template>
  <div>
    <h4>{{ name }}</h4>
    <p>
      Inicio: {{ formatDate(start) }} - Fin:
      {{ formatDate(end) }}
    </p>
  </div>
</template>

<script>
import { formatSegment } from "@/services/schoolCycleService";
import { parse, format } from "date-fns/fp";

const dateFormat = "yyyy-MM-dd";
const parseDate = parse(new Date())(dateFormat);

const prettyFormat = "dd/MM";
const formatDate = format(prettyFormat);

export default {
  props: {
    segment: Object, // expects Segment to have start & end in format {dateFormat}
    type: String,
  },
  data() {
    return { currentDate: new Date() };
  },
  methods: {
    formatSegment,
    formatDate,
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

<style></style>
