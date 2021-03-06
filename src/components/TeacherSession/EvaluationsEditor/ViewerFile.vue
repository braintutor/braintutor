<template>
  <div class="view m-card">
    <div class="m-card__body">
      <template v-if="getType(file_selected) === 'image'">
        <img :src="file_selected.url" />
      </template>
      <template v-else-if="getType(file_selected) === 'audio'">
        <embed :src="file_selected.url"
      /></template>
      <template v-else-if="getType(file_selected) === 'video'">
        <embed :src="file_selected.url" />
      </template>
      <template v-else-if="file_selected.content_type === 'application/pdf'">
        <embed :src="file_selected.url" type="application/pdf" />
      </template>
      <div v-else class="file">
        <a :href="file_selected.url" target="_blank" class="file__body">
          <div class="file__type">
            <img src="@/assets/file/icon-default.svg" />
          </div>
          <span class="file__name">{{ getName(file_selected) }}</span>
          <v-btn icon class="mx-3">
            <v-icon style="font-size: 1.5rem">mdi-download</v-icon>
          </v-btn>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["file_selected"],
  methods: {
    getName(file) {
      return file.name.substring(file.name.lastIndexOf("/") + 1);
    },
    getType(file) {
      return file.content_type.split("/")[0];
    }
  },
};
</script>

<style></style>
