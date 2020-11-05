<template>
  <FSEditor v-if="material" :material="material" />
</template>

<script>
import FSEditor from "./FSEditor/index";

export default {
  props: ["material"],
  components: {
    FSEditor,
  },
};
</script>