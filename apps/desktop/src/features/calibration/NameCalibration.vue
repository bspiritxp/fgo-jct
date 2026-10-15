<script setup lang="ts">
import { ref } from "vue";
import type { NameSearch } from "@fgo/contracts";
import { useGateway } from "../../app/gateway";
import { errorMessage } from "../../shared/errors";

const gateway = useGateway();
const query = ref("");
const result = ref<NameSearch | null>(null);
const error = ref("");
const busy = ref(false);
async function search() {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  result.value = null;
  try {
    result.value = await gateway.searchNames(query.value);
  } catch (cause) {
    error.value = errorMessage(cause);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="panel">
    <p class="eyebrow">NAME CALIBRATION</p>
    <h2>用名字确认身份</h2>
    <p class="muted">
      输入中／日名称，预览名称校准流程。当前使用虚构测试条目，例如「示例从者」。
    </p>
    <form class="search-form" @submit.prevent="search">
      <label for="name-query">游戏中识别的名字</label>
      <div class="input-row">
        <input
          id="name-query"
          v-model="query"
          :disabled="busy"
          placeholder="输入名字"
          maxlength="200"
        />
        <button :disabled="busy">{{ busy ? "查询中…" : "查找候选" }}</button>
      </div>
    </form>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div v-if="result" aria-live="polite">
      <p class="muted">
        查询「{{ result.query }}」：{{
          result.candidates.length
        }}
        个候选。结果不会自动更新档案。
      </p>
      <ul class="candidate-list">
        <li v-for="candidate in result.candidates" :key="candidate.id">
          <strong>{{ candidate.nameZh }}</strong
          ><span>{{ candidate.nameJa }}</span
          ><small>{{ candidate.id }}</small>
        </li>
      </ul>
      <p v-if="!result.candidates.length">未找到候选。可修改文字后重新查询。</p>
      <p v-else-if="result.candidates.length > 1">
        名字有歧义，需要结合游戏详情确认。
      </p>
    </div>
  </section>
</template>
