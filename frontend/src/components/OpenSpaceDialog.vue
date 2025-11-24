<template>
  <div class="osd__content">
    <v-file-input
      ref="fileInput"
      v-model="selectedFile"
      style="display: none"
      @click="(e) => (e.target.value = '')"
    ></v-file-input>
    <!--    <v-img
      width="200"
      height="200"
      class="bg-grey-lighten-1"
      :src="imagePath"
      @click="onClickSelectImage"
      v-if="useImage"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <v-icon
            large
            color="grey"
            class="align-center"
          >
            mdi-camera
          </v-icon>
        </v-row>
      </template>
    </v-img>
    -->
    <v-text-field
      v-model="spaceName"
      style="padding-top: 10px"
      label="スペース名"
      variant="outlined"
    >
    </v-text-field>

    <div>スペースの有効期限は3日間です</div>

    <div class="osd__actions">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            style="margin-right: 10px"
            variant="outlined"
            color="red"
            @click="onClickClose"
            >閉じる</v-btn
          >
          <v-btn color="blue" @click="onClick">新規登録</v-btn>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserId, getCurrentDate } from "@/utils.ts";
import { SpaceClient } from "@/clients/api/SpaceClient.ts";
import { onMounted, ref } from "vue";

defineOptions({
  name: "OpenSpaceDialog",
});

const emit = defineEmits(["close"]);

const spaceName = ref<string | null>(null);
const endTime = ref<Date | null>(null);
const spaceClient = ref<SpaceClient>(null);

onMounted(() => {
  const startTime = new Date();
  endTime.value = new Date(new Date().setTime(startTime.getTime() + 3));

  getUserId().then((userId: string) => {
    spaceClient.value = new SpaceClient(userId);
  });
});

function onClickClose() {
  emit("close", false);
}

function onClick() {
  const closeDate = getCurrentDate();
  closeDate.setDate(closeDate.getDate() + 3);

  spaceClient.value.create(spaceName.value, closeDate).then((result) => {
    if (result.status === 201) {
      emit("close", true);
    } else {
      // TODO エラー処理を作る
    }
  });
}
</script>
<style scoped>
.osd__content {
  width: 300px;
}
.osd__actions {
  border-top: lightgray solid thin;
  margin-top: 5px;
  padding-top: 5px;
}
</style>
