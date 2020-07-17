<template>
  <div class="container pt-0">
    <!-- List -->
    <div v-show="!material">
      <h1 class="title_">{{chatbot.name}}</h1>
      <div class="search">
        <input type="text" v-model="material_search" placeholder="Buscar" />
        <v-icon>mdi-magnify</v-icon>
      </div>
      <div class="row">
        <div v-for="(material, idx) in materials" :key="idx" class="col-12 col-sm-6 col-md-4 pa-4">
          <section @click="selectMaterial(material)" class="material">
            <div class="material__image" :style="{ backgroundImage: `url('${material.image}')` }" />
            <section class="material__body">
              <span class="material__name">{{material.name}}</span>
              <span class="material__description">{{material.description}}</span>
              <div class="material__actions">
                <button class="button">
                  Empezar
                  <v-icon
                    class="ml-1"
                    style="color: rgb(85, 83, 255); font-size: 1.4rem"
                  >mdi-arrow-right</v-icon>
                </button>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
    <!-- Material -->
    <MaterialCategories
      v-if="material && course.adaptive"
      :material="material"
      @unselectMaterial="unselectMaterial"
    />
    <MaterialDocuments
      v-if="material && !course.adaptive"
      :material="material"
      @unselectMaterial="unselectMaterial"
    />
  </div>
</template>

<script>
import MaterialCategories from "./MaterialCategories";
import MaterialDocuments from "./MaterialDocuments";

export default {
  props: {
    course: Object,
    chatbot: Object,
    materials: Array
  },
  data: () => ({
    material: null,
    material_search: ""
  }),
  methods: {
    selectMaterial(material) {
      this.material = material;
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
.title_ {
  margin: 0;
  margin-bottom: 8px;
  color: #5b5b6a;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.25px;
}

.search {
  width: 100%;
  padding: 10px 30px;
  padding-right: 15px;
  margin: 24px 0;
  border: 1px solid #ccc;
  border-radius: 4px;

  display: flex;

  input[type="text"] {
    color: #6b6b6b;
    flex-grow: 1;

    &:focus {
      outline: none;
    }
  }
}

.material {
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: 0.4s;
  cursor: pointer;

  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  &--disable {
    -webkit-filter: grayscale(1);
    opacity: 0.75;
  }

  &__image {
    height: 160px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__body {
    flex-grow: 1;
    padding: 10px;

    display: flex;
    flex-direction: column;
  }

  &__name {
    display: block;
    margin: 4px;
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 1.1rem;
    letter-spacing: 0.25px;
  }

  &__description {
    margin: 4px;
    margin-bottom: 20px;
    display: block;
    font-size: 0.9rem;
    color: #6d6d6d;
  }

  &__actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }
}

.button {
  padding: 10px 12px;
  font-weight: bold;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: 0.4s;

  &:hover {
    background: #e4e4e4;
  }
  &:focus {
    outline: none;
  }
}
</style>