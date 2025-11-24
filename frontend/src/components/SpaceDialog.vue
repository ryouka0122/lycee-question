<template>
  <div class="sd__main">
    <div class="sd__container">
      <div class="sd__body">
        <v-container v-if="questions.length === 0">
          <v-card title="まだ質問がありません">
          </v-card>
        </v-container>

        <v-expansion-panels>
          <template v-if="isOwner">
            <question-result-cell
              v-for="(question, index) in questions"
              :key="question.id"
              :title="(index+1) +'つ目の質問'"
              :question="question"
              :history="history[question.id] || {}"
            ></question-result-cell>
            <question-register-cell
              ref="registerCell"
              v-model="registerExpanded"
              @register="onRegister"
            ></question-register-cell>
          </template>
          <template v-else>
            <question-cell
              v-for="(question, index) in questions"
              :key="question.id"
              :title="(index+1) +'つ目の質問'"
              :question="question"
              :history="history[question.id]"
              @send="onSubmit"
            ></question-cell>
          </template>
        </v-expansion-panels>
      </div>
      <div class="sd__footer">
        <v-container>
          <v-row>
            <v-btn
              v-if="isOwner"
              variant="text"
              color="red"
              prepend-icon="mdi-qrcode"
              @click="onClickQr"
            >
             QRコード
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="green"
              prepend-icon="mdi-reload"
              style="margin-right: 20px"
              @click="onClickReload"
            >
              再読み込み
            </v-btn>
            <v-btn
              variant="text"
              color="blue"
              prepend-icon="mdi-door"
              @click="onLeaveSpace"
            >
              退室
            </v-btn>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QUESTION_TYPE } from '@/constants'
