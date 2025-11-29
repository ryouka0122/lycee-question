<template>
  <v-expansion-panel :model-value="modelValue">
    <!-- ヘッダ -->
    <v-expansion-panel-title disable-icon-rotate>
      <!-- タイトルと期限 -->
      <v-row style="display: flex">
        <v-col>新規登録</v-col>
      </v-row>

      <!-- 状態アイコン -->
      <template #actions>
        <v-icon icon="mdi-text-box-edit-outline"> </v-icon>
      </template>
    </v-expansion-panel-title>

    <!-- ボディ -->
    <v-expansion-panel-text>
      <v-form :model-value="form">
        <v-row>
          <!-- 質問文 -->
          <v-col>
            <div>
              <v-textarea
                v-model="description"
                label="Description"
                density="compact"
                :rules="question.descriptionRule()"
              ></v-textarea>
            </div>
          </v-col>
        </v-row>
        <!-- 回答 -->
        <v-container>
          <v-input :error-message="answerCheckError ?? undefined"> </v-input>
          <v-row v-for="(_, index) in answers" :key="index">
            <v-text-field
              v-model="answers[index]"
              variant="outlined"
              density="compact"
              :label="index + 1 + 'つ目の選択肢'"
            ></v-text-field>
          </v-row>
        </v-container>

        <!-- アクションエリア -->
        <v-container>
          <v-row justify="space-between">
            <vue-date-picker
              v-model="answerEndDate"
              variant="outlined"
              density="compact"
              style="width: 200px"
              placeholder="回答期限"
              :formats="dateFormat"
              :min-date="answerMinDate"
              :max-date="answerMaxDate"
            ></vue-date-picker>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn v-bind="submitProperties" @click="onRegister">登録</v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { question } from "@/rules/common.ts";

const ANSWER_SIZE = 5;

defineOptions({
  name: "QuestionRegisterCell",
});

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  spaceCloseDate: { type: Date, required: true },
});

export type QuestionRegisterPayload = {
  description: string;
  answers: string[];
};
const emit = defineEmits<{
  (e: "register", payload: QuestionRegisterPayload): void;
  (e: "update:modelValue", modelValue: boolean): void;
}>();

const form = ref(false);
const description = ref("");

const answerCheckError = ref<string>("");
const answers = ref<string[]>([]);
const answerEndDate = ref(new Date());
const dateFormat = {
  input: "yyyy/MM/dd HH:mm",
  preview: "yyyy/MM/dd HH:mm",
};

const answerMinDate = ref(new Date());
// 終了時刻の最大値はスペース終了期限の1分前まで
const answerMaxDate = ref(new Date(props.spaceCloseDate.getTime() - 60 * 1000));

const submitProperties = computed(() => {
  const canSubmit =
    !form.value &&
    !!description.value &&
    answers.value.filter((a) => a !== "").length >= 2;
  return {
    flat: true,
    disabled: !canSubmit,
    color: canSubmit ? "primary" : "gary",
  };
});

onMounted(() => {
  reset();
});

function reset() {
  description.value = "";
  answers.value = [];
  for (let i = 0; i < ANSWER_SIZE; i++) {
    answers.value.push("");
  }
}

function onRegister() {
  emit("register", {
    description: description.value,
    answers: answers.value.filter((a) => a !== ""),
  });
}

defineExpose({
  reset,
});
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
.qrc__title {
  width: 100px;
  font-size: 0.5rem;
}
</style>
