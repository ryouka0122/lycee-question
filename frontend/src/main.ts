import { createApp } from "vue";
import "./style.css";
import App from "@/App.vue";

import router from "@/router";
import vuetify from "@/plugins/vuetify";
import { createPinia } from "pinia";

import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);
app.use(router).use(createPinia()).use(vuetify);

app.component("VueDatePicker", VueDatePicker);

app.mount("#app");
