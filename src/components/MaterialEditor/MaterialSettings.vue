<template>
  <div>
    <loading :active="loading" :message="loading_msg" />

    <h1 class="m-title">Configuración</h1>
    <section class="form m-card">
      <section class="form__body m-card__body">
        <!-- Name -->
        <strong class="mt-1">Nombre:</strong>
        <v-text-field
          v-if="show_edit"
          style="font-size: .9rem"
          v-model="material_aux.name"
          :maxlength="MaterialModel.name.max_length"
          :counter="MaterialModel.name.max_length"
          hide-details
          dense
        ></v-text-field>
        <span class="mt-1" v-else>{{material.name}}</span>
        <!-- Description -->
        <!-- <strong class="mt-1">Descripción:</strong>
        <v-textarea
          v-if="show_edit"
          style="font-size: .95rem"
          v-model="material_aux.description"
          hide-details
          dense
          auto-grow
          rows="1"
        ></v-textarea>
        <span
          v-else
          class="mt-1"
          style="word-break: break-word; white-space: pre-wrap"
        >{{material.description}}</span>-->
      </section>
      <!-- Actions -->
      <div class="form__actions m-card__actions">
        <v-btn v-if="show_edit" @click="show_edit = false" small text outlined rounded>
          <v-icon class="mr-2" small>mdi-close</v-icon>Cancelar
        </v-btn>
        <v-btn v-if="show_edit" @click="save()" class="ml-2" small text outlined rounded>
          <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
        </v-btn>
        <v-btn v-else @click="showEdit()" small text outlined rounded>
          <v-icon class="mr-2" small>mdi-pencil</v-icon>Editar
        </v-btn>
      </div>
    </section>

    <!-- Image -->
    <!-- <div class="form m-card py-2 px-3 mt-3">
      <section class="form__body">
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
    </div>-->

    <!-- Actions -->
    <div class="options my-4">
      <m-btn @click="dlg_remove = true" color="error" small>Eliminar Material</m-btn>
    </div>

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
          <v-btn @click="dlg_url = false; saveImage()" color="primary" depressed small>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dlg remove -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">Si elimina este contenido, no podrá revertir los cambios.</p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small class="mr-2">Cancelar</m-btn>
          <m-btn @click="dlg_remove = false; removeMaterial()" color="error" small>Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { redirect } from "@/services/router.js";
import {
  updateMaterial,
  updateMaterialImage,
  removeMaterial,
} from "@/services/materialService";

import MaterialModel from "@/models/Material";

export default {
  props: ["material", "course"],
  data: () => ({
    material_aux: {},
    image_file: null,
    image_url: "",
    dlg_url: false,
    show_edit: false,
    //
    loading: false,
    loading_msg: "",
    dlg_remove: false,
    MaterialModel,
  }),
  methods: {
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando";

      let material_id = this.material._id.$oid;
      let { name /*, description*/ } = this.material_aux;
      try {
        await updateMaterial(material_id, name /*, description*/);
        this.material.name = name;
        // this.material.description = description;
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
      this.loading = true;
      this.loading_msg = "Subiendo Archivo";

      var data = new FormData();
      data.append("file", this.image_file);
      data.append("material_id", this.material._id.$oid);

      try {
        let res = await fetch(
          "https://braintutor-service-v2.herokuapp.com/uploadMaterialImage",
          {
            // let res = await fetch("http://localhost:5000/uploadMaterialImage", {
            method: "POST",
            body: data,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 413)
          throw { msg: "El archivo excede el tamaño de 1MB" };
        if (res.status >= 400 && res.status < 600) throw await res.json();

        let { url } = await res.json();
        this.image_url = url;
        await this.saveImage();
      } catch (error) {
        this.$root.$children[0].showMessage(
          "",
          error.msg || "Ha ocurrido un error."
        );
      }

      this.loading = false;
    },
    async removeMaterial() {
      this.loading = true;
      this.loading_msg = "Eliminando";

      let material_id = this.material._id.$oid;
      let course_id = this.course._id.$oid;
      try {
        await removeMaterial(material_id);
        redirect("course-editor", { course_id });
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }

      this.loading = false;
    },
    //
    showEdit() {
      this.material_aux = Object.assign({}, this.material);
      this.show_edit = true;
    },
  },
  components: {
    loading,
  },
};
</script>

<style lang='scss' scoped>
.m-title {
  margin: 0;
  margin-bottom: 8px;
  font-size: 1.6rem;
}

.form {
  &__body {
    font-size: 0.9rem;
    display: grid;
    grid-template-columns: auto 1fr;
    row-gap: 6px;
    column-gap: 16px;
    align-items: flex-start;
  }
}

.image {
  display: block;
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
  border-radius: 8px;
}

.options {
  display: flex;
  justify-content: center;
}
</style>