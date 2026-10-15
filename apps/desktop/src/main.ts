import { createApp } from "vue";
import { isTauri } from "@tauri-apps/api/core";
import App from "./app/App.vue";
import { gatewayKey } from "./app/gateway";
import { createTauriGateway } from "./infrastructure/tauri-gateway";
import { createDemoGateway } from "./infrastructure/demo-gateway";
import "./shared/styles.css";

// Composition root: features never choose or import a concrete transport.
const app = createApp(App);
app.provide(gatewayKey, isTauri() ? createTauriGateway() : createDemoGateway());
app.mount("#app");
