<template>
  <div class="container">
    <loading :active="loading" :message="loading_msg" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselect()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field
          class="menu-title"
          v-model="material.name"
          dense
          hide-details
          autocomplete="off"
        ></v-text-field>
      </div>
      <div class="menu-right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="dlg_image = true">
              <v-icon>mdi-image</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Editar Imagen</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="save()">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Guardar Cambios</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="dlg_delete = true">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Eliminar Material</span>
        </v-tooltip>
      </div>
    </div>

    <div class="types my-3">
      <v-btn
        @click="show_type = 'CAT'"
        :outlined="show_type !== 'CAT'"
        class="mx-1"
        color="green"
        dark
        small
        rounded
      >Material</v-btn>
      <v-btn
        @click="show_type = 'QUI'"
        :outlined="show_type !== 'QUI'"
        class="mx-1"
        color="warning"
        dark
        small
        rounded
      >Pruebas</v-btn>
    </div>

    <CategoriesEditor v-if="material._id" v-show="show_type === 'CAT'" :material="material" />
    <QuizzesEditor v-if="material._id" v-show="show_type === 'QUI'" :material="material" />

    <!-- Dialog Image -->
    <v-dialog v-model="dlg_image" max-width="500">
      <v-card class="image">
        <v-progress-linear v-if="image_progress != 0" :value="image_progress"></v-progress-linear>
        <div class="image__menu">
          <v-text-field class="mb-2" v-model="material.image" dense hide-details></v-text-field>
          <v-btn class="ml-2" @click="saveImage()" text icon>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn onclick="upload_image.click()" text icon>
            <v-icon>mdi-upload</v-icon>
          </v-btn>
        </div>
        <div class="image__input">
          <v-file-input
            id="upload_image"
            @change="onFileSelected()"
            onclick="this.value = null"
            v-model="image_file"
            style="display:none"
          ></v-file-input>
          <img :src="material.image" alt />
        </div>
      </v-card>
    </v-dialog>

    <!-- Dialog Delete -->
    <v-dialog v-model="dlg_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>Si elimina este contenido, no podrá revertir los cambios.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dlg_delete = false">Cancelar</v-btn>
          <v-btn small depressed color="error" @click="dlg_delete = false; remove()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";
import QuizzesEditor from "@/components/MaterialEditor/QuizzesEditor";
import CategoriesEditor from "@/components/MaterialEditor/CategoriesEditor/index";

import { getParam, redirect } from "@/services/router.js";
import {
  getMaterial,
  updateMaterialName,
  updateMaterialImage,
  removeMaterial
} from "@/services/materialService";
import { getCourseByMaterial } from "@/services/courseService";

import firebase from "firebase/app";
import "firebase/storage";

export default {
  data: () => ({
    material_id: "",
    material: {},
    course: {},
    show_type: "CAT",
    //
    loading: false,
    loading_msg: "",
    dlg_delete: false,
    // IMAGE
    image_file: {},
    image_progress: 0,
    dlg_image: false
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Material";
    this.material_id = getParam("material_id");
    try {
      this.material = await getMaterial(this.material_id);
      this.course = await getCourseByMaterial(this.material_id);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading = false;
  },
  methods: {
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando";
      try {
        await updateMaterialName(this.material._id.$oid, this.material.name);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando";
      try {
        await removeMaterial(this.material._id.$oid);
        this.unselect();
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    },
    async unselect() {
      redirect("course-editor", {
        course_id: this.course._id.$oid
      });
    },
    // IMAGE
    onFileSelected() {
      let size = (this.image_file.size / 1024).toFixed(2);
      if (size <= 100) {
        let ref = firebase
          .storage()
          .ref(`/material/${this.chatbot_id}/${this.material._id.$oid}`);

        let task = ref.put(this.image_file);
        task.on(
          "state_changed",
          snapshot => {
            this.image_progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          () => {
            /* error */
          },
          () => {
            this.image_progress = 100;
            task.snapshot.ref.getDownloadURL().then(async url => {
              this.image_progress = 0;
              this.material.image = url;
              this.saveImage();
            });
          }
        );
      } else {
        this.$root.$children[0].showMessage(
          "Error al Guardar",
          "La imagen excede el tamaño permitido: 100KB"
        );
      }
    },
    async saveImage() {
      this.dlg_image = false;
      this.loading = true;
      this.loading_msg = "Guardando Imagen";
      this.material.id = this.material._id.$oid;
      try {
        await updateMaterialImage(this.material);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    }
  },
  components: {
    loading,
    QuizzesEditor,
    CategoriesEditor
  }
};
</script>

<style lang='scss' scoped>
.types {
  display: flex;
  justify-content: center;
}

.image {
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  &__menu {
    padding: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: flex-end;
  }
  &__input {
    flex-grow: 1;
    overflow-y: auto;
  }
  img {
    width: 100%;
  }
}
</style>