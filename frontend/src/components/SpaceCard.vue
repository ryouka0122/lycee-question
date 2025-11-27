<template>
  <v-container>
    <v-card
      class="room-card"
      :img="entity.img"
      :title="entity.name"
      :subtitle="subtitle"
      :text="entity.description"
      :color="backgroundColor(entity.closeDate)"
    >
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { SpaceEntity } from "@/types/SpaceEntity";
import { formatDate, getCurrentDate } from "@/utils.ts";
import { computed } from "vue";

defineOptions({
  name: "SpaceCard",
});

const props = withDefaults(
  defineProps<{
    entity: SpaceEntity;
    size?: number;
  }>(),
  {
    size: 150,
  },
);

const subtitle = computed(() => {
  if (!props.entity) {
    return "";
  }
  const open = formatDate(props.entity.openedDate, "MM/DD hh:mm");
  const close = formatDate(props.entity.closeDate, "MM/DD hh:mm");
  return `開始日時：${open} / 終了日時：${close}`;
});

function backgroundColor(closeTime: Date) {
  if (getCurrentDate() < closeTime) {
    return "";
  } else {
    return "grey-lighten-2";
  }
}
</script>

<style scoped lang="scss">
.room-card {
  cursor: default;
  -webkit-user-select: none;

  &:hover {
    background-color: lightcyan;
  }
}
</style>
