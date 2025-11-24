
<script setup lang="ts">
import {computed, ref} from "vue";

defineOptions({
  name: "LyceeModalDialog",
})

const emit = defineEmits(["close", "update:show"])

const props = defineProps({
  show: { type: Boolean, required: true },
  fullScreen: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  title: { type: String, default: ""},
  iconUse: { type: Boolean, default: false }
})

type DialogIconInfo = {
  color: string,
  icon: string
}

const iconData = ref<DialogIconInfo>({
  color: "gray",
  icon: "mdi-exclamation-thick"
})

const icon = computed(() => {
  return iconData
})

function close(result: object) {
  if (props.show) {
    emit("update:show", false)
  }
  emit("close", result)
}

function onClickOutside() {
  if (props.persistent) return
  close({})
}

function onUpdateIcon(value: DialogIconInfo) {
  iconData.value.color = value.color
  iconData.value.icon = value.icon
}

</script>
<template>
  <v-dialog
    :model-value="show"
    :full-screen="fullScreen"
    :persistent="persistent"
    width="unset"
    @click:outside="onClickOutside"
  >
    <div class="lmd__content">
      <!-- ヘッダー -->
      <header v-if="title" class="lmd__content-title">
        <v-container v-if="iconUse">
          <v-row>
            {{title}}
            <v-spacer></v-spacer>
            <v-icon v-bind="icon"></v-icon>
          </v-row>
        </v-container>
        <v-container v-else>
          {{title}}
        </v-container>
      </header>

      <!-- ボディ -->
      <main>
        <slot
          :on-close="close"
          :on-update-icon="onUpdateIcon"
        ></slot>
      </main>
    </div>
  </v-dialog>
</template>
<style scoped>
.lmd__content {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  min-width: 200px;
  min-height: 150px;
}

.lmd__content-title {
  font-size: 1.3rem;
  padding: 10px;
}

</style>
