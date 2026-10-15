<script setup lang="ts">
import { ref } from "vue";
import { NButton, NInput, NSelect, NTag, NModal, useMessage } from "naive-ui";
import {
  Plus,
  ChevronRight,
  Swords,
  GripVertical,
  X,
  Save,
  Link,
  Shield,
} from "@lucide/vue";
import { servants, type PreviewServant } from "../../preview/data";
import AssetPlaceholder from "../../shared/ui/AssetPlaceholder.vue";
const message = useMessage();
const name = ref("日常周回队");
const mystic = ref("迦勒底战斗服");
const quest = ref<string[]>([]);
const selected = ref<number | null>(null);
const slots = ref<(PreviewServant | null)[]>([
  servants[0],
  servants[2],
  null,
  servants[1],
  null,
  null,
]);
function choose(s: PreviewServant) {
  if (selected.value !== null) slots.value[selected.value] = s;
  selected.value = null;
}
</script>
<template>
  <div class="section-heading">
    <div>
      <h1>编队</h1>
      <p>从阵容到礼装，让每个位置各尽其用。</p>
    </div>
    <NButton
      @click="
        name = '新建队伍';
        slots = Array(6).fill(null);
      "
      ><template #icon><Plus :size="16" /></template>新建队伍</NButton
    >
  </div>
  <div class="team-workspace">
    <aside class="team-list surface">
      <div class="panel-title">我的队伍 <span>1</span></div>
      <button class="team-list-item active">
        <span class="small-round"><Swords :size="18" /></span>
        <div>
          <b>{{ name }}</b
          ><small>草稿 · 未关联关卡</small>
        </div>
        <ChevronRight :size="15" />
      </button>
      <div class="team-list-note">
        队伍保存在工具中，<br />不会自动同步到游戏。
      </div>
    </aside>
    <section class="surface team-editor">
      <div class="panel-title">
        <NInput
          v-model:value="name"
          placeholder="队伍名称"
          style="max-width: 240px"
        /><NTag :bordered="false" size="small">预览草稿</NTag>
      </div>
      <div class="formation-labels">
        <span>前排成员</span><span>后备成员</span>
      </div>
      <div class="team-slots">
        <div v-for="(slot, i) in slots" :key="i" class="team-slot">
          <div class="slot-title">
            <span
              >{{ String(i + 1).padStart(2, "0") }}
              <small v-if="i === 2">助战位</small></span
            ><GripVertical :size="13" />
          </div>
          <button class="slot-select" @click="selected = i">
            <template v-if="slot"
              ><AssetPlaceholder
                :kind="slot.className"
                :accent="slot.accent"
                compact
              /><b>{{ slot.name }}</b
              ><small>Lv. {{ slot.level }}</small></template
            ><template v-else
              ><Plus :size="23" /><span>{{
                i === 2 ? "选择助战" : "选择从者"
              }}</span></template
            ></button
          ><button
            class="ce-select"
            @click="message.info('预览模式：此处选择该槽位的概念礼装')"
          >
            <Plus :size="12" />概念礼装</button
          ><button
            v-if="slot"
            class="slot-remove"
            :aria-label="'移除第' + (i + 1) + '位'"
            @click="slots[i] = null"
          >
            <X :size="12" />
          </button>
        </div>
      </div>
      <div class="team-config">
        <div>
          <label><Shield :size="15" /> 御主礼装</label
          ><NSelect
            v-model:value="mystic"
            :options="
              ['迦勒底战斗服', '魔术礼装·迦勒底'].map((v) => ({
                label: v,
                value: v,
              }))
            "
          />
        </div>
        <div>
          <label><Link :size="15" /> 关联关卡 <small>可选</small></label
          ><NSelect
            v-model:value="quest"
            multiple
            placeholder="不绑定关卡"
            :options="
              ['种火集结', '修炼场', '自定义关卡'].map((v) => ({
                label: v,
                value: v,
              }))
            "
          />
        </div>
      </div>
      <div class="team-save">
        <div>
          <b>COST <span class="muted">— / —</span></b>
          <p>信息不足 · 接入实际资料后校验</p>
        </div>
        <NButton
          type="primary"
          @click="message.info('预览模式：队伍仅在当前页面展示，未写入数据库')"
          ><template #icon><Save :size="16" /></template>保存草稿</NButton
        >
      </div>
    </section>
  </div>
  <NModal
    :show="selected !== null"
    preset="card"
    title="选择从者 · 预览"
    style="width: 560px; max-width: 90vw"
    @update:show="
      (v) => {
        if (!v) selected = null;
      }
    "
    ><div class="picker-list">
      <button
        v-for="s in servants"
        :key="s.id"
        :disabled="slots.some((slot) => slot?.id === s.id)"
        @click="choose(s)"
      >
        <AssetPlaceholder :kind="s.className" :accent="s.accent" compact />
        <div>
          <b>{{ s.name }}</b
          ><small>{{ s.className }} · Lv. {{ s.level }}</small>
        </div>
        <ChevronRight :size="16" />
      </button></div
  ></NModal>
</template>
