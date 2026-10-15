<script setup lang="ts">
import { ref } from "vue";
import { NButton, NTag } from "naive-ui";
import {
  Sparkles,
  Monitor,
  Clock3,
  CircleHelp,
  ArrowRight,
  RefreshCw,
} from "@lucide/vue";
const analyzed = ref(false);
</script>
<template>
  <div class="section-heading">
    <div>
      <h1>战斗助手</h1>
      <p>观察当前战况，提供思路。操作由你完成。</p>
    </div>
    <NButton type="primary" @click="analyzed = true"
      ><template #icon><Sparkles :size="16" /></template
      >{{ analyzed ? "重新查看建议示例" : "查看分析示例" }}</NButton
    >
  </div>
  <div class="battle-layout">
    <section class="surface">
      <div class="panel-title">
        <b>当前画面</b><NTag :bordered="false" size="small">未连接游戏</NTag>
      </div>
      <div class="screen-placeholder battle-screen">
        <Monitor :size="48" :stroke-width="1" />
        <h3>等待战斗画面</h3>
        <p>连接设备后，在游戏战斗页面发起分析。</p>
      </div>
      <div class="snapshot-meta">
        <Clock3 :size="14" />尚无实际截图<span>每次分析绑定一张截图</span>
      </div>
      <div class="battle-stats">
        <div><span>波次</span><b>— / —</b></div>
        <div><span>回合</span><b>—</b></div>
        <div><span>敌方状态</span><b>未知</b></div>
      </div>
    </section>
    <section class="surface advice-panel">
      <div class="panel-title">
        <span class="inline-row"><Sparkles :size="17" /><b>战况建议</b></span
        ><span class="muted">Agent 未接入</span>
      </div>
      <template v-if="!analyzed"
        ><div class="empty-state tall">
          <span class="empty-icon"><Sparkles :size="28" /></span>
          <h3>把更多精力留给判断</h3>
          <p>这里会显示建议步骤、判断依据<br />以及仍然未知的信息。</p>
          <NButton @click="analyzed = true"
            >预览建议布局 <template #icon><ArrowRight :size="15" /></template
          ></NButton></div
      ></template>
      <div v-else class="advice-content">
        <NTag type="warning" size="small" :bordered="false"
          >布局示例 · 非实际战术建议</NTag
        >
        <div
          v-for="(item, i) in [
            '确认当前出战成员与敌方状态',
            '查看可用技能与宝具充能',
            '根据实际画面决定行动',
          ]"
          :key="item"
          class="advice-step"
        >
          <span>{{ i + 1 }}</span>
          <div>
            <h3>{{ item }}</h3>
            <p>实际建议将在接入 Agent 后生成，并附带对应截图与判断依据。</p>
          </div>
        </div>
        <div class="unknown-box">
          <CircleHelp :size="17" />
          <div>
            <b>尚未确定的信息</b>
            <p>敌方血量、己方技能与指令卡均未读取。</p>
          </div>
        </div>
        <NButton quaternary @click="analyzed = false"
          ><template #icon><RefreshCw :size="14" /></template
          >返回等待状态</NButton
        >
      </div>
    </section>
  </div>
</template>
