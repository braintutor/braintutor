<template>
  <aside>
    <nav>
      <ul>
        <li v-for="(item, idx) in items" :key="idx">
          <m-btn @click="item.action()" color="light" block text :rounded="false">{{item.title}}</m-btn>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  props: ["items"],
};
</script>

<style lang='scss' scoped>
aside {
  min-width: 180px;
  height: 100vh;
  background: #0070c4;
  nav {
    padding: 4px 8px;
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        button {
          margin: 4px 0;
        }
      }
    }
  }
}
</style>