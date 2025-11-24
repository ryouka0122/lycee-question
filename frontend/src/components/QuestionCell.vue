<template>
  <v-expansion-panel>
    <!-- ヘッダ -->
    <v-expansion-panel-title disable-icon-rotate>
      <!-- タイトルと期限 -->
      <v-row justify="space-between">
        <v-col class="text-left">{{title}} / {{question.isMultiple ? "複数選択" : "単選択"}}</v-col>
        <v-col
class="text-right"
               style="padding-right: 30px"
        >{{ printDeadline(question.closeTime) }}</v-col>
      </v-row>

      <!-- 状態アイコン -->
      <template #actions>
        <v-icon v-bind="questionIcon">
        </v-icon>
      </template>
    </v-expansion-panel-title>

    <!-- ボディ -->
    <v-expansion-panel-text>
      <v-row>
        <!-- 質問文 -->
        <v-col>
          <div style="white-space: pre-line">
            {{question.content}}
          </div>
        </v-col>
      </v-row>
      <v-container>
        <v-row
          v-for="ans in question.answers"
          :key="ans.answerId"
        >
          <v-checkbox
            v-model="selectedIndexes"
            :label="ans.description"
            :value="ans.answerId"
            :disabled="disableSelect"
            :multiple="question.isMultiple"
            hide-details
          ></v-checkbox>
        </v-row>
      </v-container>

      <!-- 送信ボタン -->
      <v-btn
        class="qc--send_button"
        v-bind="buttonState"
        @click="onSend"
      >{{buttonText}}</v-btn>
    </v-expansion-panel-text>

  </v-expansion-panel>
</template>

<script setup lang="ts">
import { QuestionEntity } from '@/entity/QuestionEntity'
import {computed, onMounted, ref} from "vue";
import { formatDate } from "@/utils"

defineOptions({
  name: "QuestionCell",
})

const emit = defineEmits("send")

const props = defineProps<{
  title: string,
  question: QuestionEntity,
  history: number[]|number
}>()

const currentTime = ref(new Date())
const isClosed = ref(true)
const selectedIndexes = ref<number[] | number>([])

const disableSelect = computed(() => {
  return isClosed.value || props.history.length > 0
})

// const optionState = computed(() => {
//   return {
//     disabled: disableSelect.value
//   }
// })

const buttonState = computed(() => {
  return {
    disabled: disableSelect.value,
    variant: "outlined",
    color: disableSelect.value ? "" : "primary"
  }
})

const buttonText = computed(() => {
  return isClosed.value ? "終了" : (props.history.length > 0 ? "回答済み" : "送信")
})

const questionIcon = computed(() => {
  if (isClosed.value) {
    // 期限切れ
    return {
      color:"red",
      icon: "mdi-check-bold"
    }
  } else if (props.history.length > 0) {
    // 期限内回答済み
    return {
      color: "light-blue darken-3",
      icon: "mdi-checkbox-marked-circle-outline"
    }
  } else {
    // 期限内未回答
    return {
      color: "green",
      icon: "mdi-clock-time-three-outline"
    }
  }
})

onMounted(() => {
  isClosed.value = (props.question.closeTime < currentTime.value)

  if (props.history) {
    // TODO selectedIndexesの使い方が気持ち悪い
    if (props.question.isMultiple) {
      selectedIndexes.value = props.history
    } else {
      selectedIndexes.value = props.history[0]
    }
  }
})

function printDeadline(closeTime: Date) {
  if (isClosed.value) {
    return "終了"
  }
  return formatDate(closeTime, "期日：MM/DD hh:mm")
}

function onSend() {
  const answers = selectedIndexes.value.isArray ? selectedIndexes.value : [selectedIndexes.value]
  emit("send", {
    questionId: props.question.id,
    answers
  })
}

</script>

<style scoped>
.answer-area {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.qc--send_button {
  width: 200px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
