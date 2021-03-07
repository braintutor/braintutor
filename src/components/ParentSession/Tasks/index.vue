<template>
  <ListAsStudent :childId="$route.params.childId" type="TASK" :permissions="permissions"></ListAsStudent>
</template>

<script>
import ListAsStudent from "@/components/StudentSession/Evaluations/List";

export default {
  components: { ListAsStudent },
  data: () => ({
    permissions : ["see"]
  }),
};
</script>

<style></style>
