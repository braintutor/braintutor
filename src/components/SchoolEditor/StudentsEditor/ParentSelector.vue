<template>
  <v-dialog :value="value" max-width="800" persistent>
    <div class="m-card parents">
      <div class="m-card__body pb-0">
        <!-- CURRENT PARENT -->
        <div class="subtitle mb-3">Padre Asignado</div>
        <div v-if="parent_selected" class="current m-card">
          <div class="m-card__body current__body">
            <strong>{{`${parent_selected.last_name}, ${parent_selected.first_name}`}}</strong>
            <v-icon @click="parent_selected = null">mdi-close</v-icon>
          </div>
        </div>
        <div class="current--empty subtitle" v-else>No Asignado</div>
        <!-- NEW PARENT -->
        <v-text-field v-model="search_parent" label="Buscar" class="mt-4"></v-text-field>
      </div>
      <div class="m-card__body parents__body">
        <div v-for="(parent, idx) in parents_filtered" :key="idx" class="parent m-card mt-4">
          <div class="parent__body m-card__body">
            <div class="parent__name">{{`${parent.last_name}, ${parent.first_name}`}}</div>
            <v-icon @click="select(parent)">mdi-plus</v-icon>
          </div>
        </div>
      </div>
      <div class="m-card__actions">
        <m-btn
          v-if="!loading_save"
          @click="$emit('input', false)"
          color="primary"
          small
          text
          class="mr-2"
        >Cancelar</m-btn>
        <m-btn @click="save()" color="primary" :loading="loading_save" small>Guardar</m-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { updateStudentParent } from "@/services/studentService";

export default {
  props: {
    value: Boolean,
    student: Object,
    parents: Array,
  },
  data: () => ({
    parent_selected: null,
    search_parent: "",
    parent_id: "",
    loading_save: false,
  }),
  computed: {
    parents_filtered() {
      let parents = this.parents.filter(
        (p) =>
          (p.first_name.includes(this.search_parent) ||
            p.last_name.includes(this.search_parent) ||
            p.username.includes(this.search_parent) ||
            p.email.includes(this.search_parent)) &&
          (this.parent_selected == null || this.parent_selected._id !== p._id)
      );
      return parents;
    },
  },
  async created() {
    this.loading_save = true;
    try {
      if (this.student.parent_id)
        this.parent_selected = this.parents.find(
          (p) => p._id === this.student.parent_id
        );
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.loading_save = false;
  },
  methods: {
    select(parent) {
      this.parent_selected = parent;
    },
    async save() {
      this.loading_save = true;
      let parent_id = this.parent_selected && this.parent_selected._id; // null or id
      try {
        await updateStudentParent(this.student._id, parent_id);
        this.student.parent_id = parent_id; // null or id
        this.$forceUpdate();
        this.$emit("input", false);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_save = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.parents {
  overflow: hidden;
  height: 80vh;
  display: flex;
  flex-direction: column;

  &__body {
    flex-grow: 1;
    padding-top: 0;
    overflow-y: auto;
  }
}

.parent {
  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.current {
  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &--empty {
    padding: 10px 12px;
    color: rgb(134, 134, 134);
    border: 1px dashed #ccc;
    border-radius: 8px;
    text-align: center;
  }
}

.subtitle {
  font-size: 0.8rem;
  color: rgb(134, 134, 134);
}
</style>