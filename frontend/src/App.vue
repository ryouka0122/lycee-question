<script setup lang="ts">
import LyceeModalDialog from "@/components/common/dialog/LyceeModalDialog.vue";

import { type Component, markRaw, provide, ref } from "vue";

type DialogProperty = {
  title?: string;
  persistent?: boolean;
  fullScreen?: boolean;
  iconUse?: boolean;
  props?: object;
  show?: boolean;
  onClose?: (v: unknown | PromiseLike<unknown>) => void;
  dialog: Component;
};

const dialogStack = ref<DialogProperty[]>([]);

export type ShowDialogType = (comp: DialogProperty) => Promise<unknown>;
const showDialog: ShowDialogType = (comp: DialogProperty) => {
  // フォーカスが当たっていたら外す
  (document.activeElement as HTMLElement)?.blur?.();

  // ダイアログ表示処理
  return new Promise<unknown>((resolve) => {
    comp.show = true;
    comp.onClose = resolve;
    comp.dialog = markRaw(comp.dialog);
    dialogStack.value.push(comp);
  });
};

function closeDialog(index: number, event: unknown) {
  const [deleted] = dialogStack.value.splice(index, 1);
  if (deleted?.onClose) {
    deleted.onClose(event);
  }
}

provide("showDialog", showDialog);
</script>

<template>
  <v-app>
    <router-view></router-view>

    <template v-for="(dialog, index) in dialogStack" :key="dialog.title">
      <lycee-modal-dialog
        :show="dialog.show ?? true"
        :title="dialog.title"
        :persistent="dialog.persistent"
        :full-screen="dialog.fullScreen"
        :icon-use="dialog.iconUse"
        @close="closeDialog(index, $event)"
      >
        <template #default="{ onClose, onUpdateIcon }">
          <component
            :is="dialog.dialog"
            v-bind="dialog.props"
            @close="onClose"
            @update-icon="onUpdateIcon"
          ></component>
        </template>
      </lycee-modal-dialog>
    </template>
  </v-app>
</template>

<style scoped></style>
