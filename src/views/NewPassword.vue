<template>
  <div class="m-container">
    <h2>Cambio de contraseña</h2>
    <p>Hola Arthur</p>
    <v-form>
      <v-text-field type="password" v-model="password" placeholder="Ingrese su nueva contraseña" filled rounded dense></v-text-field>
      <v-text-field type="password" v-model="confirmPassword" placeholder="confirme su nueva contraseña" filled rounded dense></v-text-field>
      <v-btn type="submit" color="primary">Guardar contraseña</v-btn>      
    </v-form>
  </div>
</template>

<script>
export default {
  data(){
    return{
      password: "",
      confirmPassword: ""
    }
  }
};
</script>

<style>
</style>