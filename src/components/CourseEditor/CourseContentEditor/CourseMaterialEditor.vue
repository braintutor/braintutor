<template>
  <div>
    <div class="m-menu mb-3">
      <div class="m-menu__left">
        <v-btn @click="$emit('exit')" :disabled="loading" icon>
          <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
        </v-btn>
        <span class="m-menu__title">Material</span>
      </div>
    </div>
    <form @submit.prevent="save()" class="m-card">
      <div class="m-card__body">
        <v-text-field
          v-model="material.title"
          label="Título"
          required
        ></v-text-field>
        <v-textarea
          v-model="material.description"
          label="Descripción"
          required
          rows="3"
        ></v-textarea>
        <!-- FILES -->
        <div class="files mt-4">
          <div class="files__menu mb-4">
            <m-btn
              @click="show_files = true"
              type="button"
              color="primary"
              :rounded="false"
              small
              text
            >
              <v-icon style="font-size: 1rem" class="mr-2"
                >mdi-paperclip</v-icon
              >
              <span>Añadir Archivo</span></m-btn
            >
          </div>
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
            <div class="file__actions mx-2">
              <v-btn @click="removeFile(idx)" icon>
                <v-icon style="font-size: 1.5rem">mdi-close</v-icon>
              </v-btn>
            </div>
          </a>
          <p v-show="material.files.length <= 0" class="text-center ma-0">
            No hay Archivos.
          </p>
        </div>
        <div class="mt-5">
          <label>
            <input v-model="material.is_private" type="checkbox" class="mr-3" />
            <span>Privado (Los alumnos no podrán ver este contenido)</span>
          </label>
        </div>
      </div>
      <div class="m-card__actions">
        <m-btn
          v-if="material._id"
          @click="show_remove = true"
          type="button"
          color="error"
          :loading="loading"
          small
          :rounded="false"
          class="mr-2"
          >Eliminar</m-btn
        >
        <m-btn
          type="submit"
          color="primary"
          :loading="loading"
          small
          :rounded="false"
          class="mr-2"
          >Guardar</m-btn
        >
      </div>
      <v-dialog
        v-model="show_files"
        v-if="document_type && document_id"
        width="1000"
      >
        <Files
          @file="onFileSelected"
          :document_type="document_type"
          :document_id="document_id"
          :filters="[]"
          class="m-card"
          style="height: 75vh"
        />
      </v-dialog>
      <v-dialog v-model="show_remove" max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <div class="close-modal">
              <h3>Confirmar eliminación</h3>
              <v-btn class="mx-2" icon small @click="show_remove = false">
                <v-icon> mdi-close-thick </v-icon>
              </v-btn>
            </div>
            <p class="mt-4">
              Si elimina este contenido, no podrá revertir los cambios.
            </p>
          </div>
          <div class="m-card__actions">
            <m-btn @click="show_remove = false" small class="cancel-button"
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                show_remove = false;
                remove();
              "
              color="error"
              small
              >Eliminar</m-btn
            >
          </div>
        </div>
      </v-dialog>
      <v-dialog v-model="show_date" width="320">
        <form @submit.prevent="show_date = false" class="m-card">
          <div class="m-card__body">
            <h4>Programar material:</h4>
            <input
              v-model="date"
              type="datetime-local"
              required
              style="width: 100%"
              class="mt-4"
            />
          </div>
          <div class="m-card__actions">
            <m-btn type="submit" color="primary" small :rounded="false"
              >Publicar</m-btn
            >
          </div>
        </form>
      </v-dialog>
    </form>
  </div>
</template>

<script>
import Files from "@/components/globals/File/Files";

export default {
  props: ["material"],
  data: () => ({
    loading: false,
    date: null,
    // File
    document_type: "course",
    document_id: "",
    show_date: false,
    show_remove: false,
    show_files: false,
  }),
  created() {
    this.document_id = this.$router.currentRoute.params["course_id"];
  },
  methods: {
    async save() {
      this.loading = true;

      try {
        if (this.material._id) {
          let new_material = {
            title: this.material.title,
            description: this.material.description,
            files: this.material.files,
            is_private: this.material.is_private,
          };
          await this.$api.courseMaterial.update(
            this.material._id,
            new_material
          );
        } else {
          await this.$api.courseMaterial.add(this.material);
        }
        this.$emit("exit");
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }

      this.loading = false;
    },
    async remove() {
      this.loading = true;

      try {
        await this.$api.courseMaterial.remove(this.material._id);
      } catch (error) {
        this.showMessage("", "Ha ocurrido un error");
      }
      this.loading = false;

      this.$emit("exit");
    },
    onFileSelected({ name, url, content_type }) {
      this.show_files = false;

      let file = {
        name: name.substring(name.lastIndexOf("/") + 1),
        url,
        content_type,
      };

      this.material.files.push(file);
    },
    // Remove
    removeFile(idx) {
      this.material.files.splice(idx, 1);
    },
  },
  components: {
    Files,
  },
};
</script>

<style lang='scss' scoped>
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