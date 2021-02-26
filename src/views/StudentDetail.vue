<template>
  <div>
      <p>Info del hijo: </p>
       <Student v-if="false" :student="student_selected" />
  </div>
</template>

<script>
import Student from "../components/globals/Students/Student";

export default {
    components: { Student }

}
</script>

<style>

</style>