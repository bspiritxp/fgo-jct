import {
  nameSearchSchema,
  workspaceSchema,
  type DesktopGateway,
} from "@fgo/contracts";
import workspace from "../../../../tests/fixtures/demo/workspace.json";
import names from "../../../../tests/fixtures/demo/names.json";

/** UI preview only. This does not recognize screenshots or persist player records. */
export function createDemoGateway(): DesktopGateway {
  return {
    async loadWorkspace() {
      return workspaceSchema.parse(structuredClone(workspace));
    },
    async searchNames(query) {
      if ([...query].length > 200)
        throw { code: "invalid_query", message: "名称查询不得超过 200 字符" };
      const text = query.trim();
      const exact = names.filter(
        (entry) => entry.nameZh === text || entry.nameJa === text,
      );
      const candidates = !text
        ? []
        : exact.length
          ? exact
          : names.filter(
              (entry) =>
                entry.nameZh.includes(text) || entry.nameJa.includes(text),
            );
      return nameSearchSchema.parse({
        protocolVersion: 1,
        query,
        matchKind: !text
          ? "empty"
          : exact.length
            ? "exact"
            : candidates.length
              ? "suggested"
              : "none",
        candidates,
      });
    },
  };
}
