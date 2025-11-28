<template>
  <div class="osd__content">
    <v-form v-model="form">
      <!--
    <v-file-input
      ref="fileInput"
      v-model="selectedFile"
      style="display: none"
      @click="(e: MouseEvent) => (e.target! = '')"
    ></v-file-input>
    <v-img
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
        :rules="space.nameRules()"
      >
      </v-text-field>

      <v-date-input
        v-model="closeDate"
        label="有効期限"
        variant="outlined"
        :rules="space.closeDateRules()"
        :allowed-dates="checkAllowedDates"
      ></v-date-input>
    </v-form>
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
          <v-btn :disabled="!form" color="blue" @click="onClick"
            >新規登録</v-btn
          >
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserId, getCurrentDate } from "@/utils.ts";
import { SpaceClient } from "@/clients/api/SpaceClient.ts";
import { onMounted, ref } from "vue";
import type { UserId } from "@/types/common.ts";
import { space } from "@/rules/common";
import { VDateInput } from "vuetify/labs/VDateInput";
import { SPACE_OPEN_MINIMUM_SPAN } from "@/constants.ts";

defineOptions({
  name: "OpenSpaceDialog",
});

const emit = defineEmits(["close"]);

const currentDate = getCurrentDate();
const allowBaseDate = addDate(currentDate, SPACE_OPEN_MINIMUM_SPAN);

const form = ref(false);
const spaceName = ref("");
const closeDate = ref(allowBaseDate);

let spaceClient!: SpaceClient;

function addDate(base: Date, diff: number): Date {
  const newDate = new Date(base.getTime());
  newDate.setDate(newDate.getDate() + diff);
  return newDate;
}

onMounted(() => {
  getUserId().then((userId: UserId) => {
    spaceClient = new SpaceClient(userId);
  });
});

function onClickClose() {
  emit("close", false);
}

function onClick() {
  spaceClient.create(spaceName.value, closeDate.value).then((result) => {
    if (result.ok) {
      emit("close", true);
    } else {
      // TODO エラー処理を作る
      alert(`${result.message} (${result.errorCode})`);
    }
  });
}

function checkAllowedDates(date: unknown): boolean {
  if (date instanceof Date) {
    return date >= allowBaseDate;
  }
  return false;
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
