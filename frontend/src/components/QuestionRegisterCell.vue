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
      <v-row>
        <!-- 質問文 -->
        <v-col>
          <div>
            <v-textarea
              v-model="description"
              label="Description"
              density="compact"
            ></v-textarea>
          </div>
        </v-col>
      </v-row>
      <!-- 回答 -->
      <v-container>
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
        <v-row>
          <v-text-field
            v-if="0"
            variant="outlined"
            density="compact"
            label="回答期限"
            style="width: 50px"
          ></v-text-field>
          <div class="text-grey">回答期限は登録から6時間です</div>
          <v-spacer></v-spacer>
          <v-btn v-bind="submitProperties" @click="onRegister">登録</v-btn>
        </v-row>
      </v-container>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const ANSWER_SIZE = 5;

defineOptions({
  name: "QuestionRegisterCell",
});

defineProps({
  modelValue: { type: Boolean, default: false },
});

export type QuestionRegisterPayload = {
  description: string;
  answers: string[];
};
const emit = defineEmits<{
  (e: "register", payload: QuestionRegisterPayload): void;
  (e: "update:modelValue", modelValue: boolean): void;
}>();

const description = ref("");
const answers = ref<string[]>([]);

const submitProperties = computed(() => {
  const canSubmit =
    !!description.value && answers.value.filter((a) => a !== "").length >= 2;
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
