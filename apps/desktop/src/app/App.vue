<script setup lang="ts">
import { ref } from "vue";
import { NConfigProvider, NMessageProvider, zhCN, dateZhCN } from "naive-ui";
import {
  LayoutGrid,
  BookOpen,
  Users,
  ScanLine,
  Sparkles,
  Settings2,
  ChevronDown,
  Monitor,
  Hexagon,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
} from "@lucide/vue";
import { themeOverrides } from "./theme";
import ServantLibrary from "../features/servants/ServantLibrary.vue";
import EquipmentPage from "../features/equipment/EquipmentPage.vue";
import TeamsPage from "../features/teams/TeamsPage.vue";
import CapturePage from "../features/capture/CapturePage.vue";
import BattlePage from "../features/battle/BattlePage.vue";
import SettingsPage from "../features/settings/SettingsPage.vue";
import PreviewNotice from "../shared/ui/PreviewNotice.vue";
const pages = [
  { key: "servants", label: "从者库", icon: LayoutGrid },
  { key: "equipment", label: "礼装", icon: BookOpen },
  { key: "teams", label: "编队", icon: Users },
  { key: "capture", label: "采集", icon: ScanLine },
  { key: "battle", label: "战斗助手", icon: Sparkles },
];
const active = ref("servants");
const collapsed = ref(false);
</script>
<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    ><NMessageProvider
      ><div class="app-shell" :class="{ collapsed }">
        <aside class="sidebar">
          <a href="#" class="brand" @click.prevent="active = 'servants'"
            ><span class="brand-mark"
              ><Hexagon :size="26" :stroke-width="1.7" /><span>F</span></span
            >
            <div><strong>FGO JCT</strong><small>迦勒底工作区</small></div></a
          >
          <div class="workspace-label">我的工作区</div>
          <nav aria-label="主导航">
            <button
              v-for="page in pages"
              :key="page.key"
              :title="page.label"
              :class="{ active: active === page.key }"
              :aria-current="active === page.key ? 'page' : undefined"
              @click="active = page.key"
            >
              <component
                :is="page.icon"
                :size="18"
                :stroke-width="1.7"
              /><span>{{ page.label }}</span
              ><small v-if="page.key === 'servants'">8</small>
            </button>
          </nav>
          <div class="sidebar-bottom">
            <div class="local-notice">
              <span class="status-dot"></span><span>本地优先，随时掌握</span>
            </div>
            <button
              class="settings-nav"
              :class="{ active: active === 'settings' }"
              title="设置"
              @click="active = 'settings'"
            >
              <Settings2 :size="18" /><span>设置</span>
            </button>
            <div class="sidebar-version">
              <span>界面预览 <small>v0.1</small></span
              ><button
                :aria-label="collapsed ? '展开导航' : '收起导航'"
                @click="collapsed = !collapsed"
              >
                <component
                  :is="collapsed ? PanelLeftOpen : PanelLeftClose"
                  :size="16"
                />
              </button>
            </div>
          </div>
        </aside>
        <div class="main-shell">
          <header class="topbar">
            <div class="breadcrumb">
              工作区 <span>/</span>
              <b>{{
                active === "settings"
                  ? "设置"
                  : pages.find((p) => p.key === active)?.label
              }}</b>
            </div>
            <div class="topbar-right">
              <span class="preview-badge">界面预览</span
              ><button class="device-shortcut" @click="active = 'capture'">
                <Monitor :size="15" /><span>未连接设备</span
                ><ChevronDown :size="13" />
              </button>
              <div class="account-avatar" title="本地工作区">御</div>
            </div>
          </header>
          <main>
            <PreviewNotice /><ServantLibrary
              v-if="active === 'servants'"
              @capture="active = 'capture'"
            /><EquipmentPage v-else-if="active === 'equipment'" /><TeamsPage
              v-else-if="active === 'teams'"
            /><CapturePage v-else-if="active === 'capture'" /><BattlePage
              v-else-if="active === 'battle'"
            /><SettingsPage v-else />
          </main>
          <footer class="app-footer">
            <span
              >FGO JCT <span class="footer-dot">·</span> 你的本地游戏助手</span
            ><span>Windows / macOS <ArrowUpRight :size="12" /></span>
          </footer>
        </div></div></NMessageProvider
  ></NConfigProvider>
</template>
