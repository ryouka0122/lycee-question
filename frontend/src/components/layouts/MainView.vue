<script setup lang="ts">
defineOptions({
  name: "MainView"
})
</script>
<template>
  <v-main>
    <!-- ヘッダー -->
    <v-app-bar
      elevation="4"
      color="blue lighten-3"
    >
      <v-app-bar-title>
        簡単アンケート
      </v-app-bar-title>
    </v-app-bar>

    <!-- コンテンツ -->
    <router-view></router-view>

  </v-main>
</template>
<style scoped>

</style>
