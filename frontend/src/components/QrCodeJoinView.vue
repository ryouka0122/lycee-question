<template>
  <div style="text-align: center; margin-top: 50px">
    <div>参加手続き中......</div>
    <div v-if="isError">手続きに失敗しました... 再度やり直してください</div>
    <div v-if="isComplete">
      スペースに参加できるようになりました<br />
      <a href="/">ホーム画面</a>からスペースを選択してください<br />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserId } from "@/utils.ts";
import { SpaceClient } from "@/clients/api/SpaceClient.ts";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "QrCodeJoinView",
});

const route = useRoute();

const userId = ref<string | null>(null);
const isError = ref(false);
const isComplete = ref(false);

const spaceClient = ref<SpaceClient | null>(null);

onMounted(() => {
  getUserId().then((id: string) => {
    userId.value = id;
    spaceClient.value = new SpaceClient(userId.value);

    if (route.query.key) {
      spaceClient.value.join(route.query.key).then((result) => {
        if (result.status !== 200) {
          isError.value = true;
        } else {
          isComplete.value = true;
        }
      });
    } else {
      isError.value = true;
    }
  });
});
</script>

<style scoped></style>
