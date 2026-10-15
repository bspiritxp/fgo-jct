<script setup lang="ts">
import { ref } from "vue";
import {
  NButton,
  NSelect,
  NInput,
  NSteps,
  NStep,
  NTag,
  useMessage,
} from "naive-ui";
import {
  Monitor,
  ScanLine,
  Maximize2,
  Image,
  RefreshCw,
  Check,
  MousePointer2,
} from "@lucide/vue";
import NameCalibration from "../calibration/NameCalibration.vue";
const message = useMessage();
const device = ref("demo");
const captured = ref(false);
const original = ref("示例从者");
const target = ref("new");
</script>
<template>
  <div class="section-heading">
    <div>
      <h1>采集</h1>
      <p>手动切换游戏页面，识别后校对，再保存。</p>
    </div>
    <NButton
      type="primary"
      @click="
        captured = true;
        message.info('已展示截图占位，未执行真实 ADB 截图');
      "
      ><template #icon><ScanLine :size="16" /></template>截取当前画面</NButton
    >
  </div>
  <div class="capture-device surface">
    <div class="inline-row">
      <Monitor :size="18" /><b>目标设备</b
      ><NSelect
        v-model:value="device"
        :options="[{ label: 'MuMu · 演示设备', value: 'demo' }]"
        style="width: 240px"
      /><span class="status-dot gray"></span><span class="muted">尚未连接</span>
    </div>
    <NButton quaternary @click="message.info('预览模式：设备检测尚未接入')"
      ><template #icon><RefreshCw :size="14" /></template>检测设备</NButton
    >
  </div>
  <div class="capture-steps">
    <NSteps size="small" :current="captured ? 3 : 1"
      ><NStep title="选择设备" /><NStep title="截图识别" /><NStep
        title="校对资料" /><NStep title="确认保存"
    /></NSteps>
  </div>
  <div class="capture-layout">
    <section class="surface">
      <div class="panel-title">
        <b>游戏画面</b
        ><span class="muted">{{ captured ? "截图占位预览" : "等待截图" }}</span
        ><Maximize2 :size="16" />
      </div>
      <div class="screen-placeholder">
        <Monitor :size="48" :stroke-width="1" />
        <h3>{{ captured ? "截图会显示在这里" : "准备采集你的从者" }}</h3>
        <p>
          在 MuMu 中打开包含从者名称的详情页<br />点击「截取当前画面」开始采集
        </p>
        <span class="screen-corner tl"></span
        ><span class="screen-corner tr"></span
        ><span class="screen-corner bl"></span
        ><span class="screen-corner br"></span>
      </div>
      <div class="capture-thumbs">
        <div><Image :size="24" /><span>头像裁剪</span></div>
        <div><Image :size="24" /><span>立绘裁剪</span></div>
        <p>素材取自游戏截图<br /><small>可以重新裁剪或替换</small></p>
      </div>
      <div class="inline-tip">
        <MousePointer2 :size="17" />
        <p>显示外观与实际培养状态分别保存。</p>
      </div>
    </section>
    <section class="surface review-panel">
      <div class="panel-title">
        <b>识别与校对</b
        ><NTag size="small" :bordered="false" type="warning">示例</NTag>
      </div>
      <div class="review-body">
        <label
          >识别出的名字<NInput v-model:value="original" placeholder="等待识别"
        /></label>
        <div class="field-hint">保留原始文字，对照中／日名称表校准。</div>
        <label
          >保存到<NSelect
            v-model:value="target"
            :options="[
              { label: '新增持有实例', value: 'new' },
              { label: '更新已有实例（示例）', value: 'existing' },
            ]"
        /></label>
        <div class="review-fields">
          <div><span>等级</span><b>—</b></div>
          <div><span>宝具等级</span><b>—</b></div>
          <div><span>再临阶段</span><b>—</b></div>
          <div><span>技能等级</span><b>— / — / —</b></div>
        </div>
        <p class="helper">
          未知字段保持未知，不覆盖已确认的记录。同名从者需要明确选择持有实例。
        </p>
        <NButton
          block
          type="primary"
          @click="message.info('预览模式：校对结果尚未保存')"
          ><template #icon><Check :size="15" /></template>确认并保存</NButton
        >
      </div>
    </section>
  </div>
  <details class="calibration-disclosure">
    <summary>名称候选查询 · 查看校准交互示例</summary>
    <NameCalibration />
  </details>
</template>
