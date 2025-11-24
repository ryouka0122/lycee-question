<template>
  <div class="text-center">
    <v-list>
      <v-list-item
        v-for="s in spaceList" :key="s.id"
      >
        <space-card
          :entity="s"
          @click.stop="showSpaceDialog(s)"
        ></space-card>
      </v-list-item>

      <v-list-item>
        <v-container>
          <v-card
title="スペースの新規追加"
            @click="showOpenSpaceDialog">
          </v-card>
        </v-container>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import SpaceCard from '@/components/SpaceCard.vue'
import {SpaceEntity} from '@/entity/SpaceEntity'
import OpenSpaceDialog from '@/components/OpenSpaceDialog.vue'
import SpaceDialog from '@/components/SpaceDialog.vue'
import { SpaceClient } from '@/clients/api/SpaceClient'
import {getUserId} from '@/utils'
import { BackdoorClient } from '@/clients/api/BackdoorClient'
import LyceeMessageDialog from '@/components/common/LyceeMessageDialog.vue'
import {inject, onMounted, ref} from "vue";
import {useRoute} from "vue-router";

defineOptions({
  name: "SpaceList"
})

const showDialog = inject("showDialog")

const spaceList = ref<SpaceEntity[]>([])

let spaceClient!: SpaceClient
let backdoorClient!: BackdoorClient

onMounted(() => {
  getUserId().then((id: string) => {
    initialize(id)
  })
})

async function initialize(userId: string) {
  spaceClient = new SpaceClient(userId)
  backdoorClient = new BackdoorClient(userId)
  await reloadSpaceList()
  await joinSpace()
}

async function reloadSpaceList() {
  const result = await spaceClient.readAll()

  if (result.status !== 200) {
    return
  }
  const list = []
  for (const s of result.data.spaces) {
    list.push(SpaceEntity.from({...s}))
  }
  spaceList.value = list
}

const route = useRoute()

/**
 * スペースに参加
 */
async function joinSpace() {
  const spaceId = route.query.key
  if (!spaceId) return

  if (spaceList.value.some(s => s.spaceId === spaceId)) {
    // 参加済みの場合は何もしない
    return
  }

  // 参加処理
  const result = await spaceClient.join(spaceId)
  if (result.status === 204) return

  let message!: string
  if (result.status === 200) {
    message = "スペースに参加できるようになりました"
  } else {
    message = "エラーが発生しました"
  }

  showDialog({
    dialog: LyceeMessagedialog,
    props: {
      message
    }
  }).then(selected => {
    if (result.status === 200 && selected === "OK") {
      reloadSpaceList()
    }
  })
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
    reloadSpaceList()
  })
}

function showSpaceDialog(space: SpaceEntity) {
  showDialog({
    dialog: SpaceDialog,
    persistent: true,
    title: space.name,
    iconUse: true,
    props: {
      spaceId: space.id
    }
  })
}

</script>

<style scoped>

</style>
