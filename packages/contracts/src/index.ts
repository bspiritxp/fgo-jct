import { z } from 'zod';

export const PROTOCOL_VERSION = 1 as const;
export const nameEntrySchema = z.object({
  id: z.string().min(1), nameZh: z.string().min(1), nameJa: z.string().min(1),
});
export const deviceSchema = z.object({
  serial: z.string().min(1), label: z.string(), status: z.enum(['ready', 'offline', 'unauthorized']),
});
export const ownedServantSchema = z.object({
  id: z.string().min(1), nameId: z.string().nullable(), displayName: z.string(),
  level: z.number().int().nonnegative().nullable(),
  npLevel: z.number().int().min(1).max(5).nullable(),
  ascensionStage: z.number().int().min(0).max(4).nullable(),
  skillLevels: z.tuple([z.number().int().min(1).max(10).nullable(), z.number().int().min(1).max(10).nullable(), z.number().int().min(1).max(10).nullable()]),
});
export const workspaceSchema = z.object({
  protocolVersion: z.literal(PROTOCOL_VERSION),
  mode: z.literal('demo'),
  devices: z.array(deviceSchema), servants: z.array(ownedServantSchema),
  agent: z.object({ label: z.string(), available: z.boolean(), detail: z.string() }),
});
export const nameSearchSchema = z.object({
  protocolVersion: z.literal(PROTOCOL_VERSION), query: z.string(),
  matchKind: z.enum(['empty', 'exact', 'suggested', 'none']), candidates: z.array(nameEntrySchema),
});
export const appErrorSchema = z.object({ code: z.string(), message: z.string() });

export type NameEntry = z.infer<typeof nameEntrySchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
export type NameSearch = z.infer<typeof nameSearchSchema>;

/** The view-facing boundary. Browser and desktop transports implement this interface. */
export interface DesktopGateway {
  loadWorkspace(): Promise<Workspace>;
  searchNames(query: string): Promise<NameSearch>;
}
