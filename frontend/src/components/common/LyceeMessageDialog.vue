<script setup lang="ts">
defineOptions({
  name: "LyceeMessageDialog",
})

const emit = defineEmits(["close"])

type ButtonParam = {
  id: string
  text: string
  color: string
  variant:  "elevated" | "flat" | "outlined" | "plain" | "text" | "tonal" | undefined
  click: (target: string) => boolean
}

defineProps<{
  message: string,
  buttons: ButtonParam[]
}>();

function onButtonClick(target: ButtonParam, e: MouseEvent) {
  const callback = target.click || function () {return true}
  const message = target.id || target.text
  const isCanceled = !callback(message)

  if (isCanceled) {
    e.preventDefault()
  } else {
    emit("close", message)
  }
}
</script>
<template>
  <div class="dialog__content">
    <!-- メッセージ領域 -->
    <div class="dialog__message">
      {{message}}
    </div>
    <!-- アクション領域 -->
    <div class="dialog__actions">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            v-for="(button, index) in buttons"
            :key="index"
            class="dialog__button"
            :variant="button.variant"
            :color="button.color"
            @click="onButtonClick(button, $event)"
          >
            {{button.text}}
          </v-btn>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<style scoped>
.dialog__content {
  padding: 15px;
}
.dialog__message {
  margin-top: 15px;
  margin-bottom: 15px;
}
.dialog__actions {
  border-top: lightgray solid thin;
  margin-top: 5px;
  padding-top: 15px;
}
.dialog__button {
  margin-left: 10px;
}

</style>
