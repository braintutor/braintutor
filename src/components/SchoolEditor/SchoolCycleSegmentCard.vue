<template>
  <div>
    <div class="d-flex">
      <h4 class="school-cycle">{{ name }}</h4>
      <v-icon>mdi-calendar</v-icon>
    </div>    
    <p>
      Inicio: {{ start | date }} - Fin:
      {{ end | date }}
    </p>
  </div>
</template>

<script>
import { formatSegment } from "@/services/schoolCycleService";
import { parse } from "date-fns/fp";

const dateFormat = "yyyy-MM-dd";
const parseDate = parse(new Date())(dateFormat);

export default {
  props: {
    segment: Object, // expects Segment to have start & end in format {dateFormat}
    type: String,
  },
  data() {
    return { currentDate: new Date() };
  },
  methods: {
    formatSegment
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

<style lang="scss" scoped>

.school-cycle {
  font-size: 1.4rem;
  margin-right: 10px;
}

</style>
