<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="450" :showCancel="false">
      <template #body>
        <div class="close-modal">
          <div>
            <h3>{{ itemDetail.name }}</h3>
          </div>
          <div>
            <v-btn
              @click="showEdit = !showEdit"
              class="mx-1"
              small
              icon
              v-if="user.role != 'STU'"
            >
              <v-icon dark v-if="!showEdit"> mdi-pencil </v-icon>
              <v-icon dark v-else-if="showEdit"> mdi-eye </v-icon>
            </v-btn>
            <slot name="deleteSchedulePlan" v-bind:item="itemDetail"></slot>

            <v-btn class="mx-1" icon small @click="close">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
        </div>
        <div>
          <v-btn small outlined color="teal">Marcar Asistencia</v-btn>
        </div>
        <p class="date-modal">
          {{ itemDetail.description }}
        </p>
        <div v-if="showEdit">
          <slot name="editSchedulePlan" v-bind:item="itemDetail"></slot>
          <slot name="reSchedule" v-bind:item="itemDetail"></slot>
        </div>
      </template>
      <template #actions>
        <v-btn small color="error" @click="close">Finalizar clase</v-btn>
        <v-btn
          v-if="itemDetail.type == 'class'"
          color="primary"
          small
          class="ml-2"
          :href="itemDetail.meetingUrl"
          target="__blank"
          >Entrar a clase</v-btn
        >
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import BrainDialog from "../SchoolEditor/BrainDialog";

import { mapState } from "vuex";

const itemDetail = {
  type: "", // clase, tarea, evaluacion
  name: "",
};
export default {
  components: { BrainDialog },
  data: () => ({
    itemDetail: itemDetail,
    isVisible: false,
    showEdit: false,
  }),
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    ...mapState([
      "user"
    ])
  },
  watch: {
    item(value) {
      this.get(value);
      this.isVisible = !!value;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    get(item) {
      this.itemDetail = {
        type: "class",
        ...item,
      };
    },
    goMeeting() {},
  },
};
</script>

<style lang="scss">
</style>
