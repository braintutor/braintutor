<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="450" :showCancel="false">
      <template #body>
        <div class="close-modal">
          <h3>{{ itemDetail.name }}</h3>
          <v-btn
            @click="showEdit = !showEdit"
            class="mx-1"
            small
            icon
            v-if="role != 'STU'"
          >
            <v-icon dark>
              mdi-pencil
            </v-icon>
          </v-btn>
          <slot name="deleteSchedulePlan" v-bind:item="itemDetail"></slot>

          <v-btn class="mx-1" icon small @click="close">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <v-chip class="ma-2" label>
          Clase
        </v-chip>

        <p class="date-modal">
          {{ itemDetail.description }}
        </p>
        <div v-if="showEdit">
          <slot name="editSchedulePlan" v-bind:item="itemDetail"></slot>
          <slot name="reSchedule" v-bind:item="itemDetail"></slot>
        </div>
        <!-- <v-avatar color="indigo">
            <v-icon dark> mdi-account-circle </v-icon>
          </v-avatar> -->
      </template>
      <template #actions>
        <m-btn
          v-if="itemDetail.type == 'class'"
          @click="
            isEventSelected = false;
            goMeeting();
          "
          color="primary"
          small
          class="ml-2"
          >Entrar a clase</m-btn
        >
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import BrainDialog from "../SchoolEditor/BrainDialog";
const itemDetail = {
  type: "", // clase, tarea, evaluacion
  name: "",
};
export default {
  components: { BrainDialog },
  data: () => ({
    itemDetail: itemDetail,
    isVisible: false,
    role: localStorage.getItem("role"),
    showEdit: false,
  }),
  props: {
    item: {
      type: Object,
    },
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

<style></style>
