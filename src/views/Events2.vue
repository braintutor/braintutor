<template>
  <div class="m-container">
    <school-cycle-segment-card
      v-if="segment"
      :segment="segment"
      :type="segment.type"
    />
    <calendar>
      <template v-slot:reSchedule="{ item }">
        <div class="ma-2">
          <v-expansion-panels v-model="showClass">
            <v-expansion-panel>
              <v-expansion-panel-header
                >Opciones avanzadas:</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-radio-group v-model="selectedAction">
                  <v-radio label="Cancelar" value="cancel"></v-radio>
                  <v-radio value="reschedule">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        Reprogramar <date-time class="mx-2" v-model="newDate" />
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <v-textarea
                  label="Motivo"
                  placeholder="Problema de salud, sucedio un evento inesperado..."
                ></v-textarea>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </template>
      <template v-slot:meeting="{ item }">
        <div class="ma-2">
          <p>Realizar videollamada:</p>
          <v-radio-group v-model="item.meeting_strategy._cls">
            <v-radio label="Usando BBB" value="BBBMeeting"></v-radio>
            <v-radio value="ManualLink">
              <template v-slot:label>
                <div class="all d-flex justify-space-between align-center">
                  Usar link:
                  <v-text-field
                    class="ml-2"
                    v-model="item.meeting_strategy.url"
                    @blur="saveLink(item)"
                    placeholder="De zoom, google meet,teams u otros"
                  />
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
      </template>
    </calendar>
  </div>
</template>

<script>
import Calendar from "@/components/Calendar";
import DateTime from "@/components/globals/DateTime";
import SchoolCycleSegmentCard from "@/components/SchoolEditor/SchoolCycleSegmentCard";
import { getCurrentOrNextSegment } from "@/services/schoolCycleService";
import { editMeetingUrl } from "@/modules/SchoolClass/service";

function validURL(str) {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
export default {
  components: { Calendar, DateTime, SchoolCycleSegmentCard },
  data: () => ({
    role: "",
    newDate: null,
    showEdit: false,
    selectedAction: "cancel",
    segment: null,
    showClass: false
  }),
  mounted() {
    this.role = localStorage.getItem("role");
    getCurrentOrNextSegment().then((x) => (this.segment = x));
  },
  methods: {
    saveLink(item) {
      const { url } = item.meeting_strategy
      if (this.isValid(url))
        editMeetingUrl(item.id, url).then(() => {
          this.showMessage("Se ha guardado el nuevo link", "");
        })
        .catch(error => {
          this.showMessage("", error.msg || error);
        });
    },
    isValid(url) {
      if (!url) return false;
      return validURL(url);
    },
  },
};
</script>
<style lang="scss" scoped>
.all {
  width: 100%;
}
</style>
