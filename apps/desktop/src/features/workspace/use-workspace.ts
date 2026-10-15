import { onMounted, ref } from "vue";
import type { Workspace } from "@fgo/contracts";
import { useGateway } from "../../app/gateway";
import { errorMessage } from "../../shared/errors";

export function useWorkspace() {
  const gateway = useGateway();
  const data = ref<Workspace | null>(null);
  const busy = ref(false);
  const error = ref("");
  async function refresh() {
    if (busy.value) return;
    busy.value = true;
    error.value = "";
    try {
      data.value = await gateway.loadWorkspace();
    } catch (cause) {
      error.value = errorMessage(cause);
    } finally {
      busy.value = false;
    }
  }
  onMounted(refresh);
  return { data, busy, error, refresh };
}
