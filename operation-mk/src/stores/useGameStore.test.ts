import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "./useGameStore";

describe("useGameStore", () => {
  beforeEach(() => {
    useGameStore.getState().resetCase();
  });

  it("starts with all flags false", () => {
    expect(useGameStore.getState().flags.case01Started).toBe(false);
    expect(useGameStore.getState().flags.accusationUnlocked).toBe(false);
  });

  it("setFlag flips a single flag without touching others", () => {
    useGameStore.getState().setFlag("operaMissionSolved", true);
    const { flags } = useGameStore.getState();
    expect(flags.operaMissionSolved).toBe(true);
    expect(flags.bridgeMissionSolved).toBe(false);
  });

  it("unlockEvidence marks an item as new", () => {
    useGameStore.getState().unlockEvidence("E01");
    expect(useGameStore.getState().evidenceStatus.E01).toBe("new");
  });

  it("markEvidenceReviewed promotes new -> reviewed", () => {
    useGameStore.getState().unlockEvidence("E01");
    useGameStore.getState().markEvidenceReviewed("E01");
    expect(useGameStore.getState().evidenceStatus.E01).toBe("reviewed");
  });

  it("setSuspectStatus tracks per-suspect state", () => {
    useGameStore.getState().setSuspectStatus("leo", "high_risk");
    expect(useGameStore.getState().suspectStatus.leo).toBe("high_risk");
  });

  it("resetCase restores initial state after mutation", () => {
    useGameStore.getState().setFlag("case01Closed", true);
    useGameStore.getState().unlockEvidence("E01");
    useGameStore.getState().resetCase();
    const state = useGameStore.getState();
    expect(state.flags.case01Closed).toBe(false);
    expect(state.evidenceStatus).toEqual({});
  });
});
