import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Notifications from '@kyvg/vue3-notification'
import 'animate.css';


createApp(App).use(store).use(router).use(Notifications).mount("#app");
import "bootstrap/dist/js/bootstrap.js"
