<template>
  <div class="sd__main">
    <div class="sd__container">
      <div class="sd__body">
        <v-container v-if="questions.length === 0">
          <v-card title="まだ質問がありません"> </v-card>
        </v-container>

        <v-expansion-panels>
          <template v-if="isOwner">
            <question-result-cell
              v-for="(question, index) in questions"
              :key="question.id"
              :title="index + 1 + 'つ目の質問'"
              :question="question"
              :history="ownerHistory[question.id] || {}"
            ></question-result-cell>
            <question-register-cell
              ref="registerCell"
              v-model="registerExpanded"
              :space-close-date="space?.closeDate"
              @register="onRegister"
            ></question-register-cell>
          </template>
          <template v-else>
            <question-cell
              v-for="(question, index) in questions"
              :key="question.id"
              :title="index + 1 + 'つ目の質問'"
              :question="question"
              :history="history[question.id]"
              @submit="onSubmit"
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
import { QUESTION_TYPE } from "@/constants.ts";
import { getUserId, showErrorMessage } from "@/utils.ts";
import { SpaceClient } from "@/clients/api/SpaceClient.ts";
import { QuestionClient } from "@/clients/api/QuestionClient.ts";
import type { QuestionEntity } from "@/types/QuestionEntity.ts";
import { AnswerClient } from "@/clients/api/AnswerClient.ts";
import QuestionCell, {
  type QuestionCellSubmitPayload,
} from "@/components/QuestionCell.vue";
import QuestionRegisterCell, {
  type QuestionRegisterPayload,
} from "@/components/QuestionRegisterCell.vue";
import QuestionResultCell from "@/components/QuestionResultCell.vue";
import QrcodeDialog from "@/components/QrcodeDialog.vue";
import LyceeMessageDialog from "@/components/common/LyceeMessageDialog.vue";
import { AppConfig } from "@/config/env";
import {
  inject,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import type { SpaceEntity } from "@/types/SpaceEntity.ts";
import type { AnswerId, QuestionId, Result } from "@/types/common.ts";
import type { ShowDialogType } from "@/App.vue";
import type { DialogIconInfo } from "@/components/common/dialog/LyceeModalDialog.vue";

defineOptions({
  name: "SpaceDialog",
});

const showDialog = inject<ShowDialogType>("showDialog")!;

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update-icon", icon: DialogIconInfo): void;
}>();

const props = defineProps<{
  spaceId: string;
}>();

/* ユーザ情報 */
const userId = ref<string>("");

/* スペース情報 */
const space = ref<SpaceEntity | null>(null);

/* 質問 */
const questions = ref<QuestionEntity[]>([]);

type AnswerHistoryType = Record<QuestionId, AnswerId[]>;
const history = ref<AnswerHistoryType>({});

type OwnerHistoryType = Record<QuestionId, Record<AnswerId, number>>;
const ownerHistory = ref<OwnerHistoryType>({});

/* 登録パネル */
const isOwner = ref(false);
const registerExpanded = ref(false);

/* クライアント */
let spaceClient!: SpaceClient;
let questionClient!: QuestionClient;
let answerClient!: AnswerClient;

/* SSE */
let eventSource!: EventSource;
type ConnectionStatus = "disconnected" | "connecting" | "connected";
const connectionStatus = ref<ConnectionStatus>("disconnected");

watch(connectionStatus, () => {
  updateConnectionIcon();
});

onMounted(() => {
  updateConnectionIcon();

  getUserId().then((it: string) => {
    // 各種設定の初期化
    userId.value = it;
    spaceClient = new SpaceClient(userId.value);
    questionClient = new QuestionClient(userId.value, props.spaceId);
    answerClient = new AnswerClient(userId.value, props.spaceId);

    reloadSpaceInfo();

    // タブが閉じる時の処理登録
    window.addEventListener("beforeunload", leaveSpace);

    // SSE設定
    eventSource = new EventSource(
      `${AppConfig.sseBaseUrl}/connect/${props.spaceId}?userId=${userId.value}`,
    );
    connectionStatus.value = "connecting";

    eventSource.onopen = () => {
      connectionStatus.value = "connected";
    };
    eventSource.onerror = (e) => {
      connectionStatus.value = "disconnected";
      console.error(e);
    };

    eventSource.addEventListener("answer-added", () => {
      reloadQuestions();
    });

    eventSource.addEventListener("question-added", () => {
      reloadQuestions();
    });
  });
});
onUnmounted(() => {
  window.removeEventListener("beforeunload", leaveSpace);
  leaveSpace();
});

