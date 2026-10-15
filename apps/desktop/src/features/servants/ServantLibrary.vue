<script setup lang="ts">
import { computed, ref } from "vue";
import {
  NButton,
  NInput,
  NSelect,
  NDrawer,
  NDrawerContent,
  NTag,
  NTabs,
  NTabPane,
  NInputNumber,
  useMessage,
} from "naive-ui";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  ArrowUpDown,
  ScanLine,
  Image,
  ChevronRight,
  SlidersHorizontal,
} from "@lucide/vue";
import { servants, type PreviewServant } from "../../preview/data";
import AssetPlaceholder from "../../shared/ui/AssetPlaceholder.vue";
const emit = defineEmits<{ capture: [] }>();
const message = useMessage();
const query = ref("");
const className = ref("all");
const status = ref("all");
const layout = ref("grid");
const selected = ref<PreviewServant | null>(null);
const show = ref(false);
const sort = ref(false);
const classes = [
  { label: "全部职阶", value: "all" },
  ...[
    "Saber",
    "Archer",
    "Lancer",
    "Rider",
    "Caster",
    "Assassin",
    "Berserker",
    "Shielder",
  ].map((v) => ({ label: v, value: v })),
];
const filtered = computed(() => {
  const entries = servants.filter(
    (s) =>
      (s.name.includes(query.value) || s.jp.includes(query.value)) &&
      (className.value === "all" || s.className === className.value) &&
      (status.value === "all" || s.status === status.value),
  );
  return sort.value ? [...entries].sort((a, b) => b.level - a.level) : entries;
});
function open(s: PreviewServant) {
  selected.value = { ...s };
  show.value = true;
}
</script>
<template>
  <div class="section-heading">
    <div>
      <h1>
        从者库 <span class="count-badge">{{ servants.length }}</span>
      </h1>
      <p>整理每一份相遇，记录每一步成长。</p>
    </div>
    <div class="actions">
      <NButton @click="message.info('手工添加表单将在功能接入时开放')"
        ><template #icon><Plus :size="16" /></template>手工添加</NButton
      ><NButton type="primary" @click="emit('capture')"
        ><template #icon><ScanLine :size="16" /></template>采集从者</NButton
      >
    </div>
  </div>
  <div class="stat-strip">
    <div>
      <span>已记录从者</span><strong>8 <small>份</small></strong>
    </div>
    <div>
      <span>已校对资料</span><strong>6 <small>份</small></strong>
    </div>
    <div>
      <span>待校对</span><strong class="amber-text">2 <small>份</small></strong>
    </div>
    <div class="stat-note">
      <div class="small-round"><Image :size="18" /></div>
      <p>你的从者，你的样子<small>头像与立绘将使用游戏内截图</small></p>
    </div>
  </div>
  <div class="toolbar">
    <NInput
      v-model:value="query"
      clearable
      placeholder="搜索从者中文 / 日文名称"
      class="search-input"
      ><template #prefix><Search :size="16" /></template></NInput
    ><NSelect
      v-model:value="className"
      :options="classes"
      class="filter-select"
    /><NSelect
      v-model:value="status"
      :options="[
        { label: '全部状态', value: 'all' },
        { label: '已校对', value: '已校对' },
        { label: '待校对', value: '待校对' },
      ]"
      class="filter-select"
    />
    <div class="toolbar-spacer"></div>
    <NButton
      quaternary
      :type="sort ? 'primary' : 'default'"
      @click="sort = !sort"
      ><template #icon><ArrowUpDown :size="15" /></template>等级</NButton
    >
    <div class="view-toggle">
      <button
        aria-label="卡片视图"
        :class="{ active: layout === 'grid' }"
        @click="layout = 'grid'"
      >
        <LayoutGrid :size="16" /></button
      ><button
        aria-label="列表视图"
        :class="{ active: layout === 'list' }"
        @click="layout = 'list'"
      >
        <List :size="17" />
      </button>
    </div>
  </div>
  <div class="results-meta">
    <span>共 {{ filtered.length }} 份档案</span
    ><span><SlidersHorizontal :size="13" /> 点击档案查看培养信息与素材</span>
  </div>
  <div v-if="layout === 'grid'" class="servant-grid">
    <button
      v-for="s in filtered"
      :key="s.id"
      class="servant-card"
      @click="open(s)"
    >
      <div class="portrait-wrap">
        <AssetPlaceholder :kind="s.className" :accent="s.accent" compact /><span
          class="stars"
          >{{ "★".repeat(s.rarity) }}</span
        ><span
          v-if="s.status === '待校对'"
          class="review-dot"
          title="待校对"
        ></span>
      </div>
      <div class="servant-info">
        <h3 :title="s.name">{{ s.name }}</h3>
        <div class="servant-meta">
          <span>{{ s.className }}</span
          ><span v-if="s.status === '待校对'" class="amber-text">待校对</span>
        </div>
        <div class="card-level">
          <span
            >Lv. <b>{{ s.level }}</b
            ><small> / {{ s.max }}</small></span
          ><span class="np-badge">宝具 {{ s.np }}</span>
        </div>
        <div class="level-track">
          <span :style="{ width: (s.level / s.max) * 100 + '%' }"></span>
        </div>
        <div class="card-footer">
          <span
            >技能 <b>{{ s.skills }}</b></span
          ><ChevronRight :size="14" />
        </div>
      </div>
    </button>
  </div>
  <div v-else class="surface table-scroll">
    <table class="data-table">
      <thead>
        <tr>
          <th>从者</th>
          <th>职阶</th>
          <th>等级</th>
          <th>宝具</th>
          <th>技能</th>
          <th>状态</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in filtered" :key="s.id">
          <td>
            <button class="text-link" @click="open(s)">{{ s.name }}</button>
          </td>
          <td>{{ s.className }}</td>
          <td>{{ s.level }}</td>
          <td>{{ s.np }}</td>
          <td>{{ s.skills }}</td>
          <td>{{ s.status }}</td>
          <td><NButton text @click="open(s)">查看</NButton></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="!filtered.length" class="empty-state">
    <Search :size="30" />
    <h3>没有找到匹配的从者</h3>
    <p>试试其他名字，或清除筛选条件。</p>
    <NButton
      @click="
        query = '';
        className = 'all';
        status = 'all';
      "
      >清除筛选</NButton
    >
  </div>
  <div class="page-footnote">
    示例档案仅用于界面预览，不代表你的实际持有情况。
  </div>
  <NDrawer v-model:show="show" :width="440" placement="right"
    ><NDrawerContent v-if="selected" :title="selected.name" closable
      ><div class="detail-hero">
        <AssetPlaceholder
          :kind="selected.className"
          :accent="selected.accent"
        />
        <p>{{ selected.jp }}</p>
        <NTag size="small" :bordered="false"
          >{{ selected.className }} · 示例档案</NTag
        >
      </div>
      <NTabs type="line" animated
        ><NTabPane name="培养信息" tab="培养信息"
          ><div class="form-grid">
            <label
              >等级<NInputNumber
                v-model:value="selected.level"
                :min="1"
                :max="120" /></label
            ><label
              >宝具等级<NInputNumber
                v-model:value="selected.np"
                :min="1"
                :max="5"
            /></label>
          </div>
          <div class="detail-row">
            <span>技能等级</span><b>{{ selected.skills }}</b>
          </div>
          <div class="detail-row">
            <span>数据状态</span><NTag size="small">{{ selected.status }}</NTag>
          </div>
          <p class="helper">当前修改仅保留在预览抽屉中，不写入数据库。</p>
          <NButton
            block
            @click="
              show = false;
              emit('capture');
            "
            >重新识别与校准</NButton
          ></NTabPane
        ><NTabPane name="素材" tab="头像与立绘"
          ><div class="empty-state">
            <Image :size="30" />
            <h3>还没有采集素材</h3>
            <p>使用游戏中的头像与立绘，保留你的显示设置。</p>
            <NButton
              @click="
                show = false;
                emit('capture');
              "
              >前往采集</NButton
            >
          </div></NTabPane
        ></NTabs
      ><template #footer
        ><NButton @click="show = false">关闭</NButton
        ><NButton type="primary" @click="message.info('预览模式：资料尚未保存')"
          >保存修改</NButton
        ></template
      ></NDrawerContent
    ></NDrawer
  >
</template>
