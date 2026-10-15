import { appErrorSchema } from "@fgo/contracts";

export function errorMessage(error: unknown): string {
  const result = appErrorSchema.safeParse(error);
  if (result.success) return result.data.message;
  return error instanceof Error ? error.message : "请求失败，请重试。";
}