/**
 * 再読み込み
 */
function reloadSpaceInfo() {
  spaceClient.readOne(props.spaceId).then((result: Result<SpaceEntity>) => {
    if (!result.ok) {
      showErrorMessage(result);
      return;
    }
    space.value = result.data;
    isOwner.value = userId.value === result.data.ownerId;

    reloadQuestions();
  });
}

/**
 * 退出処理
 */
function onLeave() {
  leaveSpace();
  emit("close");
}

/**
 * 送信処理
 */
function onSubmit(data: QuestionCellSubmitPayload) {
  answerClient.answer(data.questionId, data.answers).then(() => {
    reloadQuestions();
  });
}

type RegisterCellType = InstanceType<typeof QuestionRegisterCell>;
const registerCell = useTemplateRef<RegisterCellType>("registerCell");
/**
 * 質問の新規登録ボタン
 */
function onRegister(data: QuestionRegisterPayload) {
  const endDate = new Date();

  // TODO 回答期限の設定項目を追加する
  endDate.setHours(endDate.getHours() + 6);

  questionClient
    .create(QUESTION_TYPE.SINGLE, data.description, data.answers, endDate)
    .then((result) => {
      if (!result.ok) {
        return;
      }

      registerExpanded.value = false;

      reloadQuestions();
      registerCell.value?.reset();
    });
}

/**
 * 再読み込みボタン
 */
function onClickReload() {
  reloadQuestions();
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
        { text: "Cancel", color: "red", variant: "text" },
        { text: "OK", color: "blue", variant: "text" },
      ],
    },
  }).then((result) => {
    if (result === "OK") {
      onLeave();
    }
  });
}

function reloadQuestions() {
  questionClient.readAll().then((resQuestions) => {
    if (!resQuestions.ok) {
      showErrorMessage(resQuestions);
      return;
    }

    questions.value = resQuestions.data;

    if (isOwner.value) {
      // 開設者のとき
      answerClient.summaryInSpace(props.spaceId).then((resSummary) => {
        if (!resSummary.ok) {
          showErrorMessage(resSummary);
          return;
        }
        const hist: OwnerHistoryType = {};

        for (const e of resSummary.data) {
          hist[e.questionId] = e.answers;
        }
        ownerHistory.value = hist;
      });
    } else {
      // 回答者のとき
      answerClient.readAllInSpace().then((resAnswer) => {
        if (!resAnswer.ok) {
          showErrorMessage(resAnswer);
          return;
        }

        const hist: Record<QuestionId, AnswerId[]> = {};
        for (const e of resAnswer.data) {
          hist[e.questionId] = e.answers;
        }

        history.value = hist;
      });
    }
  });
}

/*
function reloadQuestions1() {
  const answerPromise = isOwner.value
    ? answerClient.summaryInSpace(props.spaceId)
    : answerClient.readAllInSpace();

  Promise.all([questionClient.readAll(), answerPromise]).then((resultAll) => {
    const [resQuestions, resAnswers] = resultAll;
    if (!resQuestions.ok) {
      showErrorMessage(resQuestions);
      return;
    }
    if (!resAnswers.ok) {
      showErrorMessage(resAnswers);
      return;
    }

    questions.value = resQuestions.data;

    type QuestionHistoryType = AnswerId[] | Record<AnswerId, number>;
    const hist: Record<QuestionId, QuestionHistoryType> = {};
    for (const ans of resAnswers.data) {
      hist[ans.questionId] = ans.answers;
    }
    history.value = hist;
  });
}*/

/**
 * QR表示ボタン
 */
function onClickQr() {
  showDialog({
    dialog: QrcodeDialog,
    title: "スペースのQRコード",
    props: {
      spaceId: props.spaceId,
    },
  });
}

/**
 * スペース退出
 */
function leaveSpace() {
  eventSource?.close();
}

/**
 * アイコン更新
 */
function updateConnectionIcon() {
  const icons = {
    disconnected: { color: "red", icon: "mdi-link-variant-off" },
    connected: { color: "green", icon: "mdi-link-variant" },
    connecting: { color: "blue", icon: "mdi-connection" },
  } as const;

  const icon = icons[connectionStatus.value];

  console.log("update connection icon:", icon);
  emit("update-icon", icon);
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
