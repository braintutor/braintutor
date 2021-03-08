<template>
  <div>
    
    <ListAsStudent :childId="$route.params.childId" type="EVALUATION" :permissions="permissions"></ListAsStudent>
  </div>
</template>

<script>
import ListAsStudent from "@/components/StudentSession/Evaluations/List";

export default {
  components: { ListAsStudent },
  data: () => ({
    permissions: ["see"],
  }),
};
</script>

<style></style>
