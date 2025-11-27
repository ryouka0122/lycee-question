<template>
  <div class="qrcode__dialog">
    <div style="text-align: center">
      <QRCodeVue3 :value="qrCodeUrl"></QRCodeVue3>
    </div>
    <v-container>
      <v-row justify="center">
        <v-btn @click="onClickCopy">クリップボードにURLをコピー</v-btn>
      </v-row>
    </v-container>

    <div class="qd__footer">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn variant="text" color="blue" @click="onClickClose">
            閉じる
          </v-btn>
        </v-row>
      </v-container>
    </div>

    <!-- スナックバー -->
    <v-snackbar v-model="showSnackbar" timeout="1500">
      {{ copyText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import QRCodeVue3 from "qrcode-vue3";
import { computed, ref } from "vue";

defineOptions({
  name: "QrcodeDialog",
});

const emit = defineEmits(["close"]);

const { spaceId } = defineProps({
  spaceId: { type: String, require: true, default: "" },
});

const showSnackbar = ref(false);
const copyText = ref("");

const qrCodeUrl = computed(() => {
  const url = new URL(window.location.href);
  return `${url.origin}/?key=${spaceId}`;
});

function onClickClose() {
  emit("close");
}

function onClickCopy() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(qrCodeUrl.value);
    copyText.value = "コピーしました";
  } else {
    copyText.value = "コピーできませんでした";
  }

  showSnackbar.value = true;
}
</script>

<style scoped>
.qrcode__dialog {
  min-width: 300px;
}
.qd__footer {
  padding-top: 20px;
}
</style>
