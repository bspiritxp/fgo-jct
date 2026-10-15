import { invoke } from "@tauri-apps/api/core";
import {
  nameSearchSchema,
  workspaceSchema,
  type DesktopGateway,
} from "@fgo/contracts";

export function createTauriGateway(): DesktopGateway {
  return {
    async loadWorkspace() {
      return workspaceSchema.parse(await invoke("load_workspace"));
    },
    async searchNames(query) {
      return nameSearchSchema.parse(await invoke("search_names", { query }));
    },
  };
}
