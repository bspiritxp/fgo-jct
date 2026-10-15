import { inject, type InjectionKey } from "vue";
import type { DesktopGateway } from "@fgo/contracts";

export const gatewayKey: InjectionKey<DesktopGateway> =
  Symbol("desktop-gateway");
export function useGateway(): DesktopGateway {
  const gateway = inject(gatewayKey);
  if (!gateway) throw new Error("DesktopGateway was not provided");
  return gateway;
}
