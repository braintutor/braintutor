<template>
  <div class="material m-card">
    <div class="m-card__body">
      <h3 class="material__title">{{ material.title }}</h3>
      <p class="material__description">{{ material.description }}</p>
      <!-- FILES -->
      <div class="files mt-4">
        <!-- FILE -->
        <a v-for="(file, idx) in material.files" :key="idx" class="file mt-2">
          <a :href="file.url" target="_blank" class="file__body">
            <div class="file__type">
              <img
                v-if="file.content_type.split('/')[0] === 'audio'"
                src="@/assets/file/icon-audio.svg"
              />
              <img
                v-else-if="file.content_type.split('/')[0] === 'image'"
                src="@/assets/file/icon-image.svg"
              />
              <img
                v-else-if="file.content_type.split('/')[0] === 'video'"
                src="@/assets/file/icon-video.svg"
              />
              <!--  -->
              <img
                v-else-if="file.content_type === 'application/pdf'"
                src="@/assets/file/icon-application-pdf.svg"
              />
              <img v-else src="@/assets/file/icon-default.svg" />
            </div>
            <span class="file__name">{{ file.name }}</span>
          </a>
        </a>
        <p v-show="material.files.length <= 0" class="text-center ma-0">
          No hay Archivos.
        </p>
      </div>
    </div>
    <div class="m-card__actions">
      <m-btn
        @click="
          $emit('finish', material);
          $emit('next', material);
        "
        color="primary"
        :rounded="false"
        small
        >Finalizar</m-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ["material"],
};
</script>

<style lang='scss' scoped>
.material {
  &__title {
    font-size: 1.5rem;
  }
  &__description {
    margin-top: 16px;
    font-size: 1rem;
    white-space: pre-line;
  }
}

.files {
  &__menu {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.9rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.file {
  display: block;
  background: rgba(0, 0, 255, 0.07);
  border-radius: 6px;

  display: flex;
  align-items: center;

  &__body {
    overflow: hidden;
    flex-grow: 1;
    color: rgba(0, 0, 0, 0.75);
    text-decoration: none;

    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 255, 0.05);
    }
  }

  &__type {
    padding: 16px;
    opacity: 0.6;

    display: flex;
    align-items: center;

    img {
      height: 32px;
      width: 32px;
    }
  }
  &__name {
    flex-grow: 1;
    padding: 8px;
  }
}
</style>