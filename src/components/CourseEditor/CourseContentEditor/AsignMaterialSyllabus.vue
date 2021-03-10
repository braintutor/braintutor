<template>
  <div>
    <div class="m-card">
      <div class="m-card__body">
        <div class="close-modal">
          <h3>Escojer material</h3>
          <v-btn class="mx-2" icon small @click="close">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <div class="">
          
         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ["course", "unit"],

    methods:{

        close(){
            this.$emit("close")
        }
    }
};
</script>

<style></style>
