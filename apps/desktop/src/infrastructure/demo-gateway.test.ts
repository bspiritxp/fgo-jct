import { describe, expect, it } from "vitest";
import { createDemoGateway } from "./demo-gateway";

describe("browser demo boundary", () => {
  it("preserves ambiguity and never merges owned instances while searching", async () => {
    const gateway = createDemoGateway();
    const before = await gateway.loadWorkspace();
    const result = await gateway.searchNames(" 示例从者 ");
    expect(result.matchKind).toBe("exact");
    expect(result.candidates).toHaveLength(2);
    expect((await gateway.searchNames("テスト乙")).candidates[0].id).toBe(
      "demo-name-3",
    );
    expect((await gateway.searchNames("不存在")).matchKind).toBe("none");
    expect((await gateway.searchNames(" ")).candidates).toEqual([]);
    expect(await gateway.loadWorkspace()).toEqual(before);
  });
});
