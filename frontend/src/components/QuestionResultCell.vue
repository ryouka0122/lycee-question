<template>
  <v-expansion-panel>
    <!-- ヘッダ -->
    <v-expansion-panel-title disable-icon-rotate>
      <!-- タイトルと期限 -->
      <v-row justify="space-between">
        <v-col class="text-left"
          >{{ title }} /
          {{ question.isMultiple ? "複数選択" : "単選択" }} (回答数:
          {{ total }})</v-col
        >
        <v-col class="text-right" style="padding-right: 30px">{{
          printDeadline(question.closeTime)
        }}</v-col>
      </v-row>

      <!-- 状態アイコン -->
      <template #actions>
        <v-icon v-bind="questionIcon"> </v-icon>
      </template>
    </v-expansion-panel-title>

    <!-- ボディ -->
    <v-expansion-panel-text>
      <v-row>
        <!-- 質問文 -->
        <v-col>
          <div style="white-space: pre-line">
            {{ question.content }}
          </div>
        </v-col>
      </v-row>
      <v-container>
        <v-row v-for="(ans, index) in question.answers" :key="ans.id">
          <v-col class="answer__desc" :style="gauge(ans.id, index)">
            {{ ans.description + "/" + getCount(ans.id) }}
          </v-col>
        </v-row>
      </v-container>

      <!-- 送信ボタン -->
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type { QuestionEntity } from "@/types/QuestionEntity.ts";
import { computed, onMounted, ref } from "vue";
import { formatDate } from "@/utils.ts";
import { GAUGE_COLOR } from "@/constants.ts";

defineOptions({
  name: "QuestionResultCell",
});

const props = defineProps<{
  title: string;
  question: QuestionEntity;
  history: Record<string, number>;
}>();

const currentTime = ref(new Date());
const isClosed = ref(true);

const questionIcon = computed(() => {
  if (isClosed.value) {
    // 期限切れ
    return {
      color: "red",
      icon: "mdi-check-bold",
    };
  } else if (Object.keys(props.history).length > 0) {
    // 期限内回答済み
    return {
      color: "light-blue darken-3",
      icon: "mdi-checkbox-marked-circle-outline",
    };
  } else {
    // 期限内未回答
    return {
      color: "green",
      icon: "mdi-clock-time-three-outline",
    };
  }
});

const total = computed(() => {
  if (!props.history) return 0;
  let total = 0;
  for (const key of Object.keys(props.history)) {
    total += props.history[key] ?? 0;
  }
  return total;
});

onMounted(() => {
  isClosed.value =
    props.question.closeTime.getTime() < currentTime.value.getTime();
});

function getCount(answerId: string) {
  if (!props.history) return 0;
  return props.history[answerId] || 0;
}

function gauge(answerId: string, index: number) {
  const rate = (100 * getCount(answerId)) / total.value;
  const color = GAUGE_COLOR[index % GAUGE_COLOR.length];

  console.log("gauge::", answerId, index, color, rate);

  return {
    background: `linear-gradient(
          90deg,
          ${color} 0%, ${color} calc(${rate}%),
          lightgray calc(${rate}%),lightgray 100%
        )`,
  };
}

function printDeadline(closeTime: Date) {
  if (isClosed.value) {
    return "終了";
  }
  return formatDate(closeTime, "期日：MM/DD hh:mm");
}
</script>

<style scoped>
.answer__desc {
  margin: 3px;
}
</style>
