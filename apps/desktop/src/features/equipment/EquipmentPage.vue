<script setup lang="ts">
import { computed, ref } from "vue";
import { NButton, NInput, NTabs, NTabPane, NModal, useMessage } from "naive-ui";
import { Plus, Search, BookOpen, Shirt } from "@lucide/vue";
import { craftEssences, mysticCodes } from "../../preview/data";
import AssetPlaceholder from "../../shared/ui/AssetPlaceholder.vue";
const tab = ref("craft");
const query = ref("");
const detail = ref("");
const message = useMessage();
const items = computed(() =>
  (tab.value === "craft" ? craftEssences : mysticCodes).filter((e) =>
    e.name.includes(query.value),
  ),
);
</script>
<template>
  <div class="section-heading">
    <div>
      <h1>礼装</h1>
      <p>为从者与御主，准备合适的搭配。</p>
    </div>
    <NButton type="primary" @click="message.info('预览模式：手工录入尚未接入')"
      ><template #icon><Plus :size="16" /></template>添加礼装</NButton
    >
  </div>
  <NTabs v-model:value="tab" type="line" class="page-tabs"
    ><NTabPane name="craft" tab="概念礼装" /><NTabPane
      name="mystic"
      tab="御主礼装"
  /></NTabs>
  <div class="toolbar">
    <NInput
      v-model:value="query"
      clearable
      placeholder="搜索礼装名称"
      class="search-input"
      ><template #prefix><Search :size="16" /></template
    ></NInput>
    <div class="toolbar-spacer"></div>
    <span class="muted">{{ items.length }} 份示例资料</span>
  </div>
  <div class="equipment-grid">
    <button
      v-for="e in items"
      :key="e.name"
      class="equipment-card surface"
      @click="detail = e.name"
    >
      <AssetPlaceholder :kind="e.kind" :accent="e.accent" />
      <div class="equipment-info">
        <span class="eyebrow">{{ e.kind }}</span>
        <h3>{{ e.name }}</h3>
        <div class="detail-row">
          <span>等级</span><b>Lv. {{ e.level }}</b>
        </div>
        <p class="muted">{{ e.detail }}</p>
      </div>
    </button>
  </div>
  <div v-if="!items.length" class="empty-state">
    <Search :size="30" />
    <h3>没有找到礼装</h3>
    <p>修改名称后再试试。</p>
  </div>
  <div class="inline-tip">
    <component :is="tab === 'craft' ? BookOpen : Shirt" :size="18" />
    <p>
      {{
        tab === "craft"
          ? "同名的多份礼装会分别保存，编队时按持有实例选择。"
          : "御主礼装在队伍级别配置，不占用从者槽位，也不计入 COST。"
      }}
    </p>
  </div>
  <NModal
    :show="!!detail"
    preset="card"
    :title="detail"
    style="width: 440px; max-width: 90vw"
    @update:show="
      (value) => {
        if (!value) detail = '';
      }
    "
    ><AssetPlaceholder kind="礼装" accent="violet" />
    <p class="muted">
      这是礼装详情的界面预览。等级、突破状态、截图素材和来源记录将在此维护。
    </p>
    <NButton block @click="detail = ''">关闭预览</NButton></NModal
  >
</template>
