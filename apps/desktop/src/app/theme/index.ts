import type { GlobalThemeOverrides } from "naive-ui";
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#356AE6",
    primaryColorHover: "#477AEE",
    primaryColorPressed: "#2856C5",
    borderRadius: "6px",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontSize: "14px",
    textColorBase: "#202833",
    borderColor: "#E4E7EC",
  },
  Button: { fontWeight: "500" },
  Tabs: { tabFontWeightActive: "600" },
};
