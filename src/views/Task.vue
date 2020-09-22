<template>
  <div class="m-container pa-2">
    <div class="menu pa-0 pb-2">
      <div class="menu-left">
        <v-btn icon @click="redirectSession()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title">Volver</span>
      </div>
    </div>
    <!-- TASK -->
    <TaskCard
      :time_start="task.time_start || new Date()"
      :title="task.title"
      :description="task.description"
      disabled
    />
    <div class="response m-card">
      <div class="response__menu">
        <v-menu offset-y left>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :disabled="answer.data && answer.data.length >= AnswerModel.data.max_length"
              color="success"
              small
              rounded
              depressed
            >
              <v-icon small class="mr-1">mdi-plus</v-icon>Agregar
            </v-btn>
          </template>
          <v-list subheader dense>
            <v-list-item @click="dialog_link = true; link = ''">
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-link</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="mr-3">Añadir Vínculo</v-list-item-title>
            </v-list-item>
            <v-list-item @click="showAll()">
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-google-drive</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="mr-3">Google Drive</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-subheader class="text-center">Crear</v-subheader>
            <v-list-item @click="add(0)">
              <v-list-item-icon class="mr-2" style="display: flex; align-items: center">
                <img
                  style="width: 16px; height: 16px"
                  src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document"
                />
              </v-list-item-icon>
              <v-list-item-title class="mr-3">Documento</v-list-item-title>
            </v-list-item>
            <v-list-item @click="add(1)">
              <v-list-item-icon class="mr-2" style="display: flex; align-items: center">
                <img
                  style="width: 16px; height: 16px"
                  src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.presentation"
                />
              </v-list-item-icon>
              <v-list-item-title class="mr-3">Presentación</v-list-item-title>
            </v-list-item>
            <v-list-item @click="add(2)">
              <v-list-item-icon class="mr-2" style="display: flex; align-items: center">
                <img
                  style="width: 16px; height: 16px"
                  src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet"
                />
              </v-list-item-icon>
              <v-list-item-title class="mr-3">Hoja de Cálculo</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!-- RESPONSE -->
      <div class="response__answer">
        <v-textarea
          class="response__text mb-3"
          v-model="answer.text"
          :maxlength="AnswerModel.text.max_length"
          :counter="AnswerModel.text.max_length"
          rows="1"
          auto-grow
        ></v-textarea>
        <div class="mb-3" v-for="(item, idx) in answer.data" :key="idx">
          <!-- LINK -->
          <div class="link" v-if="item.type === 'link'">
            <a class="link__data" :href="item.url" target="_blank">
              <img class="link__image" :src="item.image" alt />
              <p class="link__title">{{item.title}}</p>
              <p class="link__description">{{item.description}}</p>
            </a>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="ml-1"
                  small
                  icon
                  @click="idx_to_remove = idx; dialog_remove = true;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span style="font-size: .75rem">Remover</span>
            </v-tooltip>
          </div>
          <!-- LINK FILE -->
          <div class="linkFile" v-if="item.type === 'file'">
            <a class="linkFile__data" :href="item.url" target="_blank">
              <img class="linkFile__image" :src="item.image" alt />
              <p class="linkFile__title">{{item.title}}</p>
            </a>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" class="ml-1" small icon @click="update(item, idx)">
                  <v-icon>mdi-sync</v-icon>
                </v-btn>
              </template>
              <span style="font-size: .75rem">Actualizar Nombre</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="ml-1"
                  small
                  icon
                  @click="idx_to_remove = idx; dialog_remove = true;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span style="font-size: .75rem">Remover</span>
            </v-tooltip>
          </div>
        </div>
      </div>
      <div class="response__actions">
        <m-btn color="primary" small @click="save()">
          <v-icon small class="mr-1">mdi-content-save</v-icon>Guardar
        </m-btn>
      </div>
    </div>
    <!-- DIALOG FILES -->
    <v-dialog v-model="dialog_files" max-width="1200" persistent>
      <div class="files m-card">
        <h3 class="files__title">
          Archivos en Google Drive
          <m-btn @click="dialog_files = false" text small>
            <v-icon>mdi-close</v-icon>
          </m-btn>
        </h3>
        <div class="files__search">
          <input type="text" placeholder="Buscar" v-model="file_search" />
        </div>
        <div class="files__body">
          <p class="text-center mt-3 mb-5" v-show="files_filtered.length === 0">Ningún elemento.</p>
          <div class="row no-gutters">
            <div
              class="col-12 col-sm-6 col-md-3 pa-2"
              v-for="(file, idx) in files_filtered"
              :key="idx"
            >
              <div class="m-card file" @click="addFileDrive(file)">
                <img class="file__img" :src="file.iconLink" />
                <p class="file__name">{{file.name}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="files__actions">
          <m-btn @click="dialog_files = false" color="primary" text small>Cancelar</m-btn>
        </div>-->
      </div>
    </v-dialog>
    <!-- DIALOG LINK -->
    <v-dialog v-model="dialog_link" max-width="500" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <v-text-field v-model="link" label="Vínculo"></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_link = false" color="primary" small text>Cerrar</m-btn>
          <m-btn @click="dialog_link = false; addLink()" color="primary" small class="ml-2">Agregar</m-btn>
        </div>
      </div>
    </v-dialog>
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" max-width="280">
      <v-card>
        <v-card-text class="text-center pt-4 pb-3" style="font-size: 1rem">
          <span>¿Desea quitar el enlace?</span>
        </v-card-text>
        <v-card-actions style="width: max-content; margin: 0 auto">
          <v-btn small text @click="dialog_remove = false">Cancelar</v-btn>
          <v-btn color="primary" small @click="dialog_remove = false; remove()" depressed>Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

import { getTaskByStudent, updateTaskAnswer } from "@/services/taskService";
import { getParam, redirect } from "@/services/router.js";

import { AnswerModel, LinkModel } from "@/models/Task";

export default {
  data: () => ({
    task_id: "",
    task: {},
    answer: {},
    files: [],
    file_search: "",
    link: "",
    idx_to_remove: -1,
    //
    dialog_files: false,
    dialog_link: false,
    dialog_remove: false,
    // GOOGLE DRIVE
    client_id:
      "777825196939-qm3a36q1v66f65cn5s627p71da3rgpsq.apps.googleusercontent.com",
    // client_secret: "eqKgUl-Lx4pCs0RcozuUUbPa",
    api_key: "AIzaSyAGFPLGWa0IFKZ7AP2Zk2aZsAi0Xxx7Hr8",
    scope: "https://www.googleapis.com/auth/drive",
    AnswerModel,
  }),
  async created() {
    this.showLoading("Cargando Tarea");
    try {
      this.task_id = getParam("task_id");
      this.task = await getTaskByStudent(this.task_id);

      let { text, data } = this.task.answer;
      this.answer = {
        text: text || "",
        data: data || [],
      };
      this.task.time_start = new Date(this.task.time_start.$date);
    } catch (error) {
      redirect("sessions-student");
    }
    this.hideLoading();
  },
  computed: {
    files_filtered() {
      let files = this.files.filter((f) =>
        f.name.toLowerCase().includes(this.file_search.toLowerCase())
      );
      return files;
    },
  },
  methods: {
    redirectSession() {
      this.$router
        .push(`/session/${this.task.session_id.$oid}/tasks`)
        .catch(() => {});
    },
    async showAll() {
      this.showLoading("Cargando Archivos");
      this.file_search = "";
      this.files = await this.getAll();
      this.dialog_files = true;
      this.hideLoading();
    },
    async addFileDrive({ /*exportLinks*/ id, iconLink, name, webViewLink }) {
      // this.showLoading("Compartiendo Archivo";
      // this.dialog_files = false;
      // await this.createPermission(id, "mitsuoysharag@gmail.com");
      // this.link = webViewLink;
      // await this.addLink();
      // this.hideLoading();

      this.dialog_files = false;
      let data = this.formatLink({
        id,
        type: "file",
        url: webViewLink,
        image: iconLink,
        title: name,
      });
      this.answer.data.push(data);

      await this.save();
    },
    async add(type) {
      let access_token = localStorage.getItem("access_token");
      if (!access_token) {
        this.login();
        return;
      }
      this.showLoading("Creando Archivo");
      let { documentId, presentationId, spreadsheetId } = await this.create(
        type
      );
      let id = documentId || presentationId || spreadsheetId;
      if (id) {
        let { iconLink, name, webViewLink } = await this.get(id);
        // await this.createPermission(id, "mitsuoysharag@gmail.com");
        await this.addFileDrive({ id, iconLink, name, webViewLink });
      }
      this.hideLoading();
    },
    async addLink() {
      this.showLoading("Añadiendo Vínculo");
      try {
        let res = await fetch(
          `${process.env.VUE_APP_API_URL}/getLinkPreview?url=${this.link}`
        );
        if (res.status >= 400 && res.status < 600) throw "Vínculo inválido.";

        let { meta } = await res.json();
        let data = this.formatLink({
          type: "link",
          url: this.link,
          image: meta.image.url,
          title: meta.title,
          description: meta.description,
        });
        this.answer.data.push(data);

        await this.save();
      } catch (error) {
        this.showMessage("Error", error);
      }
      this.link = "";
      this.hideLoading();
    },
    async save() {
      this.showLoading("Guardando Respuesta");
      try {
        await updateTaskAnswer(this.task._id.$oid, this.answer);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    remove() {
      this.answer.data.splice(this.idx_to_remove, 1);
      this.save();
    },
    // GOOGLE DRIVE
    login() {
      let redirect_uri = `${window.location.protocol}//${window.location.host}/sessions-student`;
      let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=${this.scope}&state=${this.task_id}`;
      window.location = url;
    },
    async getAll() {
      let access_token = localStorage.getItem("access_token");
      try {
        let res = await fetch(
          `https://www.googleapis.com/drive/v3/files?fields=*&key=${this.api_key}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/json",
            },
          }
        );
        if (res.status >= 400 && res.status < 600) throw "Token inválido.";
        let { files } = await res.json();
        files = files.filter(
          (f) =>
            !f.trashed && f.mimeType !== "application/vnd.google-apps.folder"
        );
        return files;
      } catch (error) {
        this.login();
      }
    },
    async create(type) {
      let url = [
        "https://docs.googleapis.com/v1/documents",
        "https://slides.googleapis.com/v1/presentations",
        "https://sheets.googleapis.com/v4/spreadsheets",
      ][type];
      let body = [{ title: "Título" }, { title: "Título" }, {}][type];
      let access_token = localStorage.getItem("access_token");
      try {
        let res = await fetch(`${url}?key=${this.api_key}`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (res.status >= 400 && res.status < 600) throw "Token inválido.";
        let data = await res.json();
        return data;
      } catch (error) {
        this.login();
      }
    },
    async createPermission(id, emailAddress) {
      let access_token = localStorage.getItem("access_token");
      try {
        let res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}/permissions?key=${this.api_key}`,
          {
            method: "POST",
            body: JSON.stringify({
              role: "reader",
              type: "user",
              emailAddress,
            }),
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        let data = await res.json();
        return data;
      } catch (error) {
        //
      }
    },
    async get(id) {
      let access_token = localStorage.getItem("access_token");
      try {
        let res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${id}?fields=*&key=${this.api_key}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/json",
            },
          }
        );
        if (res.status >= 400 && res.status < 600) throw "Token inválido.";
        let data = await res.json();
        return data;
      } catch (error) {
        this.login();
      }
    },
    async update({ id }, idx) {
      let access_token = localStorage.getItem("access_token");
      if (!access_token) {
        this.login();
        return;
      }

      this.showLoading("Actualizando Archivo");

      let { name } = await this.get(id);
      this.answer.data[idx].title = name;
      await this.save();

      this.hideLoading();
    },
    //
    formatLink({ type, id, url, title, description, image }) {
      let link = {
        type,
        id,
        url,
        title: title && title.trim().substring(0, LinkModel.title.max_length),
        description:
          description &&
          description.trim().substring(0, LinkModel.description.max_length),
        image:
          image && image.length <= LinkModel.image.max_length ? image : null,
      };
      return link;
    },
  },
  components: {
    TaskCard,
  },
};
</script>

<style lang='scss' scoped>
.response {
  margin: 20px 0;
  padding: 12px;
  &__menu {
    display: flex;
    justify-content: flex-end;
  }
  &__answer {
    margin: 12px 0;
  }
  &__text {
    padding: 10px 12px;
    font-size: 0.9rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

.link {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  //
  display: flex;
  align-items: center;

  &:hover {
    box-shadow: 0 2px 6px #ccc;
  }
  &__data {
    flex-grow: 1;
    color: #494949;
    text-decoration: none;
    //
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 12px;
    row-gap: 6px;
    align-items: center;
  }
  &__image {
    max-width: 80px;
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
  }
  &__title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: bold;
    grid-column-start: 2;
  }
  &__description {
    margin: 0;
    font-size: 0.75rem;
    font-weight: lighter;
    grid-column-start: 2;
  }
}

.linkFile {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  //
  display: flex;
  align-items: center;

  &:hover {
    box-shadow: 0 2px 6px #ccc;
  }

  &__data {
    flex-grow: 1;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  &__image {
    width: 20px;
    height: 20px;
  }
  &__title {
    flex-grow: 1;
    margin: 0;
    color: #3b3b3b;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
  }
}

.files {
  max-height: 75vh !important;
  display: flex;
  flex-direction: column;
  &__title {
    padding: 10px 20px;
    padding-right: 10px;
    font-size: 1.4rem;
    box-shadow: 0 1px 4px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__search {
    padding: 14px 16px;
    input[type="text"] {
      width: 100%;
      padding: 8px 14px;
      font-size: 0.9rem;
      border: 1px solid #ccc;
      border-radius: 20px;
      &:focus {
        outline: none;
      }
    }
  }
  &__body {
    overflow-y: auto;
    padding: 10px;
    padding-top: 0;
  }
  &__actions {
    border-top: 0.5px solid #e7e7e7;
    padding: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
.file {
  padding: 10px;
  transition: all 0.2s;
  cursor: pointer;
  &__img {
    display: block;
    width: 24px;
    margin: 12px auto;
  }
  &__name {
    margin: 0;
    padding-top: 8px;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
  }
  &:hover {
    transform: scale(1.02);
  }
}
</style>