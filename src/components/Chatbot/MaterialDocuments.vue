<template>
  <div>
    <div class="material">
      <div class="material__menu">
        <button @click="$emit('unselectMaterial')" class="button">
          <v-icon class="ml-1" style="color: rgb(85, 83, 255); font-size: 1.4rem">mdi-arrow-left</v-icon>
        </button>
        <span class="material__name">{{material.name}}</span>
      </div>
      <!-- Body -->
      <div class="material__body">
        <DocumentEditor :data="material.documents[0]" hideControls readonly />
      </div>
    </div>
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

export default {
  props: {
    material: Object
  },
  components: {
    DocumentEditor
  }
};
</script>

<style lang='scss' scoped>
.material {
  &__menu {
    display: flex;
    align-items: center;
  }

  &__name {
    display: block;
    margin-left: 10px;
    font-weight: bold;
    font-size: 1.4rem;
    letter-spacing: 0.25px;
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