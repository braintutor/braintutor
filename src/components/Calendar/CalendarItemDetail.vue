<template>
  <div>
    <brain-dialog v-model="isVisible" maxWidth="520" :showCancel="false">
      <template #body>
        <div class="close-modal">
          <div>
            <h3>{{ itemDetail.name }}</h3>
          </div>
          <div class="d-flex">
            <v-btn
              @click="showEdit = !showEdit"
              class="mx-1"
              small
              icon
              v-if="user && user.role != 'STU'"
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
          <v-chip
            class="my-2"
            label
            :color="itemDetail.color"
            text-color="white"
            v-if="itemDetail.start && itemDetail.end"
          >
            Clase de {{ itemDetail.start | time }} a {{ itemDetail.end | time }}
          </v-chip>
        </div>
        <p class="date-modal">
          {{ itemDetail.description }}
        </p>
        <div v-if="showEdit">
          <slot name="meeting" v-bind:item="itemDetail"></slot>
          <div v-if="featureFlag">
            <slot name="editSchedulePlan" v-bind:item="itemDetail"></slot>
            <slot name="reSchedule" v-bind:item="itemDetail"></slot>
          </div>
        </div>
        <div v-else-if="user && user.role == 'TEA'">
          <div class="my-2">
            <v-btn
              id="attendance"
              class="mx-2"
              fab
              dark
              small
              color="primary"
              :to="'/assistance/' + itemDetail.id"
            >
              <v-icon dark> mdi-account-check </v-icon>
            </v-btn>
            <label for="attendance">Marcar Asistencia</label>
          </div>
        </div>
      </template>
      <template #actions>
        <div v-if="itemDetail.type == 'class'">
          <v-btn small @click="close" v-if="featureFlag && user && user.role == 'TEA'">Finalizar clase</v-btn>
          <v-btn
            v-if="isActive(itemDetail) && ['TEA', 'STU'].includes(user.role)"
            color="primary"
            small
            class="ml-2"
            :loading="loadingMeeting"
            @click="enterClass"
            target="__blank"
            >Entrar a clase</v-btn
          >
        </div>
      </template>
    </brain-dialog>
  </div>
</template>

<script>
import BrainDialog from "../SchoolEditor/BrainDialog";
import { join } from "@/services/eventService";
import { mapState } from "vuex";
import { differenceInMinutes } from "date-fns";

const itemDetail = {
  type: "", // clase, tarea, evaluacion
  name: "",
  color: "",
  start: null,
};
export default {
  components: { BrainDialog },
  data: () => ({
    featureFlag: !!parseInt(process.env.VUE_APP_FEATURE_ADVANCED_SCHEDULE),
    itemDetail: itemDetail,
    isVisible: false,
    showEdit: false,
    loadingMeeting: false
  }),
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    item(value) {
      this.get(value);
      this.isVisible = !!value;
    },
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("close");
    },
    get(item) {
      if (item) {
        this.itemDetail = {
          type: "class",
          ...item,
        };
      }
    },
    isActive(item) {
      const isCurrent =
        differenceInMinutes(new Date(item.end), new Date()) >= -30;
      return isCurrent;
    },
    goMeeting() {},
    async enterClass() {
      this.loadingMeeting = true;
      const { url } = await join({
        meetingName: this.itemDetail["name"],
        meetingID: this.itemDetail["id"],
      }).catch(({ message }) => {
        this.showMessage('Error',message);
        this.loadingMeeting = false;
      });
      this.loadingMeeting = false;
      window.open(url);
    },
  },
};
</script>

<style lang="scss"></style>
