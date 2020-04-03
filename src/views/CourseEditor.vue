<template>
  <AppSidebar :links="links">
    <ChatbotsEditor :slot="0" />
    <KnowledgeEditor :slot="1" />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import ChatbotsEditor from "@/components/CourseEditor/ChatbotsEditor";
import KnowledgeEditor from "@/components/CourseEditor/KnowledgeEditor";

export default {
  data: () => ({
    links: [
      {
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQG1Ae3Y51_HRJFfzSZGzhp2ngW0O348sh2qDTiA3jSTzvUNY7G&usqp=CAU",
        text: "Unidades"
      },
      {
        image: require("@/assets/braintutor/icon-knowledge.png"),
        text: "Conocimiento"
      }
    ]
  }),
  components: {
    AppSidebar,
    ChatbotsEditor,
    KnowledgeEditor
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

.create {
  min-height: 160px;
  height: 100%;
  color: #b6b6b6;
  font-weight: lighter;
  font-size: 3rem;
  border: 2px dashed #b6b6b6;
  border-radius: 10px;
  //
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #eee;
  }
}
</style>