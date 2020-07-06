<template>
  <div class="px-2">
    <loading :active="loading" :message="loading_msg" />

    <h1 class="m-title">Configuración</h1>
    <section class="form">
      <!-- Name -->
      <strong class="mt-1">Nombre:</strong>
      <v-text-field
        v-if="show_edit"
        style="font-size: .95rem"
        v-model="material.name"
        hide-details
        dense
      ></v-text-field>
      <span class="mt-1" v-else>{{material.name}}</span>
      <v-btn v-if="show_edit" @click="saveName()" icon small>
        <v-icon style="font-size: 1.4rem">mdi-content-save</v-icon>
      </v-btn>
      <v-btn v-else @click="show_edit = true" icon small>
        <v-icon style="font-size: 1.4rem">mdi-pencil</v-icon>
      </v-btn>
      <!-- Image -->
      <strong class="mt-1">Imagen:</strong>
      <div>
        <v-btn onclick="upload_image.click()" text outlined small rounded>
          <v-icon class="mr-2" small>mdi-upload</v-icon>Archivo
        </v-btn>
        <v-btn @click="image_url = ''; dlg_url = true" class="ml-2" text outlined small rounded>
          <v-icon class="mr-2" small>mdi-link</v-icon>URL
        </v-btn>
        <v-file-input
          id="upload_image"
          @change="onFileSelected()"
          onclick="this.value = null"
          v-model="image_file"
          style="display:none"
          accept="image/*"
        ></v-file-input>
      </div>
    </section>
    <img class="image" :src="material.image" alt />

    <!-- dlg url -->
    <v-dialog v-model="dlg_url" max-width="450px" persistent>
      <v-card class="pa-1">
        <v-card-text class="py-2 px-3">
          <v-text-field
            style="font-size: .95rem"
            v-model="image_url"
            placeholder="URL"
            hide-details
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pt-3" style="width: min-content; margin: 0 auto">
          <v-btn @click="dlg_url = false" text small>Cerrar</v-btn>
          <v-btn @click="dlg_url = false; saveImage()" color="primary" small>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import {
  updateMaterialName,
  updateMaterialImage
} from "@/services/materialService";
import firebase from "firebase/app";
import "firebase/storage";

export default {
  props: ["material", "course"],
  data: () => ({
    image_file: null,
    image_url: "",
    dlg_url: false,
    show_edit: false,
    //
    loading: false,
    loading_msg: ""
  }),
  methods: {
    async saveName() {
      this.loading = true;
      this.loading_msg = "Guardando";

      let material_id = this.material._id.$oid;
      let name = this.material.name;
      try {
        await updateMaterialName(material_id, name);
        this.show_edit = false;
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }

      this.loading = false;
    },
    async saveImage() {
      this.loading = true;
      this.loading_msg = "Guardando Imagen";

      let material_id = this.material._id.$oid;
      try {
        await updateMaterialImage(material_id, this.image_url);
        this.material.image = this.image_url;
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }

      this.loading = false;
    },
    async onFileSelected() {
      let size = (this.image_file.size / 1024).toFixed(2);
      if (size <= 100) {
        let ref = firebase
          .storage()
          .ref(`/course/${this.course._id.$oid}/${this.material._id.$oid}`);

        let task = ref.put(this.image_file);
        task.on(
          "state_changed",
          snapshot => {
            let image_progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            this.loading = true;
            this.loading_msg = `Subiendo Archivo (${image_progress}%)`;
          },
          () => {
            this.loading = false;
          },
          () => {
            task.snapshot.ref.getDownloadURL().then(async url => {
              this.image_url = url;
              this.saveImage();
            });
          }
        );
      } else {
        this.$root.$children[0].showMessage(
          "",
          "La imagen excede el tamaño permitido: 100KB"
        );
      }
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.m-title {
  margin: 0;
  font-size: 1.6rem;
}

.form {
  margin: 16px 0;

  display: grid;
  grid-template-columns: auto 1fr auto;
  row-gap: 12px;
  column-gap: 16px;
  align-items: flex-start;
}

.image {
  display: block;
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
  border-radius: 8px;
}
</style>