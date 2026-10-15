<script setup lang="ts">
import { ref } from "vue";
import {
  NButton,
  NInput,
  NSelect,
  NTabs,
  NTabPane,
  NSwitch,
  useMessage,
} from "naive-ui";
import { Monitor, Bot, Database, Palette, ExternalLink } from "@lucide/vue";
const message = useMessage();
const adb = ref("");
const agent = ref("codex");
const path = ref("");
const compact = ref(false);
function preview() {
  message.info("预览模式：设置未写入，也未执行连接检测");
}
</script>
<template>
  <div class="section-heading">
    <div>
      <h1>设置</h1>
      <p>让设备、Agent 和工作区按你的习惯运行。</p>
    </div>
    <NButton type="primary" @click="preview">保存设置</NButton>
  </div>
  <NTabs type="line" animated class="settings-tabs"
    ><NTabPane name="device" tab="设备连接"
      ><section class="surface settings-panel">
        <div class="panel-title">
          <span class="inline-row"
            ><Monitor :size="18" /><b>Android 设备</b></span
          >
        </div>
        <div class="settings-body">
          <label
            >ADB 程序路径<NInput
              v-model:value="adb"
              placeholder="选择本机 adb 程序路径"
          /></label>
          <p class="helper">
            用于连接 MuMu 或安卓设备。首版支持 Windows / macOS。
          </p>
          <div class="form-grid">
            <label
              >目标模拟器<NSelect
                :value="'mumu'"
                :options="[{ label: 'MuMu 模拟器', value: 'mumu' }]" /></label
            ><label
              >游戏区服<NSelect
                :value="'cn'"
                :options="[{ label: '国服 · 简体中文', value: 'cn' }]"
            /></label>
          </div>
          <NButton @click="preview">检测设备连接</NButton>
          <div class="inline-tip">
            <Monitor :size="17" />
            <p>当前没有真实设备连接，界面显示的是演示设备。</p>
          </div>
        </div>
      </section></NTabPane
    ><NTabPane name="agent" tab="Agent"
      ><section class="surface settings-panel">
        <div class="panel-title">
          <span class="inline-row"><Bot :size="18" /><b>外部 Agent</b></span>
        </div>
        <div class="settings-body">
          <label
            >接入方式<NSelect
              v-model:value="agent"
              :options="[
                { label: 'Codex · 本地 CLI', value: 'codex' },
                { label: 'piagent · 本地 CLI', value: 'piagent' },
                { label: '云端 API（后续支持）', value: 'api', disabled: true },
              ]" /></label
          ><label
            >程序路径<NInput
              v-model:value="path"
              placeholder="输入已安装 Agent 的可执行文件路径"
          /></label>
          <p class="helper">
            复用你已有的 Agent。截图分析与结构化输出能力将在实际接入时检测。
          </p>
          <NButton @click="preview">检测 Agent 能力</NButton>
        </div>
      </section></NTabPane
    ><NTabPane name="data" tab="数据"
      ><section class="surface settings-panel">
        <div class="panel-title">
          <span class="inline-row"><Database :size="18" /><b>本地数据</b></span>
        </div>
        <div class="settings-body">
          <div class="setting-row">
            <div>
              <b>存储位置</b>
              <p>数据库接入后使用系统应用数据目录</p>
            </div>
            <NButton disabled
              ><template #icon><ExternalLink :size="14" /></template
              >打开目录</NButton
            >
          </div>
          <div class="setting-row">
            <div>
              <b>官方中／日名称表</b>
              <p>用于识别名字后的校准，不包含官方头像</p>
            </div>
            <span class="muted">尚未导入</span>
          </div>
          <div class="setting-row">
            <div>
              <b>演示数据</b>
              <p>当前预览数据不代表实际持有，刷新页面会重置交互。</p>
            </div>
          </div>
        </div>
      </section></NTabPane
    ><NTabPane name="appearance" tab="外观"
      ><section class="surface settings-panel">
        <div class="panel-title">
          <span class="inline-row"><Palette :size="18" /><b>界面偏好</b></span>
        </div>
        <div class="settings-body">
          <label
            >主题<NSelect
              :value="'light'"
              :options="[
                { label: '浅色 · 默认', value: 'light' },
                { label: '深色（后续支持）', value: 'dark', disabled: true },
              ]"
          /></label>
          <div class="setting-row">
            <div>
              <b>紧凑显示</b>
              <p>偏好控件预览，暂未应用到页面布局。</p>
            </div>
            <NSwitch v-model:value="compact" />
          </div>
        </div></section></NTabPane
  ></NTabs>
</template>
