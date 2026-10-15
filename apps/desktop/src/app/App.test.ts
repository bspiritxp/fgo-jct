// @vitest-environment jsdom
import { flushPromises, mount } from "@vue/test-utils";
import { beforeAll, describe, expect, it, vi } from "vitest";
import App from "./App.vue";
import { gatewayKey } from "./gateway";
import { createDemoGateway } from "../infrastructure/demo-gateway";

beforeAll(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

describe("interface preview", () => {
  it("filters preview records and keeps name calibration within capture", async () => {
    const wrapper = mount(App, {
      global: { provide: { [gatewayKey as symbol]: createDemoGateway() } },
    });
    await flushPromises();
    expect(wrapper.findAll(".servant-card")).toHaveLength(8);
    await wrapper.get("input").setValue("玛修");
    expect(wrapper.findAll(".servant-card")).toHaveLength(1);
    await wrapper
      .findAll("nav button")
      .find((button) => button.text() === "采集")!
      .trigger("click");
    await wrapper.get("#name-query").setValue("示例从者");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.findAll(".candidate-list li")).toHaveLength(2);
    expect(wrapper.text()).toContain("名字有歧义");
    wrapper.unmount();
  });

  it("navigates all six preview pages without offering actual battle execution", async () => {
    const wrapper = mount(App, {
      global: { provide: { [gatewayKey as symbol]: createDemoGateway() } },
    });
    for (const name of ["礼装", "编队", "采集", "战斗助手"]) {
      await wrapper
        .findAll("nav button")
        .find((button) => button.text() === name)!
        .trigger("click");
      expect(wrapper.get("h1").text()).toBe(name);
    }
    expect(wrapper.text()).toContain("Agent 未接入");
    await wrapper.get(".settings-nav").trigger("click");
    expect(wrapper.get("h1").text()).toBe("设置");
    wrapper.unmount();
  });
});