import { getUserId } from '@/utils'
import { SpaceClient } from '@/clients/api/SpaceClient'
import { QuestionClient } from '@/clients/api/QuestionClient'
import { QuestionEntity } from '@/entity/QuestionEntity'
import { AnswerClient } from '@/clients/api/AnswerClient'
import QuestionCell from '@/components/QuestionCell.vue'
import QuestionRegisterCell from '@/components/QuestionRegisterCell.vue'
import QuestionResultCell from '@/components/QuestionResultCell.vue'
import QrcodeDialog from '@/components/QrcodeDialog.vue'
import LyceeMessageDialog from '@/components/common/LyceeMessageDialog.vue'
import {AppConfig} from "@/config/env";
import {inject, onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue";


defineOptions({
  name: "SpaceDialog"
})

const showDialog = inject("showDialog")

const emit = defineEmits(["close", "update-icon"])

const props = defineProps<{
  spaceId: string
}>()

/* ユーザ情報 */
const userId = ref<string>("")

/* スペース情報 */
const space = ref<object|null>(null)

/* 質問 */
const questions = ref<QuestionEntity[]>([])
const history = ref<object>([])

/* 登録パネル */
const isOwner = ref(false)
const registerExpanded = ref(false)

/* クライアント */
let spaceClient!: SpaceClient
let questionClient!: QuestionClient
let answerClient!: AnswerClient

/* SSE */
let eventSource! : EventSource
type ConnectionStatus = "disconnected" | "connecting" | "connected"
const connectionStatus = ref<ConnectionStatus>("disconnected")

watch(connectionStatus, () => {
  updateConnectionIcon()
})

onMounted(() => {
  updateConnectionIcon()

  getUserId().then((it: string) => {
    // 各種設定の初期化
    userId.value = it
    spaceClient = new SpaceClient(userId.value)
    questionClient = new SpaceClient(userId.value, props.spaceId)
    answerClient = new SpaceClient(userId.value, props.spaceId)

    reloadSpaceInfo()

    // タブが閉じる時の処理登録
    window.addEventListener("beforeunload", leaveSpace)

    // SSE設定
    eventSource = new EventSource(
      `${AppConfig.sseBaseUrl}/connect/${props.spaceId}?userId=${userId.value}`
    );
    connectionStatus.value = "connecting"

    eventSource.onopen = () => {
      connectionStatus.value = "connected"
    }
    eventSource.onerror = (e) => {
      connectionStatus.value = "disconnected"
      console.error(e)
    }

    eventSource.addEventListener("answer-added", () => {
      reloadQuestions()
    })

    eventSource.addEventListener("question-added", () => {
      reloadQuestions()
    })
  })
})
onUnmounted(() => {
  window.removeEventListener("beforeunload", leaveSpace)
  leaveSpace()
})

/**
 * 再読み込み
 */
function reloadSpaceInfo() {
  spaceClient.readOne(props.spaceId).then(result => {
    if (result.status !== 200) {
      return
    }
    space.value = result.data
    isOwner.value = (userId.value === space.value!.ownerId)

    reloadQuestions()
  })
}

/**
 * 退出処理
 */
function onLeave() {
  leaveSpace()
  emit("close")
}

/**
 * 送信処理
 */
function onSubmit(data) {
  answerClient.answer({
    questionId: data.questionId,
    answers: data.answers
  }).then(() => {
    reloadQuestions()
  })
}


const registerCell = useTemplateRef("registerCell")
/**
 * 質問の新規登録ボタン
 */
function onRegister(data) {
  const endDate = new Date()

  // TODO 回答期限の設定項目を追加する
  endDate.setHours(endDate.getHours() + 6)

  questionClient.create({
    type: QUESTION_TYPE.SINGLE,
    endDate: endDate,
    ...data
  }).then(result => {
    if(result.status !== 201) {
      return
    }

    registerExpanded.value = false

    reloadQuestions()
    registerCell.reset()
  })
}

/**
 * 再読み込みボタン
 */
function onClickReload() {
  reloadQuestions()
}

/**
 * 退室ボタン
 */
function onLeaveSpace() {
  showDialog({
    dialog: LyceeMessageDialog,
    title: "確認",
    persistent: true,
    props: {
      message: `スペース「${space.value!.name}」から退出しますか？`,
      buttons: [
        {text: "Cancel", color: "red", variant: "text"},
        {text: "OK", color: "blue", variant: "text"}
      ]
    }
  }).then(result => {
    if (result === "OK") {
      onLeave()
    }
  })
}

function reloadQuestions() {
  const answerPromise = isOwner.value ?
    answerClient.summaryInSpace(props.spaceId) :
    answerClient.readAllInSpace()

  Promise.all([
    questionClient.readAll(),
    answerPromise
  ]).then(resultAll => {
    const [resQuestions, resAnswers] = resultAll
    questions.value = resQuestions.data.questions.map(it => {
      return new QuestionEntity(
        it.questionId,
        it.type,
        it.description,
        it.answers,
        /* isMultiple(仮置き) */it.type === QUESTION_TYPE.MULTIPLE,
        Date.parse(it.endTime)
      )
    })

    const hist: Record<string, any> = {}
    for (const ans of resAnswers.data.history) {
      hist[ans.questionId] = ans.answers
    }
    history.value = hist
  })
}

/**
 * QR表示ボタン
 */
function onClickQr() {
  showDialog({
    dialog: QrcodeDialog,
    title: "スペースのQRコード",
    props: {
      spaceId: props.spaceId,
    }
  })
}

/**
 * スペース退出
 */
function leaveSpace() {
  eventSource?.close()
}

/**
 * アイコン更新
 */
function updateConnectionIcon() {
  const icons = {
    disconnected: {color: "red", icon: "mdi-link-variant-off"},
    connected: {color: "green", icon: "mdi-link-variant"},
    connecting: {color: "blue", icon: "mdi-connection"}
  } as const

  const icon = icons[connectionStatus.value]

  emit("update-icon", icon)
}

</script>

<style scoped>
.sd__main {
  min-width: 600px;
  height: 450px;
}
.sd__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: lightgray solid thin;
  margin-top: 5px;
  padding-top: 15px;
}
.sd__body {
  flex: 1;
  overflow-y: auto;
}
.sd__footer {
  height: 50px;
  background-color: lightcyan;
}
</style>
