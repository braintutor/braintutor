<template>
  <div class="layout">
    <section class="list">
      <section v-for="(c, c_idx) in chatbots" :key="c_idx">
        <div class="list__title">
          <span>{{c.name}}</span>
          <v-icon
            class="list__show"
            :class="{'list__show--active': c.show}"
            @click="c.show = !c.show; $forceUpdate()"
          >mdi-chevron-down</v-icon>
        </div>
        <div v-show="c.show">
          <section
            v-for="(m, m_idx) in c.materials"
            :key="m_idx"
            @click="selectMaterial(m)"
            class="link"
            :class="{'link--active': m === material}"
          >{{m.name}}</section>
        </div>
      </section>
    </section>

    <!-- Material -->
    <div id="scroll" style="overflow-y: auto; width: 100%">
      <div v-if="material" class="material my-5">
        <div class="material__menu">
          <span class="material__name">{{material.name}}</span>
        </div>
        <MaterialCategories v-if="course.adaptive" :material="material" />
        <MaterialDocuments v-else :material="material" />
      </div>
    </div>
  </div>
</template>

<script>
import MaterialCategories from "./MaterialCategories";
import MaterialDocuments from "./MaterialDocuments";

import { getChatbotsByCourseTeacher } from "@/services/chatbotService";
import { getMaterialsByCourseTeacher } from "@/services/materialService";

import { mapState, mapMutations } from "vuex";

export default {
  props: {
    course: Object
  },
  data: () => ({
    chatbots: [],
    material: null
  }),
  computed: {
    ...mapState(["user"])
  },
  async created() {
    this.loading(true);
    this.loading_msg("Cargando");

    let course_id = this.course._id.$oid;
    try {
      this.chatbots = await getChatbotsByCourseTeacher(course_id);
      let materials = await getMaterialsByCourseTeacher(course_id);

      this.chatbots.forEach(c => {
        c.show = true;
        // Find Materials
        let c_materials = materials.filter(m => {
          return m.chatbot_id.$oid === c._id.$oid;
        });
        // Sorting Materials
        let order = (c.order || []).reverse();
        c_materials.sort((a, b) => {
          let a_order = order.indexOf(a._id.$oid);
          let b_order = order.indexOf(b._id.$oid);
          return b_order - a_order;
        });
        c.materials = c_materials;
      });
      if (materials[0]) this.selectMaterial(materials[0]);
    } catch (error) {
      console.log(error);
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    selectMaterial(material) {
      this.material = null;
      setTimeout(() => {
        this.material = material;
      }, 100);
    },
    unselectMaterial() {
      this.material = null;
    }
  },
  components: {
    MaterialCategories,
    MaterialDocuments
  }
};
</script>

<style lang='scss' scoped>
.layout {
  height: 100%;
}

.list {
  flex-shrink: 0;
  height: 100%;
  width: 300px;
  background: #fafafa;

  &__title {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 16px 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__show {
    font-size: 2rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: #e5e5e5;
    }

    &:focus {
      outline: none;
    }

    &--active {
      transform: rotate(180deg);
    }
  }
}

.link {
  padding: 8px 12px;
  padding-left: 32px;
  font-size: 0.85rem;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }

  &--active {
    background: #e5e5e5;
    &:hover {
      background: #e5e5e5;
    }
  }
}

.material {
  margin: 0 auto;
  max-width: 650px;

  &__menu {
    display: flex;
    align-items: center;
  }

  &__name {
    display: block;
    font-weight: bold;
    font-size: 1.5rem;
    letter-spacing: 0.25px;
  }
}
</style>