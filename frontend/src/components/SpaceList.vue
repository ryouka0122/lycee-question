<template>
  <div class="text-center">
    <v-list>
      <v-list-item v-for="s in spaceList" :key="s.id">
        <space-card :entity="s" @click.stop="showSpaceDialog(s)"></space-card>
      </v-list-item>

      <v-list-item>
        <v-container>
          <v-card title="スペースの新規追加" @click="showOpenSpaceDialog">
          </v-card>
        </v-container>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import SpaceCard from "@/components/SpaceCard.vue";
import { SpaceEntity } from "@/types/SpaceEntity";
import OpenSpaceDialog from "@/components/OpenSpaceDialog.vue";
import SpaceDialog from "@/components/SpaceDialog.vue";
import { SpaceClient } from "@/clients/api/SpaceClient.ts";
import { getUserId, showErrorMessage } from "@/utils.ts";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import LyceeMessageDialog from "@/components/common/LyceeMessageDialog.vue";
import type { UserId } from "@/types/common.ts";
import type { ShowDialogType } from "@/App.vue";

defineOptions({
  name: "SpaceList",
});

const showDialog = inject<ShowDialogType>("showDialog")!;

const spaceList = ref<SpaceEntity[]>([]);

let spaceClient!: SpaceClient;

onMounted(() => {
  getUserId().then((id: UserId) => {
    initialize(id);
  });
});

async function initialize(userId: UserId) {
  spaceClient = new SpaceClient(userId);
  await reloadSpaceList();
  await joinSpace();
}

async function reloadSpaceList() {
  spaceClient.readAll().then((result) => {
    if (!result.ok) {
      showErrorMessage(result);
      return;
    }
    spaceList.value = result.data;
  });
}

const route = useRoute();

/**
 * スペースに参加
 */
async function joinSpace() {
  const spaceId = route.query.key;
  if (!spaceId || typeof spaceId !== "string") return;

  if (spaceList.value.some((s) => s.id === spaceId)) {
    // 参加済みの場合は何もしない
    return;
  }

  // 参加処理
  const result = await spaceClient.join(spaceId);
  if (!result.ok) {
    showErrorMessage(result);
    return;
  }

  if (result.data === "AlreadyJoined") {
    return;
  }

  let message!: string;
  switch (result.data) {
    case "Joined":
      message = "スペースに参加できるようになりました";
      break;
    case "Closed":
    default:
      message = "エラーが発生しました";
  }

  showDialog({
    dialog: LyceeMessageDialog,
    props: {
      message,
    },
  }).then((selected) => {
    if (result.data === "Joined" && selected === "OK") {
      reloadSpaceList();
    }
  });
}

/**
 * スペースの新規作成
 */
function showOpenSpaceDialog() {
  showDialog({
    dialog: OpenSpaceDialog,
    title: "スペースの新規作成",
  }).then(() => {
    // 新規作成後は再読み込み
    reloadSpaceList();
  });
}

function showSpaceDialog(space: SpaceEntity) {
  showDialog({
    dialog: SpaceDialog,
    persistent: true,
    title: space.name,
    iconUse: true,
    props: {
      spaceId: space.id,
    },
  });
}
</script>

<style scoped></style>
