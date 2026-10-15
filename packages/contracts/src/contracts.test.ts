import { describe, expect, it } from 'vitest';
import { workspaceSchema } from './index';
import workspace from '../../../tests/fixtures/demo/workspace.json';

describe('IPC boundary', () => {
  it('accepts the shared demo contract and rejects incompatible versions or invalid field ranges', () => {
    expect(workspaceSchema.parse(workspace).servants).toHaveLength(2);
    expect(() => workspaceSchema.parse({ ...workspace, protocolVersion: 2 })).toThrow();
    const invalid = structuredClone(workspace);
    invalid.servants[0].npLevel = 9;
    expect(() => workspaceSchema.parse(invalid)).toThrow();
  });
});
