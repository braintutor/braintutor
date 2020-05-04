<template>
  <div>
    <label
      class="input__btn"
      @drop="onDrop($event)"
      @dragover="onDragOver($event)"
    >
      <input type="file" @change="onChange($event)" />
      <span>Arrastre o Presione</span>
    </label>
    <div v-show="src" class="input__img">
      <img :src="src" @load="onLoad($event)" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["image", "callback"],
  data: () => ({
    convert: false,
    src: ""
  }),
  mounted() {
    this.src = this.image;
  },
  methods: {
    // Local File
    onChange(event) {
      let file = event.target.files[0];
      if (file) {
        this.convert = true;
        this.src = URL.createObjectURL(file);
      }
    },
    // Drag and Drop
    onDrop(event) {
      event.preventDefault();
      let { dataTransfer } = event;
      let imageUrl = dataTransfer.getData("text/html");
      let imageFile = dataTransfer.files[0];

      if (imageUrl) {
        let rex = /src="?([^"\s]+)"?\s*/;
        let url = rex.exec(imageUrl);
        this.src = url[1];
        this.callback(this.src);
      } else if (imageFile) {
        this.convert = true;
        this.src = URL.createObjectURL(imageFile);
      }
    },
    onDragOver(event) {
      event.preventDefault();
    },
    // Convert to Base 64 onload
    onLoad(event) {
      if (this.convert) {
        this.convert = false;
        this.src = this.getBase64Image(event.target);
        this.callback(this.src);
      }
    },
    getBase64Image(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let { width, height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    }
  }
};
</script>

<style lang='scss' scoped>
.input__btn {
  display: block;
  padding: 20px;
  text-align: center;
  color: #555;
  border: 1px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
}
input {
  display: none;
}
.input__img {
  max-width: 600px;
  margin: 5px auto;
  border-radius: 10px;
}
img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  border-radius: 10px;
}
</style>