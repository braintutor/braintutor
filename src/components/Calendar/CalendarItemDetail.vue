<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="450"
    :showCancel="false">
      <template #body>
        <div class="close-modal">
          <h3>{{ itemDetail.name }}</h3>
          <v-btn class="mx-2" icon small @click="close">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <p class="date-modal">
          {{ itemDetail.description }}
        </p>
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
      this.$emit('close')
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
