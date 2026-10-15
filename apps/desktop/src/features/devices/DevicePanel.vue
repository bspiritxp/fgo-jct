<script setup lang="ts">
import type { Workspace } from "@fgo/contracts";
defineProps<{ devices: Workspace["devices"] }>();
const labels = {
  ready: "模拟就绪",
  offline: "模拟离线",
  unauthorized: "模拟未授权",
};
</script>
<template>
  <section class="panel">
    <h2>设备与采集</h2>
    <p class="muted">
      下列是演示设备，不代表实际 ADB 连接。首版采集将由玩家手动切页后触发。
    </p>
    <ul class="candidate-list">
      <li v-for="device in devices" :key="device.serial">
        <strong>{{ device.label }}</strong
        ><span>{{ device.serial }}</span
        ><span class="badge">{{ labels[device.status] }}</span>
      </li>
    </ul>
    <p v-if="!devices.length">未发现设备。</p>
  </section>
</template>
