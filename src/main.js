/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
// Composables
import { createApp } from "vue";
import snotify from "vue3-snotify";
import "vue3-snotify/style";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import router from './router/index';



// Plugins
import { registerPlugins } from "@/plugins";


const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);

app.use(snotify);
app.use(router);

registerPlugins(app);

app.mount("#app");
