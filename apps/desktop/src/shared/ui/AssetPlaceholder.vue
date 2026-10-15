<script setup lang="ts">
import {
  Image,
  Swords,
  Shield,
  Sparkles,
  Crosshair,
  WandSparkles,
} from "@lucide/vue";
withDefaults(
  defineProps<{ kind?: string; accent?: string; compact?: boolean }>(),
  { kind: "素材", accent: "blue", compact: false },
);
const icons: Record<string, typeof Image> = {
  Saber: Swords,
  Shielder: Shield,
  Archer: Crosshair,
  Caster: WandSparkles,
  Lancer: Swords,
  Berserker: Swords,
  Rider: Sparkles,
};
</script>
<template>
  <div class="asset-placeholder" :class="[accent, { compact }]">
    <div class="asset-grid"></div>
    <component
      :is="icons[kind] || Image"
      :size="compact ? 26 : 40"
      :stroke-width="1.1"
    />
    <span class="asset-label">{{ compact ? kind : "等待采集游戏素材" }}</span>
  </div>
</template>
